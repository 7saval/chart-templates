import type { TopHeaderTimeUnit } from "@/components/layout/TopHeader/TopHeader.types";

const LOOKBACK_MS: Record<TopHeaderTimeUnit, number> = {
  "5m": 5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "1H": 60 * 60 * 1000,
  "6H": 6 * 60 * 60 * 1000,
  "1D": 24 * 60 * 60 * 1000,
};

export function resolveTimeRange(
  dateRange: { from: Date; to: Date } | undefined,
  timeUnit: TopHeaderTimeUnit | undefined,
  now: Date,
): { from: Date; to: Date } {
  if (dateRange) return dateRange;
  return { from: new Date(now.getTime() - LOOKBACK_MS[timeUnit ?? "1H"]), to: now };
}
