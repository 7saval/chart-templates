import type { Meta, StoryObj } from "@storybook/react";
import { MiniStatCell } from "./MiniStatCell";

const meta: Meta<typeof MiniStatCell> = {
  title: "🧩 Misc/MiniStatCell",
  component: MiniStatCell,
};

export default meta;

type Story = StoryObj<typeof MiniStatCell>;

export const Default: Story = {
  args: { label: "Leader Election (1H)", value: 2 },
};
export const WithUnit: Story = {
  args: {
    label: "Replication Health",
    value: 98.4,
    unit: "%",
    status: "normal",
  },
};
export const Critical: Story = {
  args: {
    label: "Slow/Failed Requests",
    value: 12.3,
    unit: "%",
    status: "critical",
  },
};
export const Loading: Story = {
  args: { label: "Controller Health", value: "-", isLoading: true },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      <MiniStatCell label="Applications" value={18} />
      <MiniStatCell label="Executors" value={42} />
      <MiniStatCell label="Cores" value={168} />
      <MiniStatCell label="Total Memory" value={512} unit="GB" />
    </div>
  ),
};
