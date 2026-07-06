import type { Meta, StoryObj } from '@storybook/react';
import { StackedBarChart } from './StackedBarChart';

const meta: Meta<typeof StackedBarChart> = {
  title: '📈 Charts/ECharts/StackedBarChart',
  component: StackedBarChart,
};
export default meta;
type Story = StoryObj<typeof StackedBarChart>;

const categories = ['09:00', '09:05', '09:10', '09:15'];
const series = [
  { name: 'Normal', data: categories.map((label) => ({ label, value: 80 })), color: '#22c55e' },
  { name: 'Warning', data: categories.map((label) => ({ label, value: 15 })), color: '#f97316' },
  { name: 'Critical', data: categories.map((label) => ({ label, value: 5 })), color: '#ef4444' },
];

export const Default: Story = { args: { categories, series, height: 240 } };
export const WithWarning: Story = {
  args: {
    categories,
    series: [
      { name: 'Normal', data: categories.map((label) => ({ label, value: 40 })), color: '#22c55e' },
      { name: 'Warning', data: categories.map((label) => ({ label, value: 35 })), color: '#f97316' },
      { name: 'Critical', data: categories.map((label) => ({ label, value: 25 })), color: '#ef4444' },
    ],
    height: 240,
  },
};
export const Loading: Story = { args: { ...Default.args, isLoading: true } };
export const Empty: Story = { args: { categories: [], series: [], height: 240 } };
