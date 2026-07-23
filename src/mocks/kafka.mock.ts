import type { KpiCardData } from "@/components/kpi/KpiCard/KpiCard.types";
import type { KpiCardCompoundData } from "@/components/kpi/KpiCardCompound/KpiCardCompound.types";
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

// 3-1 → 3-2. Header stats row (Producer/Topic/Partition/Broker/Consumer Group/Sink)
export const kafkaStages: PipelineStage[] = [
  { name: "Producer", count: 36, status: "normal" },
  { name: "Topic", count: 128, status: "normal" },
  { name: "Partition", count: 612, status: "normal" },
  { name: "Broker", count: 5, status: "normal" },
  { name: "Consumer Group", count: 45, status: "warning" },
  { name: "Sink/Downstream", count: 28, status: "normal" },
];

// 3-3. KPI Cards
export const kafkaKpis: KpiCardData[] = [
  { label: "Cluster Throughput", value: 842, unit: "MB/s", deltaPct: 3.2, status: "normal" },
  { label: "Messages In/sec", value: 128_400, deltaPct: 1.8, status: "normal" },
  { label: "Produce Requests/sec", value: 9_820, deltaPct: 0.6, status: "normal" },
  { label: "Fetch Requests/sec", value: 14_300, deltaPct: -1.1, status: "normal" },
  { label: "Consumer Lag Total", value: "742,000", deltaPct: 12.4, status: "warning" },
  { label: "Under Replicated Partitions", value: 3, status: "critical" },
];

export const kafkaActiveAlerts: KpiCardCompoundData = {
  label: "Active Alerts",
  value: 9,
  breakdown: [
    { label: "Critical", count: 2, color: "#ef4444" },
    { label: "Warning", count: 7, color: "#f97316" },
  ],
};

// 3-4. Producers list
export const kafkaProducers: RankedListItem[] = [
  { label: "producer-cdc-kovis", value: 420, unit: " msg/s" },
  { label: "producer-cdc-xrois", value: 355, unit: " msg/s" },
  { label: "producer-cdc-iris", value: 210, unit: " msg/s" },
  { label: "producer-batch-voc", value: 45, unit: " msg/s" },
];

// 3-4. Topic table
interface TopicRow extends Record<string, unknown> {
  id: string;
  topic: string;
  partitions: number;
  rf: number;
  isr: string;
  throughput: string;
  status: StatusLevel;
}

export const kafkaTopicColumns: TableColumn<TopicRow>[] = [
  { key: "topic", header: "Topic", sortable: true },
  { key: "partitions", header: "Partitions", sortable: true },
  { key: "rf", header: "RF" },
  { key: "isr", header: "ISR" },
  { key: "throughput", header: "Throughput", sortable: true },
  { key: "status", header: "Status", statusKey: "status" },
];

export const kafkaTopicRows: TopicRow[] = [
  { id: "1", topic: "rt.kovis.events", partitions: 24, rf: 3, isr: "24/24", throughput: "62 MB/s", status: "normal" },
  { id: "2", topic: "rt.xrois.events", partitions: 18, rf: 3, isr: "18/18", throughput: "48 MB/s", status: "normal" },
  { id: "3", topic: "batch.voc.docs", partitions: 8, rf: 3, isr: "6/8", throughput: "4 MB/s", status: "warning" },
  { id: "4", topic: "iceberg.sink.c2", partitions: 12, rf: 3, isr: "9/12", throughput: "2 MB/s", status: "critical" },
];

// 3-4. Cluster summary mini stats
export const kafkaClusterSummary = [
  { label: "Total Topics", value: 128 },
  { label: "Total Partitions", value: 612 },
  { label: "Replication Factor", value: 3 },
  { label: "Cluster State", value: "Healthy", status: "normal" as const },
  { label: "Active Controllers", value: 1, status: "normal" as const },
];

// 3-4. Broker topology (KRaft mode, 5 brokers)
export const kafkaBrokerTopology: { nodes: TopologyNode[]; edges: TopologyEdge[] } = {
  nodes: [
    { id: "b1", label: "broker-1", status: "normal", isController: true, badges: [{ label: "CPU", value: "42%" }] },
    { id: "b2", label: "broker-2", status: "normal", badges: [{ label: "CPU", value: "38%" }] },
    { id: "b3", label: "broker-3", status: "warning", badges: [{ label: "CPU", value: "78%" }] },
    { id: "b4", label: "broker-4", status: "normal", badges: [{ label: "CPU", value: "45%" }] },
    { id: "b5", label: "broker-5", status: "critical", badges: [{ label: "CPU", value: "91%" }] },
  ],
  edges: [
    { source: "b1", target: "b2" },
    { source: "b1", target: "b3" },
    { source: "b1", target: "b4" },
    { source: "b1", target: "b5" },
    { source: "b2", target: "b3" },
    { source: "b3", target: "b4" },
    { source: "b4", target: "b5" },
  ],
};

// 3-4. Consumer Groups list (name + Lag)
export const kafkaConsumerGroupsRanked: RankedListItem[] = [
  { label: "cg-orders", value: "520,000", status: lagStatus(520_000) },
  { label: "cg-payments", value: "210,000", status: lagStatus(210_000) },
  { label: "cg-notifications", value: "84,000", status: lagStatus(84_000) },
  { label: "cg-inventory", value: "12,000", status: lagStatus(12_000) },
];

// 3-4. Sinks/Downstream list (name + status)
export const kafkaSinksRanked: RankedListItem[] = [
  { label: "iceberg-sink-c1", value: "Connected", status: "normal" },
  { label: "iceberg-sink-c2", value: "Degraded", status: "warning" },
  { label: "milvus-writer", value: "Connected", status: "normal" },
  { label: "backup-sink", value: "Offline", status: "critical" },
];

// 3-5. Broker status table
interface BrokerRow extends Record<string, unknown> {
  id: string;
  broker: string;
  role: string;
  state: string;
  cpu: string;
  mem: string;
  disk: string;
  netIO: string;
  reqQueue: number;
  status: StatusLevel;
}

export const kafkaBrokerColumns: TableColumn<BrokerRow>[] = [
  { key: "broker", header: "Broker (ID)", sortable: true },
  { key: "role", header: "Role" },
  { key: "state", header: "State" },
  { key: "cpu", header: "CPU" },
  { key: "mem", header: "MEM" },
  { key: "disk", header: "DISK" },
  { key: "netIO", header: "Net (In/Out)" },
  { key: "reqQueue", header: "Req Queue", sortable: true, statusKey: "status" },
];

export const kafkaBrokerRows: BrokerRow[] = [
  { id: "1", broker: "broker-1", role: "Controller", state: "Leader", cpu: "42%", mem: "58%", disk: "61%", netIO: "120/95 MB/s", reqQueue: 12, status: "normal" },
  { id: "2", broker: "broker-2", role: "Broker", state: "Follower", cpu: "38%", mem: "52%", disk: "58%", netIO: "98/80 MB/s", reqQueue: 9, status: "normal" },
  { id: "3", broker: "broker-3", role: "Broker", state: "Follower", cpu: "78%", mem: "81%", disk: "72%", netIO: "210/180 MB/s", reqQueue: 64, status: "warning" },
  { id: "4", broker: "broker-4", role: "Broker", state: "Leader", cpu: "45%", mem: "55%", disk: "60%", netIO: "110/90 MB/s", reqQueue: 14, status: "normal" },
  { id: "5", broker: "broker-5", role: "Broker", state: "Follower", cpu: "91%", mem: "88%", disk: "84%", netIO: "260/230 MB/s", reqQueue: 128, status: "critical" },
];

// 3-6. Top Topics by Throughput
export const kafkaTopTopicsBar = {
  categories: ["rt.kovis.events", "rt.xrois.events", "rt.iris.events", "batch.voc.docs", "iceberg.sink.c2"],
  values: [62, 48, 31, 4, 2],
};

// 3-6. Topic Partition Distribution by Broker
export const kafkaPartitionDistribution: { categories: string[]; series: SeriesConfig[] } = {
  categories: ["broker-1", "broker-2", "broker-3", "broker-4", "broker-5"],
  series: [
    {
      name: "Leader",
      color: "#3b82f6",
      data: [
        { label: "broker-1", value: 130 },
        { label: "broker-2", value: 118 },
        { label: "broker-3", value: 96 },
        { label: "broker-4", value: 124 },
        { label: "broker-5", value: 88 },
      ],
    },
    {
      name: "Follower",
      color: "#64748b",
      data: [
        { label: "broker-1", value: 244 },
        { label: "broker-2", value: 236 },
        { label: "broker-3", value: 210 },
        { label: "broker-4", value: 240 },
        { label: "broker-5", value: 196 },
      ],
    },
  ],
};

// 3-6. Messages In/Out trend
export const kafkaMessagesTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "Messages In", color: "#3b82f6", data: [118_000, 122_000, 126_000, 124_000, 128_400].map((v, i) => ({ label: String(i), value: v })) },
    { name: "Messages Out", color: "#22c55e", data: [112_000, 116_000, 119_000, 118_500, 121_000].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

// 3-6. Produce vs Fetch trend
export const kafkaProduceFetchTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "Produce req/s", color: "#3b82f6", data: [9_200, 9_500, 9_700, 9_600, 9_820].map((v, i) => ({ label: String(i), value: v })) },
    { name: "Fetch req/s", color: "#f97316", data: [13_500, 13_800, 14_100, 13_900, 14_300].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

// 3-6. Request Latency (p50/p95/p99)
export const kafkaLatencyTrend: { xLabels: string[]; series: SeriesConfig[] } = {
  xLabels: ["09:00", "09:05", "09:10", "09:15", "09:20"],
  series: [
    { name: "p50 (ms)", color: "#22c55e", data: [4, 4.2, 3.9, 4.1, 4.0].map((v, i) => ({ label: String(i), value: v })) },
    { name: "p95 (ms)", color: "#f97316", data: [18, 19, 21, 20, 22].map((v, i) => ({ label: String(i), value: v })) },
    { name: "p99 (ms)", color: "#ef4444", data: [42, 45, 51, 48, 55].map((v, i) => ({ label: String(i), value: v })) },
  ],
};

// 3-7. Consumer Group Status Table
interface ConsumerGroupRow extends Record<string, unknown> {
  id: string;
  group: string;
  topic: string;
  lag: number;
  lagSpike: string;
  consumers: number;
  state: string;
  throughput: string;
  rebalance1h: number;
  status: StatusLevel;
}

export const kafkaConsumerGroupColumns: TableColumn<ConsumerGroupRow>[] = [
  { key: "group", header: "Group", sortable: true },
  { key: "topic", header: "Primary Topic" },
  { key: "lag", header: "Lag", sortable: true, statusKey: "status", render: (v) => (v as number).toLocaleString() },
  { key: "lagSpike", header: "Lag Δ" },
  { key: "consumers", header: "Consumers", sortable: true },
  { key: "state", header: "State" },
  { key: "throughput", header: "Throughput" },
  { key: "rebalance1h", header: "Rebalance (1H)", sortable: true },
];

export const kafkaConsumerGroupRows: ConsumerGroupRow[] = [
  { id: "1", group: "cg-orders", topic: "rt.kovis.events", lag: 520_000, lagSpike: "+18%", consumers: 6, state: "Stable", throughput: "12 MB/s", rebalance1h: 1, status: lagStatus(520_000) },
  { id: "2", group: "cg-payments", topic: "rt.xrois.events", lag: 210_000, lagSpike: "+4%", consumers: 4, state: "Stable", throughput: "8 MB/s", rebalance1h: 0, status: lagStatus(210_000) },
  { id: "3", group: "cg-notifications", topic: "rt.iris.events", lag: 84_000, lagSpike: "-2%", consumers: 3, state: "Rebalancing", throughput: "5 MB/s", rebalance1h: 3, status: lagStatus(84_000) },
  { id: "4", group: "cg-inventory", topic: "batch.voc.docs", lag: 12_000, lagSpike: "-6%", consumers: 2, state: "Stable", throughput: "1 MB/s", rebalance1h: 0, status: lagStatus(12_000) },
];

// 3-8. Replication / ISR State
export const kafkaReplicationDonut: DonutSlice[] = [
  { name: "Healthy", value: 588, color: "#22c55e" },
  { name: "Degraded", value: 21, color: "#f97316" },
  { name: "Offline", value: 3, color: "#ef4444" },
];

export const kafkaUnderReplicatedList: RankedListItem[] = [
  { label: "rt.iris.events-p4", value: "ISR 2/3", status: "warning" },
  { label: "batch.voc.docs-p1", value: "ISR 2/3", status: "warning" },
  { label: "iceberg.sink.c2-p7", value: "ISR 1/3", status: "critical" },
];

export const kafkaOfflinePartitionsList: RankedListItem[] = [
  { label: "iceberg.sink.c2-p2", value: "Offline", status: "critical" },
  { label: "iceberg.sink.c2-p9", value: "Offline", status: "critical" },
];

export const kafkaReplicationMiniStats = [
  { label: "Leader Election (1H)", value: 2 },
  { label: "Rebalance Events (1H)", value: 4 },
  { label: "Replication Health", value: 96.2, unit: "%", status: "normal" as const },
  { label: "Controller Health", value: "Healthy", status: "normal" as const },
];

// 3-9. Resource Usage
export const kafkaDiskUsageBar = {
  categories: ["broker-1", "broker-2", "broker-3", "broker-4", "broker-5"],
  values: [61, 58, 72, 60, 84],
  colors: ["#3b82f6", "#3b82f6", "#f97316", "#3b82f6", "#ef4444"],
};

export const kafkaNetworkUsage: { categories: string[]; series: SeriesConfig[] } = {
  categories: ["broker-1", "broker-2", "broker-3", "broker-4", "broker-5"],
  series: [
    {
      name: "Network In (MB/s)",
      color: "#3b82f6",
      data: [
        { label: "broker-1", value: 120 },
        { label: "broker-2", value: 98 },
        { label: "broker-3", value: 210 },
        { label: "broker-4", value: 110 },
        { label: "broker-5", value: 260 },
      ],
    },
    {
      name: "Network Out (MB/s)",
      color: "#22c55e",
      data: [
        { label: "broker-1", value: 95 },
        { label: "broker-2", value: 80 },
        { label: "broker-3", value: 180 },
        { label: "broker-4", value: 90 },
        { label: "broker-5", value: 230 },
      ],
    },
  ],
};

export const kafkaSegmentStorage = [
  { label: "Segment Storage (Total)", value: 8.2, unit: " TB" },
  { label: "Segment Storage (Used)", value: 6.1, unit: " TB" },
  { label: "Segments", value: 4_820 },
];

export const kafkaLogRetention = [
  { label: "Log Size", value: 6.1, unit: " TB" },
  { label: "Retention", value: 7, unit: "d" },
  { label: "Cleanup Policy", value: "delete" },
];

// 3-10. Alerts & Events Table
export const kafkaAlerts: AlertEvent[] = [
  { id: "1", timestamp: "2026-07-23T09:10:00Z", serverity: "Critical", message: "Under replicated partitions detected (3)", target: "broker-5", detail: "ISR shrink on iceberg.sink.c2" },
  { id: "2", timestamp: "2026-07-23T09:02:00Z", serverity: "Warning", message: "Consumer group rebalancing", target: "cg-notifications", detail: "3 rebalances in last hour" },
  { id: "3", timestamp: "2026-07-23T08:48:00Z", serverity: "Warning", message: "Broker disk usage above 80%", target: "broker-5" },
  { id: "4", timestamp: "2026-07-23T08:30:00Z", serverity: "Info", message: "Controller election completed", target: "broker-1" },
];
