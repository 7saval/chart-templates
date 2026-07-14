import type { PipelineFlowConnectorProps } from "./PipelineFlowConnector.types";

export function PipelineFlowConnector({
  label,
  isBottleneck,
  width = 60,
  height = 40,
}: PipelineFlowConnectorProps) {
  const midY = height / 2;
  const path = `M0,${midY} C${width * 0.4},${midY} ${width * 0.6},${midY} ${width},${midY}`;
  const color = isBottleneck ? "#ef4444" : "#334155";

  return (
    <svg width={width} height={height}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={isBottleneck ? "4 3" : undefined}
        markerEnd="url(#pipeline-flow-connector-arrow)"
      />
      <defs>
        <marker
          id="pipeline-flow-connector-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      </defs>
      {label && (
        <text
          x={width / 2}
          y={midY - 8}
          textAnchor="middle"
          fontSize={10}
          fill="#94a3b8"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
