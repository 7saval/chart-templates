import type { Meta, StoryObj } from "@storybook/react";
import { SectionPanel } from "./SectionPanel";

const meta: Meta<typeof SectionPanel> = {
  title: "📐 Layout/SectionPanel",
  component: SectionPanel,
};
export default meta;
type Story = StoryObj<typeof SectionPanel>;

export const Default: Story = {
  args: {
    title: "Pipeline Throughput",
    legend: [
      { label: "Normal", color: "#22c55e" },
      { label: "Warning", color: "#f97316" },
    ],
    children: (
      <div className="h-40 flex items-center justify-center text-muted-foreground">
        Chart Slot
      </div>
    ),
  },
};
