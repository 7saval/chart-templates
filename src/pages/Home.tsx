import { useMemo, useState } from "react";
import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineStageTimeline } from "@/components/layout/PipelineStageTimeline";
import { TimeRangeToggle } from "@/components/layout/TimeRangeToggle";
import { KpiCard } from "@/components/kpi/KpiCard";
import { ProgressKpiCard } from "@/components/kpi/ProgressKpiCard";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { PipelineFlowDiagram } from "@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram";
import { PipelineFlowNode } from "@/components/flow/PipelineFlowNode";
import { StatusDataTable } from "@/components/tables/StatusDataTable";
import { AlertEventTable } from "@/components/tables/AlertEventTable";
import type { AlertServerity } from "@/components/tables/AlertEventTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RankedList } from "@/components/misc/RankedList";
import { resolveTimeRange } from "@/lib/resolveTimeRange";
import { generateTrendSeries, reanchor } from "@/mocks/trend";
import { STATUS_COLORS, getResourceUsageStatus } from "@/tokens/colors";
import { renderStatusIcon } from "@/lib/statusDisplay";
import type { TopHeaderTimeUnit } from "@/components/layout/TopHeader/TopHeader.types";
import type { TimeRangeUnit } from "@/components/layout/TimeRangeToggle";
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

  const containerColumns = homeContainerColumns.map((col) => {
    if (col.key === "cpuPct") {
      return {
        ...col,
        render: (_value: unknown, row: (typeof homeContainerRows)[number]) => {
          const color =
            STATUS_COLORS[getResourceUsageStatus(row.cpuPct).status];
          const fillPct = Math.min((row.cpuPct / row.cpuLimitPct) * 100, 100);
          return (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-14 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${fillPct}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-xs tabular-nums" style={{ color }}>
                {row.cpuPct}% / {row.cpuLimitPct}%
              </span>
            </div>
          );
        },
      };
    }
    if (col.key === "memUsedGB") {
      return {
        ...col,
        render: (_value: unknown, row: (typeof homeContainerRows)[number]) => {
          const memPct = (row.memUsedGB / row.memTotalGB) * 100;
          const color = STATUS_COLORS[getResourceUsageStatus(memPct).status];
          return (
            <span className="text-xs tabular-nums">
              <span style={{ color, fontWeight: 600 }}>{row.memUsedGB}</span>
              <span className="text-muted-foreground">
                {" "}
                / {row.memTotalGB} GB
              </span>
            </span>
          );
        },
      };
    }
    if (col.key === "status") {
      return {
        ...col,
        render: (_value: unknown, row: (typeof homeContainerRows)[number]) =>
          renderStatusIcon(row.status),
      };
    }
    return col;
  });

  const adapterColumns = homeAdapterColumns.map((col) => {
    if (col.key === "status") {
      return {
        ...col,
        render: (_value: unknown, row: (typeof homeAdapterRows)[number]) =>
          renderStatusIcon(row.status),
      };
    }
    return col;
  });

  // 2-11 알림&이벤트 패널 헤더의 탭: 전체/심각도별 건수를 보여주는 동시에 테이블 필터로 동작
  const [alertFilter, setAlertFilter] = useState<"ALL" | AlertServerity>("ALL");
  const alertCounts = {
    Critical: homeAlerts.filter((a) => a.serverity === "Critical").length,
    Warning: homeAlerts.filter((a) => a.serverity === "Warning").length,
    Info: homeAlerts.filter((a) => a.serverity === "Info").length,
  };
  const alertFilterTabs = (
    <Tabs
      value={alertFilter}
      onValueChange={(v) => setAlertFilter(v as typeof alertFilter)}
    >
      <TabsList className="group-data-horizontal/tabs:h-10 gap-1 p-1">
        <TabsTrigger value="ALL" className="gap-2 px-4 py-1.5 text-base">
          <span className="size-2.5 rounded-full bg-muted-foreground" />
          전체 {homeAlerts.length}
        </TabsTrigger>
        <TabsTrigger value="Critical" className="gap-2 px-4 py-1.5 text-base">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: STATUS_COLORS.critical }}
          />
          Critical {alertCounts.Critical}
        </TabsTrigger>
        <TabsTrigger value="Warning" className="gap-2 px-4 py-1.5 text-base">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: STATUS_COLORS.warning }}
          />
          Warning {alertCounts.Warning}
        </TabsTrigger>
        <TabsTrigger value="Info" className="gap-2 px-4 py-1.5 text-base">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: STATUS_COLORS.info }}
          />
          Info {alertCounts.Info}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  // 2-6 트렌드 차트는 상단 헤더 기간과 별도로 자체 기간 선택을 가짐
  const [trendTimeUnit, setTrendTimeUnit] = useState<TimeRangeUnit>("1H");
  const trendRange = useMemo(
    () => resolveTimeRange(undefined, trendTimeUnit, lastRefresh),
    [trendTimeUnit, lastRefresh],
  );
  const trendSeriesWithLiveData = useMemo(
    () =>
      homeTrend.series.map((s) => ({
        ...s,
        data: reanchor(s.data, lastRefresh.getTime()),
      })),
    [lastRefresh],
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
          ? {
              ...node,
              sparklineData: reanchor(
                node.sparklineData,
                lastRefresh.getTime(),
              ),
            }
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
          {
            label: "지연(Lag)",
            color: STATUS_COLORS.critical,
            variant: "dashed",
          },
          { label: "데이터 흐름", color: "#60a5fa", variant: "arrow" },
        ]}
      >
        <PipelineFlowDiagram
          nodes={homeFlowNodes}
          edges={homeFlowEdges}
          direction="horizontal"
          height={500}
          range={range}
          anchor={lastRefresh.getTime()}
        />
      </SectionPanel>

      {/* 2-6: 트래픽/처리량 트렌드 */}
      <SectionPanel
        compact
        title="트래픽 & 처리량 추이"
        legend={homeTrend.series.map((s) => ({
          label: s.name,
          color: s.color,
        }))}
        actions={
          <TimeRangeToggle value={trendTimeUnit} onChange={setTrendTimeUnit} />
        }
      >
        <TrendLineChart
          series={trendSeriesWithLiveData}
          range={trendRange}
          showLegend={false}
          height={260}
        />
      </SectionPanel>

      {/* 2-7 & 2-8: 저장소 & 쿼리 사용량 / AI·Vector 요약 */}
      <div className="flex gap-4">
        <SectionPanel compact title="저장소 & 쿼리 사용량" className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            <ProgressKpiCard data={homeMinioCapacity} range={range} />
            {homeStorageKpis.map((kpi) => (
              <KpiCard key={kpi.label} data={kpi} range={range} />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel compact title="AI / Vector 요약" className="flex-1">
          <div className="grid grid-cols-3 gap-4">
            {vectorKpisWithLiveTrend.map((node) => (
              <PipelineFlowNode key={node.name} {...node} range={range} />
            ))}
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                최근 질의 Top 5
              </div>
              <RankedList items={homeTopQueries} />
            </div>
          </div>
        </SectionPanel>
      </div>

      {/* 2-9: 컨테이너 리소스 사용량 */}
      <SectionPanel compact title="컨테이너 리소스 사용량">
        <StatusDataTable columns={containerColumns} data={homeContainerRows} />
      </SectionPanel>

      {/* 2-10: PPS Adapter/Agent 상태 */}
      <SectionPanel compact title="PPS Adapter/Agent 상태">
        <StatusDataTable columns={adapterColumns} data={homeAdapterRows} />
      </SectionPanel>

      {/* 2-11: 최근 알림 */}
      <SectionPanel compact title="알림&이벤트" actions={alertFilterTabs}>
        <AlertEventTable
          events={homeAlerts}
          showAckColumn
          filter={alertFilter}
          onFilterChange={setAlertFilter}
        />
      </SectionPanel>
    </div>
  );
}
