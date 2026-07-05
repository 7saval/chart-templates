import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { SectionPanelProps } from "./SectionPanel.types";
import { cn } from "@/lib/utils";

export function SectionPanel({
  title,
  legend,
  children,
  className,
}: SectionPanelProps) {
  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {legend && (
          <div className="flex gap-3">
            {legend.map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
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
