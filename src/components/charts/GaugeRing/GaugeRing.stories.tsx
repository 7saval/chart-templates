import type { Meta, StoryObj } from '@storybook/react';
import { GaugeRing } from './GaugeRing';

const meta: Meta<typeof GaugeRing> = {
  title: '📈 Charts/ECharts/GaugeRing',
  component: GaugeRing,
};
export default meta;
type Story = StoryObj<typeof GaugeRing>;

export const Default: Story = { args: { value: 62, warningThreshold: 80, unit: '%', height: 200 } };
export const WithWarning: Story = { args: { value: 88, warningThreshold: 80, unit: '%', height: 200 } };
export const Loading: Story = { args: { ...Default.args, isLoading: true } };
export const Empty: Story = { args: { value: 0, warningThreshold: 80, unit: '%', height: 200 } };
