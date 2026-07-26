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
   > **번복 (2026-07-26)**: `PipelineStageTimeline`에 한해 애니메이션 흐름 라인까지 구현했다. Phase C-3에서 실현 가능성을 다시 검토한 결과 구현 난이도가 낮다고 판단됐고, 이후 실제 목업 이미지 대조 결과 유량을 "선 개수"로 표현하는 것이 핵심 디테일이라 정적 글로우만으로는 대체가 안 됐다. 자세한 내용은 Phase C 참고.

---

## Phase A — 디자인 토큰 확장 (글로우, 밀도, 색상) ✅ 구현 완료 (2026-07-26)

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

> ✅ A-1(글로우 토큰)은 `color-mix(in srgb, var(--status-*) 50%, transparent)`로 구현(스펙의 하드코딩 hsl 대신 기존 `--status-*` 변수 재사용, `inactive` 레벨도 추가). A-2(`SectionPanel compact`)·A-3(`SparklineChart` 그라디언트) 모두 스펙대로 구현 완료.

---

## Phase B — `TopHeader` 부가 기능 추가 ✅ 구현 완료 (2026-07-26)

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

> ✅ `dateRange`는 `{from: string; to: string}` 대신 `{from: Date; to: Date}`로 구현(shadcn `Calendar`가 `Date` 객체 기반이라 타입을 맞춤). 라우트 전환 시 `cluster` 값이 새 `clusterOptions`에 없으면 빈 값으로 보이는 버그를 발견해 `App.tsx`에서 폴백 로직 추가(문제 3, 7/26 devlog 참고).

---

## Phase C — `PipelineStageTimeline` 시각 강화 ✅ 구현 완료 (2026-07-26)

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

### C-3. 연결선 흐름 애니메이션 + 유량 표현 (검토 완료, 2026-07-26)

**결론**: React Flow가 아니라 순수 SVG로 구현. `PipelineFlowDiagram`(React Flow 기반)은 `animated: true`로 흐름 애니메이션이 내장돼 있지만, 이 컴포넌트는 노드 5~8개짜리 단순 수평 배열이라 라이브러리 오버헤드가 불필요 — 이미 같은 패턴을 쓰는 `PipelineFlowConnector.tsx`(SVG `<path>` + 화살표 마커)를 확장하는 쪽이 신규 의존성 없이 더 가볍다.

- C-2의 연결선(`bg-gradient-to-r` div)을 SVG `<path>`로 교체 — `PipelineFlowConnector` 패턴 재사용.
- **흐르는 애니메이션**: `stroke-dasharray` + `stroke-dashoffset` CSS keyframe(`index.css`에 `@keyframes flow-dash` 추가). `tw-animate-css`가 이미 설치돼 있어 신규 패키지 불필요. `prefers-reduced-motion`일 때 애니메이션 정지 처리 필요.
- **데이터 양 → 선의 굵기/밀도**: `stage.count`를 도메인으로 `strokeWidth`를 스케일링(예: 1.5~6px 클램프). 대시 밀도·애니메이션 속도도 같이 비례시키면 "흐르는 양"이 더 체감됨.
- 색상은 신규 토큰 없이 기존 `STATUS_COLORS` 재사용.

**유량 기준 결론 (2026-07-26)**: `count`(개체 수)를 재사용하지 않고 별도 `volume` optional 필드를 추가한다.

- 일반적인 파이프라인 유량 모니터링(Kafka Manager, Confluent Control Center, Grafana 등)에서는 **처리량(throughput)** — 초당 레코드 수(`msg/s`) 또는 초당 바이트(`MB/s`) — 를 선 굵기/흐름 밀도로 표현한다. 컨슈머 랙(backlog) 같은 적체 지표는 "병목"을 뜻하므로 굵기가 아니라 색상(빨강 강조)으로 별도 표시하는 게 일반적.
- 이 프로젝트의 `PipelineStage.count`는 실제로는 **개체 수**다 — `kafka.mock.ts` 기준 Partition 612, Broker 5, Consumer Group 45처럼 "몇 개 있냐"이지 "초당 얼마나 흐르냐"가 아니다. 파티션이 많다고 그 구간에 데이터가 더 흐르는 건 아니므로 선 굵기 소스로 재사용하면 의미가 어긋난다.
- `kafka.mock.ts`에는 이미 처리량 지표가 별도로 존재한다: `Cluster Throughput 842 MB/s`, `producer-cdc-kovis 420 msg/s`, 토픽별 `throughput: "62 MB/s"` 등. `volume` 필드는 **해당 스테이지에서 다음 스테이지로 초당 흘러가는 처리량(msg/s 또는 MB/s)** 을 가리키며, 각 페이지 mock에 이미 있는 throughput 값을 재사용해서 채운다.

```ts
export interface PipelineStage {
  name: string;
  count: number;
  status: StatusLevel;
  volume?: number; // 신규, optional — 다음 스테이지로의 처리량(msg/s 또는 MB/s), 연결선 굵기/흐름 밀도에 사용
}
```

**남은 미결정 사항 결론 (2026-07-26)**

- **단위(`msg/s`/`MB/s`) 통일 여부 → 혼용 유지.** mock 데이터를 확인해보면 같은 페이지 안에서도 스테이지 성격에 따라 단위가 이미 다르다 — `kafka.mock.ts`는 producer가 `msg/s`, 토픽/클러스터가 `MB/s`; `pps-minio.mock.ts`는 MinIO가 `GB/s`; `spark.mock.ts`는 ETL 스테이지가 `Rows/s`. 이건 실수가 아니라 스테이지의 실제 성격을 반영한 자연스러운 단위이며, 하나로 강제 통일하려면 "메시지 1개=몇 바이트" 같은 임의의 환산 가정이 필요한데 어떤 mock에도 그런 모델이 없다. 그래서 `volume`은 기존 mock 컨벤션(`{ label, value, unit }`)과 동일하게 `{ value: number; unit: string }`로 유지하고, 선 굵기는 절대값이 아니라 **같은 타임라인 안 스테이지들끼리의 상대적 min-max 스케일**로 계산한다 — 단위가 달라도 "이 안에서 상대적으로 굵은가"만 표현하면 되므로 문제되지 않는다.
- **마지막 스테이지의 `volume` 처리 → 별도 분기 불필요.** 현재 렌더링 로직(`i < stages.length - 1`일 때만 커넥터 렌더)은 항상 "현재 순회 중인 stage(source)"를 기준으로 커넥터를 그린다. `volume`을 **source stage 기준(= 이 스테이지가 다음 스테이지로 내보내는 처리량)** 으로 정의하면 lookahead 없이 `stage.volume`만 읽으면 되어 구현이 단순해지고, `producer-cdc-kovis 420 msg/s`처럼 기존 throughput 표기도 "이 노드가 뭘 내보내는지" 기준이라 의미적으로도 일치한다. 마지막 스테이지는 애초에 그 뒤에 그릴 커넥터가 없으므로 `volume` 값이 있든 없든 읽히지 않는다 — 무시/사용 여부를 별도로 분기할 필요가 없다.

```ts
export interface PipelineStage {
  name: string;
  count: number;
  status: StatusLevel;
  volume?: { value: number; unit: string }; // 신규, optional — 다음 스테이지로의 처리량(source 기준), 연결선 굵기는 타임라인 내 상대(min-max) 스케일로 계산
}
```

### C-4. 실제 구현 결과 — 스펙에서 두 차례 더 진화 (2026-07-26)

위 C-3 스펙(고정폭 SVG `<path>` + `strokeWidth` 스케일링)으로 1차 구현한 뒤, 실사용 과정에서 두 가지가 더 바뀌었다.

- **고정폭 SVG → `flex-1` 가변폭 CSS 라인**: 노드 개수가 적은 화면(Home 5개 스테이지)에서 커넥터가 고정 48px라 전체가 왼쪽으로 뭉쳐 보이는 문제가 발견돼, SVG `<path>` 대신 `flex-1` div + CSS 그라디언트/`repeating-linear-gradient` 배경으로 재구현. 노드 개수와 무관하게 항상 컨테이너 폭을 꽉 채운다.
- **선 굵기 스케일링 → 선 개수(1~5개) 스케일링**: `_docs/DataPipeLineDashboard.pptx` 원본 이미지를 직접 열어 대조한 결과, 목업은 굵기가 변하는 선 하나가 아니라 **가는 선 여러 개가 다발로 흐르는 스트림**이었다. 유량을 `strokeWidth`가 아니라 **선 개수**(`Math.round(scale(metric, min, max, 1, 5))`)로 매핑하도록 재구현했고, 화살표도 채워진 삼각형에서 목업과 같은 `›` 모양 outline chevron으로 교체.
- 구현 중 SVG 관련 버그 2건도 발견해 수정: 마커가 `strokeWidth`에 비례 확대되던 문제(`markerUnits="userSpaceOnUse"`), 완전 수평선이라 `objectBoundingBox` 그라디언트가 무효 처리되던 문제(`gradientUnits="userSpaceOnUse"`). 최종 구현(다발 스트림)은 이 문제들 자체를 SVG stroke 대신 CSS 배경으로 대체하며 우회했다.

자세한 트러블슈팅은 `_docs/dev-log/2026-07-26.md` 참고.

---

## Phase D — `PipelineFlowDiagram` 가로 흐름 지원 (Home 2-5) ✅ 구현 완료 (2026-07-26)

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

> ✅ 스펙대로 구현. `nodeTypes` 객체를 렌더마다 새로 만들면 React Flow가 매번 새 타입으로 인식하는 문제가 있어 `useMemo`로 감싸는 처리가 추가로 필요했다. Spark 4-4 회귀 없음, Home 2-5 가로 배치 브라우저 확인 완료.

---

## Phase E — 카드 밀도 상향 (KPI 그리드 등) ✅ 구현 완료 (2026-07-26)

**목표**: Open Decision #3 기본값(5~6열)에 맞춰 각 페이지의 `grid-cols-N`을 조정.

- `Home.tsx`, `Kafka.tsx`, `Spark.tsx`, `PpsMinIO.tsx`의 KPI 카드 그리드를 `grid-cols-3`/`grid-cols-4` → `grid-cols-5` 또는 `grid-cols-6`(반응형 `md:grid-cols-3 lg:grid-cols-6` 형태)으로 조정.
- `KpiCard.tsx` 자체는 변경 없음(카드 폭이 좁아져도 `truncate`가 이미 라벨 줄바꿈을 막아줌 — Phase E 착수 시 실제로 좁은 폭에서 값이 안 잘리는지 확인 필요).
- Phase A-2에서 만든 `SectionPanel compact` 옵션을 각 `SectionPanel` 호출부에 `compact` 추가해서 전체 스크롤 길이 단축.

**완료 기준**: Home/Kafka/Spark/PPS-MinIO 4개 페이지의 전체 스크롤 높이가 기존 대비 눈에 띄게 줄어드는지(정성적 확인) + 브라우저 좁은 폭(1280px)에서도 카드 내용이 깨지지 않는지 확인.

> ✅ "KPI 카드 그리드"로 주석된 섹션만 `grid-cols-2 md:grid-cols-4 xl:grid-cols-6` 반응형으로 확대(스펙의 `md:grid-cols-3 lg:grid-cols-6` 대신 실제 항목 수에 맞춰 조정 — 항목이 3개뿐인 Home 메인 KPI는 컬럼을 늘려봐야 빈 칸만 늘어서 그대로 둠). 모든 `SectionPanel`에 `compact` 적용. **미완료**: 1280px 좁은 폭 실측은 `resize_window` 도구가 이 환경에서 뷰포트를 바꾸지 못해 못 했음(구조적으로 기존보다 안전하다고 판단은 했음).

---

## Phase F — `TopologyDiagram` 정보 밀도 보강 ✅ 구현 완료 (2026-07-26, 가운데 정렬 수정 포함)

**목표**: Open Decision #2 기본값(d3-force 유지)에 맞춰 레이아웃은 그대로 두고 배지만 보강.

- `TopologyNode.badges`에 CPU 외 `MEM`/`DISK` 배지 추가 (`kafka.mock.ts`/`pps-minio.mock.ts`의 `badges` 배열 확장 — 이미 `badges?: {label, value}[]` 타입이 있으므로 컴포넌트 수정 없이 mock만 확장하면 됨).
- 컨트롤러/특정 노드 강조가 필요하면 `isController` 외에 배지 색상으로 구분(이미 지원됨, mock 데이터만 채우면 됨).

**완료 기준**: Kafka/PPS-MinIO 페이지의 토폴로지 노드에 CPU/MEM/DISK 3종 배지가 모두 표시되는지 확인. **컴포넌트 코드 변경 불필요** — mock 데이터 확장만으로 끝나는 가장 가벼운 Phase.

> ✅ "컴포넌트 코드 변경 불필요" 전제가 실제와 달랐다 — `TopologyDiagram.tsx`가 `badges` 타입만 갖고 있고 실제로는 렌더링하지 않아서 d3 `<text class="badge">` 로직을 새로 추가해야 했다. mock(CPU/MEM/DISK 3종)과 컴포넌트 렌더링 모두 완료.
>
> **추가 작업 (스펙 외, 2026-07-26)**: Kafka "Broker Cluster Topology"/PPS-MinIO "MinIO Cluster Topology"가 넓은 패널 안에서 고정폭 SVG라 왼쪽으로 쏠려 보이는 문제를 발견해 `<div className="flex justify-center">`로 감싸 가운데 정렬. 겸사겸사 tick 핸들러의 baseline `any` 타입 4건도 `SimLink = d3.SimulationLinkDatum<SimNode>` 타입 신설로 근본 수정(7/23 devlog부터 이월되던 이슈).

---

## Phase G — 사이드바 아이콘/톤 정리 (선택) ✅ 구현 완료 (2026-07-26, 폭 축소 포함)

Open Decision #1 기본값(4항목 유지)에 따라 메뉴 자체는 늘리지 않되:

- 이모지 아이콘(🏠📨⚡🪣) → lucide-react 아이콘(이미 shadcn 의존성에 포함)으로 교체해 목업 톤에 근접.
- `SideNav.tsx`의 active 상태 배경(`bg-status-info/20`)에 Phase A 글로우 토큰 적용.

**완료 기준**: Storybook `SideNav` 스토리 시각 확인.

> ✅ 이모지 → lucide 아이콘 교체 시, `SideNav.stories.tsx`가 이미 `Home/MessageSquare/Zap/Database` 조합을 쓰고 있던 걸 발견해 그 컨벤션에 맞춰 통일. active 상태 글로우 적용도 완료.
>
> **추가 작업 (스펙 외, 2026-07-26)**: 사이드바를 PPTX 목업처럼 아이콘 위·라벨 아래 세로 배치의 좁은 레일 형태로 바꿔달라는 별도 요청을 받아, `SideNav.tsx` 버튼을 `flex flex-col items-center`로 전환하고 `DashboardShell.tsx`의 사이드바 컬럼 폭을 `240px → 84px`로 축소(Open Decision #1 "4항목 유지"는 그대로, 폭만 축소).

---

## 진행 순서 요약

```
Phase A  디자인 토큰(글로우/밀도/그라디언트) 준비        — 다른 Phase의 전제조건                    ✅ 완료 (2026-07-26)
Phase B  TopHeader 부가 기능(클러스터/날짜/시간버튼)      — 독립적, A 이후 아무때나                   ✅ 완료 (2026-07-26)
Phase C  PipelineStageTimeline 시각 강화                — A 이후                                  ✅ 완료 (2026-07-26)
Phase D  PipelineFlowDiagram 가로 흐름 (Home 2-5)        — 가장 큰 작업, 단독 진행 가능              ✅ 완료 (2026-07-26)
Phase E  카드 밀도 상향 (그리드 열 수, compact 옵션)      — A 이후, 전 페이지 영향                    ✅ 완료 (2026-07-26, 1280px 실측 미완료)
Phase F  TopologyDiagram 배지 보강                       — mock 데이터만, 아무때나 (가장 가벼움)      ✅ 완료 (2026-07-26)
Phase G  사이드바 아이콘/톤 (선택)                        — A 이후, 우선순위 낮음                     ✅ 완료 (2026-07-26)
```

Phase F(가장 가벼움) → Phase B/C(독립적) → Phase A 필요 시 병행 → Phase D(가장 무거움) → Phase E → Phase G 순으로 체감 임팩트 대비 비용이 낮은 것부터 처리하는 것을 권장.

각 Phase 종료 시 `npm run storybook`(컴포넌트 단위 회귀 확인) + `npm run dev`(통합 화면에서 목업과 스크린샷 대조)를 번갈아 확인한다.

**전체 7개 Phase 구현 완료 (2026-07-26)**. 상세 진행 로그는 `_docs/dev-log/2026-07-26.md` 참고. 남은 항목: Phase E의 1280px 좁은 폭 실측, 레포 전역 `storybook/no-renderer-packages` lint 정리 여부 판단.
