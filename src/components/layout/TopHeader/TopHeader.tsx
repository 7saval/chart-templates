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
import type { TopHeaderProps } from "./TopHeader.types";

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
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">
          Last refresh: {lastRefresh}
        </span>
        <div className="flex items-center gap-2">
          <Switch checked={autoRefresh} onCheckedChange={onAutoRefreshChange} />
          <span className="text-xs text-muted-foreground">Auto Refresh</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-status-info" />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
