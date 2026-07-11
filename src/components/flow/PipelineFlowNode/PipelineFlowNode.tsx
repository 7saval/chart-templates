import { Card, CardContent } from "@/components/ui/card";
import type { PipelineFlowNodeProps } from "./PipelineFlowNode.types";
import { Badge } from "@/components/ui/badge";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_COLORS } from "@/tokens/colors";

export function PipelineFlowNode({
  name,
  metrics,
  sparklineData,
  status,
  isLoading,
}: PipelineFlowNodeProps) {
  if (isLoading)
    return (
      <Card className="w-44 bg-card border-border">
        <CardContent className="pt-4">
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-44 border-2" style={{ borderColor: STATUS_COLORS[status] }}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">{name}</span>
          <Badge
            style={{ backgroundColor: STATUS_COLORS[status] }}
            className="text-white text-[10px]"
          >
            {status}
          </Badge>
        </div>
        <div className="mt-2 space-y-0.5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="flex justify-between text-[11px] text-muted-foreground"
            >
              <span>{m.label}</span>
              <span className="text-foreground">{m.value}</span>
            </div>
          ))}
        </div>
        {sparklineData && (
          <SparklineChart data={sparklineData} height={24} status={status} />
        )}
      </CardContent>
    </Card>
  );
}
