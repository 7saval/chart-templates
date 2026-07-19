import type { Meta, StoryObj } from "@storybook/react";
import { TopologyDiagram } from "./TopologyDiagram";

const meta: Meta<typeof TopologyDiagram> = {
  title: "🔗 Flow & Topology/TopologyDiagram",
  component: TopologyDiagram,
};
export default meta;
type Story = StoryObj<typeof TopologyDiagram>;

export const KafkaBrokers: Story = {
  args: {
    nodes: [
      { id: "b1", label: "broker-1", status: "normal", isController: true },
      { id: "b2", label: "broker-2", status: "normal" },
      { id: "b3", label: "broker-3", status: "warning" },
      { id: "b4", label: "broker-4", status: "normal" },
      { id: "b5", label: "broker-5", status: "critical" },
    ],
    edges: [
      { source: "b1", target: "b2" },
      { source: "b1", target: "b3" },
      { source: "b1", target: "b4" },
      { source: "b1", target: "b5" },
      { source: "b2", target: "b3" },
    ],
  },
};

export const MinioNodes: Story = {
  args: {
    nodes: Array.from({ length: 8 }, (_, i) => ({
      id: `node-${i + 1}`,
      label: `minio-${i + 1}`,
      status: i === 6 ? "warning" : "normal",
    })),
    edges: Array.from({ length: 8 }, (_, i) => ({
      source: `node-${i + 1}`,
      target: `node-${((i + 1) % 8) + 1}`,
    })),
  },
};
