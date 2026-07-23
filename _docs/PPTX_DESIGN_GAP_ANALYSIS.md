# PPTX 디자인 목업 vs 실제 구현 — 비교 분석

> 작성일: 2026-07-23
> 비교 대상: `_docs/DataPipeLineDashboard.pptx`(슬라이드 4장, 각 대시보드 풀샷 목업 이미지) vs Phase 6까지 구현된 실제 화면(`npm run dev` + `claude-in-chrome` 브라우저 검증)
> 관련 문서: [PPTX_ALIGNMENT_PLAN.md](./PPTX_ALIGNMENT_PLAN.md)(이 분석을 바탕으로 한 정합화 계획)

---

## 0. 결론 먼저

목업은 **"NOC 관제센터" 스타일의 커스텀 디자인**(네온 글로우, 그라디언트 스파크라인, 고밀도 그리드)이고, 실제 구현은 **shadcn/ui 범용 컴포넌트(Card, Badge, Skeleton 등 Nova 테마)**로 조립했다. `IMPLEMENTATION_GUIDE.md` Phase 0에서 "shadcn init/add(Radix+Nova)"로 이미 방향을 잡았기 때문에, 컴포넌트 단위(카드 하나, 테이블 하나)의 **props 계약과 정보 구조는 스펙과 일치**하지만, 화면 전체의 **비주얼 아이덴티티(밀도·글로우·헤더 구성요소)는 상당히 다르다.** 이는 하루이틀 수정으로 되는 규모가 아니라 디자인 토큰과 일부 컴포넌트 구조 자체를 다시 손봐야 하는 작업이다.

---

## 1. 슬라이드 ↔ 화면 매핑

| 슬라이드 | 대상 화면 | 비교에 사용한 실제 구현 |
|---|---|---|
| `image1.png` | Home (Ch2, `Real-time Data Pipeline Monitoring`) | `src/pages/Home.tsx` |
| `image2.png` | Kafka (Ch3, `Kafka Cluster Detail Monitoring`) | `src/pages/Kafka.tsx` |
| `image3.png` | Spark (Ch4, `Spark Cluster Detail Monitoring`) | `src/pages/Spark.tsx` |
| `image4.png` | PPS/MinIO (Ch5, `PPS Agent Consumer & MinIO Lakehouse Monitoring`) | `src/pages/PpsMinIO.tsx` |

pptx 자체엔 텍스트 레이어가 없고(슬라이드 4장 모두 풀샷 스크린샷 이미지 1장씩만 배치) 각 이미지는 1672×941px.

---

## 2. 항목별 차이

### 2-1. 사이드바 내비게이션

- **목업**: 12개 항목(HOME / 파이프라인 / 데이터소스 / 어댑터 / Kafka / 에이전트 / 저장소 / 쿼리 / AI-Vector / 알림 / 대시보드 / 설정)을 컬러 원 안 아이콘 + 라벨로 촘촘히 나열. 화면별로 강조 아이콘이 다르게 활성화(Kafka 화면에선 Kafka 아이콘, Spark 화면에선 Spark 아이콘 등).
- **실제**: `SideNav`(`src/components/layout/SideNav/SideNav.tsx`)에 4개 항목(Home/Kafka/Spark/PPS-MinIO)뿐, 아이콘도 이모지(🏠📨⚡🪣).
- **원인**: 4개 대시보드 페이지만 라우팅되어 있어 자연스러운 축소지만, 목업이 의도한 하위 화면(파이프라인 상세/데이터소스/어댑터/에이전트/저장소/쿼리 개별 화면)은 애초에 이 프로젝트 스코프(`PLANNING.md`)에 없었다.

### 2-2. 헤더 (`TopHeader`)

| 요소 | 목업 | 실제 (`TopHeader.types.ts`) |
|---|---|---|
| 환경/파이프라인 드롭다운 | ✅ | ✅ |
| 클러스터 선택기 (Kafka/Spark/PPS 화면) | ✅ (`kafka-prod` 등) | ❌ 없음 |
| 날짜 범위 피커 (캘린더 아이콘) | ✅ | ❌ 없음 |
| 시간 단위 퀵버튼 (5m/15m/1H/6H/1D) | ✅ | ❌ 없음 |
| Auto Refresh 토글 | ✅ | ✅ |
| Last Refresh 시각 | ✅ | ✅ |
| System Response 시간 | ✅ (`System Response 2.5s`) | ❌ 없음 |
| Operator 프로필 (이름 + chevron) | ✅ | ▲ 아바타 원만, 이름 텍스트 없음 |

### 2-3. 파이프라인 스테이지 타임라인 (`PipelineStageTimeline`)

- **목업**: 아이콘이 든 컬러 원 → 글로우 그라디언트 연결선(애니메이션 화살표) → 각 스테이지 아래 상태 dot 행(●●●●●, 여러 노드의 개별 상태를 색 점으로 표시).
- **실제**: 숫자만 든 단색 테두리 원 → 단순 텍스트 화살표(`→`)뿐. 아이콘도, 글로우도, 하위 노드 상태 dot도 없음.
- 코드 근거: `PipelineStageTimeline.tsx`는 `border-2` 원 + `&rarr;` 텍스트만 렌더링.

### 2-4. 실시간 파이프라인 흐름도 (Home 2-5) — 구조적으로 가장 큰 차이

- **목업**: **좌→우 가로 배치**. `DATA SOURCE → PPS ADAPTER → KAFKA CLUSTER → ICEBERG SINK`가 왼쪽에서 오른쪽으로 흐르고, `ICEBERG(MinIO) / SPARK / TRINO / Vector DB(Milvus) / AI AGENT`가 그 오른쪽에 이어지는 한 화면짜리 가로 다이어그램.
- **실제**: **위→아래 세로 배치** (8단을 세로로 쌓음, `height={520}`). 스크롤이 훨씬 길어짐.
- **원인**: `PipelineFlowDiagram`(`src/components/flow/PipelineFlowDiagram/PipelineFlowDiagram.tsx`)의 `FlowNodeRenderer`가 `Handle type="target" position={Position.Top}` / `Handle type="source" position={Position.Bottom}`으로 **세로 흐름만** 지원하도록 고정되어 있다. 이는 기존 Spark Master→Worker 트리(Phase 5-2b)와 동일한 패턴을 그대로 재사용한 결과이며, Home 2-5 목업이 요구하는 가로 흐름과는 맞지 않는다.

### 2-5. 밀도 / 스크롤 길이

- **목업**: Home 화면 전체가 거의 1~1.5 뷰포트 안에 들어옴(11개 섹션이 촘촘한 그리드로 압축).
- **실제**: 섹션마다 `SectionPanel`(shadcn `Card` + `CardHeader`/`CardContent` 패딩)이 커서, 브라우저 검증 시 Home/Kafka/Spark/PPS-MinIO 각각 스크롤을 5~6회 해야 끝까지 보임.
- **구체 예**: 목업 KPI 카드는 한 줄에 6~8개, 실제(`grid grid-cols-3` / `grid-cols-4`)는 3~4개.

### 2-6. 브로커/노드 토폴로지 (`TopologyDiagram`)

- **목업**: 고정 좌표에 배치된 소형 노드(원 안에 ID+상태), 별도로 "브로커 상태" 섹션엔 카드형으로 CPU/MEM/DISK가 촘촘히 박혀 있음.
- **실제**: d3-force 물리 시뮬레이션 기반이라 노드 위치가 매 렌더마다 달라지고(Storybook 완료체크에 "드래그 시 물리 시뮬레이션을 따라 재배치"가 의도된 동작으로 명시됨), 배지도 CPU 하나뿐이라 목업 대비 정보 밀도가 낮음.

### 2-7. 색감 / 이펙트

- **목업**: 시안/블루 계열 네온 글로우, 스파크라인 아래 그라디언트 채움, 상태별로 채도 높은 색.
- **실제**: shadcn 기본 다크 테마(`--background: hsl(222 47% 11%)`, `--card: hsl(215 28% 17%)` 등 무채색 계열) — 훨씬 차분하고 플랫함. `SparklineChart`도 `areaStyle opacity: 0.15`로 옅은 채움만 있고 글로우 없음.

---

## 3. 일치하는 부분 (참고용)

모든 게 다른 건 아니다 — 아래는 목업과 실제가 잘 맞아떨어지는 지점:

- KPI 카드 레이아웃(라벨 → 큰 숫자 → delta % → 우측 스파크라인) 자체의 구조는 `KpiCard.tsx`가 목업과 동일한 배치를 따른다.
- 상태별 색상 의미(정상=초록/경고=주황/위험=빨강)는 `STATUS_COLORS` 토큰이 목업의 색 의미와 일치.
- 알림 테이블의 필터 탭(All/Critical/Warning/Info) 구조 일치.
- 각 화면의 섹션 구성 순서(KPI → 다이어그램/토폴로지 → 트렌드 차트 → 테이블 → 알림)는 목업과 실제가 거의 동일한 순서로 배치됨.

즉 **"무엇을 보여줄지"(정보 구조)는 맞고, "어떻게 보여줄지"(비주얼 밀도·이펙트·헤더 부가기능)가 다르다.**
