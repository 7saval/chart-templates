import { Skeleton } from "@/components/ui/skeleton";
import type { RankedListProps } from "./RankedList.types";
import { Badge } from "@/components/ui/badge";
import { STATUS_COLORS } from "@/tokens/colors";

export function RankedList({
  items,
  maxItems = 5,
  isLoading,
  emptyMessage = "No data",
}: RankedListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: maxItems }, (_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  const ranked = items.slice(0, maxItems);

  if (ranked.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ol className="space-y-1.5">
      {ranked.map((item, i) => (
        <li
          key={item.label}
          className="flex items-center justify-between gap-2 text-sm"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="w-4 shrink-0 text-xs text-muted-foreground">
              {i + 1}
            </span>
            <span className="truncate text-foreground">{item.label}</span>
          </div>
          {item.status ? (
            <Badge
              style={{ backgroundColor: STATUS_COLORS[item.status] }}
              className="shrink-0 text-white"
            >
              {item.value}
              {item.unit}
            </Badge>
          ) : (
            <span className="shrink-0 text-muted-foreground">
              {item.value}
              {item.unit}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
