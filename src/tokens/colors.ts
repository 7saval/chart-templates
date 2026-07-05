export type StatusLevel =
  | "normal"
  | "warning"
  | "critical"
  | "info"
  | "inactive";

export const STATUS_COLORS: Record<StatusLevel, string> = {
  normal: "#22c55e",
  warning: "#f97316",
  critical: "#ef4444",
  info: "#3b82f6",
  inactive: "#6b7280",
};

export const LAG_THRESHOLDS = [
  { max: 50_000, status: "normal" as const, color: "#22c55e" },
  { max: 200_000, status: "caution" as const, color: "#f97316" },
  { max: 500_000, status: "warning" as const, color: "#f43f5e" },
  { max: Infinity, status: "critical" as const, color: "#ef4444" },
];

export const PROGRESS_THRESHOLDS = [
  { max: 70, status: "normal" as const },
  { max: 90, status: "warning" as const },
  { max: 100, status: "critical" as const },
];

export function getLagStatus(lag: number) {
  return LAG_THRESHOLDS.find((t) => lag < t.max)!;
}

export function getProgressStatus(pct: number) {
  return PROGRESS_THRESHOLDS.find((t) => pct <= t.max)!;
}
