import { useMemo } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type NodeProps,
} from "@xyflow/react";
import type {
  PipelineFlowDiagramProps,
  PipelineFlowNodeType,
} from "./PipelineFlowDiagram.types";
import { PipelineFlowNode } from "../PipelineFlowNode";

function FlowNodeRenderer({
  data,
  direction,
}: NodeProps<PipelineFlowNodeType> & { direction: "vertical" | "horizontal" }) {
  return (
    <>
      <Handle
        type="target"
        position={direction === "horizontal" ? Position.Left : Position.Top}
        className="border-0! bg-transparent!"
      />
      <div className="w-44">
        <PipelineFlowNode {...data} />
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
}: PipelineFlowDiagramProps) {
  const nodeTypes = useMemo(
    () => ({
      pipelineNode: (props: NodeProps<PipelineFlowNodeType>) => (
        <FlowNodeRenderer {...props} direction={direction} />
      ),
    }),
    [direction],
  );
  const styleEdges = edges.map((e) => ({
    ...e,
    type: "smoothstep",
    animated: e.data?.isBottleneck === true,
    style: {
      stroke: e.data?.isBottleneck ? "#ef4444" : "#334155",
      strokeWidth: 2,
      strokeDasharray: e.data?.isBottleneck ? "4 3" : undefined,
    },
    labelStyle: { fill: "94a3b8", fontSize: 10 },
    labelBgStyle: { fill: "1e293b" },
  }));
  return (
    <div style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={styleEdges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background color="#1e293b" gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
