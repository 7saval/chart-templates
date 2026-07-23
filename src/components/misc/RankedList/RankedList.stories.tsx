import { RankedList } from "./RankedList";
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta<typeof RankedList> = {
  title: "🧩 Misc/RankedList",
  component: RankedList,
};
export default meta;
type Story = StoryObj<typeof RankedList>;

export const TopWriters: Story = {
  args: {
    items: [
      { label: "iceberg-sink-c1", value: 1240, unit: " writes/h" },
      { label: "iceberg-sink-c2", value: 1024, unit: " writes/h" },
      { label: "iceberg-sink-c3", value: 500, unit: " writes/h" },
      { label: "iceberg-sink-c4", value: 300, unit: " writes/h" },
      { label: "iceberg-sink-c5", value: 100, unit: " writes/h" },
    ],
  },
};

export const ConsumerGroupsByLag: Story = {
  args: {
    items: [
      { label: "cg-orders", value: "520,000", status: "critical" },
      { label: "cg-payments", value: "210,000", status: "warning" },
      { label: "cg-inventory", value: "12,000", status: "normal" },
    ],
  },
};

export const DownstreamStatus: Story = {
  args: {
    items: [
      { label: "milvus-writer", value: "Connected", status: "normal" },
      { label: "trino-refresh", value: "Degraded", status: "warning" },
      { label: "backup-sink", value: "Offline", status: "critical" },
    ],
  },
};

export const Loading: Story = {
  args: {
    items: [],
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    isLoading: false,
    emptyMessage: "No data available",
  },
};
