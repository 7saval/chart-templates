import { createContext, useContext, useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type NodeProps,
} from "@xyflow/react";
import type {
  PipelineFlowDiagramProps,
  PipelineFlowNodeType,
} from "./PipelineFlowDiagram.types";
import { PipelineFlowNode } from "../PipelineFlowNode";

// range는 lastRefresh를 따라 5초마다 바뀌는 값이라, React Flow의 nodes 배열(data)에 얹으면
// 노드 identity가 매번 바뀌어 React Flow가 노드를 계속 재측정(hidden→visible)하게 되고,
// 그 사이 hover/tooltip이 죽는 문제가 있었음 — 노드 배열은 그대로 두고 Context로만 흘려보냄.
const RangeContext = createContext<{ from: Date; to: Date } | undefined>(undefined);

function FlowNodeRenderer({
  data,
  direction,
}: NodeProps<PipelineFlowNodeType> & {
  direction: "vertical" | "horizontal";
}) {
  const range = useContext(RangeContext);
  return (
    <>
      <Handle
        type="target"
        position={direction === "horizontal" ? Position.Left : Position.Top}
        className="border-0! bg-transparent!"
      />
      {/* elementsSelectable={false}면 .react-flow__node에 pointer-events:none이 걸리므로
          노드 내용(차트 hover 포함)에서만 되살림 */}
      <div className="w-52" style={{ pointerEvents: "auto" }}>
        <PipelineFlowNode {...data} range={range} />
      </div>
      <Handle
        type="source"
        position={direction === "horizontal" ? Position.Right : Position.Bottom}
        className="border-0! bg-transparent!"
      />
    </>
  );
}
export function PipelineFlowDiagram({
  nodes,
  edges,
  height = 360,
  direction = "vertical",
  range,
}: PipelineFlowDiagramProps) {
  const nodeTypes = useMemo(
    () => ({
      pipelineNode: (props: NodeProps<PipelineFlowNodeType>) => (
        <FlowNodeRenderer {...props} direction={direction} />
      ),
    }),
    [direction],
  );
  const styleEdges = edges.map((e) => {
    const color = e.data?.isBottleneck ? "#ef4444" : "#60a5fa";
    return {
      ...e,
      type: "default",
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
      style: {
        stroke: color,
        strokeWidth: 1.5,
        strokeDasharray: "5 4",
      },
      labelStyle: { fill: "94a3b8", fontSize: 10 },
      labelBgStyle: { fill: "1e293b" },
    };
  });
  return (
    <div style={{ height }}>
      <RangeContext.Provider value={range}>
        <ReactFlow
          nodes={nodes}
          edges={styleEdges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll
          zoomOnScroll={false}
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{ padding: 0.06 }}
        >
          <Background color="#1e293b" gap={28} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </RangeContext.Provider>
    </div>
  );
}
