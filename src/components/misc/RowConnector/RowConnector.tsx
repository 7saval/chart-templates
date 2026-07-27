import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/tokens/colors";
import type { RowConnectorProps } from "./RowConnector.types";

export function RowConnector({ count, className }: RowConnectorProps) {
  return (
    <div className={cn("flex flex-col justify-center space-y-1.5 pt-9", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex h-5 w-6 items-center">
          <span
            className="h-px flex-1 border-t border-dashed"
            style={{ borderColor: STATUS_COLORS.info }}
          />
          <svg width="7" height="8" viewBox="0 0 7 8" className="shrink-0">
            <path
              d="M0.5,0.5 L6,4 L0.5,7.5"
              fill="none"
              stroke={STATUS_COLORS.info}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
