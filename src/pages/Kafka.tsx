import { SectionPanel } from "@/components/layout/SectionPanel";
import { PipelineStageTimeline } from "@/components/layout/PipelineStageTimeline";
import { KpiCard } from "@/components/kpi/KpiCard";
import { KpiCardCompound } from "@/components/kpi/KpiCardCompound";
import { RankedList } from "@/components/misc/RankedList";
import { MiniStatCell } from "@/components/misc/MiniStatCell";
import { StatusDataTable } from "@/components/tables/StatusDataTable";
import { TopologyDiagram } from "@/components/topology/TopologyDiagram/TopologyDiagram";
import { BarChart } from "@/components/charts/BarChart";
import { StackedBarChart } from "@/components/charts/StackedBarChart";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { DonutRingChart } from "@/components/charts/DonutRingChart";
import { AlertEventTable } from "@/components/tables/AlertEventTable";
import {
  kafkaStages,
  kafkaKpis,
  kafkaActiveAlerts,
  kafkaProducers,
  kafkaTopicColumns,
  kafkaTopicRows,
  kafkaClusterSummary,
  kafkaBrokerTopology,
  kafkaConsumerGroupsRanked,
  kafkaSinksRanked,
  kafkaBrokerColumns,
  kafkaBrokerRows,
  kafkaTopTopicsBar,
  kafkaPartitionDistribution,
  kafkaMessagesTrend,
  kafkaProduceFetchTrend,
  kafkaLatencyTrend,
  kafkaConsumerGroupColumns,
  kafkaConsumerGroupRows,
  kafkaReplicationDonut,
  kafkaUnderReplicatedList,
  kafkaOfflinePartitionsList,
  kafkaReplicationMiniStats,
  kafkaDiskUsageBar,
  kafkaNetworkUsage,
  kafkaSegmentStorage,
  kafkaLogRetention,
  kafkaAlerts,
} from "@/mocks/kafka.mock";

export default function Kafka() {
  return (
    <div className="space-y-4">
      {/* 3-1 → 3-2: 클러스터 개요 스탯 바 */}
      <SectionPanel title="Cluster Overview (kafka-prod)">
        <PipelineStageTimeline stages={kafkaStages} />
      </SectionPanel>

      {/* 3-3: KPI 카드 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {kafkaKpis.map((kpi) => (
          <KpiCard key={kpi.label} data={kpi} />
        ))}
        <KpiCardCompound data={kafkaActiveAlerts} />
      </div>

      {/* 3-4: 실시간 클러스터 상태 (KRaft mode) */}
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Producers">
          <RankedList items={kafkaProducers} />
        </SectionPanel>
        <SectionPanel title="Cluster Summary">
          <div className="grid grid-cols-2 gap-4">
            {kafkaClusterSummary.map((s) => (
              <MiniStatCell key={s.label} {...s} />
            ))}
          </div>
        </SectionPanel>
      </div>

      <SectionPanel title="Topics">
        <StatusDataTable columns={kafkaTopicColumns} data={kafkaTopicRows} />
      </SectionPanel>

      <SectionPanel title="Broker Cluster Topology">
        <TopologyDiagram nodes={kafkaBrokerTopology.nodes} edges={kafkaBrokerTopology.edges} />
      </SectionPanel>

      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Consumer Groups (by Lag)">
          <RankedList items={kafkaConsumerGroupsRanked} />
        </SectionPanel>
        <SectionPanel title="Sinks / Downstream">
          <RankedList items={kafkaSinksRanked} />
        </SectionPanel>
      </div>

      {/* 3-5 → 3-6: 브로커 상태 & 토픽 처리량 / 파티션 분석 */}
      <SectionPanel title="Broker Status">
        <StatusDataTable columns={kafkaBrokerColumns} data={kafkaBrokerRows} />
      </SectionPanel>

      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Top Topics by Throughput">
          <BarChart {...kafkaTopTopicsBar} orientation="horizontal" height={240} />
        </SectionPanel>
        <SectionPanel title="Topic Partition Distribution by Broker">
          <StackedBarChart {...kafkaPartitionDistribution} height={240} />
        </SectionPanel>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <SectionPanel title="Messages In/Out">
          <TrendLineChart {...kafkaMessagesTrend} height={220} />
        </SectionPanel>
        <SectionPanel title="Produce vs Fetch (req/s)">
          <TrendLineChart {...kafkaProduceFetchTrend} height={220} />
        </SectionPanel>
        <SectionPanel title="Request Latency (p50/p95/p99)">
          <TrendLineChart {...kafkaLatencyTrend} height={220} />
        </SectionPanel>
      </div>

      {/* 3-7: Consumer Group 상태 테이블 */}
      <SectionPanel title="Consumer Group Status">
        <StatusDataTable columns={kafkaConsumerGroupColumns} data={kafkaConsumerGroupRows} />
      </SectionPanel>

      {/* 3-8: 복제 / ISR 상태 */}
      <div className="grid grid-cols-3 gap-4">
        <SectionPanel title="Replication Health">
          <DonutRingChart data={kafkaReplicationDonut} height={220} />
        </SectionPanel>
        <SectionPanel title="Under Replicated Partitions">
          <RankedList items={kafkaUnderReplicatedList} />
        </SectionPanel>
        <SectionPanel title="Offline Partitions">
          <RankedList items={kafkaOfflinePartitionsList} emptyMessage="No offline partitions" />
        </SectionPanel>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {kafkaReplicationMiniStats.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      {/* 3-9: 리소스 사용량 */}
      <div className="grid grid-cols-2 gap-4">
        <SectionPanel title="Broker Disk Usage (%)">
          <BarChart {...kafkaDiskUsageBar} height={220} />
        </SectionPanel>
        <SectionPanel title="Network Usage (MB/s)">
          <StackedBarChart {...kafkaNetworkUsage} height={220} />
        </SectionPanel>
      </div>
      <div className="grid grid-cols-6 gap-4">
        {kafkaSegmentStorage.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
        {kafkaLogRetention.map((s) => (
          <MiniStatCell key={s.label} {...s} />
        ))}
      </div>

      {/* 3-10: 알림 & 이벤트 */}
      <SectionPanel title="Alerts & Events">
        <AlertEventTable events={kafkaAlerts} />
      </SectionPanel>
    </div>
  );
}
