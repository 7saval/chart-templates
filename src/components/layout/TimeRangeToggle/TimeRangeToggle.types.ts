export type TimeRangeUnit = "5m" | "15m" | "1H" | "6H" | "1D";

export interface TimeRangeToggleProps {
  value?: TimeRangeUnit;
  onChange: (unit: TimeRangeUnit) => void;
  size?: "sm" | "default";
}
