import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { STATUS_COLORS } from '@/tokens/colors';
import type { StatusLevel } from '@/tokens/colors';
import type { KpiCardProps } from './KpiCard.types';

function getDeltaColor(status: StatusLevel | undefined, deltaPct: number | undefined) {
  if (status) return STATUS_COLORS[status];
  if (deltaPct === undefined) return STATUS_COLORS.info;
  return deltaPct >= 0 ? STATUS_COLORS.normal : STATUS_COLORS.critical;
}

export function KpiCard({ data, isLoading, error }: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="space-y-2 pt-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6 text-sm text-status-critical">{error}</CardContent>
      </Card>
    );
  }

  const { label, value, unit, deltaPct, compareLabel, trend, status } = data;
  const arrow = deltaPct === undefined ? null : deltaPct > 0 ? '▲' : deltaPct < 0 ? '▼' : '─';
  const deltaColor = getDeltaColor(status, deltaPct);

  return (
    <Card className="bg-card border-border">
      <CardContent className="flex items-center justify-between gap-4 pt-6">
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-foreground">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          {arrow && (
            <div className="mt-1 text-xs" style={{ color: deltaColor }}>
              {arrow} {Math.abs(deltaPct!)}%{compareLabel && ` (${compareLabel})`}
            </div>
          )}
        </div>
        {trend && (
          <div className="w-24 shrink-0">
            <SparklineChart data={trend} height={40} status={status} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
