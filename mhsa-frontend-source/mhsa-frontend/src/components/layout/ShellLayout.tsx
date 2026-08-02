import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { CriticalAlertBanner } from "./CriticalAlertBanner";

/**
 * Shell — frontend_architecture.md §2.1: the single persistent frame for
 * every authenticated screen (Dashboard onward). Landing is outside it.
 */
export function ShellLayout({
  children,
  criticalCount = 0,
}: {
  children: ReactNode;
  criticalCount?: number;
}) {
  return (
    <div className="flex h-full flex-col bg-surface-light-muted">
      <TopNav />
      <CriticalAlertBanner count={criticalCount} />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-content px-5 py-12 tablet:px-10 laptop:px-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
