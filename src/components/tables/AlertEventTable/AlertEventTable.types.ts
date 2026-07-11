export type AlertServerity = "Critical" | "Warning" | "Info";

export interface AlertEvent {
  id: string;
  timestamp: string;
  serverity: AlertServerity;
  message: string;
  target: string;
  status?: "ack" | "unack" | "pending" | "info";
  detail?: string;
}

export interface AlertEventTableProps {
  events: AlertEvent[];
  showAckColumn?: boolean;
  isLoading?: boolean;
}
