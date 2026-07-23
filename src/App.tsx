import { useState } from "react";
import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { DashboardShell } from "./components/layout/DashboardShell";
import { TopHeader } from "./components/layout/TopHeader";
import { SideNav } from "./components/layout/SideNav";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import Home from "./pages/Home";
import Kafka from "./pages/Kafka";
import Spark from "./pages/Spark";
import PpsMinIO from "./pages/PpsMinIO";

const NAV_ITEMS = [
  { id: "/", label: "Home", icon: <span>🏠</span> },
  { id: "/kafka", label: "Kafka", icon: <span>📨</span> },
  { id: "/spark", label: "Spark", icon: <span>⚡</span> },
  { id: "/pps-minio", label: "PPS/MinIO", icon: <span>🪣</span> },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const lastRefresh = useAutoRefresh(autoRefresh, 5000);

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
