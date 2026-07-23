import type {
  PipelineFlowNodeType,
  PipelineFlowEdgeType,
} from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram.types";
import type { KpiCardData } from "@/components/kpi/KpiCard/KpiCard.types";
import type { KpiCardCompoundData } from "@/components/kpi/KpiCardCompound/KpiCardCompound.types";
import type { AlertEvent } from "@/components/tables/AlertEventTable/AlertEventTable.types";
import type { TableColumn } from "@/components/tables/StatusDataTable/StatusDataTable.types";
import type { PipelineStage } from "@/components/layout/PipelineStageTimeline/PipelineStageTimeline.types";
import type { SeriesConfig } from "@/tokens/base.types";
import type { DonutSlice } from "@/components/charts/DonutRingChart/DonutRingChart.types";
import type { StatusLevel } from "@/tokens/colors";

// 4-1 → 4-2. Header stats row
export const sparkStages: PipelineStage[] = [
  { name: "Kafka", count: 24, status: "normal" },
  { name: "Iceberg/MinIO", count: 18, status: "normal" },
  { name: "Spark Streaming", count: 17, status: "normal" },
  { name: "Spark SQL/ETL", count: 23, status: "normal" },
  { name: "Feature/ML Jobs", count: 12, status: "warning" },
  { name: "Trino/AI/Downstream", count: 9, status: "normal" },
];

// 4-3. KPI Cards
export const sparkKpis: KpiCardData[] = [
  { label: "Active Applications", value: 18, status: "normal" },
  { label: "Running Jobs", value: 46, status: "normal" },
  { label: "Streaming Queries", value: 12, status: "normal" },
  { label: "Avg Stage Latency", value: 3.4, unit: "s", deltaPct: -1.8, status: "normal" },
  { label: "Rows Processed/sec", value: "1.8M", deltaPct: 4.2, status: "normal" },
  { label: "Failed Jobs", value: 2, deltaPct: -33, status: "warning" },
];

export const sparkActiveAlerts: KpiCardCompoundData = {
  label: "Active Alerts",
  value: 5,
  breakdown: [
    { label: "Critical", count: 1, color: "#ef4444" },
    { label: "Warning", count: 4, color: "#f97316" },
  ],
};

// 4-4 → 4-6. Cluster Overview (Master→Worker tree)
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

// 4-4. Cluster stats block + Dynamic Allocation / Cluster Health chips
export const sparkClusterStats = [
  { label: "Applications", value: 18 },
  { label: "Executors", value: 42 },
  { label: "Cores", value: 168 },
  { label: "Total Memory", value: 512, unit: " GB" },
];

export const sparkHealthChips = [
  { label: "Dynamic Allocation", value: "Enabled", status: "normal" as const },
  { label: "Cluster Health", value: "Healthy", status: "normal" as const },
];

// 4-4. Applications/Jobs table
interface AppJobRow extends Record<string, unknown> {
  id: string;
  app: string;
  type: string;
  status: string;
  duration: string;
  inputRows: string;
  outputRows: string;
  failures: number;
  level: StatusLevel;
}

export const sparkAppJobColumns: TableColumn<AppJobRow>[] = [
  { key: "app", header: "Application", sortable: true },
  { key: "type", header: "Type" },
  { key: "status", header: "Status", statusKey: "level" },
  { key: "duration", header: "Duration" },
  { key: "inputRows", header: "Input Rows" },
  { key: "outputRows", header: "Output Rows" },
  { key: "failures", header: "Failures", sortable: true, statusKey: "level" },
];

export const sparkAppJobRows: AppJobRow[] = [
  { id: "1", app: "cdc-to-iceberg-stream", type: "Streaming", status: "Running", duration: "3h 12m", inputRows: "48.2M", outputRows: "48.1M", failures: 0, level: "normal" },
  { id: "2", app: "voc-etl-daily", type: "Batch", status: "Running", duration: "24m", inputRows: "1.2M", outputRows: "1.2M", failures: 0, level: "normal" },
  { id: "3", app: "feature-extract-ml", type: "ML", status: "Failed", duration: "8m", inputRows: "310k", outputRows: "0", failures: 2, level: "critical" },
  { id: "4", app: "iceberg-compaction", type: "Maintenance", status: "Running", duration: "51m", inputRows: "-", outputRows: "-", failures: 0, level: "normal" },
];

// 4-4 → 4-6. Executor State table
interface ExecutorRow extends Record<string, unknown> {
  id: string;
  executor: string;
  cpu: string;
  memory: string;
  diskSpill: string;
  shuffleRead: string;
  shuffleWrite: string;
  taskTime: string;
  gcTime: string;
  status: StatusLevel;
}

export const sparkExecutorColumns: TableColumn<ExecutorRow>[] = [
  { key: "executor", header: "Executor", sortable: true },
  { key: "cpu", header: "CPU" },
  { key: "memory", header: "Memory" },
  { key: "diskSpill", header: "Disk Spill" },
  { key: "shuffleRead", header: "Shuffle Read" },
  { key: "shuffleWrite", header: "Shuffle Write" },
  { key: "taskTime", header: "Task Time" },
  { key: "gcTime", header: "GC Time", statusKey: "status" },
];

export const sparkExecutorRows: ExecutorRow[] = [
  { id: "1", executor: "worker-1-exec-0", cpu: "24%", memory: "6.1/8 GB", diskSpill: "0 MB", shuffleRead: "120 MB", shuffleWrite: "98 MB", taskTime: "1.2s", gcTime: "40ms", status: "normal" },
  { id: "2", executor: "worker-2-exec-0", cpu: "31%", memory: "7.4/8 GB", diskSpill: "210 MB", shuffleRead: "340 MB", shuffleWrite: "290 MB", taskTime: "2.8s", gcTime: "480ms", status: "warning" },
  { id: "3", executor: "worker-3-exec-0", cpu: "22%", memory: "5.8/8 GB", diskSpill: "0 MB", shuffleRead: "88 MB", shuffleWrite: "72 MB", taskTime: "1.0s", gcTime: "35ms", status: "normal" },
  { id: "4", executor: "worker-4-exec-0", cpu: "28%", memory: "6.6/8 GB", diskSpill: "0 MB", shuffleRead: "150 MB", shuffleWrite: "118 MB", taskTime: "1.4s", gcTime: "60ms", status: "normal" },
];

// 4-7 → 4-9. Structured Streaming
export const sparkStreamingStats = [
  { label: "Input Rate", value: "24.1k", unit: "/s" },
  { label: "Processed Rows/sec", value: "23.8k" },
  { label: "Trigger Latency (p95)", value: 620, unit: "ms", status: "normal" as const },
  { label: "Watermark", value: "2s delay" },
  { label: "State Store (Mem)", value: 1.2, unit: " GB" },
  { label: "State Store (Disk)", value: 4.6, unit: " GB" },
  { label: "Batch Duration", value: 1.8, unit: "s" },
  { label: "Checkpoint Health", value: "OK", status: "normal" as const },
];

// 4-7. Running/Completed/Failed Stages ring
export const sparkStagesDonut: DonutSlice[] = [
  { name: "Completed", value: 812, color: "#22c55e" },
  { name: "Running", value: 46, color: "#3b82f6" },
  { name: "Failed", value: 6, color: "#ef4444" },
];

export const sparkTaskStats = [
  { label: "Pending Tasks", value: 128 },
  { label: "Skewed Tasks", value: 4, status: "warning" as const },
  { label: "Retry Count", value: 9, status: "warning" as const },
];

// 4-7. Top Running Stages table
interface StageRow extends Record<string, unknown> {
  id: string;
  stage: string;
  job: string;
  tasks: string;
  duration: string;
  status: StatusLevel;
}

export const sparkTopStagesColumns: TableColumn<StageRow>[] = [
  { key: "stage", header: "Stage", sortable: true },
  { key: "job", header: "Job" },
  { key: "tasks", header: "Tasks" },
  { key: "duration", header: "Duration", sortable: true },
  { key: "status", header: "Status", statusKey: "status" },
];

export const sparkTopStagesRows: StageRow[] = [
  { id: "1", stage: "mapPartitions at CDC.scala:88", job: "cdc-to-iceberg-stream", tasks: "180/200", duration: "42s", status: "normal" },
  { id: "2", stage: "shuffle at ETL.scala:145", job: "voc-etl-daily", tasks: "64/64", duration: "1m 12s", status: "warning" },
  { id: "3", stage: "aggregate at Feature.scala:52", job: "feature-extract-ml", tasks: "12/32", duration: "8s", status: "critical" },
];

// 4-7 → 4-9. Resource Usage trend
export const sparkResourceTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "CPU (%)", color: "#3b82f6", data: [58, 62, 66, 60, 64].map((v, i) => ({ label: String(i), value: v })) },
    { name: "Memory (%)", color: "#22c55e", data: [64, 66, 70, 68, 71].map((v, i) => ({ label: String(i), value: v })) },
    { name: "Shuffle R/W (MB/s)", color: "#f97316", data: [120, 180, 210, 160, 190].map((v, i) => ({ label: String(i), value: v })) },
    { name: "Storage Spill (MB/s)", color: "#ef4444", data: [0, 12, 40, 8, 4].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

// 4-10. Spark SQL/ETL Throughput Table
interface EtlRow extends Record<string, unknown> {
  id: string;
  pipeline: string;
  type: string;
  status: string;
  inputRows: string;
  outputRows: string;
  latencyP95: string;
  duration: string;
  level: StatusLevel;
}

export const sparkEtlColumns: TableColumn<EtlRow>[] = [
  { key: "pipeline", header: "Pipeline", sortable: true },
  { key: "type", header: "Type" },
  { key: "status", header: "Status", statusKey: "level" },
  { key: "inputRows", header: "Input Rows/s" },
  { key: "outputRows", header: "Output Rows/s" },
  { key: "latencyP95", header: "Avg Latency (p95)" },
  { key: "duration", header: "Duration" },
];

export const sparkEtlRows: EtlRow[] = [
  { id: "1", pipeline: "voc-etl-daily", type: "Batch", status: "Running", inputRows: "1.2k", outputRows: "1.2k", latencyP95: "820ms", duration: "24m", level: "normal" },
  { id: "2", pipeline: "kovis-realtime-etl", type: "Streaming", status: "Running", inputRows: "18.4k", outputRows: "18.2k", latencyP95: "410ms", duration: "-", level: "normal" },
  { id: "3", pipeline: "iceberg-small-file-compact", type: "Maintenance", status: "Queued", inputRows: "-", outputRows: "-", latencyP95: "-", duration: "-", level: "inactive" },
];

// 4-11. Storage & Downstream Overview
export const sparkStorageKpis: KpiCardData[] = [
  { label: "Iceberg Tables (Touched)", value: 84 },
  { label: "MinIO I/O Read", value: 1.4, unit: " GB/s" },
  { label: "MinIO I/O Write", value: 0.9, unit: " GB/s" },
];

export const sparkDownstreamStats = [
  { label: "Checkpoints (Streaming)", value: "OK", status: "normal" as const },
  { label: "Trino Active Queries", value: 42 },
  { label: "Trino Avg Runtime", value: 1.2, unit: "s" },
  { label: "Trino Queued", value: 3 },
  { label: "Milvus Index Refresh", value: "38s ago" },
  { label: "RAG Index Update", value: "1m ago" },
  { label: "Vector DB Write", value: 210, unit: "/s" },
  { label: "Model Serving QPS", value: 9 },
];

// 4-12. Alerts & Events Table
export const sparkAlerts: AlertEvent[] = [
  { id: "1", timestamp: "2026-07-23T09:05:00Z", serverity: "Critical", message: "Executor lost on worker-2", target: "worker-2-exec-0", detail: "OOM during shuffle" },
  { id: "2", timestamp: "2026-07-23T08:58:00Z", serverity: "Warning", message: "Excessive GC time detected", target: "worker-2-exec-0", detail: "GC 480ms/task" },
  { id: "3", timestamp: "2026-07-23T08:40:00Z", serverity: "Warning", message: "Data skew detected in stage", target: "feature-extract-ml" },
  { id: "4", timestamp: "2026-07-23T08:20:00Z", serverity: "Info", message: "Small file compaction completed", target: "iceberg-compaction" },
];

// 4-13. Tuning & Health Indicators
export const sparkTuningGauges = {
  cacheHitRatio: { value: 86, target: 90, warningThreshold: 75, unit: "%" },
  broadcastJoinUsage: { value: 62, target: 70, warningThreshold: 50, unit: "%" },
};

export const sparkTuningKpis: KpiCardData[] = [
  { label: "Dynamic Allocation", value: "12 / 20", status: "normal" },
  { label: "AQE Skew Join Handling", value: 6, status: "normal" },
  { label: "Speculative Execution", value: 2, status: "normal" },
];

export const sparkTuningStats = [
  { label: "Adaptive Query Execution", value: "Enabled", status: "normal" as const },
  { label: "Small File Compaction", value: "Running", status: "normal" as const },
  { label: "Cluster Overall Health", value: "94/100", status: "normal" as const },
];
