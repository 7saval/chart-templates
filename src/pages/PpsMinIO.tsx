import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineStageTimeline } from "@/components/layout/PipelineStageTimeline";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiCardCompound } from "@/components/kpi/KpiCardCompound";
import { ProgressKpiCard } from "@/components/kpi/ProgressKpiCard";
import { MiniStatCell } from "@/components/misc/MiniStatCell";
import { RankedList } from "@/components/misc/RankedList";
import { StatusDataTable } from "@/components/tables/StatusDataTable";
import { SparklineChart } from "@/components/charts/SparklineChart";
import { TopologyDiagram } from "@/components/topology/TopologyDiagram/TopologyDiagram";
import { DonutRingChart } from "@/components/charts/DonutRingChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { BarChart } from "@/components/charts/BarChart";
import { GaugeRing } from "@/components/charts/GaugeRing";
import { AlertEventTable } from "@/components/tables/AlertEventTable";
import {
  ppsMinioStages,
  ppsMinioKpis,
  ppsMinioHpaUsage,
  ppsMinioCapacity,
  ppsMinioActiveAlerts,
  ppsMinioConsumerColumns,
  ppsMinioConsumerRows,
  ppsMinioHpaColumns,
  ppsMinioHpaRows,
  ppsMinioCapacityDonut,
  ppsMinioStorageStats,
  ppsMinioTopology,
  ppsMinioDurabilityStats,
  ppsMinioIcebergKpis,
  ppsMinioIcebergStats,
  ppsMinioLagTrend,
  ppsMinioThroughputTrend,
  ppsMinioHpaHistory,
  ppsMinioBucketUsageBar,
  ppsMinioIoLatencyTrend,
  ppsMinioLakehouseOpsKpis,
  ppsMinioGauges,
  ppsMinioTopWriters,
  ppsMinioAlerts,
} from "@/mocks/pps-minio.mock";

export default function PpsMinIO() {
  const hpaColumnsWithSparkline = [
    ...ppsMinioHpaColumns,
    {
      key: "trend" as const,
      header: "Trend",
      render: (_value: unknown, row: (typeof ppsMinioHpaRows)[number]) => (
        <div style={{ width: 80 }}>
          <SparklineChart data={row.trend} height={24} status={row.status} />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 5-1 → 5-2: 스탯 바 */}
      <SectionPanel title="PPS Agent Consumer & MinIO Lakehouse (All clusters)">
        <PipelineStageTimeline stages={ppsMinioStages} />
      </SectionPanel>

      {/* 5-3: KPI 카드 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {ppsMinioKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
        <ProgressKpiCard data={ppsMinioHpaUsage} />
        <ProgressKpiCard data={ppsMinioCapacity} />
        <KpiCardCompound data={ppsMinioActiveAlerts} />
      </div>

      {/* 5-4: PPS Agent Consumer Groups 테이블 */}
      <SectionPanel title="PPS Agent Consumer Groups">
        <StatusDataTable columns={ppsMinioConsumerColumns} data={ppsMinioConsumerRows} />
      </SectionPanel>

      {/* 5-5: PPS Agent HPA 상태 테이블 (스파크라인 포함) */}
      <SectionPanel title="PPS Agent HPA Status">
        <StatusDataTable columns={hpaColumnsWithSparkline} data={ppsMinioHpaRows} />
      </SectionPanel>

      {/* 5-6: MinIO Data Lakehouse */}
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Total Capacity">
          <DonutRingChart data={ppsMinioCapacityDonut} height={220} />
        </SectionPanel>
        <div className="grid grid-cols-2 gap-4 self-start">
          {ppsMinioStorageStats.map((s) => (
            <MiniStatCell key={s.label} {...s} />
          ))}
        </div>
      </div>
      <SectionPanel title="MinIO Cluster Topology (Erasure Coding 8+4)">
        <TopologyDiagram nodes={ppsMinioTopology.nodes} edges={ppsMinioTopology.edges} />
      </SectionPanel>
      <div className="grid grid-cols-3 gap-4">
        {ppsMinioDurabilityStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      {/* 5-7: Iceberg/Lakehouse 상태 */}
      <div className="grid grid-cols-3 gap-4">
        {ppsMinioIcebergKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {ppsMinioIcebergStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      {/* 5-8 → 5-11: 트렌드 차트 */}
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Consumer Lag Trend">
          <TrendLineChart {...ppsMinioLagTrend} height={240} />
        </SectionPanel>
        <SectionPanel title="Consumer Throughput (msgs/s)">
          <TrendLineChart {...ppsMinioThroughputTrend} height={240} />
        </SectionPanel>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="HPA Scale Events / Replica History">
          <StackedBarChart {...ppsMinioHpaHistory} height={220} />
        </SectionPanel>
        <SectionPanel title="MinIO Bucket Usage Breakdown">
          <BarChart {...ppsMinioBucketUsageBar} orientation="horizontal" height={220} />
        </SectionPanel>
      </div>

      {/* 5-12 → 5-14: I/O 지연시간 · 레이크하우스 운영 · 알림 */}
      <SectionPanel title="MinIO I/O & Request Latency">
        <TrendLineChart {...ppsMinioIoLatencyTrend} height={240} />
      </SectionPanel>
      <div className="grid grid-cols-4 gap-4">
        {ppsMinioLakehouseOpsKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Small File Ratio (target < 5%)">
          <GaugeRing {...ppsMinioGauges.smallFileRatio} height={200} />
        </SectionPanel>
        <SectionPanel title="Table Freshness (target < 1h)">
          <GaugeRing {...ppsMinioGauges.tableFreshness} height={200} />
        </SectionPanel>
      </div>
      <SectionPanel title="Top Writers (1h)">
        <RankedList items={ppsMinioTopWriters} />
      </SectionPanel>
      <SectionPanel title="Alerts & Events">
        <AlertEventTable events={ppsMinioAlerts} />
      </SectionPanel>
    </div>
  );
}
