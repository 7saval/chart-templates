import type { Meta, StoryObj } from "@storybook/react";
import { Database, Home, MessageSquare, Zap } from "lucide-react";
import { DashboardShell } from "./DashboardShell";
import { TopHeader } from "@/components/layout/TopHeader";
import { SideNav } from "@/components/layout/SideNav";

const meta: Meta<typeof DashboardShell> = {
  title: "📐 Layout/DashboardShell",
  component: DashboardShell,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof DashboardShell>;

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: <Home className="size-4" /> },
  { id: "kafka", label: "Kafka", icon: <MessageSquare className="size-4" /> },
  { id: "spark", label: "Spark", icon: <Zap className="size-4" /> },
  { id: "pps-minio", label: "PPS/MinIO", icon: <Database className="size-4" /> },
];

export const Default: Story = {
  render: () => (
    <DashboardShell
      header={
        <TopHeader
          env="production"
          envOptions={["production", "staging"]}
          onEnvChange={() => {}}
          pipeline="all"
          pipelineOptions={["all", "realtime", "batch"]}
          onPipelineChange={() => {}}
          autoRefresh
          onAutoRefreshChange={() => {}}
          lastRefresh="12:00:00"
        />
      }
      sidebar={<SideNav items={NAV_ITEMS} activeId="home" onSelect={() => {}} />}
    >
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
        Page content slot
      </div>
    </DashboardShell>
  ),
};
