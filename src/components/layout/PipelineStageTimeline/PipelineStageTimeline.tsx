import { STATUS_COLORS } from "@/tokens/colors";
import type { PipelineStage, PipelineStageTimelineProps } from "./PipelineStageTimeline.types";

const GLOW_CLASS: Record<PipelineStage["status"], string> = {
  normal: "shadow-glow-normal",
  warning: "shadow-glow-warning",
  critical: "shadow-glow-critical",
  info: "shadow-glow-info",
  inactive: "shadow-glow-inactive",
};

const MIN_LINES = 1;
const MAX_LINES = 5;
const LINE_HEIGHT = 2;
const LINE_GAP = 3;
const MAX_DURATION_S = 1.6;
const MIN_DURATION_S = 0.5;

function stageMetric(stage: PipelineStage) {
  return stage.volume?.value ?? stage.count;
}

function scale(value: number, min: number, max: number, from: number, to: number) {
  if (max === min) return (from + to) / 2;
  return from + ((value - min) / (max - min)) * (to - from);
}

export function PipelineStageTimeline({ stages }: PipelineStageTimelineProps) {
  const metrics = stages.map(stageMetric);
  const min = Math.min(...metrics);
  const max = Math.max(...metrics);

  return (
    <div className="flex items-stretch overflow-x-auto py-2">
      {stages.map((stage, i) => {
        const next = stages[i + 1];
        const metric = stageMetric(stage);
        const lineCount = Math.max(
          MIN_LINES,
          Math.round(scale(metric, min, max, MIN_LINES, MAX_LINES)),
        );
        const duration = scale(metric, min, max, MAX_DURATION_S, MIN_DURATION_S);
        const fromColor = STATUS_COLORS[stage.status];
        const toColor = next ? STATUS_COLORS[next.status] : fromColor;

        return (
          <div
            key={stage.name}
            className={next ? "flex flex-1 items-center gap-1" : "flex items-center"}
          >
            <div className="flex shrink-0 flex-col items-center gap-1">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-semibold ${GLOW_CLASS[stage.status]}`}
                style={{
                  borderColor: STATUS_COLORS[stage.status],
                  color: STATUS_COLORS[stage.status],
                }}
              >
                {stage.icon ?? stage.count}
              </div>
              <span className="text-xs text-muted-foreground">{stage.name}</span>
              {stage.nodeStatuses && (
                <div className="flex gap-0.5">
                  {stage.nodeStatuses.map((s, idx) => (
                    <span
                      key={idx}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[s] }}
                    />
                  ))}
                </div>
              )}
            </div>
            {next && (
              <div className="relative h-6 min-w-8 flex-1">
                <div
                  className="absolute inset-y-0 left-0 right-2 flex flex-col items-stretch justify-center"
                  style={{
                    gap: LINE_GAP,
                    filter: `drop-shadow(0 0 3px ${fromColor}aa)`,
                  }}
                >
                  {Array.from({ length: lineCount }, (_, li) => (
                    <span
                      key={li}
                      className="pipeline-flow-line block rounded-full"
                      style={{
                        height: LINE_HEIGHT,
                        opacity: Math.max(0.35, 0.95 - li * 0.15),
                        backgroundImage: `repeating-linear-gradient(to right, ${fromColor} 0 6px, transparent 6px 10px)`,
                        animationDuration: `${duration}s`,
                        animationDelay: `${li * 0.12}s`,
                      }}
                    />
                  ))}
                </div>
                <svg
                  width={8}
                  height={10}
                  viewBox="0 0 8 10"
                  className="absolute top-1/2 right-0 -translate-y-1/2"
                  style={{ filter: `drop-shadow(0 0 2px ${toColor}aa)` }}
                >
                  <path
                    d="M1,1 L6,5 L1,9"
                    fill="none"
                    stroke={toColor}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
