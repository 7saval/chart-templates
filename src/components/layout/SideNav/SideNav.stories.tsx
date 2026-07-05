import type { Meta, StoryObj } from "@storybook/react";
import { Database, Home, MessageSquare, Zap } from "lucide-react";
import { SideNav } from "./SideNav";

const meta: Meta<typeof SideNav> = {
  title: "📐 Layout/SideNav",
  component: SideNav,
  decorators: [
    (Story) => (
      <div className="h-80 w-56">
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SideNav>;

const items = [
  { id: "home", label: "Home", icon: <Home className="size-4" /> },
  { id: "kafka", label: "Kafka", icon: <MessageSquare className="size-4" /> },
  { id: "spark", label: "Spark", icon: <Zap className="size-4" /> },
  { id: "pps-minio", label: "PPS/MinIO", icon: <Database className="size-4" /> },
];

export const Default: Story = {
  args: { items, activeId: "home", onSelect: () => {} },
};

export const KafkaActive: Story = {
  args: { items, activeId: "kafka", onSelect: () => {} },
};
