import { useEffect, useState } from "react";

export function useAutoRefresh(enabled: boolean, intervalMs: number) {
  const [lastRefresh, setLastRefresh] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setLastRefresh(new Date()), intervalMs);

    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  return lastRefresh;
}
