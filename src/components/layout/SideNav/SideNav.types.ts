export interface SideNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SideNavProps {
  items: SideNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}
