import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "recording" | "stopped" | "error";

interface UseMicRecorderResult {
  status: RecorderStatus;
  seconds: number;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  file: File | null;
}

/**
 * Wraps the browser's MediaRecorder API into a small, self-contained
 * hook. Records to whatever format the browser's mic pipeline
 * natively supports (audio/webm in Chrome/Firefox/Edge, audio/mp4 in
 * Safari) and hands back a File with a matching extension -- so it
 * plugs directly into the same upload/validation path already used
 * for browsed audio files, no separate backend code needed.
 */
export function useMicRecorder(): UseMicRecorderResult {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setFile(null);
    chunksRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("This browser doesn't support microphone recording.");
      setStatus("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const type = recorder.mimeType || "audio/webm";
        const extension = type.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(chunksRef.current, { type });
        setFile(new File([blob], `recording.${extension}`, { type }));
        cleanupStream();
        setStatus("stopped");
      };

      recorder.start();
      setStatus("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Microphone access was denied or unavailable.");
      setStatus("error");
      cleanupStream();
    }
  }, [cleanupStream]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    cleanupStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setFile(null);
    setSeconds(0);
    setError(null);
    setStatus("idle");
  }, [cleanupStream]);

  // Guards against a live mic being left open if the user navigates
  // away mid-recording -- browsers show a persistent "mic in use"
  // indicator until the stream's tracks are explicitly stopped.
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      cleanupStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, seconds, error, start, stop, reset, file };
}
