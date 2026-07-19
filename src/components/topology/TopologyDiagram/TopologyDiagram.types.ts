import type { StatusLevel } from "@/tokens/colors";

export interface TopologyNode {
  id: string;
  label: string;
  status: StatusLevel;
  badges?: { label: string; value: string }[];
  isController?: boolean;
}

export interface TopologyEdge {
  source: string;
  target: string;
}

export interface TopologyDiagramProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  width?: number;
  height?: number;
}
