import { useState } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Home as HomeIcon, MessageSquare, Zap, Database } from "lucide-react";
import { TooltipProvider } from "./components/ui/tooltip";
import { DashboardShell } from "./components/layout/DashboardShell";
import { TopHeader } from "./components/layout/TopHeader";
import { SideNav } from "./components/layout/SideNav";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import Home from "./pages/Home";
import Kafka from "./pages/Kafka";
import Spark from "./pages/Spark";
import PpsMinIO from "./pages/PpsMinIO";
import type { TopHeaderTimeUnit } from "./components/layout/TopHeader/TopHeader.types";

const NAV_ITEMS = [
  { id: "/", label: "Home", icon: <HomeIcon className="size-4" /> },
  { id: "/kafka", label: "Kafka", icon: <MessageSquare className="size-4" /> },
  { id: "/spark", label: "Spark", icon: <Zap className="size-4" /> },
  { id: "/pps-minio", label: "PPS/MinIO", icon: <Database className="size-4" /> },
];

const CLUSTER_OPTIONS_BY_ROUTE: Record<string, string[] | undefined> = {
  "/": undefined,
  "/kafka": ["kafka-prod"],
  "/spark": ["spark-prod"],
  "/pps-minio": ["all"],
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const lastRefresh = useAutoRefresh(autoRefresh, 5000);
  const [clusterState, setCluster] = useState("kafka-prod");
  const [timeUnit, setTimeUnit] = useState<TopHeaderTimeUnit>("15m");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>();
  const clusterOptions = CLUSTER_OPTIONS_BY_ROUTE[location.pathname];
  const cluster = clusterOptions?.includes(clusterState)
    ? clusterState
    : clusterOptions?.[0];

  return (
    <TooltipProvider>
      <DashboardShell
        header={
          <TopHeader
            env="production"
            envOptions={["production", "staging"]}
            onEnvChange={() => {}}
            pipelineOptions={["all", "realtime", "batch"]}
            onPipelineChange={() => {}}
            autoRefresh={autoRefresh}
            onAutoRefreshChange={setAutoRefresh}
            lastRefresh={lastRefresh}
            pipeline="all"
            cluster={cluster}
            clusterOptions={clusterOptions}
            onClusterChange={setCluster}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            timeUnit={timeUnit}
            onTimeUnitChange={setTimeUnit}
            systemResponseMs={2500}
            operatorName="Operator"
          />
        }
        sidebar={
          <SideNav
            items={NAV_ITEMS}
            activeId={location.pathname}
            onSelect={navigate}
          />
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kafka" element={<Kafka />} />
          <Route path="/spark" element={<Spark />} />
          <Route path="/pps-minio" element={<PpsMinIO />} />
        </Routes>
      </DashboardShell>
    </TooltipProvider>
  );
}
