import type { Meta, StoryObj } from '@storybook/react';
import { AlertEventTable } from './AlertEventTable';
import type { AlertEvent } from './AlertEventTable.types';

const meta: Meta<typeof AlertEventTable> = {
  title: '📋 Tables/AlertEventTable',
  component: AlertEventTable,
};
export default meta;
type Story = StoryObj<typeof AlertEventTable>;

const events: AlertEvent[] = [
  {
    id: '1',
    timestamp: '2026-07-11T09:12:00Z',
    serverity: 'Critical',
    message: 'Disk usage exceeded 95%',
    target: 'kafka-broker-3',
    status: 'unack',
    detail: '/data partition has 2GB free of 500GB',
  },
  {
    id: '2',
    timestamp: '2026-07-11T09:05:00Z',
    serverity: 'Warning',
    message: 'Consumer lag above threshold',
    target: 'order-events-consumer',
    status: 'unack',
    detail: 'Lag reached 210,000 messages',
  },
  {
    id: '3',
    timestamp: '2026-07-11T08:58:00Z',
    serverity: 'Info',
    message: 'Broker restarted',
    target: 'kafka-broker-1',
    status: 'info',
  },
  {
    id: '4',
    timestamp: '2026-07-11T08:40:00Z',
    serverity: 'Warning',
    message: 'Under-replicated partitions detected',
    target: 'kafka-broker-2',
    status: 'ack',
  },
  {
    id: '5',
    timestamp: '2026-07-11T08:20:00Z',
    serverity: 'Critical',
    message: 'Connection to ZooKeeper lost',
    target: 'zk-node-2',
    status: 'pending',
  },
];

export const Default: Story = { args: { events } };
export const WithAckColumn: Story = { args: { events, showAckColumn: true } };
export const Loading: Story = { args: { events, isLoading: true } };
export const Empty: Story = { args: { events: [], showAckColumn: true } };
