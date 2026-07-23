# PPTX 목업 정합화 계획

> 작성일: 2026-07-23
> 목적: [PPTX_DESIGN_GAP_ANALYSIS.md](./PPTX_DESIGN_GAP_ANALYSIS.md)에서 정리한 7개 차이(사이드바/헤더/스테이지 타임라인/흐름도 방향/밀도/토폴로지/색감)를 `_docs/DataPipeLineDashboard.pptx` 목업 수준으로 끌어올리기 위한 단계별 계획.
> 전제: `IMPLEMENTATION_GUIDE.md` Phase 0~6은 이미 완료된 상태(4개 대시보드 페이지, 19개 컴포넌트 모두 구현·조립 완료)이므로, 이 문서는 **기존 컴포넌트를 갈아엎지 않고 점진적으로 강화**하는 방향으로 짠다.

---

## 0. 시작 전 결정해야 할 것 (Open Decisions)

아래 4가지는 구현 순서/범위에 큰 영향을 주므로, Phase A 착수 전에 먼저 답을 정해야 한다. 답이 없으면 기본값(★ 표시)으로 진행할 예정이나, 확인 후 진행을 권장한다.

1. **사이드바 정보구조(IA)를 목업 12항목까지 확장할지, 4항목 그대로 둘지.**
   ★ 기본값: **4항목 유지** — 파이프라인/데이터소스/어댑터/에이전트/저장소/쿼리 등 하위 화면은 라우트 자체가 없어서(스코프 밖), 메뉴만 늘리면 죽은 링크가 된다. 아이콘·스타일만 목업 톤에 맞춘다.
2. **`TopologyDiagram`을 d3-force(현재, 물리 시뮬레이션) 유지할지, 목업처럼 고정 좌표로 바꿀지.**
   ★ 기본값: **d3-force 유지** — Phase 5-0 설계 검토에서 "물리 시뮬레이션으로 드래그 재배치 가능"이 의도된 기능으로 명시됐고 Storybook 완료 체크 항목이기도 함. 대신 배지(CPU/MEM/DISK)를 늘려 정보 밀도만 목업에 맞춘다.
3. **KPI 카드 그리드를 목업처럼 6~8열로 압축할지, 지금처럼 3~4열 유지할지.**
   ★ 기본값: **화면 폭에 따라 5~6열로 확대**(반응형 유지, 완전히 목업과 동일한 8열까지는 안 감 — 실제 브라우저 폭에서 카드 텍스트가 너무 좁아짐).
4. **글로우/네온 이펙트를 CSS 박스섀도우 수준으로만 흉내낼지, 목업처럼 애니메이션 그라디언트 라인까지 구현할지.**
   ★ 기본값: **정적 글로우(box-shadow + border 그라디언트)만** — 애니메이션 흐름 라인은 성능/구현 난이도 대비 효과가 작다고 판단.

---

## Phase A — 디자인 토큰 확장 (글로우, 밀도, 색상)

**목표**: 컴포넌트 코드를 건드리기 전에 토큰 레벨에서 목업 톤을 낼 수 있는 재료를 먼저 준비한다.

### A-1. `src/index.css` `@theme inline`에 글로우/그라디언트 토큰 추가

```css
--shadow-glow-normal: 0 0 12px -2px hsl(142 71% 45% / 0.5);
--shadow-glow-warning: 0 0 12px -2px hsl(38 92% 50% / 0.5);
--shadow-glow-critical: 0 0 12px -2px hsl(0 84% 60% / 0.5);
--shadow-glow-info: 0 0 12px -2px hsl(217 91% 60% / 0.5);
```

`STATUS_COLORS`(`src/tokens/colors.ts`)와 짝이 맞도록 `StatusLevel`별로 하나씩. `PipelineStageTimeline`, `PipelineFlowNode`, `TopologyDiagram` 노드 테두리에 조건부로 적용.

### A-2. 카드 패딩 축소 옵션

`SectionPanel`(`src/components/layout/SectionPanel/SectionPanel.tsx`)의 `CardHeader`/`CardContent`에 `compact?: boolean` prop을 추가해 목업 수준 밀도(패딩 축소, 폰트 1단계 축소)를 opt-in으로 지원. 전면 교체가 아니라 옵션으로 두는 이유: 기존 Storybook 스토리·스냅샷을 깨뜨리지 않기 위함.

### A-3. `SparklineChart` 그라디언트 채움 강화

`areaStyle.opacity`를 0.15 → 0.35 안팎으로 올리고, `color`를 단색 대신 `linearGradient`(위 진하게 → 아래 투명)로 교체. echarts `graphic.LinearGradient` 사용.

**완료 기준**: Storybook에서 기존 스토리들이 색만 살짝 진해질 뿐 레이아웃 깨짐 없이 렌더링.

---

## Phase B — `TopHeader` 부가 기능 추가

**목표**: 목업 헤더의 4개 누락 요소(클러스터 선택기 / 날짜 범위 피커 / 시간 단위 퀵버튼 / System Response) 추가.

### B-1. `TopHeader.types.ts` 확장

```ts
export interface TopHeaderProps {
  // 기존 필드 유지 (env, pipeline, autoRefresh, lastRefresh ...)
  cluster?: string;
  clusterOptions?: string[];
  onClusterChange?: (cluster: string) => void;
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (range: { from: string; to: string }) => void;
  timeUnit?: "5m" | "15m" | "1H" | "6H" | "1D";
  onTimeUnitChange?: (unit: "5m" | "15m" | "1H" | "6H" | "1D") => void;
  systemResponseMs?: number;
  operatorName?: string;
}
```

모두 optional로 둬서 Home 화면(클러스터 선택기 없음)과 Kafka/Spark/PPS 화면(클러스터 선택기 있음)이 같은 컴포넌트를 공유하도록 한다 — P2(props-only reuse) 원칙 유지.

### B-2. UI 구현

- 클러스터 선택기: 기존 `env`/`pipeline`과 동일하게 `Select` 재사용.
- 날짜 범위 피커: shadcn `Calendar` + `Popover` 조합(아직 미설치라면 `npx shadcn add calendar popover`).
- 시간 단위 퀵버튼: `ToggleGroup`(shadcn) 또는 `Button` 5개 `variant="outline"`/`variant="default"` 토글.
- System Response: `lastRefresh` 옆에 `text-xs text-muted-foreground`로 `System Response {ms}ms` 텍스트만 추가(측정 로직은 mock 고정값으로 시작).

### B-3. 페이지별 배선

`App.tsx`에서 페이지 전환 시 `cluster`/`clusterOptions`를 넘기려면 라우트별 상태가 필요 — Home은 `undefined`(클러스터 선택기 자체를 숨김), Kafka/Spark/PPS는 각각 `["kafka-prod"]`/`["spark-prod"]`/`["all"]` 등 mock 옵션을 페이지 컴포넌트가 아니라 `App.tsx`에서 라우트 매칭으로 결정.

**완료 기준**: Storybook `TopHeader` 스토리에 `WithCluster`/`WithoutCluster` 2종 추가, 브라우저에서 4개 페이지 헤더가 목업과 동일한 요소를 갖추는지 확인.

---

## Phase C — `PipelineStageTimeline` 시각 강화

**목표**: 아이콘 + 글로우 연결선 + 하위 상태 dot 행 추가.

### C-1. 타입 확장

```ts
export interface PipelineStage {
  name: string;
  count: number;
  status: StatusLevel;
  icon?: React.ReactNode;       // 신규, optional
  nodeStatuses?: StatusLevel[]; // 신규, optional — 하위 dot 행
}
```

### C-2. 렌더링

- 원 안에 `icon`이 있으면 표시, 없으면 기존처럼 `count` 숫자만(하위 호환).
- 원 `box-shadow`에 Phase A-1 글로우 토큰 적용.
- 연결선(`&rarr;`)을 `<div className="h-px flex-1 bg-gradient-to-r from-{status} to-{nextStatus}">`로 교체.
- `nodeStatuses`가 있으면 원 아래에 `flex gap-0.5`로 작은 dot(`h-1.5 w-1.5 rounded-full`) 행 추가.

**완료 기준**: 기존 호출부(`Home.tsx`의 `homeStages` 등, `icon`/`nodeStatuses` 없이 호출)가 그대로 동작 — breaking change 없음.

---

## Phase D — `PipelineFlowDiagram` 가로 흐름 지원 (Home 2-5)

**목표**: Home 2-5를 목업처럼 좌→우 가로 배치로 전환. 가장 손이 많이 가는 항목.

### D-1. 컴포넌트에 방향 옵션 추가

```ts
export interface PipelineFlowDiagramProps {
  nodes: PipelineFlowNodeType[];
  edges: PipelineFlowEdgeType[];
  height?: number;
  direction?: "vertical" | "horizontal"; // 신규, 기본값 "vertical"(기존 동작 유지)
}
```

`direction === "horizontal"`일 때 `FlowNodeRenderer`의 Handle을 `Position.Left`/`Position.Right`로 전환.

```tsx
<Handle type="target" position={direction === "horizontal" ? Position.Left : Position.Top} .../>
<Handle type="source" position={direction === "horizontal" ? Position.Right : Position.Bottom} .../>
```

- Spark Master→Worker(4-4)는 `direction` 생략(기본 vertical) → **회귀 없음**.
- Home 2-5만 `direction="horizontal"` 사용.

### D-2. `home.mock.ts`의 `homeFlowNodes` 좌표 재배치

현재 8단(y: 0→1050)을 세로로 쌓은 좌표를, 목업처럼 4~5단(x: 0→1600)을 가로로 배치하도록 좌표계 전체 교체. 대략적인 컬럼 매핑:

```
col0 (x=0):    DATA SOURCE (5개, y로 분산)
col1 (x=220):  PPS ADAPTER (2개)
col2 (x=440):  KAFKA CLUSTER (2개)
col3 (x=660):  ICEBERG SINK (2개)
col4 (x=880):  MinIO
col5 (x=1080): SPARK
col6 (x=1280): TRINO / Milvus (2개, y로 분산)
col7 (x=1480): AI AGENT
```

노드 카드 폭이 `w-44`(176px) 고정이므로 컬럼 간격은 최소 200px 이상 유지.

### D-3. `Home.tsx` 배선

```tsx
<PipelineFlowDiagram
  nodes={homeFlowNodes}
  edges={homeFlowEdges}
  direction="horizontal"
  height={420}
/>
```

세로일 때보다 컨테이너가 넓어지므로 `SectionPanel` 폭이 화면을 넘어가면 `overflow-x-auto` 필요 여부 확인.

**완료 기준**: Storybook에서 `PipelineFlowDiagram`에 `Horizontal`/`Vertical` 스토리 2종 추가. Home 2-5가 세로 스크롤 대신 가로로 넓게 배치되는지 브라우저 확인. Spark 4-4(세로)가 기존과 동일하게 렌더링되는지 회귀 확인.

---

## Phase E — 카드 밀도 상향 (KPI 그리드 등)

**목표**: Open Decision #3 기본값(5~6열)에 맞춰 각 페이지의 `grid-cols-N`을 조정.

- `Home.tsx`, `Kafka.tsx`, `Spark.tsx`, `PpsMinIO.tsx`의 KPI 카드 그리드를 `grid-cols-3`/`grid-cols-4` → `grid-cols-5` 또는 `grid-cols-6`(반응형 `md:grid-cols-3 lg:grid-cols-6` 형태)으로 조정.
- `KpiCard.tsx` 자체는 변경 없음(카드 폭이 좁아져도 `truncate`가 이미 라벨 줄바꿈을 막아줌 — Phase E 착수 시 실제로 좁은 폭에서 값이 안 잘리는지 확인 필요).
- Phase A-2에서 만든 `SectionPanel compact` 옵션을 각 `SectionPanel` 호출부에 `compact` 추가해서 전체 스크롤 길이 단축.

**완료 기준**: Home/Kafka/Spark/PPS-MinIO 4개 페이지의 전체 스크롤 높이가 기존 대비 눈에 띄게 줄어드는지(정성적 확인) + 브라우저 좁은 폭(1280px)에서도 카드 내용이 깨지지 않는지 확인.

---

## Phase F — `TopologyDiagram` 정보 밀도 보강

**목표**: Open Decision #2 기본값(d3-force 유지)에 맞춰 레이아웃은 그대로 두고 배지만 보강.

- `TopologyNode.badges`에 CPU 외 `MEM`/`DISK` 배지 추가 (`kafka.mock.ts`/`pps-minio.mock.ts`의 `badges` 배열 확장 — 이미 `badges?: {label, value}[]` 타입이 있으므로 컴포넌트 수정 없이 mock만 확장하면 됨).
- 컨트롤러/특정 노드 강조가 필요하면 `isController` 외에 배지 색상으로 구분(이미 지원됨, mock 데이터만 채우면 됨).

**완료 기준**: Kafka/PPS-MinIO 페이지의 토폴로지 노드에 CPU/MEM/DISK 3종 배지가 모두 표시되는지 확인. **컴포넌트 코드 변경 불필요** — mock 데이터 확장만으로 끝나는 가장 가벼운 Phase.

---

## Phase G — 사이드바 아이콘/톤 정리 (선택)

Open Decision #1 기본값(4항목 유지)에 따라 메뉴 자체는 늘리지 않되:

- 이모지 아이콘(🏠📨⚡🪣) → lucide-react 아이콘(이미 shadcn 의존성에 포함)으로 교체해 목업 톤에 근접.
- `SideNav.tsx`의 active 상태 배경(`bg-status-info/20`)에 Phase A 글로우 토큰 적용.

**완료 기준**: Storybook `SideNav` 스토리 시각 확인.

---

## 진행 순서 요약

```
Phase A  디자인 토큰(글로우/밀도/그라디언트) 준비        — 다른 Phase의 전제조건
Phase B  TopHeader 부가 기능(클러스터/날짜/시간버튼)      — 독립적, A 이후 아무때나
Phase C  PipelineStageTimeline 시각 강화                — A 이후
Phase D  PipelineFlowDiagram 가로 흐름 (Home 2-5)        — 가장 큰 작업, 단독 진행 가능
Phase E  카드 밀도 상향 (그리드 열 수, compact 옵션)      — A 이후, 전 페이지 영향
Phase F  TopologyDiagram 배지 보강                       — mock 데이터만, 아무때나 (가장 가벼움)
Phase G  사이드바 아이콘/톤 (선택)                        — A 이후, 우선순위 낮음
```

Phase F(가장 가벼움) → Phase B/C(독립적) → Phase A 필요 시 병행 → Phase D(가장 무거움) → Phase E → Phase G 순으로 체감 임팩트 대비 비용이 낮은 것부터 처리하는 것을 권장.

각 Phase 종료 시 `npm run storybook`(컴포넌트 단위 회귀 확인) + `npm run dev`(통합 화면에서 목업과 스크린샷 대조)를 번갈아 확인한다.
