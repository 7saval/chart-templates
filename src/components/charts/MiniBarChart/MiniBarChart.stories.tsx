import type { Meta, StoryObj } from "@storybook/react";
import { MiniBarChart } from "./MiniBarChart";
import { generateTrendSeries } from "@/mocks/trend";

const meta: Meta<typeof MiniBarChart> = {
  title: "📈 Charts/ECharts/MiniBarChart",
  component: MiniBarChart,
};
export default meta;
type Story = StoryObj<typeof MiniBarChart>;

const throughputTrend = generateTrendSeries(20, { points: 20 });

export const Default: Story = {
  args: {
    data: throughputTrend,
    height: 32,
    status: "normal",
  },
};
export const WithWarning: Story = {
  args: {
    data: throughputTrend,
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
