import { useMemo } from "react";
import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineStageTimeline } from "@/components/layout/PipelineStageTimeline";
import { KpiCard } from "@/components/kpi/KpiCard";
import { ProgressKpiCard } from "@/components/kpi/ProgressKpiCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { PipelineFlowDiagram } from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram";
import { PipelineFlowNode } from "@/components/flow/PipelineFlowNode";
import { StatusDataTable } from "@/components/tables/StatusDataTable";
import { AlertEventTable } from "@/components/tables/AlertEventTable";
import { RankedList } from "@/components/misc/RankedList";
import { resolveTimeRange } from "@/lib/resolveTimeRange";
import { generateTrendSeries, reanchor } from "@/mocks/trend";
import { STATUS_COLORS } from "@/tokens/colors";
import type { TopHeaderTimeUnit } from "@/components/layout/TopHeader/TopHeader.types";
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

interface HomeProps {
  dateRange?: { from: Date; to: Date };
  timeUnit?: TopHeaderTimeUnit;
  lastRefresh: Date;
}

export default function Home({ dateRange, timeUnit, lastRefresh }: HomeProps) {
  const range = useMemo(
    () => resolveTimeRange(dateRange, timeUnit, lastRefresh),
    [dateRange, timeUnit, lastRefresh],
  );

  const kpisWithLiveTrend = useMemo(
    () =>
      homeKpis.map((kpi) =>
        kpi.trend
          ? {
              ...kpi,
              trend: generateTrendSeries(Number(kpi.value), {
                anchor: lastRefresh.getTime(),
                points: 1441,
                stepMinutes: 1,
                volatility: 0.05,
              }),
            }
          : kpi,
      ),
    [lastRefresh],
  );

  const vectorKpisWithLiveTrend = useMemo(
    () =>
      homeVectorKpis.map((node) =>
        node.sparklineData
          ? { ...node, sparklineData: reanchor(node.sparklineData, lastRefresh.getTime()) }
          : node,
      ),
    [lastRefresh],
  );

  return (
    <div className="space-y-4">
      {/* 2-1: 파이프라인 전체 개요 */}
      <SectionPanel compact title="Pipeline Overview">
        <PipelineStageTimeline stages={homeStages} />
      </SectionPanel>

      {/* 2-2 ~ 2-4: KPI 카드 그리드 */}
      <div className="grid grid-cols-6 gap-4">
        {kpisWithLiveTrend.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} range={range} />
        ))}
      </div>

      {/* 2-5: 실시간 데이터 파이프라인 흐름도 */}
      <SectionPanel
        compact
        title="Real-time Data Pipeline Flow"
        legend={[
          { label: "정상", color: STATUS_COLORS.normal, variant: "dot" },
          { label: "경고", color: STATUS_COLORS.warning, variant: "dot" },
          { label: "오류", color: STATUS_COLORS.critical, variant: "dot" },
          { label: "지연(Lag)", color: STATUS_COLORS.critical, variant: "dashed" },
          { label: "데이터 흐름", color: "#60a5fa", variant: "arrow" },
        ]}
      >
        <PipelineFlowDiagram
          nodes={homeFlowNodes}
          edges={homeFlowEdges}
          direction="horizontal"
          height={600}
          range={range}
          anchor={lastRefresh.getTime()}
        />
      </SectionPanel>

      {/* 2-6: 트래픽/처리량 트렌드 */}
      <SectionPanel compact title="Traffic & Throughput Trend">
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
        <div className="grid grid-cols-2 gap-4">
          {vectorKpisWithLiveTrend.map((node) => (
            <PipelineFlowNode key={node.name} {...node} range={range} />
          ))}
        </div>
        <SectionPanel compact title="Recent Top-5 Query Ranking">
          <RankedList items={homeTopQueries} />
        </SectionPanel>
      </div>

      {/* 2-9: 컨테이너 리소스 사용량 */}
      <SectionPanel compact title="Container Resource Usage">
        <StatusDataTable columns={homeContainerColumns} data={homeContainerRows} />
      </SectionPanel>

      {/* 2-10: PPS Adapter/Agent 상태 */}
      <SectionPanel compact title="PPS Adapter/Agent Status">
        <StatusDataTable columns={homeAdapterColumns} data={homeAdapterRows} />
      </SectionPanel>

      {/* 2-11: 최근 알림 */}
      <SectionPanel compact title="Recent Alerts">
        <AlertEventTable events={homeAlerts} showAckColumn />
      </SectionPanel>
    </div>
  );
}
