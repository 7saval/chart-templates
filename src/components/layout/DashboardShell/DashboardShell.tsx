import type { DashboardShellProps } from "./DashboardShell.types";

export function DashboardShell({
  header,
  sidebar,
  children,
}: DashboardShellProps) {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr] grid-cols-[240px_1fr] bg-background">
      <div className="col-span-2">{header}</div>
      <div className="row-start-2 border-r border-border">{sidebar}</div>
      <main className="row-start-2 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
