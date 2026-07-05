export interface SectionPanelProps {
  title: string;
  legend?: { label: string; color: string }[];
  children: React.ReactNode;
  className?: string;
}
