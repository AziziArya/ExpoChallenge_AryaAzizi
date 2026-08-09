import { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, X, FileText, ShieldCheck, ArrowRight, Mic, StopCircle } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Button } from "../components/ui/Button";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { PipelineProgress } from "../components/analysis/PipelineProgress";
import { analyzeConversationText, analyzeConversationFile, analyzeConversationAudio } from "../services/conversationDetail.service";
import { useMicRecorder } from "../hooks/useMicRecorder";
import { cn } from "../lib/cn";

type Method = "paste" | "upload" | "audio";

const ACCEPTED_EXTENSIONS = [".txt", ".csv", ".json"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB — [ASSUMPTION], see new-analysis_spec.md §7

const ACCEPTED_AUDIO_EXTENSIONS = [".wav", ".mp3", ".m4a", ".ogg", ".webm", ".flac"];
const MAX_AUDIO_SIZE = 15 * 1024 * 1024; // 15 MB, matches backend limit

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const recorder = useMicRecorder();

  const hasValidInput =
    method === "paste"
      ? text.trim().length > 0
      : method === "audio"
        ? audioFile !== null
        : file !== null;
  const isShort = method === "paste" && text.trim().length > 0 && text.trim().length < 20;

  const validateAndSetFile = useCallback((f: File) => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setFileError("Unsupported file type. Please upload a .txt, .csv, or .json file.");
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError("File is too large. Maximum size is 10 MB.");
      return;
    }
    setFileError(null);
    setFile(f);
  }, []);

  const validateAndSetAudioFile = useCallback((f: File) => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_AUDIO_EXTENSIONS.includes(ext)) {
      setFileError(
        `Unsupported audio type. Please upload one of: ${ACCEPTED_AUDIO_EXTENSIONS.join(", ")}.`
      );
      return;
    }
    if (f.size > MAX_AUDIO_SIZE) {
      setFileError("Audio file is too large. Maximum size is 15 MB.");
      return;
    }
    setFileError(null);
    setAudioFile(f);
  }, []);

  // Once a mic recording finishes, run it through the same validation
  // as a browsed file -- same size/extension checks, same downstream
  // upload path, no special-casing needed anywhere else.
  useEffect(() => {
    if (recorder.status === "stopped" && recorder.file) {
      validateAndSetAudioFile(recorder.file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.status, recorder.file]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      setMethod("upload"); // page-wide drop intent inference — new-analysis_spec.md §6
      validateAndSetFile(dropped);
    }
  }

  async function handleSubmit() {
    setSubmitError(null);
    setSubmitting(true);
  }

  async function handlePipelineComplete() {
    try {
      let detail;

      if (method === "upload" && file) {
        // Real export files (Telegram JSON/TXT, CSV) are parsed
        // server-side so JSON/CSV structure is respected instead of
        // being naively split by newline.
        detail = await analyzeConversationFile(file);
      } else if (method === "audio" && audioFile) {
        detail = await analyzeConversationAudio(audioFile, audioFile.name);
      } else {
        detail = await analyzeConversationText(text);
      }

      navigate(`/dashboard/${detail.id}`);
    } catch (err) {
      setSubmitting(false);
      setSubmitError(
        err instanceof Error && err.message
          ? err.message
          : "Couldn't start analysis. Please try again."
      );
    }
  }

  return (
    <ShellLayout>
      <div className={cn("mx-auto transition-[max-width] duration-normal", submitting ? "max-w-content" : "max-w-reading")}>
        <h1 className="text-2xl font-bold text-foreground-light">New Analysis</h1>
        <p className="mt-1 text-foreground-light-muted">
          Submit a conversation for AI-assisted safety analysis.
        </p>

        {submitting ? (
          <div className="mt-8">
            <PipelineProgress onComplete={handlePipelineComplete} />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <SegmentedControl
              aria-label="Input method"
              value={method}
              onChange={setMethod}
              options={[
                { value: "paste", label: "Paste Text" },
                { value: "upload", label: "Upload File" },
                { value: "audio", label: "Audio" },
              ]}
            />

            {method === "paste" ? (
              <div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste the conversation here — one message per line, or in the format it was exported."
                  className="min-h-[320px] w-full resize-y rounded-card border border-border-light bg-surface-light p-4 text-sm leading-relaxed text-foreground-light outline-none focus-visible:border-primary"
                />
                <div className="mt-1 flex justify-between text-xs text-foreground-light-muted">
                  <span>{isShort && "This looks like a very short conversation — analysis may be less reliable."}</span>
                  <span className="tabular-nums">{text.length} characters</span>
                </div>
              </div>
            ) : method === "audio" ? (
              <div
                className={cn(
                  "rounded-card border-2 border-dashed p-10 text-center transition-colors duration-fast",
                  "border-border-light",
                  audioFile && "border-solid bg-surface-light-muted"
                )}
              >
                {!audioFile ? (
                  recorder.status === "recording" ? (
                    <div className="flex flex-col items-center">
                      <div className="relative flex h-14 w-14 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger/40" />
                        <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-danger text-white">
                          <Mic size={18} aria-hidden="true" />
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium tabular-nums text-foreground-light">
                        {String(Math.floor(recorder.seconds / 60)).padStart(2, "0")}:
                        {String(recorder.seconds % 60).padStart(2, "0")}
                      </p>
                      <p className="text-xs text-foreground-light-muted">Recording…</p>
                      <button
                        type="button"
                        onClick={recorder.stop}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-input bg-danger px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                      >
                        <StopCircle size={15} aria-hidden="true" />
                        Stop Recording
                      </button>
                    </div>
                  ) : (
                    <>
                      <Mic className="mx-auto mb-3 text-foreground-light-muted" size={28} aria-hidden="true" />
                      <p className="text-sm text-foreground-light">Upload a voice recording</p>
                      <button
                        type="button"
                        onClick={() => audioInputRef.current?.click()}
                        className="mt-1 text-sm font-medium text-primary hover:underline"
                      >
                        or click to browse
                      </button>

                      <div className="my-3 flex items-center justify-center gap-2 text-xs text-foreground-light-muted">
                        <span className="h-px w-10 bg-border-light" />
                        or
                        <span className="h-px w-10 bg-border-light" />
                      </div>

                      <button
                        type="button"
                        onClick={recorder.start}
                        className="inline-flex items-center gap-1.5 rounded-input border border-border-light px-3.5 py-1.5 text-sm font-medium text-foreground-light hover:bg-surface-light-muted"
                      >
                        <Mic size={14} aria-hidden="true" />
                        Record from microphone
                      </button>

                      {recorder.error && (
                        <p className="mt-2 text-xs text-danger">{recorder.error}</p>
                      )}

                      <p className="mt-3 text-xs text-foreground-light-muted">
                        Accepts {ACCEPTED_AUDIO_EXTENSIONS.join(", ")} — up to 15 MB.
                      </p>
                      <p className="mt-1 text-xs text-foreground-light-muted">
                        Speech is transcribed, then analyzed through the same safety pipeline as typed text.
                      </p>
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept={ACCEPTED_AUDIO_EXTENSIONS.join(",")}
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && validateAndSetAudioFile(e.target.files[0])}
                      />
                    </>
                  )
                ) : (
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <Mic className="text-foreground-light-muted" size={20} aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-foreground-light">{audioFile.name}</p>
                        <p className="text-xs text-foreground-light-muted">{Math.round(audioFile.size / 1024)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove audio file"
                      onClick={() => {
                        setAudioFile(null);
                        recorder.reset();
                      }}
                      className="text-foreground-light-muted hover:text-danger"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={cn(
                  "rounded-card border-2 border-dashed p-10 text-center transition-colors duration-fast",
                  dragActive ? "border-primary bg-primary/5" : "border-border-light",
                  file && "border-solid border-border-light bg-surface-light-muted"
                )}
              >
                {!file ? (
                  <>
                    <Upload className="mx-auto mb-3 text-foreground-light-muted" size={28} aria-hidden="true" />
                    <p className="text-sm text-foreground-light">Drag and drop a file here</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-1 text-sm font-medium text-primary hover:underline"
                    >
                      or click to browse
                    </button>
                    <p className="mt-3 text-xs text-foreground-light-muted">
                      Accepts .txt, .csv, or .json — including Telegram chat exports — up to 10 MB.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ACCEPTED_EXTENSIONS.join(",")}
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <FileText className="text-foreground-light-muted" size={20} aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-foreground-light">{file.name}</p>
                        <p className="text-xs text-foreground-light-muted">{Math.round(file.size / 1024)} KB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove file"
                      onClick={() => setFile(null)}
                      className="text-foreground-light-muted hover:text-danger"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
            {fileError && <p className="text-sm text-danger">{fileError}</p>}

            <div className="flex items-start gap-2 rounded-card border-none bg-transparent px-1 py-2 text-xs text-foreground-light-muted">
              <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>
                Before analysis, personal information such as names, phone numbers, and addresses
                is automatically detected and removed.{" "}
                <Link to="/documentation" className="font-medium text-primary hover:underline">
                  Learn more →
                </Link>
              </p>
            </div>

            {submitError && <p className="text-sm text-danger">{submitError}</p>}

            <Button variant="primary" size="lg" disabled={!hasValidInput} onClick={handleSubmit}>
              Analyze Conversation <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>
    </ShellLayout>
  );
}
