import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: '📈 Charts/ECharts/BarChart',
  component: BarChart,
};
export default meta;
type Story = StoryObj<typeof BarChart>;

const categories = ['kafka-broker-1', 'kafka-broker-2', 'kafka-broker-3', 'kafka-broker-4'];
const values = [62, 71, 48, 55];

export const Default: Story = { args: { categories, values, height: 240 } };
export const WithWarning: Story = {
  args: { categories, values: [62, 71, 92, 55], colors: ['#3b82f6', '#3b82f6', '#ef4444', '#3b82f6'], height: 240 },
};
export const Loading: Story = { args: { ...Default.args, isLoading: true } };
export const Empty: Story = { args: { categories: [], values: [], height: 240 } };
