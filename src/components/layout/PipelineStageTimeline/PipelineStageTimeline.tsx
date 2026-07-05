import { STATUS_COLORS } from "@/tokens/colors";
import type { PipelineStageTimelineProps } from "./PipelineStageTimeline.types";

export function PipelineStageTimeline({ stages }: PipelineStageTimelineProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {stages.map((stage, i) => (
        <div key={stage.name} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-semibold"
              style={{
                borderColor: STATUS_COLORS[stage.status],
                color: STATUS_COLORS[stage.status],
              }}
            >
              {stage.count}
            </div>
            <span className="text-xs text-muted-foreground">{stage.name}</span>
          </div>
          {i < stages.length - 1 && (
            <span className="text-muted-foreground">&rarr;</span>
          )}
        </div>
      ))}
    </div>
  );
}
