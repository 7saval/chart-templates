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
  direction?: "vertical" | "horizontal";
  /** TopHeader 기간 선택과 연동된 구간. 각 노드의 미니 차트로 전달됨 */
  range?: { from: Date; to: Date };
  /**
   * sparklineData 재앵커링 기준 시각(epoch ms, 보통 lastRefresh). nodes 배열 자체에
   * 얹지 말 것 — 5초마다 노드 identity가 바뀌면 React Flow가 노드를 재측정하다가
   * visibility:hidden에 갇히는 버그가 있음.
   */
  anchor?: number;
}
