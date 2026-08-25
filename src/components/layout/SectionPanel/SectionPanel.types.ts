export interface SectionPanelLegendItem {
  label: string;
  color: string;
  /** 범례 스와치 모양. 기본값 "dot" — 상태 색상 점. "dashed"/"arrow"는 엣지 스타일 설명용 라인. */
  variant?: "dot" | "dashed" | "arrow";
}

export interface SectionPanelProps {
  title: string;
  legend?: SectionPanelLegendItem[];
  children: React.ReactNode;
  className?: string;
  /** 목업 수준 밀도(패딩/폰트 축소)를 opt-in으로 적용. 기본값 false로 기존 레이아웃 유지. */
  compact?: boolean;
  /** 헤더 우측, legend 옆에 배치되는 컨트롤 영역 (예: 기간 선택 토글). */
  actions?: React.ReactNode;
}
