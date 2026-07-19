import type {
  PipelineFlowNodeType,
  PipelineFlowEdgeType,
} from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram.types";

export const sparkClusterNodes: PipelineFlowNodeType[] = [
  {
    id: "master",
    type: "pipelineNode",
    position: { x: 300, y: 0 },
    data: {
      name: "Spark Master (Primary)",
      status: "normal",
      metrics: [
        { label: "Uptime", value: "25d 14h" },
        { label: "CPU", value: "18%" },
        { label: "MEM", value: "28%" },
      ],
    },
  },
  ...["Worker-01", "Worker-02", "Worker-03", "Worker-04"].map((name, i) => ({
    id: `worker-${i + 1}`,
    type: "pipelineNode" as const,
    position: { x: i * 200, y: 160 },
    data: {
      name,
      status: "normal" as const,
      metrics: [
        { label: "Executors", value: 10 },
        { label: "Cores", value: "40 / 80GB" },
        { label: "CPU", value: "26%" },
      ],
    },
  })),
];

export const sparkClusterEdges: PipelineFlowEdgeType[] = [
  "1",
  "2",
  "3",
  "4",
].map((n) => ({
  id: `master-worker-${n}`,
  source: "master",
  target: `worker-${n}`,
}));
