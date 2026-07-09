import type { Meta, StoryObj } from '@storybook/react';
import { TrendLineChart } from './TrendLineChart';
import { TrendLineChartRecharts } from './TrendLineChart.recharts';

const meta: Meta<typeof TrendLineChart> = {
  title: '📈 Charts/ECharts/TrendLineChart',
  component: TrendLineChart,
};
export default meta;
type Story = StoryObj<typeof TrendLineChart>;

const xLabels = ['09:00', '09:05', '09:10', '09:15', '09:20', '09:25'];
const series = [
  { name: 'Producer', data: xLabels.map((l, i) => ({ label: l, value: 100 + i * 5 })), color: '#3b82f6' },
  { name: 'Consumer', data: xLabels.map((l, i) => ({ label: l, value: 90 + i * 4 })), color: '#22c55e' },
];

export const Default: Story = { args: { series, xLabels, height: 240 } };
export const WithWarning: Story = { args: { ...Default.args, error: undefined } };
export const Loading: Story = { args: { ...Default.args, isLoading: true } };
export const Empty: Story = { args: { ...Default.args, series: [] } };

export const RechartsVariant: Story = {
  name: 'recharts (학습 비교)',
  render: (args) => <TrendLineChartRecharts {...args} />,
  args: Default.args,
};
