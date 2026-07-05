import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { KpiCardCompoundProps } from './KpiCardCompound.types';

export function KpiCardCompound({ data, isLoading }: KpiCardCompoundProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <span className="text-xs text-muted-foreground">{data.label}</span>
        <div className="mt-1 text-2xl font-semibold text-foreground">{data.value}</div>
        <div className="mt-2 flex gap-2">
          {data.breakdown.map((b) => (
            <Badge key={b.label} style={{ backgroundColor: b.color }} className="text-white">
              {b.label} {b.count}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
