import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { TimeRangeToggleProps, TimeRangeUnit } from "./TimeRangeToggle.types";

const TIME_UNITS: TimeRangeUnit[] = ["5m", "15m", "1H", "6H", "1D"];

export function TimeRangeToggle({ value, onChange, size = "sm" }: TimeRangeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size={size}
      value={value}
      onValueChange={(v) => v && onChange(v as TimeRangeUnit)}
    >
      {TIME_UNITS.map((u) => (
        <ToggleGroupItem key={u} value={u} className="text-xs">
          {u}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
