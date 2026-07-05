import type { Meta, StoryObj } from "@storybook/react";
import { KpiCardCompound } from "./KpiCardCompound";

const meta: Meta<typeof KpiCardCompound> = {
  title: "📊 KPI Cards/KpiCardCompound",
  component: KpiCardCompound,
};
export default meta;
type Story = StoryObj<typeof KpiCardCompound>;

const baseData = {
  label: "Active Alerts",
  value: 14,
  breakdown: [
    { label: "Critical", count: 3, color: "#ef4444" },
    { label: "Warning", count: 11, color: "#f97316" },
  ],
};

export const Default: Story = { args: { data: baseData } };
export const Loading: Story = { args: { data: baseData, isLoading: true } };
export const Empty: Story = { args: { data: { ...baseData, breakdown: [] } } };
