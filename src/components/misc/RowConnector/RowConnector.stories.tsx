import { RowConnector } from "./RowConnector";
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta<typeof RowConnector> = {
  title: "🧩 Misc/RowConnector",
  component: RowConnector,
};
export default meta;
type Story = StoryObj<typeof RowConnector>;

export const FourRows: Story = {
  args: {
    count: 4,
  },
};
