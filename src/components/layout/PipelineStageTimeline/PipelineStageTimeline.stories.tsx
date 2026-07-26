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

export const WithVolumeAndStatusDots: Story = {
  args: {
    stages: [
      {
        name: "Producer",
        count: 36,
        status: "normal",
        volume: { value: 420, unit: "msg/s" },
        nodeStatuses: ["normal", "normal", "warning", "normal"],
      },
      {
        name: "Topic",
        count: 128,
        status: "normal",
        volume: { value: 842, unit: "MB/s" },
        nodeStatuses: ["normal", "normal", "normal"],
      },
      {
        name: "Partition",
        count: 612,
        status: "normal",
        volume: { value: 62, unit: "MB/s" },
      },
      {
        name: "Consumer Group",
        count: 45,
        status: "warning",
        volume: { value: 8, unit: "MB/s" },
        nodeStatuses: ["normal", "warning"],
      },
      { name: "Sink", count: 28, status: "normal" },
    ],
  },
};
