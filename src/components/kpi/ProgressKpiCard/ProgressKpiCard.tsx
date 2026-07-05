import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getProgressStatus, STATUS_COLORS } from '@/tokens/colors';
import type { ProgressKpiCardProps } from './ProgressKpiCard.types';

export function ProgressKpiCard({ data, isLoading }: ProgressKpiCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  const derived = getProgressStatus(data.usedPct).status;
  const color = STATUS_COLORS[data.status ?? derived];

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{data.label}</span>
          <Badge style={{ backgroundColor: color }} className="text-white">{data.usedPct}%</Badge>
        </div>
        <div className="mt-1 text-lg font-semibold text-foreground">
          {data.value} / {data.total}
        </div>
        <Progress value={data.usedPct} className="mt-2 h-2" style={{ ['--progress-color' as string]: color }} />
      </CardContent>
    </Card>
  );
}
