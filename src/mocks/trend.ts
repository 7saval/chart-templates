import type { ChartDataPoint } from "@/tokens/base.types";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TrendOptions {
  points?: number;
  stepMinutes?: number;
  volatility?: number;
  seed?: number;
  /** Epoch ms of the last (most recent) point. Defaults to Date.now(). */
  anchor?: number;
}

export function generateTrendSeries(
  endValue: number,
  { points = 289, stepMinutes = 5, volatility = 0.06, seed, anchor }: TrendOptions = {},
): ChartDataPoint[] {
  const rand = mulberry32(seed ?? (Math.round(endValue * 1000) || 1));
  const values: number[] = [endValue];
  for (let i = 1; i < points; i++) {
    const prev = values[values.length - 1];
    const delta = (rand() - 0.5) * 2 * volatility * (Math.abs(endValue) || 1);
    values.push(Math.max(0, prev + delta));
  }
  values.reverse();

  const now = anchor ?? Date.now();
  return values.map((value, i) => ({
    timestamp: now - (points - 1 - i) * stepMinutes * 60_000,
    value: Math.round(value * 10_000) / 10_000,
  }));
}

/** Attaches synthetic timestamps (ending at anchor, defaults to now) to a hand-authored value array, without altering the values. */
export function toPoints(values: number[], stepMinutes = 5, anchor?: number): ChartDataPoint[] {
  const now = anchor ?? Date.now();
  return values.map((value, i) => ({
    timestamp: now - (values.length - 1 - i) * stepMinutes * 60_000,
    value,
  }));
}

/** Shifts an already-timestamped series so its last point lands exactly on `anchor`, preserving shape/values. */
export function reanchor(points: ChartDataPoint[], anchor: number): ChartDataPoint[] {
  if (points.length === 0) return points;
  const lastTimestamp = Number(points[points.length - 1].timestamp);
  const offset = anchor - lastTimestamp;
  return points.map((p) => ({ ...p, timestamp: Number(p.timestamp) + offset }));
}
