import type { KpiCardData } from "@/components/kpi/KpiCard/KpiCard.types";
import type { AlertEvent } from "@/components/tables/AlertEventTable/AlertEventTable.types";
import type { ProgressKpiData } from "@/components/kpi/ProgressKpiCard/ProgressKpiCard.types";
import type { RankedListItem } from "@/components/misc/RankedList/RankedList.types";
import type { TableColumn } from "@/components/tables/StatusDataTable/StatusDataTable.types";
import type {
  PipelineFlowNodeType,
  PipelineFlowEdgeType,
} from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram.types";
import type { PipelineFlowNodeProps } from "@/components/flow/PipelineFlowNode/PipelineFlowNode.types";
import type { StatusLevel } from "@/tokens/colors";
import { generateTrendSeries, toPoints } from "./trend";

export const homeKpis: KpiCardData[] = [
  {
    label: "Total Traffic (In/Out)",
    value: 15.42,
    unit: "GB/s",
    deltaPct: 12.6,
    compareLabel: "vs 14:00",
    trend: generateTrendSeries(15.42, { volatility: 0.05 }),
    status: "normal",
  },
  {
    label: "Total Events / sec",
    value: 125_842,
    unit: "eps",
    deltaPct: 8.2,
    compareLabel: "vs 14:00",
    trend: generateTrendSeries(125_842, { volatility: 0.05 }),
    status: "normal",
  },
  {
    label: "Pipeline Latency (End-to-End)",
    value: 2.35,
    unit: "sec",
    deltaPct: -18.4,
    compareLabel: "vs 14:00",
    trend: generateTrendSeries(2.35, { volatility: 0.05 }),
    status: "info",
  },
  {
    label: "Processing Throughput",
    value: 98.7,
    unit: "K rec/s",
    deltaPct: 9.7,
    compareLabel: "vs 14:00",
    trend: generateTrendSeries(98.7, { volatility: 0.05 }),
    status: "warning",
  },
  {
    label: "Error Rate",
    value: 0.021,
    unit: "%",
    deltaPct: -22.1,
    compareLabel: "vs 14:00",
    trend: generateTrendSeries(0.021, { volatility: 0.05 }),
    status: "critical",
  },
  {
    label: "Active Alerts",
    value: 3,
    breakdown: [
      { label: "Critical", count: 1, color: "#ef4444" },
      { label: "Warning", count: 2, color: "#f97316" },
    ],
  },
];

export const homeAlerts: AlertEvent[] = [
  {
    id: "1",
    timestamp: "2026-07-05T09:12:00Z",
    serverity: "Critical",
    message: "Consumer lag exceeded 500k",
    target: "iceberg-sink-c1",
    status: "unack",
  },
  {
    id: "2",
    timestamp: "2026-07-05T08:55:00Z",
    serverity: "Warning",
    message: "Broker disk usage 82%",
    target: "kafka-broker-3",
    status: "ack",
  },
];

export const homeStages = [
  { name: "CDC", count: 4, status: "normal" as const },
  { name: "Kafka", count: 12, status: "normal" as const },
  { name: "Iceberg", count: 2, status: "warning" as const },
  { name: "Spark", count: 6, status: "normal" as const },
  { name: "Milvus", count: 1, status: "normal" as const },
];

// 2-5. Real-time Data Pipeline Flow Diagram — Data Source → Adapter → Kafka → Iceberg Sink → MinIO → Spark → Trino/Milvus → AI Agent
// 좌→우 가로 배치 (Phase D). 컬럼: col0=DATA SOURCE, col1=PPS ADAPTER, col2=KAFKA, col3=ICEBERG SINK, col4=MinIO, col5=SPARK, col6=TRINO/Milvus, col7=AI AGENT
export const homeFlowNodes: PipelineFlowNodeType[] = [
  {
    id: "src-kovis",
    type: "pipelineNode",
    position: { x: 0, y: 0 },
    data: { name: "KOVIS", status: "normal", metrics: [{ label: "rec/s", value: 120 }] },
  },
  {
    id: "src-xrois",
    type: "pipelineNode",
    position: { x: 0, y: 160 },
    data: { name: "XROIS", status: "normal", metrics: [{ label: "rec/s", value: 95 }] },
  },
  {
    id: "src-iris",
    type: "pipelineNode",
    position: { x: 0, y: 320 },
    data: { name: "IRIS", status: "normal", metrics: [{ label: "rec/s", value: 60 }] },
  },
  {
    id: "src-kotris",
    type: "pipelineNode",
    position: { x: 0, y: 480 },
    data: { name: "KOTRIS", status: "normal", metrics: [{ label: "rec/s", value: 40 }] },
  },
  {
    id: "src-voc",
    type: "pipelineNode",
    position: { x: 0, y: 640 },
    data: {
      name: "문서-VOC",
      status: "normal",
      metrics: [{ label: "rec/s", value: 15 }, { label: "mode", value: "batch" }],
    },
  },
  {
    id: "adapter-cdc",
    type: "pipelineNode",
    position: { x: 280, y: 200 },
    data: {
      name: "Adapter-CDC",
      status: "normal",
      subtitle: "실시간 변경 캡쳐",
      stats: ["9개 노드", "4.2K rec/s"],
      chartVariant: "bar",
      sparklineData: toPoints([3.6, 3.9, 3.7, 4.0, 3.8, 4.1, 3.9, 4.3, 4.0, 4.2, 4.1, 4.2]),
    },
  },
  {
    id: "adapter-dlhwp",
    type: "pipelineNode",
    position: { x: 280, y: 520 },
    data: {
      name: "Adapter-DLHWP",
      status: "normal",
      metrics: [{ label: "nodes", value: 1 }, { label: "mode", value: "batch" }],
    },
  },
  {
    id: "kafka-realtime",
    type: "pipelineNode",
    position: { x: 560, y: 200 },
    data: { name: "Kafka RealTime Topics", status: "normal", metrics: [{ label: "msg/s", value: 2_400 }] },
  },
  {
    id: "kafka-batch",
    type: "pipelineNode",
    position: { x: 560, y: 520 },
    data: { name: "Kafka Batch Topics", status: "normal", metrics: [{ label: "msg/s", value: 180 }] },
  },
  {
    id: "iceberg-c1",
    type: "pipelineNode",
    position: { x: 840, y: 200 },
    data: { name: "Iceberg Sink (C1)", status: "normal", metrics: [{ label: "write/h", value: 1_240 }] },
  },
  {
    id: "iceberg-c2",
    type: "pipelineNode",
    position: { x: 840, y: 520 },
    data: { name: "PPS Agent DLHWP (C2)", status: "warning", metrics: [{ label: "Lag", value: "210,000" }] },
  },
  {
    id: "minio",
    type: "pipelineNode",
    position: { x: 1120, y: 360 },
    data: {
      name: "MinIO/NAS",
      status: "normal",
      metrics: [{ label: "util", value: "68%" }, { label: "freshness", value: "2m" }],
    },
  },
  {
    id: "spark",
    type: "pipelineNode",
    position: { x: 1380, y: 360 },
    data: {
      name: "SPARK",
      status: "normal",
      metrics: [{ label: "docs/hr", value: "18.2k" }, { label: "state", value: "running" }],
    },
  },
  {
    id: "trino",
    type: "pipelineNode",
    position: { x: 1640, y: 260 },
    data: { name: "TRINO", status: "normal", metrics: [{ label: "qps", value: 42 }, { label: "state", value: "running" }] },
  },
  {
    id: "milvus",
    type: "pipelineNode",
    position: { x: 1640, y: 480 },
    data: {
      name: "Vector DB (Milvus)",
      status: "critical",
      highlight: { label: "stale", value: "7,420s", caption: "vec-regulation" },
      sparklineData: toPoints([12, 30, 18, 42, 25, 50, 33, 60, 28, 45, 20, 55]),
    },
  },
  {
    id: "ai-agent",
    type: "pipelineNode",
    position: { x: 1900, y: 360 },
    data: { name: "AI Agent/RAG Search", status: "normal", metrics: [{ label: "qps", value: 9 }] },
  },
];

export const homeFlowEdges: PipelineFlowEdgeType[] = [
  { id: "e-kovis-cdc", source: "src-kovis", target: "adapter-cdc" },
  { id: "e-xrois-cdc", source: "src-xrois", target: "adapter-cdc" },
  { id: "e-iris-cdc", source: "src-iris", target: "adapter-cdc" },
  { id: "e-kotris-cdc", source: "src-kotris", target: "adapter-cdc" },
  { id: "e-voc-dlhwp", source: "src-voc", target: "adapter-dlhwp" },
  { id: "e-cdc-realtime", source: "adapter-cdc", target: "kafka-realtime" },
  { id: "e-dlhwp-batch", source: "adapter-dlhwp", target: "kafka-batch" },
  { id: "e-realtime-c1", source: "kafka-realtime", target: "iceberg-c1" },
  { id: "e-batch-c2", source: "kafka-batch", target: "iceberg-c2" },
  { id: "e-c1-minio", source: "iceberg-c1", target: "minio" },
  { id: "e-c2-minio", source: "iceberg-c2", target: "minio", data: { isBottleneck: true } },
  { id: "e-minio-spark", source: "minio", target: "spark" },
  { id: "e-spark-trino", source: "spark", target: "trino" },
  { id: "e-spark-milvus", source: "spark", target: "milvus" },
  { id: "e-trino-ai", source: "trino", target: "ai-agent" },
  { id: "e-milvus-ai", source: "milvus", target: "ai-agent" },
];

// 2-6. Traffic & Throughput Trend Charts
export const homeTrend = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    {
      name: "Traffic In (GB/s)",
      color: "#3b82f6",
      data: [3.8, 4.1, 4.0, 4.3, 4.2].map((v, i) => ({ label: String(i), value: v })),
    },
    {
      name: "Traffic Out (GB/s)",
      color: "#22c55e",
      data: [3.2, 3.4, 3.3, 3.6, 3.5].map((v, i) => ({ label: String(i), value: v })),
    },
    {
      name: "Events (eps)",
      color: "#f97316",
      yAxisGroup: "secondary" as const,
      data: [1_200, 1_260, 1_180, 1_340, 1_290].map((v, i) => ({ label: String(i), value: v })),
    },
  ],
};

// 2-7. Storage & Query Usage
export const homeMinioCapacity: ProgressKpiData = {
  label: "MinIO Object Storage",
  value: "18.4 TB",
  total: 24,
  usedPct: 76.7,
};

export const homeStorageKpis: KpiCardData[] = [
  { label: "Iceberg Tables", value: 142, deltaPct: 2.1, compareLabel: "vs yesterday" },
  { label: "Trino Queries", value: 8_240, unit: "qps", deltaPct: 4.6, compareLabel: "vs yesterday" },
];

// 2-8. AI/Vector Summary
export const homeVectorKpis: PipelineFlowNodeProps[] = [
  {
    name: "Vector DB (Milvus)",
    status: "critical",
    highlight: { label: "stale", value: "7,420s", caption: "vec-regulation" },
    sparklineData: toPoints([12, 30, 18, 42, 25, 50, 33, 60, 28, 45, 20, 55]),
  },
  {
    name: "AI Agent (RAG)",
    status: "normal",
    highlight: { value: "1.2K qps", caption: "성공률 98.7%" },
    sparklineData: toPoints([8, 9, 10, 9, 11, 12, 10, 13, 12, 14, 13, 15]),
  },
];

export const homeTopQueries: RankedListItem[] = [
  { label: '"iceberg table lineage 조회"', value: 412, unit: " hits" },
  { label: '"kafka consumer lag 원인"', value: 305, unit: " hits" },
  { label: '"minio 용량 임계치"', value: 268, unit: " hits" },
  { label: '"spark job 실패 사유"', value: 190, unit: " hits" },
  { label: '"trino query 성능 저하"', value: 133, unit: " hits" },
];

// 2-9. Container Resource Usage Table
interface ContainerRow extends Record<string, unknown> {
  id: string;
  container: string;
  role: string;
  cpu: string;
  memory: string;
  netIO: string;
  status: StatusLevel;
}

export const homeContainerColumns: TableColumn<ContainerRow>[] = [
  { key: "container", header: "Container / Node", sortable: true },
  { key: "role", header: "Role" },
  { key: "cpu", header: "CPU", sortable: true },
  { key: "memory", header: "Memory", sortable: true },
  { key: "netIO", header: "Network (In/Out)" },
  { key: "status", header: "Status", statusKey: "status" },
];

export const homeContainerRows: ContainerRow[] = [
  { id: "1", container: "cdc-collector-1", role: "CDC", cpu: "34%", memory: "2.1 GB", netIO: "12 / 8 MB/s", status: "normal" },
  { id: "2", container: "kafka-broker-3", role: "Kafka", cpu: "78%", memory: "6.4 GB", netIO: "88 / 64 MB/s", status: "warning" },
  { id: "3", container: "iceberg-sink-c1", role: "Iceberg Sink", cpu: "41%", memory: "3.2 GB", netIO: "24 / 18 MB/s", status: "normal" },
  { id: "4", container: "spark-worker-2", role: "Spark", cpu: "56%", memory: "12.8 GB", netIO: "40 / 30 MB/s", status: "normal" },
  { id: "5", container: "milvus-writer", role: "Vector DB", cpu: "22%", memory: "4.6 GB", netIO: "6 / 4 MB/s", status: "normal" },
];

// 2-10. PPS Adapter/Agent Status Table
interface AdapterRow extends Record<string, unknown> {
  id: string;
  name: string;
  type: string;
  source: string;
  status: StatusLevel;
  ingestRate: number;
  sendRate: number;
  lag: number;
}

export const homeAdapterColumns: TableColumn<AdapterRow>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "type", header: "Type" },
  { key: "source", header: "Source" },
  { key: "status", header: "Status", statusKey: "status" },
  { key: "ingestRate", header: "Ingest (rec/s)", sortable: true, render: (v) => (v as number).toLocaleString() },
  { key: "sendRate", header: "Send (rec/s)", sortable: true, render: (v) => (v as number).toLocaleString() },
  { key: "lag", header: "Lag", sortable: true, statusKey: "status", render: (v) => (v as number).toLocaleString() },
];

export const homeAdapterRows: AdapterRow[] = [
  { id: "1", name: "Adapter-CDC-01", type: "CDC", source: "KOVIS", status: "normal", ingestRate: 120, sendRate: 118, lag: 40 },
  { id: "2", name: "Adapter-CDC-02", type: "CDC", source: "XROIS", status: "normal", ingestRate: 95, sendRate: 94, lag: 30 },
  { id: "3", name: "Adapter-DLHWP-01", type: "Batch", source: "문서-VOC", status: "warning", ingestRate: 15, sendRate: 9, lag: 2_400 },
];
