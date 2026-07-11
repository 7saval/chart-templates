import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type {
  AlertEvent,
  AlertEventTableProps,
  AlertServerity,
} from "./AlertEventTable.types";
import { STATUS_COLORS } from "@/tokens/colors";

type AckStatus = NonNullable<AlertEvent["status"]>;

const SERVERITY_COLOR: Record<AlertServerity, string> = {
  Critical: STATUS_COLORS.critical,
  Warning: STATUS_COLORS.warning,
  Info: STATUS_COLORS.info,
};

const STATUS_LABEL: Record<AckStatus, string> = {
  ack: "확인",
  unack: "미확인",
  pending: "확인대기",
  info: "정보",
};

const STATUS_VARIANT: Record<
  AckStatus,
  "secondary" | "destructive" | "outline" | "ghost"
> = {
  ack: "secondary",
  unack: "destructive",
  pending: "outline",
  info: "ghost",
};

export function AlertEventTable({
  events,
  isLoading,
  showAckColumn,
}: AlertEventTableProps) {
  const [filter, setFilter] = useState<"ALL" | AlertServerity>("ALL");

  if (isLoading) return <Skeleton className="h-40 w-full" />;
  const filtered =
    filter === "ALL" ? events : events.filter((e) => e.serverity === filter);

  return (
    <div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="ALL">ALL</TabsTrigger>
          <TabsTrigger value="Critical">Critical</TabsTrigger>
          <TabsTrigger value="Warning">Warning</TabsTrigger>
          <TabsTrigger value="Info">Info</TabsTrigger>
        </TabsList>
      </Tabs>
      <Table className="mt-3">
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Target</TableHead>
            {showAckColumn && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(e.timestamp).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                <Badge
                  style={{ backgroundColor: SERVERITY_COLOR[e.serverity] }}
                  className="text-white"
                >
                  {e.serverity}
                </Badge>
              </TableCell>
              <TableCell>{e.message}</TableCell>
              <TableCell className="text-xs">{e.target}</TableCell>
              {showAckColumn && (
                <TableCell>
                  <Badge variant={STATUS_VARIANT[e.status ?? "unack"]}>
                    {STATUS_LABEL[e.status ?? "unack"]}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
