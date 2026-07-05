import type { KpiCardData } from "@/components/kpi/KpiCard/KpiCard.types";
import type { AlertEvent } from "@/components/tables/AlertEventTable/AlertEventTable.types";

export const homeKpis: KpiCardData[] = [
  {
    label: "End-to-End Latency",
    value: 4.2,
    unit: "s",
    deltaPct: -3.1,
    trend: [5, 4.8, 4.5, 4.6, 4.3, 4.2],
    status: "normal",
  },
  {
    label: "Active Alerts",
    value: 14,
    breakdown: [
      { label: "Critical", count: 3, color: "#ef4444" },
      { label: "Warning", count: 11, color: "#f97316" },
    ],
  },
  {
    label: "Throughput",
    value: 12_400,
    unit: "msg/s",
    deltaPct: 5.4,
    trend: [10, 11, 10.5, 12, 12.4],
    status: "normal",
  },
];

export const homeAlerts: AlertEvent[] = [
  {
    id: "1",
    timestamp: "2026-07-05T09:12:00Z",
    severity: "Critical",
    message: "Consumer lag exceeded 500k",
    target: "iceberg-sink-c1",
    status: "unack",
  },
  {
    id: "2",
    timestamp: "2026-07-05T08:55:00Z",
    severity: "Warning",
    message: "Broker disk usage 82%",
    target: "kafka-broker-3",
    status: "ack",
  },
];
