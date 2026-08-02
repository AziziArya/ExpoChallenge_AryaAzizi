import { useCallback, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, X, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Button } from "../components/ui/Button";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { PipelineProgress } from "../components/analysis/PipelineProgress";
import { analyzeConversationText } from "../services/conversationDetail.service";
import { cn } from "../lib/cn";

type Method = "paste" | "upload";

const ACCEPTED_EXTENSIONS = [".txt", ".csv", ".json"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB — [ASSUMPTION], see new-analysis_spec.md §7

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<Method>("paste");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasValidInput = method === "paste" ? text.trim().length > 0 : file !== null;
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
      let content = text;
      if (method === "upload" && file) {
        content = await file.text();
      }
      const detail = await analyzeConversationText(content);
      navigate(`/dashboard/${detail.id}`);
    } catch {
      setSubmitting(false);
      setSubmitError("Couldn't start analysis. Please try again.");
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
                      Accepts .txt, .csv, or .json — up to 10 MB.
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
