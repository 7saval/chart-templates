import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineStageTimeline } from "@/components/layout/PipelineStageTimeline";
import { KpiCard } from "@/components/kpi/KpiCard";
import { ProgressKpiCard } from "@/components/kpi/ProgressKpiCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { PipelineFlowDiagram } from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram";
import { StatusDataTable } from "@/components/tables/StatusDataTable";
import { AlertEventTable } from "@/components/tables/AlertEventTable";
import { RankedList } from "@/components/misc/RankedList";
import {
  homeKpis,
  homeAlerts,
  homeStages,
  homeFlowNodes,
  homeFlowEdges,
  homeTrend,
  homeMinioCapacity,
  homeStorageKpis,
  homeVectorKpis,
  homeTopQueries,
  homeContainerColumns,
  homeContainerRows,
  homeAdapterColumns,
  homeAdapterRows,
} from "@/mocks/home.mock";

export default function Home() {
  return (
    <div className="space-y-4">
      {/* 2-1: 파이프라인 전체 개요 */}
      <SectionPanel title="Pipeline Overview">
        <PipelineStageTimeline stages={homeStages} />
      </SectionPanel>

      {/* 2-2 ~ 2-4: KPI 카드 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {homeKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* 2-5: 실시간 데이터 파이프라인 흐름도 */}
      <SectionPanel title="Real-time Data Pipeline Flow">
        <PipelineFlowDiagram nodes={homeFlowNodes} edges={homeFlowEdges} height={520} />
      </SectionPanel>

      {/* 2-6: 트래픽/처리량 트렌드 */}
      <SectionPanel title="Traffic & Throughput Trend">
        <TrendLineChart
          series={homeTrend.series}
          xLabels={homeTrend.xLabels}
          height={260}
        />
      </SectionPanel>

      {/* 2-7: 스토리지 & 쿼리 사용량 */}
      <div className="grid grid-cols-3 gap-4">
        <ProgressKpiCard data={homeMinioCapacity} />
        {homeStorageKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
      </div>

      {/* 2-8: AI/Vector 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-3 gap-4">
          {homeVectorKpis.map((kpi) => (
            <KpiCard key={kpi.label} data={kpi} />
          ))}
        </div>
        <SectionPanel title="Recent Top-5 Query Ranking">
          <RankedList items={homeTopQueries} />
        </SectionPanel>
      </div>

      {/* 2-9: 컨테이너 리소스 사용량 */}
      <SectionPanel title="Container Resource Usage">
        <StatusDataTable columns={homeContainerColumns} data={homeContainerRows} />
      </SectionPanel>

      {/* 2-10: PPS Adapter/Agent 상태 */}
      <SectionPanel title="PPS Adapter/Agent Status">
        <StatusDataTable columns={homeAdapterColumns} data={homeAdapterRows} />
      </SectionPanel>

      {/* 2-11: 최근 알림 */}
      <SectionPanel title="Recent Alerts">
        <AlertEventTable events={homeAlerts} showAckColumn />
      </SectionPanel>
    </div>
  );
}
