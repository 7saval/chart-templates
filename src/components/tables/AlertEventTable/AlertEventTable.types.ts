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
  /** 상위 컴포넌트가 필터 탭을 직접 렌더링할 때 쓰는 controlled 필터 값. onFilterChange와 함께 넘기면 테이블 내부의 기본 탭 UI는 숨겨진다. */
  filter?: "ALL" | AlertServerity;
  /** filter를 controlled로 쓸 때 함께 전달. 생략하면 내부 상태로 자체 탭 UI를 그린다. */
  onFilterChange?: (value: "ALL" | AlertServerity) => void;
}
