import { useState } from "react";
import {
  User,
  Palette,
  Bell,
  ShieldCheck,
  Eye,
  Lock,
  Monitor,
  UserX,
  Check,
} from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Button } from "../components/ui/Button";
import { Toggle } from "../components/ui/Toggle";
import { SegmentedControl } from "../components/ui/SegmentedControl";
import { SimpleConfirmDialog } from "../components/ui/SimpleConfirmDialog";
import { useTheme } from "../hooks/useTheme";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSettings } from "../hooks/useSettings";
import { cn } from "../lib/cn";

type SectionId =
  | "profile"
  | "appearance"
  | "notifications"
  | "privacy"
  | "accessibility"
  | "security"
  | "sessions"
  | "account";

const SECTIONS: { id: SectionId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
  { id: "accessibility", label: "Accessibility", icon: Eye },
  { id: "security", label: "Security", icon: Lock },
  { id: "sessions", label: "Sessions", icon: Monitor },
  { id: "account", label: "Account", icon: UserX },
];

/** Small saved-confirmation, reused by every Save-gated section (settings_spec.md §4). */
function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <Button variant="primary" size="md" onClick={onSave}>
        Save changes
      </Button>
      {saved && (
        <span className="inline-flex items-center gap-1 text-sm text-success">
          <Check size={14} /> Saved
        </span>
      )}
    </div>
  );
}

function useSavedFlash() {
  const [saved, setSaved] = useState(false);
  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return { saved, flash };
}

export default function Settings() {
  const [active, setActive] = useState<SectionId>("profile");

  return (
    <ShellLayout>
      <h1 className="mb-6 text-2xl font-bold text-foreground-light">Settings</h1>

      <div className="flex flex-col gap-8 laptop:flex-row">
        {/* Sub-nav rail — desktop/laptop */}
        <nav className="hidden w-60 shrink-0 laptop:block" aria-label="Settings sections">
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "relative flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-left text-sm transition-colors duration-fast",
                    active === s.id
                      ? "font-semibold text-foreground-light bg-primary/5"
                      : "text-foreground-light-muted hover:bg-surface-light-muted hover:text-foreground-light"
                  )}
                >
                  {active === s.id && (
                    <span className="absolute left-0 top-0 h-full w-[3px] rounded-r bg-primary" aria-hidden="true" />
                  )}
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile section select */}
        <div className="laptop:hidden">
          <select
            value={active}
            onChange={(e) => setActive(e.target.value as SectionId)}
            className="w-full rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
            aria-label="Settings section"
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="max-w-reading flex-1">
          {active === "profile" && <ProfileSection />}
          {active === "appearance" && <AppearanceSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "privacy" && <PrivacySection />}
          {active === "accessibility" && <AccessibilitySection />}
          {active === "security" && <SecuritySection />}
          {active === "sessions" && <SessionsSection />}
          {active === "account" && <AccountSection />}
        </div>
      </div>
    </ShellLayout>
  );
}

/* ---------------------------------------------------------------- */
function SectionHeader({ title, subline }: { title: string; subline: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-foreground-light">{title}</h2>
      {subline && <p className="mt-1 text-sm text-foreground-light-muted">{subline}</p>}
    </div>
  );
}

/* 1. Profile — Save-gated, settings_spec.md §4 */
function ProfileSection() {
  const { settings, update } = useSettings();
  const [name, setName] = useState(settings.profile.fullName);
  const [title, setTitle] = useState(settings.profile.title);
  const { saved, flash } = useSavedFlash();

  function handleSave() {
    update("profile", { fullName: name, title });
    flash();
  }

  return (
    <div>
      <SectionHeader title="Profile" subline="This information appears on reports and review records." />
      <div className="flex items-center gap-3">
        <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary/15 text-lg font-semibold text-secondary">
          DR
        </span>
        <button className="text-sm font-medium text-primary hover:underline">Change photo</button>
      </div>
      <div className="mt-6 space-y-6">
        <Field label="Full Name" value={name} onChange={setName} />
        <Field label="Professional Title" value={title} onChange={setTitle} />
        <Field label="Email" value="dr.reviewer@clinic.example" onChange={() => {}} readOnly />
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground-light-muted">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-input border border-border-light px-3 py-2 text-sm text-foreground-light outline-none focus-visible:border-primary",
          readOnly ? "bg-surface-light-muted text-foreground-light-muted" : "bg-surface-light"
        )}
      />
    </div>
  );
}

/* 2. Appearance — Theme + Reduce Motion instant-apply, Language Save-gated */
function AppearanceSection() {
  const { preference, setPreference } = useTheme();
  const { enabled: reducedMotion, setEnabled: setReducedMotion } = useReducedMotion();
  const { settings, update } = useSettings();
  const [language, setLanguage] = useState(settings.appearance.language);
  const { saved, flash } = useSavedFlash();

  function handleSave() {
    update("appearance", { language });
    flash();
  }

  return (
    <div>
      <SectionHeader title="Appearance" subline="Choose how the interface looks on this device." />

      <p className="mb-2 text-sm font-medium text-foreground-light">Theme</p>
      <SegmentedControl
        aria-label="Theme"
        value={preference}
        onChange={setPreference}
        options={[
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
          { value: "system", label: "System" },
        ]}
      />

      <div className="my-6 border-t border-border-light" />

      <Toggle
        checked={reducedMotion}
        onChange={setReducedMotion}
        label="Reduce motion"
        helperText="Turns off animated transitions, including the AI reasoning pipeline animation. Recommended if motion is distracting."
      />

      <div className="my-6 border-t border-border-light" />

      <div>
        <label className="mb-1 block text-xs font-medium text-foreground-light-muted">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full max-w-xs rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
        >
          <option value="en-US">English (United States)</option>
          <option value="fa-IR">Persian (Iran)</option>
        </select>
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

/* 3. Notifications — batched Save-gated, one row always-on & disabled */
function NotificationsSection() {
  const { settings, update } = useSettings();
  const [pendingReminders, setPendingReminders] = useState(settings.notifications.pendingReminders);
  const [newCompleted, setNewCompleted] = useState(settings.notifications.newAnalysisCompleted);
  const [escalationUpdates, setEscalationUpdates] = useState(settings.notifications.escalationUpdates);
  const { saved, flash } = useSavedFlash();

  function handleSave() {
    update("notifications", {
      pendingReminders,
      newAnalysisCompleted: newCompleted,
      escalationUpdates,
    });
    flash();
  }

  return (
    <div>
      <SectionHeader title="Notifications" subline="Control what you're notified about and how." />
      <div className="divide-y divide-border-light">
        <Toggle checked={pendingReminders} onChange={setPendingReminders} label="Pending review reminders" />
        <Toggle checked={newCompleted} onChange={setNewCompleted} label="New analysis completed" />
        <Toggle checked={escalationUpdates} onChange={setEscalationUpdates} label="Escalation updates on cases you've reviewed" />
      </div>
      <div className="my-4 border-t border-border-light" />
      <Toggle
        checked
        onChange={() => {}}
        disabled
        label="Critical Emergency alerts"
        helperText="Critical Emergency notifications cannot be turned off, to ensure urgent cases are never missed."
      />
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

/* 4. Privacy — two consequential toggles gated by Confirmation Dialog */
function PrivacySection() {
  const { settings, update } = useSettings();
  const [avoidRawStorage, setAvoidRawStorage] = useState(settings.privacy.avoidRawStorage);
  const [anonymousProcessing, setAnonymousProcessing] = useState(settings.privacy.anonymousProcessing);
  const [retention, setRetention] = useState(settings.privacy.retention);
  const { saved, flash } = useSavedFlash();

  const [confirmRaw, setConfirmRaw] = useState(false);
  const [confirmAnon, setConfirmAnon] = useState(false);

  function handleSave() {
    update("privacy", { avoidRawStorage, anonymousProcessing, retention });
    flash();
  }

  return (
    <div>
      <SectionHeader title="Privacy" subline="Control how conversation data is handled and retained." />

      <Toggle
        checked={avoidRawStorage}
        onChange={(v) => (v ? setConfirmRaw(true) : setAvoidRawStorage(false))}
        label="Avoid storing raw conversation text after analysis"
        helperText="When enabled, only the structured analysis result is retained. The original conversation cannot be re-viewed later."
      />
      <Toggle
        checked={anonymousProcessing}
        onChange={(v) => (v ? setAnonymousProcessing(true) : setConfirmAnon(true))}
        label="Anonymous processing"
        helperText="Detected personal information is removed before any AI analysis begins. Enabled by default and recommended for all cases."
      />

      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-foreground-light-muted">
          Data retention period
        </label>
        <select
          value={retention}
          onChange={(e) => setRetention(e.target.value as typeof retention)}
          className="w-full max-w-xs rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
        >
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="365">1 year</option>
          <option value="indefinite">Indefinite</option>
        </select>
      </div>
      <SaveBar onSave={handleSave} saved={saved} />

      <SimpleConfirmDialog
        open={confirmRaw}
        title="Stop storing raw conversation text?"
        description="Once enabled, only the structured analysis result is retained. Past and future original conversations will no longer be re-viewable. This trade-off applies going forward."
        confirmLabel="Enable"
        onCancel={() => setConfirmRaw(false)}
        onConfirm={() => {
          setAvoidRawStorage(true);
          setConfirmRaw(false);
        }}
      />
      <SimpleConfirmDialog
        open={confirmAnon}
        danger
        title="Turn off anonymous processing?"
        description="Turning this off means personal information will not be removed before analysis. Are you sure?"
        confirmLabel="Turn off"
        onCancel={() => setConfirmAnon(false)}
        onConfirm={() => {
          setAnonymousProcessing(false);
          setConfirmAnon(false);
        }}
      />
    </div>
  );
}

/* 5. Accessibility — Contrast/Underline instant, Text Size Save-gated */
function AccessibilitySection() {
  const { settings, update } = useSettings();
  const [textSize, setTextSize] = useState(settings.accessibility.textSize);
  const { saved, flash } = useSavedFlash();

  function handleSave() {
    update("accessibility", { textSize });
    flash();
  }

  return (
    <div>
      <SectionHeader title="Accessibility" subline="These settings help tailor the interface to your needs." />
      <Toggle
        checked={settings.accessibility.contrast}
        onChange={(v) => update("accessibility", { contrast: v })}
        label="Increase contrast"
        helperText="Strengthens borders and text contrast beyond the standard theme."
      />
      <Toggle
        checked={settings.accessibility.underlineLinks}
        onChange={(v) => update("accessibility", { underlineLinks: v })}
        label="Underline links"
        helperText="Adds a permanent underline to text links, useful if color alone is hard to distinguish."
      />
      <div className="mt-4">
        <label className="mb-1 block text-xs font-medium text-foreground-light-muted">Text size</label>
        <select
          value={textSize}
          onChange={(e) => setTextSize(e.target.value as typeof textSize)}
          className="w-full max-w-xs rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
        >
          <option value="default">Default</option>
          <option value="large">Large</option>
          <option value="xl">Extra Large</option>
        </select>
      </div>
      <SaveBar onSave={handleSave} saved={saved} />
    </div>
  );
}

/* 6. Security — password Save-gated + validated, 2FA shown-disabled */
function SecuritySection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { saved, flash } = useSavedFlash();

  function handleSave() {
    if (!current) {
      setError("Current password is incorrect.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setCurrent("");
    setNext("");
    setConfirm("");
    flash();
  }

  return (
    <div>
      <SectionHeader title="Security" subline="Manage how you sign in to your account." />
      <div className="space-y-4">
        <Field label="Current password" value={current} onChange={setCurrent} type="password" />
        <Field label="New password" value={next} onChange={setNext} type="password" />
        <Field label="Confirm new password" value={confirm} onChange={setConfirm} type="password" />
      </div>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <SaveBar onSave={handleSave} saved={saved} />

      <div className="my-6 border-t border-border-light" />
      <Toggle
        checked={false}
        onChange={() => {}}
        disabled
        label="Two-factor authentication"
        helperText="Coming soon. Two-factor authentication will be available once multi-user account support is added."
      />
    </div>
  );
}

/* 7. Sessions */
const MOCK_SESSIONS = [
  { id: "s1", device: "Chrome on macOS", location: "Amsterdam, NL", current: true, lastActive: "Active now" },
  { id: "s2", device: "Safari on iPhone", location: "Amsterdam, NL", current: false, lastActive: "2 days ago" },
];

function SessionsSection() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [confirmAll, setConfirmAll] = useState(false);

  return (
    <div>
      <SectionHeader title="Sessions" subline="Devices and locations currently signed in to your account." />
      <div className="divide-y divide-border-light rounded-card border border-border-light">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-foreground-light">
                {s.device}
                {s.current && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    This device
                  </span>
                )}
              </p>
              <p className="text-xs text-foreground-light-muted">
                {s.location} · {s.lastActive}
              </p>
            </div>
            {!s.current && (
              <button
                onClick={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))}
                className="text-sm font-medium text-foreground-light-muted hover:text-danger"
              >
                Sign out
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button variant="secondary" size="md" onClick={() => setConfirmAll(true)}>
          Sign out of all other sessions
        </Button>
      </div>

      <SimpleConfirmDialog
        open={confirmAll}
        danger
        title="Sign out of all other sessions?"
        description="This will sign you out everywhere except this device. Continue?"
        confirmLabel="Sign out everywhere"
        onCancel={() => setConfirmAll(false)}
        onConfirm={() => {
          setSessions((prev) => prev.filter((s) => s.current));
          setConfirmAll(false);
        }}
      />
    </div>
  );
}

/* 8. Account — danger zone, type-to-confirm delete */
function AccountSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleted, setDeleted] = useState(false);
  const requiredText = "dr.reviewer@clinic.example";

  if (deleted) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-foreground-light">Your account has been deleted.</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Account" subline="" />
      <Button variant="secondary" size="md">
        Export my data
      </Button>
      <p className="mt-1 text-xs text-foreground-light-muted">
        Download a copy of your profile and account settings.
      </p>

      <div className="my-6 border-t border-border-light" />

      <Button variant="danger" size="md" onClick={() => setConfirmOpen(true)}>
        Delete account
      </Button>
      <p className="mt-1 text-xs text-foreground-light-muted">
        Permanently deletes your account and profile. Conversation and case data ownership is
        governed by your organization's data retention policy and may not be deleted.
      </p>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-modal border border-border-light bg-surface-light p-6 shadow-card-hover">
            <h3 className="text-base font-semibold text-foreground-light">Delete account</h3>
            <p className="mt-2 text-sm text-foreground-light-muted">
              This action is permanent and cannot be undone. Type{" "}
              <span className="font-medium text-foreground-light">{requiredText}</span> to confirm.
            </p>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="mt-3 w-full rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light outline-none focus-visible:border-danger"
              aria-describedby="delete-confirm-help"
            />
            <p id="delete-confirm-help" className="mt-1 text-xs text-foreground-light-muted">
              Confirmation is case-sensitive.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  setConfirmOpen(false);
                  setTyped("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="md"
                disabled={typed !== requiredText}
                onClick={() => setDeleted(true)}
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
