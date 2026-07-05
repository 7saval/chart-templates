import type { Meta, StoryObj } from "@storybook/react";
import { ProgressKpiCard } from "./ProgressKpiCard";

const meta: Meta<typeof ProgressKpiCard> = {
  title: "📊 KPI Cards/ProgressKpiCard",
  component: ProgressKpiCard,
};
export default meta;
type Story = StoryObj<typeof ProgressKpiCard>;

const baseData = {
  label: "HPA Replica Usage",
  value: 6,
  total: 10,
  usedPct: 60,
};

export const Default: Story = { args: { data: baseData } };
export const WithWarning: Story = { args: { data: { ...baseData, value: 8, usedPct: 80 } } };
export const Critical: Story = { args: { data: { ...baseData, value: 10, usedPct: 95 } } };
export const Loading: Story = { args: { data: baseData, isLoading: true } };
