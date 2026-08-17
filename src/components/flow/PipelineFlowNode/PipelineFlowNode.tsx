import { Card, CardContent } from "@/components/ui/card";
import type { PipelineFlowNodeProps } from "./PipelineFlowNode.types";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { MiniBarChart } from "@/components/charts/MiniBarChart";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_COLORS } from "@/tokens/colors";

export function PipelineFlowNode({
  name,
  subtitle,
  stats,
  metrics = [],
  highlight,
  sparklineData,
  chartVariant = "line",
  status,
  isLoading,
  range,
}: PipelineFlowNodeProps) {
  if (isLoading)
    return (
      <Card size="sm" className="w-full bg-card border-border">
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );

  return (
    <Card size="sm" className="w-full border-2" style={{ borderColor: STATUS_COLORS[status] }}>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">{name}</span>
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
        </div>
        {subtitle || stats ? (
          <div className="mt-1.5">
            {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
            {stats && (
              <div className="mt-1 flex items-center justify-between text-sm text-foreground">
                {stats.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            )}
          </div>
        ) : highlight ? (
          <div className="mt-2">
            <div className="text-lg font-bold" style={{ color: STATUS_COLORS[status] }}>
              {highlight.label && `${highlight.label} `}
              {highlight.value}
            </div>
            {highlight.caption && (
              <div className="mt-0.5 text-xs text-muted-foreground">{highlight.caption}</div>
            )}
          </div>
        ) : (
          <div className="mt-2 space-y-1">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span>{m.label}</span>
                <span className="text-foreground">{m.value}</span>
              </div>
            ))}
          </div>
        )}
        {sparklineData && (
          // width를 퍼센트(반응형)로 두면 echarts 자체 ResizeObserver와 React Flow의 노드
          // 자동 측정(ResizeObserver)이 서로를 계속 다시 측정하게 만들어, 이 노드가
          // visibility:hidden에 갇히는 버그가 있었음 — 고정 폭으로 순환 의존을 끊음.
          <div className="mt-1.5" style={{ width: 184 }}>
            {chartVariant === "bar" ? (
              <MiniBarChart data={sparklineData} height={32} status={status} range={range} />
            ) : (
              <SparklineChart data={sparklineData} height={32} status={status} range={range} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
