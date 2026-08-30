import type { StatusLevel } from "@/tokens/colors";

const STATUS_LABEL: Record<StatusLevel, string> = {
  normal: "정상",
  warning: "경고",
  critical: "오류",
  info: "정보",
  inactive: "비활성",
};

const STATUS_ICON: Record<StatusLevel, string> = {
  normal: "🟢",
  warning: "🟠",
  critical: "🔴",
  info: "🔵",
  inactive: "⚪",
};

/**
 * 상태 값을 아이콘 + 한글 라벨(예: "🟢 정상")로 표시하는 공통 렌더러.
 * StatusDataTable의 `render` 콜백에 그대로 꽂아 여러 테이블에서 재사용한다.
 *
 * @param status - 표시할 상태 값 (normal/warning/critical/info/inactive)
 * @returns 아이콘과 한글 라벨을 함께 담은 `<span>` 엘리먼트
 */
export function renderStatusIcon(status: StatusLevel) {
  return (
    <span>
      {STATUS_ICON[status]} {STATUS_LABEL[status]}
    </span>
  );
}
