import { useEffect, useState } from "react";

export function useAutoRefresh(enabled: boolean, intervalMs: number) {
  const [lastRefresh, setLastRefresh] = useState(() =>
    new Date().toLocaleTimeString(),
  );
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(
      () => setLastRefresh(new Date().toLocaleTimeString()),
      intervalMs,
    );

    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  return lastRefresh;
}
