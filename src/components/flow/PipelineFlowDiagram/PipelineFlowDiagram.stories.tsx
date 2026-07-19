import type { Meta, StoryObj } from "@storybook/react";
import { PipelineFlowDiagram } from "./PipelineFlowDiagram";

const meta: Meta<typeof PipelineFlowDiagram> = {
  title: "🔗 Flow/PipelineFlowDiagram",
  component: PipelineFlowDiagram,
};
export default meta;
type Story = StoryObj<typeof PipelineFlowDiagram>;

export const Default: Story = {
  args: {
    nodes: [
      {
        id: "producer-1",
        type: "pipelineNode",
        position: { x: 0, y: 100 },
        data: {
          name: "Producer",
          metrics: [{ label: "Throughput", value: "1.2k/s" }],
          status: "normal",
          sparklineData: [980, 1050, 1010, 1120, 1180, 1150, 1200],
        },
      },
      {
        id: "broker-1",
        type: "pipelineNode",
        position: { x: 200, y: 100 },
        data: {
          name: "Kafka Broker",
          metrics: [{ label: "Lag", value: "210k" }],
          status: "normal",
          sparklineData: [150, 180, 165, 200, 190, 205, 210],
        },
      },
      {
        id: "consumer-1",
        type: "pipelineNode",
        position: { x: 400, y: 100 },
        data: {
          name: "Consumer",
          metrics: [{ label: "Processed", value: "980/s" }],
          status: "normal",
          sparklineData: [820, 860, 900, 890, 940, 960, 980],
        },
      },
    ],
    edges: [
      { id: "e1", source: "producer-1", target: "broker-1" },
      { id: "e2", source: "broker-1", target: "consumer-1" },
    ],
    height: 360,
  },
};
export const WithWarning: Story = {
  args: {
    nodes: [
      {
        id: "producer-1",
        type: "pipelineNode",
        position: { x: 0, y: 100 },
        data: {
          name: "Producer",
          metrics: [{ label: "Throughput", value: "1.2k/s" }],
          status: "normal",
          sparklineData: [980, 1050, 1010, 1120, 1180, 1150, 1200],
        },
      },
      {
        id: "broker-1",
        type: "pipelineNode",
        position: { x: 200, y: 100 },
        data: {
          name: "Kafka Broker",
          metrics: [{ label: "Lag", value: "210k" }],
          status: "warning",
          sparklineData: [90, 105, 130, 160, 190, 210],
        },
      },
      {
        id: "consumer-1",
        type: "pipelineNode",
        position: { x: 400, y: 100 },
        data: {
          name: "Consumer",
          metrics: [{ label: "Processed", value: "980/s" }],
          status: "normal",
          sparklineData: [820, 860, 900, 890, 940, 960, 980],
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "producer-1",
        target: "broker-1",
        data: { isBottleneck: true },
      },
      { id: "e2", source: "broker-1", target: "consumer-1" },
    ],
    height: 360,
  },
};
export const Loading: Story = {
  args: {
    nodes: [
      {
        id: "producer-1",
        type: "pipelineNode",
        position: { x: 0, y: 100 },
        data: {
          name: "Producer",
          metrics: [{ label: "Throughput", value: "1.2k/s" }],
          status: "normal",
          isLoading: true,
        },
      },
      {
        id: "broker-1",
        type: "pipelineNode",
        position: { x: 200, y: 100 },
        data: {
          name: "Kafka Broker",
          metrics: [{ label: "Lag", value: "210k" }],
          status: "normal",
          isLoading: true,
        },
      },
      {
        id: "consumer-1",
        type: "pipelineNode",
        position: { x: 400, y: 100 },
        data: {
          name: "Consumer",
          metrics: [{ label: "Processed", value: "980/s" }],
          status: "normal",
          isLoading: true,
        },
      },
    ],
    edges: [
      { id: "e1", source: "producer-1", target: "broker-1" },
      { id: "e2", source: "broker-1", target: "consumer-1" },
    ],
    height: 360,
  },
};
export const Empty: Story = { args: { nodes: [], edges: [], height: 360 } };
