import type { Node, Edge } from "@xyflow/react";
import type { PipelineFlowNodeProps } from "@/components/flow/PipelineFlowNode/PipelineFlowNode.types";

export type PipelineFlowNodeType = Node<PipelineFlowNodeProps, "pipelineNode">;
export type PipelineFlowEdgeData = {
  isBottleneck?: boolean;
};
export type PipelineFlowEdgeType = Edge<PipelineFlowEdgeData>;

export interface PipelineFlowDiagramProps {
  nodes: PipelineFlowNodeType[];
  edges: PipelineFlowEdgeType[];
  height?: number;
}
