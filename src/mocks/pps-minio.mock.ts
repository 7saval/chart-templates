import type { KpiCardData } from "@/components/kpi/KpiCard/KpiCard.types";
import type { KpiCardCompoundData } from "@/components/kpi/KpiCardCompound/KpiCardCompound.types";
import type { ProgressKpiData } from "@/components/kpi/ProgressKpiCard/ProgressKpiCard.types";
import type { AlertEvent } from "@/components/tables/AlertEventTable/AlertEventTable.types";
import type { TableColumn } from "@/components/tables/StatusDataTable/StatusDataTable.types";
import type { RankedListItem } from "@/components/misc/RankedList/RankedList.types";
import type { TopologyNode, TopologyEdge } from "@/components/topology/TopologyDiagram/TopologyDiagram.types";
import type { PipelineStage } from "@/components/layout/PipelineStageTimeline/PipelineStageTimeline.types";
import type { SeriesConfig } from "@/tokens/base.types";
import type { DonutSlice } from "@/components/charts/DonutRingChart/DonutRingChart.types";
import type { StatusLevel } from "@/tokens/colors";

function lagStatus(lag: number): StatusLevel {
  if (lag < 50_000) return "normal";
  if (lag < 500_000) return "warning";
  return "critical";
}

// 5-1 → 5-2. Header stats row
export const ppsMinioStages: PipelineStage[] = [
  { name: "Kafka", count: 24, status: "normal" },
  { name: "PPS Agent Consumers", count: 14, status: "warning" },
  { name: "Iceberg Sink", count: 2, status: "normal" },
  { name: "MinIO Data Lakehouse", count: 8, status: "normal" },
  { name: "Spark/Trino", count: 19, status: "normal" },
  { name: "AI/Vector", count: 2, status: "normal" },
];

// 5-3. KPI Cards
export const ppsMinioKpis: KpiCardData[] = [
  { label: "Total Consumer Throughput", value: 24.6, unit: "MB/s", deltaPct: 2.4, status: "normal" },
  { label: "Total Consumer Lag", value: "742,000", deltaPct: 12.4, status: "warning" },
  { label: "Active Consumer Groups", value: 14, status: "normal" },
  { label: "MinIO Read/Write Throughput", value: "1.4 / 0.9", unit: " GB/s", status: "normal" },
  { label: "Object Count", value: "18.2M", deltaPct: 0.8, status: "normal" },
];

export const ppsMinioHpaUsage: ProgressKpiData = {
  label: "HPA Replica Usage",
  value: 14,
  total: 20,
  usedPct: 70,
};

export const ppsMinioCapacity: ProgressKpiData = {
  label: "MinIO Capacity Usage",
  value: "18.4 TB",
  total: 24,
  usedPct: 76.7,
};

export const ppsMinioActiveAlerts: KpiCardCompoundData = {
  label: "Active Alerts",
  value: 7,
  breakdown: [
    { label: "Critical", count: 1, color: "#ef4444" },
    { label: "Warning", count: 6, color: "#f97316" },
  ],
};

// 5-4. PPS Agent Consumer Groups Table
interface ConsumerGroupRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: StatusLevel;
  topic: string;
  lag: number;
  throughput: string;
  msgsPerSec: number;
  rebalance: number;
  hpaRange: string;
  replicas: number;
  cpu: string;
  memory: string;
  network: string;
  queueDepth: number;
}

export const ppsMinioConsumerColumns: TableColumn<ConsumerGroupRow>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "status", header: "Status", statusKey: "status" },
  { key: "topic", header: "Topic" },
  { key: "lag", header: "Lag", sortable: true, statusKey: "status", render: (v) => (v as number).toLocaleString() },
  { key: "throughput", header: "Throughput" },
  { key: "msgsPerSec", header: "Msgs/s", sortable: true },
  { key: "rebalance", header: "Rebalance" },
  { key: "hpaRange", header: "HPA (Min/Max)" },
  { key: "replicas", header: "Replicas (Cur)" },
  { key: "cpu", header: "CPU" },
  { key: "memory", header: "Memory" },
  { key: "network", header: "Network" },
  { key: "queueDepth", header: "Queue Depth", sortable: true },
];

export const ppsMinioConsumerRows: ConsumerGroupRow[] = [
  { id: "1", name: "pps-agent-cdc-kovis (real-time)", status: lagStatus(520_000), topic: "rt.kovis.events", lag: 520_000, throughput: "12 MB/s", msgsPerSec: 4_200, rebalance: 1, hpaRange: "2 / 10", replicas: 8, cpu: "68%", memory: "72%", network: "34 MB/s", queueDepth: 1_200 },
  { id: "2", name: "pps-agent-cdc-xrois (real-time)", status: lagStatus(210_000), topic: "rt.xrois.events", lag: 210_000, throughput: "8 MB/s", msgsPerSec: 2_800, rebalance: 0, hpaRange: "2 / 8", replicas: 4, cpu: "52%", memory: "58%", network: "20 MB/s", queueDepth: 480 },
  { id: "3", name: "pps-agent-dlhwp (batch)", status: lagStatus(12_000), topic: "batch.voc.docs", lag: 12_000, throughput: "1 MB/s", msgsPerSec: 120, rebalance: 0, hpaRange: "1 / 4", replicas: 2, cpu: "18%", memory: "24%", network: "3 MB/s", queueDepth: 40 },
];

// 5-5. PPS Agent HPA Status Table (with embedded sparkline)
interface HpaRow extends Record<string, unknown> {
  id: string;
  deployment: string;
  minMax: string;
  current: number;
  cpuTarget: string;
  memTarget: string;
  scaleEvents: number;
  status: StatusLevel;
  trend: number[];
}

export const ppsMinioHpaColumns: TableColumn<HpaRow>[] = [
  { key: "deployment", header: "Deployment", sortable: true },
  { key: "minMax", header: "Min/Max Replicas" },
  { key: "current", header: "Current", sortable: true },
  { key: "cpuTarget", header: "CPU Target/Current" },
  { key: "memTarget", header: "Memory Target/Current" },
  { key: "scaleEvents", header: "Scale Events (1H)", sortable: true },
  { key: "status", header: "Status", statusKey: "status" },
];

export const ppsMinioHpaRows: HpaRow[] = [
  { id: "1", deployment: "pps-agent-cdc-kovis", minMax: "2 / 10", current: 8, cpuTarget: "70% / 68%", memTarget: "75% / 72%", scaleEvents: 3, status: "normal", trend: [4, 5, 6, 7, 8] },
  { id: "2", deployment: "pps-agent-cdc-xrois", minMax: "2 / 8", current: 4, cpuTarget: "70% / 52%", memTarget: "75% / 58%", scaleEvents: 1, status: "normal", trend: [3, 3, 4, 4, 4] },
  { id: "3", deployment: "pps-agent-dlhwp", minMax: "1 / 4", current: 2, cpuTarget: "70% / 18%", memTarget: "75% / 24%", scaleEvents: 6, status: "warning", trend: [4, 2, 3, 1, 2] },
];

// 5-6. MinIO Data Lakehouse
export const ppsMinioCapacityDonut: DonutSlice[] = [
  { name: "Used", value: 18.4, color: "#3b82f6" },
  { name: "Free", value: 5.6, color: "#334155" },
];

export const ppsMinioStorageStats = [
  { label: "Read Throughput", value: 1.4, unit: " GB/s" },
  { label: "Write Throughput", value: 0.9, unit: " GB/s" },
  { label: "API Requests/sec", value: 6_400 },
  { label: "Object Count", value: "18.2M" },
];

export const ppsMinioTopology: { nodes: TopologyNode[]; edges: TopologyEdge[] } = {
  nodes: Array.from({ length: 8 }, (_, i) => ({
    id: `minio-${i + 1}`,
    label: `minio-${i + 1}`,
    status: i === 6 ? "warning" : ("normal" as const),
    badges: [{ label: "bucket", value: `${60 + i * 3}%` }],
  })),
  edges: Array.from({ length: 8 }, (_, i) => ({
    source: `minio-${i + 1}`,
    target: `minio-${((i + 1) % 8) + 1}`,
  })),
};

export const ppsMinioDurabilityStats = [
  { label: "Replication State", value: "Synced", status: "normal" as const },
  { label: "Erasure Coding Health", value: "8+4 OK", status: "normal" as const },
  { label: "Slow/Failed Requests", value: 0.4, unit: "%", status: "normal" as const },
];

// 5-7. Iceberg/Lakehouse Status
export const ppsMinioIcebergKpis: KpiCardData[] = [
  { label: "Tables", value: 142 },
  { label: "Snapshots", value: 8_420 },
  { label: "Commits (1h)", value: 96 },
];

export const ppsMinioIcebergStats = [
  { label: "Stale Tables (>24h)", value: 3, status: "warning" as const },
  { label: "Small File Tables", value: 5, status: "warning" as const },
  { label: "Active Readers", value: 22 },
  { label: "Active Writers", value: 8 },
];

// 5-8 → 5-11. Trend charts
export const ppsMinioLagTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "pps-agent-cdc-kovis", color: "#ef4444", data: [420_000, 460_000, 490_000, 505_000, 520_000].map((v, i) => ({ label: String(i), value: v })) },
    { name: "pps-agent-cdc-xrois", color: "#f97316", data: [180_000, 195_000, 200_000, 205_000, 210_000].map((v, i) => ({ label: String(i), value: v })) },
    { name: "pps-agent-dlhwp", color: "#22c55e", data: [10_000, 11_000, 12_500, 12_000, 12_000].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

export const ppsMinioThroughputTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "pps-agent-cdc-kovis", color: "#3b82f6", data: [3_800, 4_000, 4_100, 4_150, 4_200].map((v, i) => ({ label: String(i), value: v })) },
    { name: "pps-agent-cdc-xrois", color: "#8b5cf6", data: [2_600, 2_700, 2_750, 2_780, 2_800].map((v, i) => ({ label: String(i), value: v })) },
    { name: "pps-agent-dlhwp", color: "#22c55e", data: [110, 115, 120, 118, 120].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

export const ppsMinioHpaHistory: { categories: string[]; series: SeriesConfig[] } = {
  categories: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    {
      name: "Scale Out",
      color: "#22c55e",
      data: [
        { label: "09:00", value: 1 },
        { label: "09:05", value: 2 },
        { label: "09:10", value: 0 },
        { label: "09:15", value: 3 },
        { label: "09:20", value: 1 },
      ],
    },
    {
      name: "Scale In",
      color: "#f97316",
      data: [
        { label: "09:00", value: 0 },
        { label: "09:05", value: 1 },
        { label: "09:10", value: 1 },
        { label: "09:15", value: 0 },
        { label: "09:20", value: 2 },
      ],
    },
  ],
};

export const ppsMinioBucketUsageBar = {
  categories: ["raw-bronze", "cleansed-silver", "curated-gold", "backup", "logs"],
  values: [8.2, 6.4, 3.1, 0.5, 0.2],
};

// 5-12 → 5-14
export const ppsMinioIoLatencyTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "GET p95 (ms)", color: "#3b82f6", data: [18, 20, 22, 19, 21].map((v, i) => ({ label: String(i), value: v })) },
    { name: "PUT p95 (ms)", color: "#f97316", data: [34, 36, 40, 38, 42].map((v, i) => ({ label: String(i), value: v })) },
    { name: "LIST p95 (ms)", color: "#22c55e", data: [12, 13, 14, 12, 13].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

export const ppsMinioLakehouseOpsKpis: KpiCardData[] = [
  { label: "Commits/min", value: 1.6 },
  { label: "Snapshots/min", value: 0.4 },
  { label: "Data Added (1h)", value: 2.8, unit: " GB" },
  { label: "Delete/Expire (1h)", value: 0.6, unit: " GB" },
];

export const ppsMinioGauges = {
  smallFileRatio: { value: 4.2, target: 5, warningThreshold: 5, unit: "%" },
  tableFreshness: { value: 0.6, target: 1, warningThreshold: 1, unit: "h" },
};

// 5-13. Top Writers (1h)
export const ppsMinioTopWriters: RankedListItem[] = [
  { label: "iceberg-sink-c1", value: 1_240, unit: " writes/h" },
  { label: "iceberg-sink-c2", value: 640, unit: " writes/h" },
  { label: "pps-agent-cdc-kovis", value: 420, unit: " writes/h" },
  { label: "spark-compaction-job", value: 180, unit: " writes/h" },
];

// 5-14. Alerts & Events Table
export const ppsMinioAlerts: AlertEvent[] = [
  { id: "1", timestamp: "2026-07-23T09:12:00Z", serverity: "Critical", message: "Consumer lag exceeded 500k", target: "pps-agent-cdc-kovis" },
  { id: "2", timestamp: "2026-07-23T09:00:00Z", serverity: "Warning", message: "HPA scale-in flapping detected", target: "pps-agent-dlhwp", detail: "6 scale events in last hour" },
  { id: "3", timestamp: "2026-07-23T08:44:00Z", serverity: "Warning", message: "Stale table detected (>24h no commit)", target: "iceberg.raw.kovis_events" },
  { id: "4", timestamp: "2026-07-23T08:20:00Z", serverity: "Info", message: "MinIO node re-joined cluster", target: "minio-7" },
];
