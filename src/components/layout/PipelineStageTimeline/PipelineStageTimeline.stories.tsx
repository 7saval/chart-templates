import type { Meta, StoryObj } from "@storybook/react";
import { PipelineStageTimeline } from "./PipelineStageTimeline";

const meta: Meta<typeof PipelineStageTimeline> = {
  title: "📐 Layout/PipelineStageTimeline",
  component: PipelineStageTimeline,
};
export default meta;
type Story = StoryObj<typeof PipelineStageTimeline>;

const stages = [
  { name: "CDC", count: 4, status: "normal" as const },
  { name: "Kafka", count: 12, status: "normal" as const },
  { name: "Iceberg", count: 2, status: "warning" as const },
  { name: "Spark", count: 6, status: "normal" as const },
  { name: "Milvus", count: 1, status: "normal" as const },
];

export const Default: Story = { args: { stages } };

export const WithCritical: Story = {
  args: {
    stages: stages.map((s, i) => (i === 2 ? { ...s, status: "critical" as const } : s)),
  },
};

export const Empty: Story = { args: { stages: [] } };
