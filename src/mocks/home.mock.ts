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

// homeFlowNodes(2-5) 흐름을 8단계로 요약: Data Source → PPS Adapter → Kafka → PPS Agent/DWP(배치 소비)
// → Iceberg Sink(실시간 소비) → MinIO/Iceberg(저장) → Spark/Trino(가공·조회) → Milvus/AI Agent(벡터·에이전트)
export const homeStages = [
  { name: "Data Source", count: 16, status: "normal" as const },
  { name: "PPS Adapter", count: 9, status: "normal" as const },
  { name: "Kafka", count: 24, status: "normal" as const },
  { name: "PPS Agent/DWP", count: 12, status: "warning" as const },
  { name: "Iceberg Sink", count: 7, status: "normal" as const },
  { name: "MinIO/Iceberg", count: 18, status: "normal" as const },
  { name: "Spark/Trino", count: 17, status: "normal" as const },
  { name: "Milvus/AI Agent", count: 7, status: "normal" as const },
];

// 2-5. Real-time Data Pipeline Flow Diagram — Data Source → Adapter → Kafka → Iceberg Sink → MinIO → Spark → Trino/Milvus → AI Agent
// 좌→우 가로 배치 (Phase D). 컬럼: col0=DATA SOURCE, col1=PPS ADAPTER, col2=KAFKA, col3=ICEBERG SINK, col4=MinIO, col5=SPARK, col6=TRINO/Milvus, col7=AI AGENT
export const homeFlowNodes: PipelineFlowNodeType[] = [
  {
    id: "src-kovis",
    type: "pipelineNode",
    position: { x: 0, y: 0 },
    data: {
      name: "KOVIS",
      status: "normal",
      metrics: [{ label: "rec/s", value: 120 }],
    },
  },
  {
    id: "src-xrois",
    type: "pipelineNode",
    position: { x: 0, y: 160 },
    data: {
      name: "XROIS",
      status: "normal",
      metrics: [{ label: "rec/s", value: 95 }],
    },
  },
  {
    id: "src-iris",
    type: "pipelineNode",
    position: { x: 0, y: 320 },
    data: {
      name: "IRIS",
      status: "normal",
      metrics: [{ label: "rec/s", value: 60 }],
    },
  },
  {
    id: "src-kotris",
    type: "pipelineNode",
    position: { x: 0, y: 480 },
    data: {
      name: "KOTRIS",
      status: "normal",
      metrics: [{ label: "rec/s", value: 40 }],
    },
  },
  {
    id: "src-voc",
    type: "pipelineNode",
    position: { x: 0, y: 640 },
    data: {
      name: "문서-VOC",
      status: "normal",
      metrics: [
        { label: "rec/s", value: 15 },
        { label: "mode", value: "batch" },
      ],
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
      sparklineData: toPoints([
        3.6, 3.9, 3.7, 4.0, 3.8, 4.1, 3.9, 4.3, 4.0, 4.2, 4.1, 4.2,
      ]),
    },
  },
  {
    id: "adapter-dlhwp",
    type: "pipelineNode",
    position: { x: 280, y: 520 },
    data: {
      name: "Adapter-DLHWP",
      status: "normal",
      metrics: [
        { label: "nodes", value: 1 },
        { label: "mode", value: "batch" },
      ],
      chartVariant: "bar",
      sparklineData: toPoints([
        0.8, 0.9, 1.0, 0.95, 1.1, 1.05, 0.9, 1.2, 1.0, 1.1, 0.95, 1.0,
      ]),
    },
  },
  {
    id: "kafka-realtime",
    type: "pipelineNode",
    position: { x: 560, y: 200 },
    data: {
      name: "RealTime Topics",
      status: "normal",
      subtitle: "Topic 88 · Part 352",
      stats: ["24 MB/s", "Lag 6.2K"],
      chartVariant: "bar",
      sparklineData: toPoints([
        2200, 2350, 2300, 2450, 2380, 2500, 2300, 2420, 2350, 2480, 2400, 2450,
      ]),
    },
  },
  {
    id: "kafka-batch",
    type: "pipelineNode",
    position: { x: 560, y: 520 },
    data: {
      name: "Kafka Batch Topics",
      status: "normal",
      metrics: [{ label: "msg/s", value: 180 }],
      chartVariant: "bar",
      sparklineData: toPoints([
        160, 175, 170, 185, 178, 190, 172, 188, 180, 195, 178, 182,
      ]),
    },
  },
  {
    id: "iceberg-c1",
    type: "pipelineNode",
    position: { x: 840, y: 200 },
    data: {
      name: "Iceberg Sink (C1)",
      status: "normal",
      metrics: [{ label: "write/h", value: 1_240 }],
      chartVariant: "bar",
      sparklineData: toPoints([
        1150, 1200, 1180, 1250, 1220, 1280, 1200, 1260, 1240, 1300, 1220, 1240,
      ]),
    },
  },
  {
    id: "iceberg-c2",
    type: "pipelineNode",
    position: { x: 840, y: 520 },
    data: {
      name: "PPS Agent DLHWP (C2)",
      status: "warning",
      metrics: [{ label: "Lag", value: "210,000" }],
      chartVariant: "bar",
      sparklineData: toPoints([
        150_000, 165_000, 170_000, 180_000, 175_000, 190_000, 195_000, 200_000,
        205_000, 208_000, 210_000, 210_000,
      ]),
    },
  },
  {
    id: "minio",
    type: "pipelineNode",
    position: { x: 1120, y: 360 },
    data: {
      name: "MinIO/NAS",
      status: "normal",
      metrics: [
        { label: "util", value: "68%" },
        { label: "freshness", value: "2m" },
      ],
      chartVariant: "bar",
      sparklineData: toPoints([60, 62, 65, 63, 67, 66, 68, 65, 69, 67, 68, 68]),
    },
  },
  {
    id: "spark",
    type: "pipelineNode",
    position: { x: 1380, y: 360 },
    data: {
      name: "SPARK",
      status: "normal",
      metrics: [
        { label: "docs/hr", value: "18.2k" },
        { label: "state", value: "running" },
      ],
      chartVariant: "bar",
      sparklineData: toPoints([
        16500, 17000, 16800, 17500, 17200, 18000, 17600, 18500, 18000, 18800,
        18200, 18200,
      ]),
    },
  },
  {
    id: "trino",
    type: "pipelineNode",
    position: { x: 1640, y: 260 },
    data: {
      name: "TRINO",
      status: "normal",
      metrics: [
        { label: "qps", value: 42 },
        { label: "state", value: "running" },
      ],
      chartVariant: "bar",
      sparklineData: toPoints([35, 38, 36, 40, 39, 44, 41, 45, 40, 43, 42, 42]),
    },
  },
  {
    id: "milvus",
    type: "pipelineNode",
    position: { x: 1640, y: 480 },
    data: {
      name: "Vector DB (Milvus)",
      status: "critical",
      highlight: { label: "stale", value: "7,420s", caption: "vec-regulation" },
      chartVariant: "bar",
      sparklineData: toPoints([12, 30, 18, 42, 25, 50, 33, 60, 28, 45, 20, 55]),
    },
  },
  {
    id: "ai-agent",
    type: "pipelineNode",
    position: { x: 1900, y: 360 },
    data: {
      name: "AI Agent/RAG Search",
      status: "normal",
      metrics: [{ label: "qps", value: 9 }],
      chartVariant: "bar",
      sparklineData: toPoints([
        7, 8, 7.5, 8.5, 8, 9.2, 8.8, 9.5, 9, 9.8, 9.2, 9,
      ]),
    },
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
  {
    id: "e-c2-minio",
    source: "iceberg-c2",
    target: "minio",
    data: { isBottleneck: true },
  },
  { id: "e-minio-spark", source: "minio", target: "spark" },
  { id: "e-spark-trino", source: "spark", target: "trino" },
  { id: "e-spark-milvus", source: "spark", target: "milvus" },
  { id: "e-trino-ai", source: "trino", target: "ai-agent" },
  { id: "e-milvus-ai", source: "milvus", target: "ai-agent" },
];

// 2-6. Traffic & Throughput Trend Charts
export const homeTrend = {
  series: [
    {
      name: "Traffic In (GB/s)",
      color: "#3b82f6",
      data: generateTrendSeries(14.8, { volatility: 0.05 }),
    },
    {
      name: "Traffic Out (GB/s)",
      color: "#22c55e",
      data: generateTrendSeries(12.7, { volatility: 0.05 }),
    },
    {
      name: "Events (eps)",
      color: "#f97316",
      yAxisGroup: "secondary" as const,
      data: generateTrendSeries(128_432, { volatility: 0.05 }),
    },
    {
      name: "Throughput (rec/s)",
      color: "#a855f7",
      yAxisGroup: "secondary" as const,
      data: generateTrendSeries(96_214, { volatility: 0.05 }),
    },
  ],
};

// 2-7. Storage & Query Usage
export const homeMinioCapacity: ProgressKpiData = {
  label: "MinIO Object Storage",
  value: "18.4 TB",
  total: 24,
  usedPct: 76.7,
  chartVariant: "line",
  sparklineData: toPoints([68, 70, 69, 72, 71, 74, 72, 75, 73, 76, 74, 76.7]),
};

export const homeStorageKpis: KpiCardData[] = [
  {
    label: "Iceberg Tables",
    value: 142,
    deltaPct: 2.1,
    compareLabel: "vs yesterday",
    chartVariant: "bar",
    trend: toPoints([
      128, 132, 130, 135, 133, 138, 134, 140, 136, 141, 138, 142,
    ]),
  },
  {
    label: "Trino Queries",
    value: 8_240,
    unit: "qps",
    deltaPct: 4.6,
    compareLabel: "vs yesterday",
    chartVariant: "bar",
    trend: toPoints([
      7800, 8000, 7900, 8100, 8050, 8300, 8150, 8400, 8200, 8350, 8180, 8240,
    ]),
  },
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
  cpuPct: number;
  cpuLimitPct: number;
  memUsedGB: number;
  memTotalGB: number;
  netInMbps: number;
  netOutMbps: number;
  status: StatusLevel;
}

export const homeContainerColumns: TableColumn<ContainerRow>[] = [
  { key: "container", header: "컨테이너 / 노드", sortable: true },
  { key: "role", header: "역할" },
  { key: "cpuPct", header: "CPU", sortable: true },
  { key: "memUsedGB", header: "Memory", sortable: true },
  {
    key: "netInMbps",
    header: "Network (In / Out)",
    render: (_value, row) =>
      `${row.netInMbps} Mbps / ${row.netOutMbps} Mbps`,
  },
  { key: "status", header: "상태", statusKey: "status" },
];

export const homeContainerRows: ContainerRow[] = [
  {
    id: "1",
    container: "adapter-cdc-1",
    role: "PPS Adapter",
    cpuPct: 32,
    cpuLimitPct: 80,
    memUsedGB: 1.2,
    memTotalGB: 4.0,
    netInMbps: 180,
    netOutMbps: 90,
    status: "normal",
  },
  {
    id: "2",
    container: "adapter-dlhwp-1",
    role: "PPS Adapter (Batch)",
    cpuPct: 26,
    cpuLimitPct: 80,
    memUsedGB: 1.0,
    memTotalGB: 4.0,
    netInMbps: 120,
    netOutMbps: 60,
    status: "normal",
  },
  {
    id: "3",
    container: "agent-dlhwp-1",
    role: "PPS Agent",
    cpuPct: 41,
    cpuLimitPct: 80,
    memUsedGB: 2.6,
    memTotalGB: 6.0,
    netInMbps: 200,
    netOutMbps: 110,
    status: "normal",
  },
  {
    id: "4",
    container: "kafka-broker-1",
    role: "Kafka Broker",
    cpuPct: 39,
    cpuLimitPct: 80,
    memUsedGB: 3.1,
    memTotalGB: 8.0,
    netInMbps: 250,
    netOutMbps: 250,
    status: "normal",
  },
  {
    id: "5",
    container: "spark-worker-1",
    role: "Spark Worker",
    cpuPct: 62,
    cpuLimitPct: 80,
    memUsedGB: 6.8,
    memTotalGB: 12,
    netInMbps: 300,
    netOutMbps: 280,
    status: "warning",
  },
  {
    id: "6",
    container: "trino-worker-1",
    role: "Trino Worker",
    cpuPct: 55,
    cpuLimitPct: 80,
    memUsedGB: 5.2,
    memTotalGB: 12,
    netInMbps: 210,
    netOutMbps: 190,
    status: "normal",
  },
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
  {
    key: "ingestRate",
    header: "Ingest (rec/s)",
    sortable: true,
    render: (v) => (v as number).toLocaleString(),
  },
  {
    key: "sendRate",
    header: "Send (rec/s)",
    sortable: true,
    render: (v) => (v as number).toLocaleString(),
  },
  {
    key: "lag",
    header: "Lag",
    sortable: true,
    statusKey: "status",
    render: (v) => (v as number).toLocaleString(),
  },
];

export const homeAdapterRows: AdapterRow[] = [
  {
    id: "1",
    name: "Adapter-CDC-01",
    type: "CDC",
    source: "KOVIS",
    status: "normal",
    ingestRate: 120,
    sendRate: 118,
    lag: 40,
  },
  {
    id: "2",
    name: "Adapter-CDC-02",
    type: "CDC",
    source: "XROIS",
    status: "normal",
    ingestRate: 95,
    sendRate: 94,
    lag: 30,
  },
  {
    id: "3",
    name: "Adapter-DLHWP-01",
    type: "Batch",
    source: "문서-VOC",
    status: "warning",
    ingestRate: 15,
    sendRate: 9,
    lag: 2_400,
  },
];
