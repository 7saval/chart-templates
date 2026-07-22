import { Skeleton } from "@/components/ui/skeleton";
import type { MiniStatCellProps } from "./MiniStatCell.types";
import { STATUS_COLORS } from "@/tokens/colors";

export function MiniStatCell({
  label,
  value,
  unit,
  status,
  isLoading,
}: MiniStatCellProps) {
  if (isLoading) {
    return (
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span
        className="text-base font-semibold text-foreground"
        style={status ? { color: STATUS_COLORS[status] } : undefined}
      >
        {value}
        {unit && (
          <span className="ml-1 text-xs text-muted-foreground">{unit}</span>
        )}
      </span>
    </div>
  );
}
