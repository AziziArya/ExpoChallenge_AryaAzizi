"""
Speech-to-Text module.

Converts an uploaded audio file into a transcript, which is then fed
into the exact same analysis pipeline used for typed messages. Speech
input is just another way text gets into the system -- it doesn't get
its own separate analysis logic.

Engine chain (tries each in order, falls back automatically):

  1. OpenAI Whisper API  -- only attempted if OPENAI_API_KEY is set.
     Best accuracy, costs money per request. This is the "upgrade
     path": set the env var later and transcription quality improves
     automatically, with zero code changes needed anywhere else.

  2. Google Web Speech (free, keyless, via SpeechRecognition)
     -- default engine. No API key, no local model download, no GPU.
     Has practical limits (short clips, needs network, unofficial
     API) but works out of the box for a demo.

  3. Local Whisper (faster-whisper, CPU, free, fully offline)
     -- best-effort fallback for when there's no network at all.
     Loaded lazily and wrapped defensively: environments without a
     working torch/CUDA setup will simply skip this engine instead of
     crashing the whole request (same pattern as PrivacyGuard's
     spaCy fallback).

If every engine fails, a clear TranscriptionError is raised so the
API layer can return a useful message instead of a 500.
"""

import os
import tempfile
from typing import Optional

from src.logging.logger import logger

SUPPORTED_EXTENSIONS = {"wav", "mp3", "m4a", "ogg", "webm", "flac", "aiff", "aif"}

# Cached lazily-loaded local model, so repeated requests in the same
# process don't reload it from disk every time.
_LOCAL_WHISPER_MODEL = None
_LOCAL_WHISPER_LOAD_ATTEMPTED = False


class TranscriptionError(Exception):
    """Raised when no available speech-to-text engine could produce a transcript."""


def _to_wav(raw: bytes, filename: str) -> str:
    """
    Converts an arbitrary uploaded audio file (webm/mp3/m4a/ogg/...)
    into a temporary 16kHz mono WAV file, which is the format every
    engine below can reliably consume. Requires ffmpeg to be installed
    on the host (same requirement most browser-mic-recording demos
    have, since browsers record as webm/ogg, not wav).
    """

    from pydub import AudioSegment

    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else "webm"

    with tempfile.NamedTemporaryFile(suffix=f".{extension}", delete=False) as src:
        src.write(raw)
        src_path = src.name

    dst_path = src_path + ".wav"

    try:
        audio = AudioSegment.from_file(src_path)
        audio = audio.set_channels(1).set_frame_rate(16000)
        audio.export(dst_path, format="wav")
    finally:
        os.unlink(src_path)

    return dst_path


def _transcribe_with_openai(wav_path: str) -> Optional[str]:
    api_key = os.environ.get("OPENAI_API_KEY")

    if not api_key:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)

        with open(wav_path, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
            )

        return response.text.strip() or None

    except Exception as exc:  # pragma: no cover - network/environment dependent
        logger.warning("Speech-to-Text: OpenAI Whisper API failed (%s)." % exc)
        return None


def _transcribe_with_google_free(wav_path: str) -> Optional[str]:
    try:
        import speech_recognition as sr

        recognizer = sr.Recognizer()

        with sr.AudioFile(wav_path) as source:
            audio = recognizer.record(source)

        return recognizer.recognize_google(audio).strip() or None

    except Exception as exc:  # pragma: no cover - network/environment dependent
        logger.warning("Speech-to-Text: free Google engine failed (%s)." % exc)
        return None


def _load_local_whisper_model():
    global _LOCAL_WHISPER_MODEL, _LOCAL_WHISPER_LOAD_ATTEMPTED

    if _LOCAL_WHISPER_MODEL is not None or _LOCAL_WHISPER_LOAD_ATTEMPTED:
        return _LOCAL_WHISPER_MODEL

    _LOCAL_WHISPER_LOAD_ATTEMPTED = True

    try:
        from faster_whisper import WhisperModel

        _LOCAL_WHISPER_MODEL = WhisperModel("tiny", device="cpu", compute_type="int8")
        logger.info("Speech-to-Text: local Whisper (tiny) model loaded.")

    except Exception as exc:  # pragma: no cover - environment dependent
        logger.warning(
            "Speech-to-Text: local Whisper unavailable (%s). "
            "Offline fallback disabled for this session." % exc
        )
        _LOCAL_WHISPER_MODEL = None

    return _LOCAL_WHISPER_MODEL


def _transcribe_with_local_whisper(wav_path: str) -> Optional[str]:
    model = _load_local_whisper_model()

    if model is None:
        return None

    try:
        segments, _info = model.transcribe(wav_path)
        text = " ".join(segment.text.strip() for segment in segments).strip()
        return text or None

    except Exception as exc:  # pragma: no cover - environment dependent
        logger.warning("Speech-to-Text: local Whisper transcription failed (%s)." % exc)
        return None


def transcribe_audio(raw: bytes, filename: str) -> dict:
    """
    Main entry point. Returns {"text": ..., "engine": ...}.
    Raises TranscriptionError if no engine could produce a transcript.
    """

    extension = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if extension not in SUPPORTED_EXTENSIONS:
        raise TranscriptionError(
            f"Unsupported audio format: .{extension or 'unknown'}. "
            f"Supported: {', '.join(sorted(SUPPORTED_EXTENSIONS))}"
        )

    wav_path = _to_wav(raw, filename)

    try:
        engines = [
            ("openai_whisper_api", _transcribe_with_openai),
            ("google_free", _transcribe_with_google_free),
            ("local_whisper", _transcribe_with_local_whisper),
        ]

        for engine_name, engine_fn in engines:

            text = engine_fn(wav_path)

            if text:
                return {"text": text, "engine": engine_name}

        raise TranscriptionError(
            "Could not transcribe this audio with any available engine. "
            "Try a clearer recording, or set OPENAI_API_KEY for higher accuracy."
        )

    finally:
        os.unlink(wav_path)
