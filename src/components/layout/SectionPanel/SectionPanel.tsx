import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SectionPanelProps } from "./SectionPanel.types";
import { cn } from "@/lib/utils";

export function SectionPanel({
  title,
  legend,
  children,
  className,
  compact = false,
}: SectionPanelProps) {
  return (
    <Card size={compact ? "sm" : "default"} className={cn("bg-card border-border", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className={cn("font-medium text-foreground", compact ? "text-xs" : "text-sm")}>
          {title}
        </h3>
        {legend && (
          <div className="flex gap-3">
            {legend.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                {item.variant === "dashed" || item.variant === "arrow" ? (
                  <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0">
                    <line
                      x1="0"
                      y1="4"
                      x2={item.variant === "arrow" ? "11" : "16"}
                      y2="4"
                      stroke={item.color}
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />
                    {item.variant === "arrow" && (
                      <polygon points="10,1 16,4 10,7" fill={item.color} />
                    )}
                  </svg>
                ) : (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.label}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
