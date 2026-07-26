export interface SectionPanelProps {
  title: string;
  legend?: { label: string; color: string }[];
  children: React.ReactNode;
  className?: string;
  /** 목업 수준 밀도(패딩/폰트 축소)를 opt-in으로 적용. 기본값 false로 기존 레이아웃 유지. */
  compact?: boolean;
}
