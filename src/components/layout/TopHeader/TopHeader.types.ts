export interface TopHeaderProps {
  env: string;
  envOptions: string[];
  onEnvChange: (env: string) => void;
  pipeline: string;
  pipelineOptions: string[];
  onPipelineChange: (pipeline: string) => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (v: boolean) => void;
  lastRefresh: string;
}
