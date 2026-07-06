import type { ChartBaseProps } from '@/tokens/base.types';

export interface GaugeRingProps extends ChartBaseProps {
  value: number;
  target?: number;
  warningThreshold?: number;
  unit?: string;
}
