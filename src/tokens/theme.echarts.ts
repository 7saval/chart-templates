export const DL_OPS_DARK_THEME = {
  backgroundColor: "transparent",
  textStyle: { color: "#e2e8f0" },

  color: ["#3b82f6", "#22c55e", "#f97316", "#ef4444", "#8b5cf6", "#06b6d4"],

  tooltip: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    textStyle: { color: "#e2e8f0" },
  },

  xAxis: {
    axisLine: { lineStyle: { color: "#334155" } },
    axisLabel: { color: "#94a3b8" },
    splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
  },
  yAxis: {
    axisLine: { lineStyle: { color: "#334155" } },
    axisLabel: { color: "#94a3b8" },
    splitLine: { lineStyle: { color: "#1e293b", type: "dashed" } },
  },
} as const;
