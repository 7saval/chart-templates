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
