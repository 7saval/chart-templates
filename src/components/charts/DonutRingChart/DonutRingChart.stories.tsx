import type { Meta, StoryObj } from '@storybook/react';
import { DonutRingChart } from './DonutRingChart';

const meta: Meta<typeof DonutRingChart> = {
  title: '📈 Charts/ECharts/DonutRingChart',
  component: DonutRingChart,
};
export default meta;
type Story = StoryObj<typeof DonutRingChart>;

const data = [
  { name: 'Normal', value: 82, color: '#22c55e' },
  { name: 'Warning', value: 11, color: '#f97316' },
  { name: 'Critical', value: 7, color: '#ef4444' },
];

export const Default: Story = { args: { data, height: 240 } };
export const WithWarning: Story = {
  args: {
    data: [
      { name: 'Normal', value: 40, color: '#22c55e' },
      { name: 'Warning', value: 35, color: '#f97316' },
      { name: 'Critical', value: 25, color: '#ef4444' },
    ],
    height: 240,
  },
};
export const Loading: Story = { args: { ...Default.args, isLoading: true } };
export const Empty: Story = { args: { data: [], height: 240 } };
