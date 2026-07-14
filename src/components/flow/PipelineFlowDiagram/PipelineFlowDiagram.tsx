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

function FlowNodeRenderer({ data }: NodeProps<PipelineFlowNodeType>) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="border-0! bg-transparent!"
      />
      <PipelineFlowNode {...data} />
      <Handle
        type="source"
        position={Position.Bottom}
        className="border-0! bg-transparent!"
      />
    </>
  );
}
const nodeTypes = { pipelineNode: FlowNodeRenderer };
export function PipelineFlowDiagram({
  nodes,
  edges,
  height = 360,
}: PipelineFlowDiagramProps) {
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
