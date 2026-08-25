import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { TimeRangeToggle } from "@/components/layout/TimeRangeToggle";
import type { TopHeaderProps } from "./TopHeader.types";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TopHeader({
  env,
  envOptions,
  onEnvChange,
  pipeline,
  pipelineOptions,
  onPipelineChange,
  autoRefresh,
  onAutoRefreshChange,
  lastRefresh,
  cluster,
  clusterOptions,
  onClusterChange,
  dateRange,
  onDateRangeChange,
  timeUnit,
  onTimeUnitChange,
  systemResponseMs,
  operatorName,
}: TopHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-foreground">
          DL OPS Dashboard
        </span>
        <Select value={env} onValueChange={onEnvChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {envOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={pipeline} onValueChange={onPipelineChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pipelineOptions.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {clusterOptions && (
          <Select value={cluster} onValueChange={onClusterChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Cluster" />
            </SelectTrigger>
            <SelectContent>
              {clusterOptions.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {onDateRangeChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <CalendarIcon className="size-3.5" />
                {dateRange
                  ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                  : "Date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  range?.from &&
                  range?.to &&
                  onDateRangeChange({ from: range.from, to: range.to })
                }
              />
            </PopoverContent>
          </Popover>
        )}
        {onTimeUnitChange && (
          <TimeRangeToggle value={timeUnit} onChange={onTimeUnitChange} />
        )}
      </div>

      <div className="flex items-center gap-4">
        {systemResponseMs !== undefined && (
          <span className="text-xs text-muted-foreground">
            System Response {(systemResponseMs / 1000).toFixed(1)}s
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          Last refresh: {lastRefresh}
        </span>
        <div className="flex items-center gap-2">
          <Switch checked={autoRefresh} onCheckedChange={onAutoRefreshChange} />
          <span className="text-xs text-muted-foreground">Auto Refresh</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-status-info" />
            {operatorName && (
              <span className="text-xs text-foreground">{operatorName}</span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
