import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: '📊 KPI Cards/KpiCard',
  component: KpiCard,
};
export default meta;
type Story = StoryObj<typeof KpiCard>;

const baseData = {
  label: 'End-to-End Latency',
  value: 4.2,
  unit: 's',
  deltaPct: -3.1,
  compareLabel: 'vs 14:00',
  trend: [5, 4.8, 4.5, 4.6, 4.3, 4.2],
  status: 'normal' as const,
};

export const Default: Story = { args: { data: baseData } };
export const WithWarning: Story = { args: { data: { ...baseData, status: 'warning' } } };
export const Loading: Story = { args: { data: baseData, isLoading: true } };
export const Empty: Story = { args: { data: { ...baseData, trend: undefined } } };
