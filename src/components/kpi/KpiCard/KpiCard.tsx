import { Bell } from 'lucide-react';
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

export function KpiCard({ data, isLoading, error, range }: KpiCardProps) {
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

  const { label, value, unit, deltaPct, compareLabel, trend, status, breakdown } = data;
  const arrow = deltaPct === undefined ? null : deltaPct > 0 ? '▲' : deltaPct < 0 ? '▼' : '─';
  const deltaColor = getDeltaColor(status, deltaPct);
  const displayValue = typeof value === 'number' ? value.toLocaleString('en-US') : value;

  return (
    <Card className="relative bg-card border-border">
      {breakdown && <Bell className="absolute right-4 top-4 size-4 text-status-warning" />}
      <CardContent className="flex items-center justify-between gap-4 pt-6">
        <div className="min-w-0">
          <div className="text-xs leading-tight text-muted-foreground">{label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-foreground">{displayValue}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          {arrow && (
            <div className="mt-1 text-xs" style={{ color: deltaColor }}>
              {arrow} {Math.abs(deltaPct!)}%{compareLabel && ` (${compareLabel})`}
            </div>
          )}
          {breakdown && (
            <div className="mt-1 flex gap-2 text-xs">
              {breakdown.map((b) => (
                <span key={b.label} style={{ color: b.color }}>
                  {b.label} {b.count}
                </span>
              ))}
            </div>
          )}
        </div>
        {trend && (
          <div className="w-24 shrink-0">
            <SparklineChart data={trend} height={40} status={status} range={range} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
