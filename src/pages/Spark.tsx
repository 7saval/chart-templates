import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineStageTimeline } from "@/components/layout/PipelineStageTimeline";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiCardCompound } from "@/components/kpi/KpiCardCompound";
import { MiniStatCell } from "@/components/misc/MiniStatCell";
import { StatusDataTable } from "@/components/tables/StatusDataTable";
import { PipelineFlowDiagram } from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram";
import { DonutRingChart } from "@/components/charts/DonutRingChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { GaugeRing } from "@/components/charts/GaugeRing";
import { AlertEventTable } from "@/components/tables/AlertEventTable";
import {
  sparkStages,
  sparkKpis,
  sparkActiveAlerts,
  sparkClusterNodes,
  sparkClusterEdges,
  sparkClusterStats,
  sparkHealthChips,
  sparkAppJobColumns,
  sparkAppJobRows,
  sparkExecutorColumns,
  sparkExecutorRows,
  sparkStreamingStats,
  sparkStagesDonut,
  sparkTaskStats,
  sparkTopStagesColumns,
  sparkTopStagesRows,
  sparkResourceTrend,
  sparkEtlColumns,
  sparkEtlRows,
  sparkStorageKpis,
  sparkDownstreamStats,
  sparkAlerts,
  sparkTuningGauges,
  sparkTuningKpis,
  sparkTuningStats,
} from "@/mocks/spark.mock";

export default function Spark() {
  return (
    <div className="space-y-4">
      {/* 4-1 → 4-2: 클러스터 개요 스탯 바 */}
      <SectionPanel title="Cluster Overview (spark-prod)">
        <PipelineStageTimeline stages={sparkStages} />
      </SectionPanel>

      {/* 4-3: KPI 카드 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {sparkKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
        <KpiCardCompound data={sparkActiveAlerts} />
      </div>

      {/* 4-4 → 4-6: Master→Worker 토폴로지 + 클러스터 통계 */}
      <SectionPanel title="Spark Cluster Overview">
        <PipelineFlowDiagram nodes={sparkClusterNodes} edges={sparkClusterEdges} height={280} />
      </SectionPanel>

      <div className="grid grid-cols-6 gap-4">
        {sparkClusterStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
        {sparkHealthChips.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      <SectionPanel title="Applications / Jobs">
        <StatusDataTable columns={sparkAppJobColumns} data={sparkAppJobRows} />
      </SectionPanel>

      <SectionPanel title="Executor State">
        <StatusDataTable columns={sparkExecutorColumns} data={sparkExecutorRows} />
      </SectionPanel>

      {/* 4-7 → 4-9: Structured Streaming / Jobs·Stages·Tasks / 리소스 사용량 */}
      <div className="grid grid-cols-4 gap-4">
        {sparkStreamingStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Running / Completed / Failed Stages">
          <DonutRingChart data={sparkStagesDonut} height={220} />
        </SectionPanel>
        <div className="grid grid-cols-3 gap-4 self-start">
          {sparkTaskStats.map((s) => (
            <MiniStatCell key={s.label} {...s} />
          ))}
        </div>
      </div>

      <SectionPanel title="Top Running Stages">
        <StatusDataTable columns={sparkTopStagesColumns} data={sparkTopStagesRows} />
      </SectionPanel>

      <SectionPanel title="Cluster Resource Usage">
        <TrendLineChart {...sparkResourceTrend} height={260} />
      </SectionPanel>

      {/* 4-10: Spark SQL/ETL 처리량 */}
      <SectionPanel title="Spark SQL/ETL Throughput">
        <StatusDataTable columns={sparkEtlColumns} data={sparkEtlRows} />
      </SectionPanel>

      {/* 4-11: 스토리지 & 다운스트림 개요 */}
      <div className="grid grid-cols-3 gap-4">
        {sparkStorageKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {sparkDownstreamStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      {/* 4-12: 알림 & 이벤트 */}
      <SectionPanel title="Alerts & Events">
        <AlertEventTable events={sparkAlerts} />
      </SectionPanel>

      {/* 4-13: 튜닝 & 헬스 지표 */}
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Cache Hit Ratio">
          <GaugeRing {...sparkTuningGauges.cacheHitRatio} height={200} />
        </SectionPanel>
        <SectionPanel title="Broadcast Join Usage">
          <GaugeRing {...sparkTuningGauges.broadcastJoinUsage} height={200} />
        </SectionPanel>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {sparkTuningKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {sparkTuningStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
