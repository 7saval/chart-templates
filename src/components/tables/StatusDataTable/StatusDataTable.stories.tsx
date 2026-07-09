import type { Meta, StoryObj } from '@storybook/react';
import { StatusDataTable } from './StatusDataTable';
import type { TableColumn } from './StatusDataTable.types';
import type { StatusLevel } from '@/tokens/colors';

interface BrokerRow extends Record<string, unknown> {
  id: string;
  broker: string;
  status: StatusLevel;
  partitions: number;
  leaderCount: number;
  lagTotal: number;
}

const meta: Meta<typeof StatusDataTable<BrokerRow>> = {
  title: '📋 Tables/StatusDataTable',
  component: StatusDataTable<BrokerRow>,
};
export default meta;
type Story = StoryObj<typeof StatusDataTable<BrokerRow>>;

const columns: TableColumn<BrokerRow>[] = [
  { key: 'broker', header: 'Broker', sortable: true },
  { key: 'status', header: 'Status', statusKey: 'status' },
  { key: 'partitions', header: 'Partitions', sortable: true },
  { key: 'leaderCount', header: 'Leaders', sortable: true },
  {
    key: 'lagTotal',
    header: 'Consumer Lag',
    sortable: true,
    statusKey: 'status',
    render: (value) => (value as number).toLocaleString(),
  },
];

const data: BrokerRow[] = [
  { id: '1', broker: 'kafka-broker-1', status: 'normal', partitions: 42, leaderCount: 14, lagTotal: 1_200 },
  { id: '2', broker: 'kafka-broker-2', status: 'normal', partitions: 40, leaderCount: 13, lagTotal: 3_400 },
  { id: '3', broker: 'kafka-broker-3', status: 'warning', partitions: 38, leaderCount: 12, lagTotal: 210_000 },
  { id: '4', broker: 'kafka-broker-4', status: 'normal', partitions: 41, leaderCount: 15, lagTotal: 8_900 },
  { id: '5', broker: 'kafka-broker-5', status: 'critical', partitions: 35, leaderCount: 9, lagTotal: 540_000 },
];

export const Default: Story = { args: { columns, data } };
export const Loading: Story = { args: { columns, data, isLoading: true } };
export const Empty: Story = { args: { columns, data: [] } };
