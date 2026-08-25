import type { ChartBaseProps, SeriesConfig } from '@/tokens/base.types';

export interface TrendLineChartProps extends ChartBaseProps {
  series: SeriesConfig[];
  /** category 축 라벨. `range`를 전달하지 않을 때만 사용 (기존 category 모드). */
  xLabels?: (string | number)[];
  /**
   * 전달 시 실제 timestamp 기반 time 축 + dataZoom(range 구간)으로 렌더링.
   * SparklineChart/MiniBarChart의 기간 선택 연동 패턴과 동일.
   */
  range?: { from: Date; to: Date };
  /** 차트 내부 legend 표시 여부. SectionPanel 헤더에서 legend를 별도로 그릴 때는 false로 끔. 기본값 true. */
  showLegend?: boolean;
}
