import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { STATUS_COLORS } from '@/tokens/colors';
import type { KpiCardProps } from './KpiCard.types';

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

  const { label, value, unit, deltaPct, trend, status } = data;
  const deltaUp = (deltaPct ?? 0) >= 0;

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          {status && (
            <Badge style={{ backgroundColor: STATUS_COLORS[status] }} className="text-white">
              {status}
            </Badge>
          )}
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-foreground">{value}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
        <div className="mt-1 flex items-center justify-between">
          {deltaPct !== undefined && (
            <span className={deltaUp ? 'text-xs text-status-normal' : 'text-xs text-status-critical'}>
              {deltaUp ? '▲' : '▼'} {Math.abs(deltaPct)}%
            </span>
          )}
          {trend && <SparklineChart data={trend} height={32} status={status} />}
        </div>
      </CardContent>
    </Card>
  );
}
