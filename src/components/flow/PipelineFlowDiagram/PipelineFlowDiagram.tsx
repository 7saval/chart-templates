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
import { reanchor } from "@/mocks/trend";

// range/anchor는 lastRefresh를 따라 5초마다 바뀌는 값이라, React Flow의 nodes 배열(data)에 얹으면
// 노드 identity가 매번 바뀌어 React Flow가 노드를 계속 재측정(hidden→visible)하게 되고,
// 그 재측정이 되돌아오지 못한 채 노드가 visibility:hidden에 갇혀버리는 버그가 있었음(sparklineData를
// 가진 노드에서 재현됨) — 노드 배열은 그대로 두고 Context로만 흘려보내, sparklineData 재앵커링도
// 여기 FlowNodeRenderer 안에서 로컬로 처리한다.
const RangeContext = createContext<{ from: Date; to: Date } | undefined>(undefined);
const AnchorContext = createContext<number | undefined>(undefined);

function FlowNodeRenderer({
  data,
  direction,
}: NodeProps<PipelineFlowNodeType> & {
  direction: "vertical" | "horizontal";
}) {
  const range = useContext(RangeContext);
  const anchor = useContext(AnchorContext);
  const liveData = useMemo(
    () =>
      data.sparklineData && anchor !== undefined
        ? { ...data, sparklineData: reanchor(data.sparklineData, anchor) }
        : data,
    [data, anchor],
  );
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
        <PipelineFlowNode {...liveData} range={range} />
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
  anchor,
}: PipelineFlowDiagramProps) {
  const nodeTypes = useMemo(
    () => ({
      pipelineNode: (props: NodeProps<PipelineFlowNodeType>) => (
        <FlowNodeRenderer {...props} direction={direction} />
      ),
    }),
    [direction],
  );
  // edges도 매 렌더마다 새 배열/객체를 만들면 부모(Home)가 5초마다 리렌더될 때 ReactFlow에
  // 매번 새 identity의 edges가 들어가 노드와 같은 재측정 문제를 일으킴 — edges prop이 실제로
  // 바뀔 때만 재계산되도록 메모이즈.
  const styleEdges = useMemo(
    () =>
      edges.map((e) => {
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
      }),
    [edges],
  );
  return (
    <div style={{ height }}>
      <RangeContext.Provider value={range}>
        <AnchorContext.Provider value={anchor}>
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
        </AnchorContext.Provider>
      </RangeContext.Provider>
    </div>
  );
}
