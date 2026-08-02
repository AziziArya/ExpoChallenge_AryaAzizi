import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus2,
  History as HistoryIcon,
  FileText,
  BookOpen,
  Code2,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "../../lib/cn";

/**
 * Sidebar — frontend_architecture.md §2.2 / dashboard_spec.md §4
 *
 * Fixed, seven-item set, always identical regardless of page or app state
 * (Explainability is deliberately NOT a Sidebar item — §17.3 — it's only
 * reachable from within an open conversation).
 * Active state uses three redundant signals: filled icon, bold label,
 * 3px leading accent bar — never color alone.
 */
const primaryItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-analysis", label: "New Analysis", icon: FilePlus2 },
  { to: "/history", label: "History", icon: HistoryIcon },
  { to: "/reports", label: "Reports", icon: FileText },
];

const docItems = [
  { to: "/documentation", label: "Documentation", icon: BookOpen },
  { to: "/documentation#api", label: "API", icon: Code2 },
];

const settingsItem = { to: "/settings", label: "Settings", icon: SettingsIcon };

function SidebarLink({ to, label, icon: Icon }: (typeof primaryItems)[number]) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "relative flex h-11 items-center gap-3 rounded-[10px] px-4 text-sm transition-colors duration-fast",
          isActive
            ? "font-semibold text-foreground-light bg-primary/5"
            : "font-normal text-foreground-light-muted hover:bg-surface-light-muted hover:text-foreground-light"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-0 top-0 h-full w-[3px] rounded-r bg-primary"
              aria-hidden="true"
            />
          )}
          <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border-light bg-surface-light laptop:flex">
      <div className="flex flex-1 flex-col gap-1 px-3 pt-6">
        {primaryItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}

        <div className="my-3 border-t border-border-light" />

        {docItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}

        <div className="my-3 border-t border-border-light" />

        <SidebarLink {...settingsItem} />
      </div>

      <div className="border-t border-border-light px-4 py-4">
        <NavLink
          to="/about"
          className="text-xs text-foreground-light-muted hover:text-foreground-light"
        >
          About · License
        </NavLink>
      </div>
    </aside>
  );
}
