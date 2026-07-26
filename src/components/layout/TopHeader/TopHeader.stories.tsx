import type { Meta, StoryObj } from "@storybook/react";
import { TopHeader } from "./TopHeader";

const meta: Meta<typeof TopHeader> = {
  title: "📐 Layout/TopHeader",
  component: TopHeader,
};
export default meta;
type Story = StoryObj<typeof TopHeader>;

const baseArgs = {
  env: "production",
  envOptions: ["production", "staging"],
  onEnvChange: () => {},
  pipeline: "all",
  pipelineOptions: ["all", "realtime", "batch"],
  onPipelineChange: () => {},
  autoRefresh: true,
  onAutoRefreshChange: () => {},
  lastRefresh: "12:00:00",
};

export const Default: Story = { args: baseArgs };

export const AutoRefreshOff: Story = {
  args: { ...baseArgs, autoRefresh: false },
};

export const WithCluster: Story = {
  args: {
    ...baseArgs,
    cluster: "kafka-prod",
    clusterOptions: ["kafka-prod", "kafka-staging"],
    onClusterChange: () => {},
    dateRange: { from: new Date("2026-07-19"), to: new Date("2026-07-26") },
    onDateRangeChange: () => {},
    timeUnit: "15m",
    onTimeUnitChange: () => {},
    systemResponseMs: 2500,
    operatorName: "Operator",
  },
};

export const WithoutCluster: Story = {
  args: baseArgs,
};
