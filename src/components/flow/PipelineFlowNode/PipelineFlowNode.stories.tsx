import type { Meta, StoryObj } from '@storybook/react';
import { PipelineFlowNode } from './PipelineFlowNode';

const meta: Meta<typeof PipelineFlowNode> = {
  title: '🔗 Flow/PipelineFlowNode',
  component: PipelineFlowNode,
};
export default meta;
type Story = StoryObj<typeof PipelineFlowNode>;

const throughputTrend = [120, 132, 128, 145, 150, 148, 160];

export const Default: Story = {
  args: {
    name: 'Kafka Adapter',
    status: 'normal',
    metrics: [
      { label: 'Throughput', value: '160/s' },
      { label: 'Latency', value: '12ms' },
    ],
    sparklineData: throughputTrend,
  },
};

export const Warning: Story = {
  args: {
    name: 'Spark Sink',
    status: 'warning',
    metrics: [
      { label: 'Throughput', value: '95/s' },
      { label: 'Lag', value: '210,000' },
    ],
    sparklineData: [90, 105, 130, 160, 190, 210],
  },
};

export const Critical: Story = {
  args: {
    name: 'Trino Query',
    status: 'critical',
    metrics: [
      { label: 'Queue', value: '4,300' },
      { label: 'Errors', value: '58' },
    ],
    sparklineData: [10, 25, 60, 120, 220, 430],
  },
};

export const Inactive: Story = {
  args: {
    name: 'Milvus Index',
    status: 'inactive',
    metrics: [{ label: 'Status', value: 'Stopped' }],
  },
};

export const WithoutSparkline: Story = {
  args: {
    name: 'Document VOC',
    status: 'info',
    metrics: [
      { label: 'Queued', value: 24 },
      { label: 'Processed', value: '1,208' },
    ],
  },
};

export const Loading: Story = {
  args: {
    name: 'Agent',
    status: 'normal',
    metrics: [],
    isLoading: true,
  },
};
