import type { Meta, StoryObj } from "@storybook/react";
import { SparklineChart } from "./SparklineChart";

const meta: Meta<typeof SparklineChart> = {
  title: "📈 Charts/ECharts/SparklineChart",
  component: SparklineChart,
};
export default meta;
type Story = StoryObj<typeof SparklineChart>;

const latencyTrend = [10, 12, 9, 14, 13, 16, 15, 18, 17, 20];

// export const Default: Story = { args: { data: latencyTrend, height: 32, status: 'normal' } };
// export const WithWarning: Story = { args: { data: latencyTrend, height: 32, status: 'warning' } };
// export const Loading: Story = { args: { data: [], height: 32, status: 'info' } };
// export const Empty: Story = { args: { data: [], height: 32, status: 'inactive' } };
export const Default: Story = {
  args: {
    data: latencyTrend,
    height: 32,
    status: "normal",
  },
};
export const WithWarning: Story = {
  args: {
    data: latencyTrend,
    height: 32,
    status: "warning",
  },
};
export const Loading: Story = {
  args: { data: [], height: 32, status: "info" },
};
export const Empty: Story = {
  args: { data: [], height: 32, status: "normal" },
};
