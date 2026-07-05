# Chart Templates — 구현 플래닝

> DL OPS Dashboard 스펙 기반 공통 차트 컴포넌트 라이브러리  
> React + Vite + ECharts · shadcn/ui · Storybook 공유 · 멀티 라이브러리 확장 설계

---

## 목차

1. [프로젝트 목적 & 범위](#1-프로젝트-목적--범위)
2. [아키텍처 결정](#2-아키텍처-결정)
3. [기술 스택](#3-기술-스택)
4. [shadcn/ui 역할 분담](#4-shadcnui-역할-분담)
5. [차트 라이브러리 비교 & 전략](#5-차트-라이브러리-비교--전략)
6. [디렉토리 구조](#6-디렉토리-구조)
7. [컴포넌트 카탈로그](#7-컴포넌트-카탈로그)
8. [TypeScript 데이터 계약](#8-typescript-데이터-계약)
9. [디자인 토큰 시스템](#9-디자인-토큰-시스템)
10. [Storybook 운영 전략](#10-storybook-운영-전략)
11. [FSD 프로젝트에서 가져다 쓰는 방법](#11-fsd-프로젝트에서-가져다-쓰는-방법)
12. [구현 페이즈](#12-구현-페이즈)
13. [컴포넌트별 라이브러리 배정표](#13-컴포넌트별-라이브러리-배정표)

---

## 1. 프로젝트 목적 & 범위

### 목적

| 구분 | 내용 |
|------|------|
| 실무 목적 | DL OPS Dashboard 4개 화면의 차트·카드·테이블을 재사용 가능한 독립 컴포넌트로 추출, 어떤 프로젝트에서도 복사해서 쓸 수 있는 템플릿 |
| 학습 목적 | ECharts, D3.js, recharts 등 실무 차트 라이브러리를 동일 props 인터페이스 위에서 비교·체득 |
| 공유 목적 | Storybook으로 디자이너·기획팀과 컴포넌트 스펙/상태 공유 |

### 범위 (DL OPS Dashboard 스펙 기준)

- **레이아웃**: DashboardShell, TopHeader, SideNav, SectionPanel, PipelineStageTimeline
- **KPI 카드**: KpiCard, KpiCardCompound, ProgressKpiCard
- **차트**: SparklineChart, TrendLineChart, BarChart, StackedBarChart, DonutRingChart, GaugeRing
- **파이프라인 시각화**: PipelineFlowNode, PipelineFlowConnector
- **테이블**: StatusDataTable, AlertEventTable
- **기타 시각화**: TopologyDiagram, MiniStatCell, RankedList

### 범위 외

- 실제 API 연동 (컴포넌트는 props / mock 데이터만 처리)
- 인증·권한 로직
- 배포 파이프라인

---

## 2. 아키텍처 결정

### 이 프로젝트: CBA (Component-Based Architecture)

chart-templates는 **컴포넌트 라이브러리 프로젝트**이므로 CBA를 적용한다.  
FSD는 애플리케이션 아키텍처로, features/entities/pages 간 의존성 방향을 제어하는 것이 목적이다.  
이 프로젝트에는 features도, entities도, pages도 없으므로 FSD를 적용하면 대부분의 레이어가 비어있는 형식적 구조가 된다.

| FSD 레이어 | chart-templates에 해당하는가? | 이유 |
|-----------|-------------------------|------|
| `app/` | ✗ | Storybook이 앱 레이어 역할을 대신함 |
| `pages/` | ✗ (Storybook story로 대체) | 대시보드 조립은 실제 프로젝트의 역할 |
| `widgets/` | ✗ | 도메인 컨텍스트 없음 |
| `features/` | ✗ | 사용자 인터랙션 시나리오 단위 없음 |
| `entities/` | ✗ | 비즈니스 도메인 모델은 실제 프로젝트에 귀속 |
| `shared/ui/` | ✓ | **차트 컴포넌트 전체가 바로 이것** |

**결론:** chart-templates의 `src/components/` 전체가 FSD의 `shared/ui/`에 해당하는 레이어다.  
따라서 이 프로젝트는 `shared/ui/` 내부 구조만 정의하면 되고, 그 방식이 CBA다.

### CBA 핵심 규칙

- 모든 컴포넌트는 **독립적**: 어디에 붙여도 동작
- 각 컴포넌트 폴더에 구현·타입·스토리·테스트를 **코로케이션**
- props만 주입받고, 로딩/에러/빈 상태를 자기 자신이 처리
- 비즈니스 로직 없음: 순수 UI + 데이터 렌더링만

### 실제 프로젝트(FSD)와의 관계

```
chart-templates (CBA, 라이브러리)
  src/components/charts/TrendLineChart/
          ↓ 복사 or path import
실제 프로젝트 (FSD)
  src/shared/ui/charts/TrendLineChart/
```

shadcn/ui를 양쪽에서 동일하게 쓰기 때문에 스타일 시스템(Tailwind + CSS 변수)도 마찰 없이 그대로 이식된다.

---

## 3. 기술 스택

### 코어

```
React 18 + TypeScript 5
Vite 5                        빌드 & 개발 서버
Tailwind CSS 3                스타일링 (shadcn/ui 의존)
shadcn/ui                     기본 UI 프리미티브 (Card, Table, Tabs, Progress 등)
ECharts 5 + echarts-for-react 메인 차트 엔진
Storybook 8                   컴포넌트 문서화 & 공유
```

### 보조 (차트 학습·확장)

```
recharts             React-native 선언형 차트 API, ECharts와 동일 props로 비교 학습
D3.js                노드-링크 다이어그램 (TopologyDiagram, PipelineFlowConnector)
@tanstack/react-table StatusDataTable 정렬·필터 헤드리스 로직
```

### shadcn/ui가 제공하는 것 (직접 구현 불필요)

```
Card, CardHeader, CardContent   KPI 카드 껍데기
Table, TableHeader, TableRow    테이블 구조
Tabs, TabsList, TabsTrigger     AlertEventTable 심각도 필터
Progress                        ProgressKpiCard 진행 바
Badge                           심각도 라벨 (Critical / Warning / Info)
Skeleton                        로딩 상태
Select, DropdownMenu            TopHeader 필터 드롭다운
Switch                          Auto Refresh 토글
Tooltip                         차트 외부 툴팁
ScrollArea                      SideNav 스크롤
Separator                       섹션 구분선
```

---

## 4. shadcn/ui 역할 분담

### 핵심 원칙

> shadcn/ui가 이미 잘 만들어놓은 것은 재구현하지 않는다.  
> **chart-templates의 고유 가치 = ECharts/D3 차트 래퍼 + 대시보드 특화 조합 컴포넌트**

### 레이어 구분

```
┌─────────────────────────────────────────────────┐
│         chart-templates 고유 구현 영역           │
│                                                 │
│  ECharts 래퍼     D3 시각화       조합 컴포넌트  │
│  ───────────      ──────────      ────────────  │
│  TrendLineChart   TopologyDiagram KpiCard       │
│  BarChart         FlowConnector   KpiCardCompound│
│  DonutRingChart                  ProgressKpiCard│
│  GaugeRing                       PipelineFlow   │
│  SparklineChart                  StatusDataTable│
│                                  AlertEventTable│
├─────────────────────────────────────────────────┤
│              shadcn/ui 프리미티브 레이어          │
│                                                 │
│  Card  Table  Tabs  Progress  Badge  Skeleton   │
│  Select  Switch  Tooltip  DropdownMenu  Badge   │
└─────────────────────────────────────────────────┘
```

### 컴포넌트별 shadcn/ui 활용

| 차트 템플릿 컴포넌트 | 내부적으로 쓰는 shadcn/ui |
|-----------------|----------------------|
| `KpiCard` | `Card`, `CardContent`, `Badge` (상태 표시), `Skeleton` |
| `KpiCardCompound` | `Card`, `CardContent`, `Badge` |
| `ProgressKpiCard` | `Card`, `CardContent`, `Progress`, `Badge` |
| `StatusDataTable` | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` + TanStack Table 로직 |
| `AlertEventTable` | `Table`, `Tabs`, `TabsList`, `TabsTrigger`, `Badge` |
| `TopHeader` | `Select` (env/pipeline 필터), `Switch` (Auto Refresh), `DropdownMenu` (operator 프로필) |
| `SideNav` | `ScrollArea`, `Separator`, `Tooltip` (아이콘 툴팁) |
| `SectionPanel` | `Card`, `CardHeader`, `CardContent` |
| `PipelineFlowNode` | `Card`, `Badge`, `Skeleton` |
| `MiniStatCell` | `Badge` (선택) |

### shadcn/ui 설치 전략

차트 템플릿 자체에 shadcn/ui를 설치하고,  
실제 FSD 프로젝트도 shadcn/ui를 쓰므로 컴포넌트 복사 시 스타일 시스템이 그대로 호환된다.

```bash
# 프로젝트 초기화 시
npx shadcn@latest init          # tailwind.config, globals.css, cn() 유틸 셋업
npx shadcn@latest add card table tabs progress badge skeleton select \
  dropdown-menu switch tooltip scroll-area separator
```

---

## 5. 차트 라이브러리 비교 & 전략

### 라이브러리 비교

| 항목 | ECharts (echarts-for-react) | recharts | D3.js |
|------|-----------------------------|----------|-------|
| 성숙도 | ★★★★★ (Apache, 18년) | ★★★★ (React-native) | ★★★★★ (저수준 표준) |
| 번들 크기 | ~900KB (tree-shake 시 ~300KB) | ~300KB | ~570KB |
| 다크 테마 | 내장 theme 객체 지원 | CSS props 직접 제어 | 완전 수동 |
| 실시간 데이터 | `setOption` + `notMerge` 지원 | state re-render | 직접 구현 |
| 커스텀 자유도 | 높음 (렌더러 교체 가능) | 중간 | 최고 (SVG 완전 제어) |
| 학습 곡선 | 중간 (option 객체 패턴) | 낮음 (JSX) | 높음 (수학·SVG 직접) |
| 실무 채택 | 금융·모니터링 대형 프로젝트 | 스타트업·대시보드 | 데이터 저널리즘·고급 시각화 |

### 전략 결정

```
메인: ECharts (echarts-for-react)
  → 모든 차트 컴포넌트의 1차 구현
  → DL OPS 다크 테마를 theme 객체로 관리

학습 브랜치: recharts
  → TrendLineChart, BarChart, DonutRingChart를 동일 props 인터페이스로 재구현
  → 같은 Story에서 "library" argType으로 전환 비교

커스텀 전용: D3.js
  → TopologyDiagram: Kafka 5-브로커, MinIO 8-노드 force layout
  → PipelineFlowConnector: Bezier 곡선, 점선 애니메이션
  → ECharts/recharts로 표현이 부자연스러운 노드-링크 구조만
```

### ECharts를 메인으로 선택한 이유

- 실무 모니터링 대시보드 (Grafana 대안, 금융·인프라)에서 가장 많이 쓰임
- `darkMode: true` + custom theme 객체로 shadcn/ui 다크 테마와 일관성 유지 용이
- `setOption` 기반 실시간 업데이트가 WebSocket/polling 데이터 환경에 최적
- `echarts-for-react`의 `onEvents` prop으로 React 이벤트 핸들링 자연스럽게 통합

---

## 6. 디렉토리 구조

```
chart-templates/
├── _docs/
│   ├── PLANNING.md                       ← 이 문서
│   ├── DL_OPS_Dashboard_Spec.docx
│   └── DataPipeLineDashboard.pptx
│
├── src/
│   ├── lib/
│   │   └── utils.ts                      shadcn/ui cn() 유틸 (tailwind-merge + clsx)
│   │
│   ├── tokens/
│   │   ├── colors.ts                     상태 색상 상수 (STATUS_COLORS, LAG_COLORS 등)
│   │   └── theme.echarts.ts              ECharts 전역 테마 객체 (shadcn 토큰 참조)
│   │
│   ├── components/
│   │   │
│   │   ├── layout/                       대시보드 레이아웃 뼈대
│   │   │   ├── DashboardShell/
│   │   │   ├── TopHeader/                shadcn Select, Switch, DropdownMenu 사용
│   │   │   ├── SideNav/                  shadcn ScrollArea, Tooltip 사용
│   │   │   ├── SectionPanel/             shadcn Card 사용
│   │   │   └── PipelineStageTimeline/    CSS Flex + SVG 화살표
│   │   │
│   │   ├── kpi/                          메트릭 카드 (shadcn Card 기반)
│   │   │   ├── KpiCard/
│   │   │   ├── KpiCardCompound/
│   │   │   └── ProgressKpiCard/          shadcn Progress 사용
│   │   │
│   │   ├── charts/                       차트 엔진 래퍼 (이 프로젝트의 핵심)
│   │   │   ├── SparklineChart/           echarts-for-react
│   │   │   ├── TrendLineChart/           echarts-for-react (+ recharts variant)
│   │   │   ├── BarChart/                 echarts-for-react (+ recharts variant)
│   │   │   ├── StackedBarChart/          echarts-for-react
│   │   │   ├── DonutRingChart/           echarts-for-react (+ recharts variant)
│   │   │   └── GaugeRing/                echarts-for-react
│   │   │
│   │   ├── flow/                         파이프라인 흐름도
│   │   │   ├── PipelineFlowNode/         shadcn Card + SparklineChart 내장
│   │   │   └── PipelineFlowConnector/    D3 SVG (Bezier, 점선 애니메이션)
│   │   │
│   │   ├── tables/                       데이터 테이블 (shadcn Table + TanStack)
│   │   │   ├── StatusDataTable/
│   │   │   └── AlertEventTable/          shadcn Tabs + Badge
│   │   │
│   │   ├── topology/
│   │   │   └── TopologyDiagram/          D3 force layout
│   │   │
│   │   └── misc/
│   │       ├── MiniStatCell/
│   │       └── RankedList/
│   │
│   ├── mocks/                            화면별 목 데이터 (스토리 & 개발용)
│   │   ├── home.mock.ts
│   │   ├── kafka.mock.ts
│   │   ├── spark.mock.ts
│   │   └── pps-minio.mock.ts
│   │
│   ├── pages/                            4개 대시보드 조립 화면 (Storybook preview 겸용)
│   │   ├── Home.tsx
│   │   ├── Kafka.tsx
│   │   ├── Spark.tsx
│   │   └── PpsMinIO.tsx
│   │
│   ├── styles/
│   │   └── globals.css                   Tailwind directives + shadcn/ui CSS 변수 + DL OPS 토큰
│   │
│   └── index.ts                          컴포넌트 전체 re-export (라이브러리 진입점)
│
├── .storybook/
│   ├── main.ts                           Vite builder, Tailwind 설정
│   └── preview.ts                        전역 다크 테마 데코레이터, globals.css import
│
├── components.json                       shadcn/ui 설정 파일
├── tailwind.config.ts
├── postcss.config.js
├── vite.config.ts
└── tsconfig.json
```

### 컴포넌트 폴더 내부 구조 (CBA 단위)

```
TrendLineChart/
├── TrendLineChart.tsx            메인 구현 (ECharts)
├── TrendLineChart.recharts.tsx   recharts 구현 (동일 props, 학습용)
├── TrendLineChart.types.ts       props 타입 정의 (코로케이션)
├── TrendLineChart.stories.tsx    Storybook CSF3
├── TrendLineChart.test.tsx       단위 테스트 (선택)
└── index.ts                      named export
```

---

## 7. 컴포넌트 카탈로그

### 7-1. 레이아웃

| 컴포넌트 | shadcn/ui 사용 | 핵심 Props | 난이도 |
|----------|--------------|-----------|--------|
| `DashboardShell` | - | `children`, `sidebar`, `header` | ★☆☆ |
| `TopHeader` | Select, Switch, DropdownMenu | `env`, `pipeline`, `dateRange`, `autoRefresh`, `lastRefresh` | ★★☆ |
| `SideNav` | ScrollArea, Tooltip, Separator | `items[]`, `activeId` | ★☆☆ |
| `PipelineStageTimeline` | Badge | `stages[]` (name, count, status) | ★★☆ |
| `SectionPanel` | Card, CardHeader, CardContent | `title`, `legend[]`, `children` | ★☆☆ |

### 7-2. KPI 카드

| 컴포넌트 | shadcn/ui 사용 | 핵심 Props | 난이도 |
|----------|--------------|-----------|--------|
| `KpiCard` | Card, Badge, Skeleton | `label`, `value`, `unit`, `deltaPct`, `trend[]`, `status` | ★☆☆ |
| `KpiCardCompound` | Card, Badge, Skeleton | `label`, `value`, `breakdown[]` | ★★☆ |
| `ProgressKpiCard` | Card, Progress, Badge, Skeleton | `label`, `value`, `total`, `usedPct`, `status` | ★★☆ |

### 7-3. 차트 (핵심 구현 영역)

| 컴포넌트 | ECharts 타입 | recharts 대응 | 사용 예 | 난이도 |
|----------|-------------|--------------|--------|--------|
| `SparklineChart` | Line (miniature) | LineChart | KpiCard 내 삽입 | ★☆☆ |
| `TrendLineChart` | Line (multi-series) | ComposedChart | Traffic, Consumer Lag | ★★☆ |
| `BarChart` | Bar (h/v 전환) | BarChart | Top Topics, Broker Disk | ★★☆ |
| `StackedBarChart` | Bar (stack) | BarChart stacked | Partition Distribution | ★★☆ |
| `DonutRingChart` | Pie (donut) | PieChart | ISR Health, Stage Status | ★★☆ |
| `GaugeRing` | Gauge | RadialBarChart | Small File Ratio | ★★★ |

### 7-4. 파이프라인 & 토폴로지

| 컴포넌트 | 렌더링 | shadcn/ui 사용 | 난이도 |
|----------|--------|--------------|--------|
| `PipelineFlowNode` | div + CSS | Card, Badge, Skeleton | ★★☆ |
| `PipelineFlowConnector` | D3 SVG | - | ★★★ |
| `TopologyDiagram` | D3 force | Tooltip | ★★★★ |

### 7-5. 테이블

| 컴포넌트 | shadcn/ui 사용 | 핵심 기능 | 난이도 |
|----------|--------------|---------|--------|
| `StatusDataTable` | Table + TanStack Table | 정렬·필터·셀 상태 색상 | ★★★ |
| `AlertEventTable` | Table + Tabs + Badge | 심각도 탭 필터, ack 표시 | ★★☆ |

### 7-6. 기타

| 컴포넌트 | shadcn/ui 사용 | 목적 | 난이도 |
|----------|--------------|------|--------|
| `MiniStatCell` | - | 라벨+값 초소형 블록 | ★☆☆ |
| `RankedList` | Badge | Top-N 순위 리스트 | ★☆☆ |

---

## 8. TypeScript 데이터 계약

타입은 각 컴포넌트 폴더에 코로케이션(`ComponentName.types.ts`)하는 것이 원칙.  
여러 컴포넌트에서 공유되는 기반 타입만 `src/tokens/colors.ts` 또는 각 컴포넌트의 `index.ts`에서 re-export한다.

### 공통 기반 타입

```typescript
// 각 컴포넌트 types.ts에서 import해서 사용

export type StatusLevel = 'normal' | 'warning' | 'critical' | 'info' | 'inactive';

export interface ChartBaseProps {
  height?: number | string;
  isLoading?: boolean;
  error?: string;
  theme?: 'dark' | 'light';  // 기본값: 'dark'
}

export interface ChartDataPoint {
  timestamp?: string | number;
  label?: string;
  value: number;
}

export interface SeriesConfig {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar' | 'area';
  dashed?: boolean;
}
```

### KPI 카드 타입 (kpi/KpiCard/KpiCard.types.ts)

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface KpiCardData {
  label: string;
  value: number | string;
  unit?: string;
  deltaPct?: number;         // 이전 구간 대비 증감률, 양수=▲ 음수=▼
  trend?: number[];          // SparklineChart용 시계열
  status?: StatusLevel;
  breakdown?: {
    label: string;
    count: number;
    color: string;
  }[];                       // KpiCardCompound용 (Active Alerts 등)
}

export interface ProgressKpiData extends KpiCardData {
  total: number;
  usedPct: number;           // 0–100, Progress 컴포넌트에 직접 전달
}
```

### 알림/이벤트 타입 (tables/AlertEventTable/AlertEventTable.types.ts)

```typescript
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';

export interface AlertEvent {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  target: string;
  status?: 'ack' | 'unack';  // Home 화면만 표시
  detail?: string;
}
```

### 테이블 타입 (tables/StatusDataTable/StatusDataTable.types.ts)

```typescript
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  statusKey?: keyof T;       // 이 필드값으로 셀 배경 색상 결정
  render?: (value: unknown, row: T) => React.ReactNode;
}
```

---

## 9. 디자인 토큰 시스템

### globals.css — shadcn/ui 토큰 + DL OPS 다크 테마

shadcn/ui는 CSS 변수 기반 토큰 시스템을 사용한다.  
DL OPS 다크 테마를 shadcn/ui 규격에 맞춰 정의하면 컴포넌트가 자동으로 올바른 색상을 사용한다.

```css
/* src/styles/globals.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn/ui 기본 토큰 — DL OPS 다크 테마 값으로 오버라이드 */
    --background:   222 47% 11%;   /* slate-900  #0f172a */
    --foreground:   213 31% 91%;   /* slate-200  #e2e8f0 */
    --card:         215 28% 17%;   /* slate-800  #1e293b */
    --card-foreground: 213 31% 91%;
    --muted:        215 16% 47%;   /* slate-500 */
    --muted-foreground: 215 20% 65%;
    --border:       215 25% 27%;   /* slate-700 */
    --input:        215 25% 27%;
    --ring:         217 91% 60%;   /* blue-500  포커스 링 */

    /* DL OPS 도메인 전용 토큰 */
    --status-normal:   142 71% 45%;  /* green-500 */
    --status-warning:   25 95% 53%;  /* orange-500 */
    --status-critical:   0 84% 60%;  /* red-500 */
    --status-info:     217 91% 60%;  /* blue-500 */
    --status-inactive: 220 9%  46%;  /* gray-500 */

    /* Consumer Lag 구간 색상 */
    --lag-safe:       142 71% 45%;
    --lag-caution:     25 95% 53%;
    --lag-warning:    347 77% 50%;
    --lag-critical:     0 84% 60%;
  }
}
```

### Tailwind 설정 — CSS 변수 연결

```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        status: {
          normal:   'hsl(var(--status-normal))',
          warning:  'hsl(var(--status-warning))',
          critical: 'hsl(var(--status-critical))',
          info:     'hsl(var(--status-info))',
          inactive: 'hsl(var(--status-inactive))',
        },
      },
    },
  },
}
```

### ECharts 테마 — shadcn/ui 토큰 참조

```typescript
// src/tokens/theme.echarts.ts
// CSS 변수 값을 직접 참조하지 않고 동일한 색상 값을 미러링
// (ECharts는 CSS 변수를 직접 읽지 못함)

export const DL_OPS_DARK_THEME = {
  backgroundColor: 'transparent',      // 카드 배경은 shadcn Card가 담당
  textStyle: { color: '#e2e8f0' },

  color: ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'],

  tooltip: {
    backgroundColor: '#1e293b',        // --card
    borderColor: '#334155',            // --border
    textStyle: { color: '#e2e8f0' },
  },

  xAxis: {
    axisLine:  { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
  },
  yAxis: {
    axisLine:  { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
  },
} as const;
```

### 상태 색상 상수 (TypeScript용)

```typescript
// src/tokens/colors.ts
// CSS 변수로 표현이 어려운 JS 로직 (D3, ECharts option)에서 직접 사용

export type StatusLevel = 'normal' | 'warning' | 'critical' | 'info' | 'inactive';

export const STATUS_COLORS: Record<StatusLevel, string> = {
  normal:   '#22c55e',
  warning:  '#f97316',
  critical: '#ef4444',
  info:     '#3b82f6',
  inactive: '#6b7280',
};

export const LAG_THRESHOLDS = [
  { max: 50_000,  status: 'normal'   as const, color: '#22c55e' },
  { max: 200_000, status: 'caution'  as const, color: '#f97316' },
  { max: 500_000, status: 'warning'  as const, color: '#f43f5e' },
  { max: Infinity, status: 'critical' as const, color: '#ef4444' },
];

export const PROGRESS_THRESHOLDS = [
  { max: 70,  status: 'normal'   as const },
  { max: 90,  status: 'warning'  as const },
  { max: 100, status: 'critical' as const },
];

export function getLagStatus(lag: number) {
  return LAG_THRESHOLDS.find(t => lag < t.max)!;
}

export function getProgressStatus(pct: number) {
  return PROGRESS_THRESHOLDS.find(t => pct <= t.max)!;
}
```

---

## 10. Storybook 운영 전략

### Storybook에서의 shadcn/ui 설정

```typescript
// .storybook/preview.ts
import '../src/styles/globals.css';   // Tailwind + shadcn CSS 변수 로드

export const decorators = [
  (Story) => (
    <div className="min-h-screen bg-background text-foreground p-6">
      <Story />
    </div>
  ),
];

export const parameters = {
  backgrounds: { disable: true },     // Tailwind bg-background로 대체
};
```

### 사이드바 구조 (Storybook 8 CSF3)

```
├── 🎨 Design Tokens
│   ├── Colors & Status
│   └── ECharts Theme
├── 📐 Layout
│   ├── DashboardShell
│   ├── TopHeader
│   ├── SideNav
│   ├── SectionPanel
│   └── PipelineStageTimeline
├── 📊 KPI Cards
│   ├── KpiCard
│   ├── KpiCardCompound
│   └── ProgressKpiCard
├── 📈 Charts / ECharts
│   ├── SparklineChart
│   ├── TrendLineChart
│   ├── BarChart
│   ├── StackedBarChart
│   ├── DonutRingChart
│   └── GaugeRing
├── 📈 Charts / recharts  (학습 비교)
│   ├── TrendLineChart
│   ├── BarChart
│   └── DonutRingChart
├── 🔗 Flow & Topology
│   ├── PipelineFlowNode
│   ├── PipelineFlowConnector
│   └── TopologyDiagram
├── 📋 Tables
│   ├── StatusDataTable
│   └── AlertEventTable
└── 🧩 Misc
    ├── MiniStatCell
    └── RankedList
```

### 모든 차트 Story 필수 Controls

| Control | 타입 | 목적 |
|---------|------|------|
| `status` | select | normal / warning / critical 색상 변화 확인 |
| `isLoading` | boolean | shadcn Skeleton 로딩 상태 확인 |
| `error` | text | 에러 메시지 UI 확인 |
| `height` | number | 반응형 높이 조절 |

```typescript
// TrendLineChart.stories.tsx 예시

export const Default: Story = {
  args: {
    series: kafkaMock.lagTrend,
    height: 240,
    status: 'normal',
    isLoading: false,
  },
};

export const WithWarning: Story = {
  args: { ...Default.args, status: 'warning' },
};

export const Loading: Story = {
  args: { ...Default.args, isLoading: true },
};

export const Empty: Story = {
  args: { ...Default.args, series: [] },
};

// recharts 동일 Story — library argType으로 전환 비교
export const RechartsVariant: Story = {
  name: 'recharts (학습 비교)',
  render: (args) => <TrendLineChartRecharts {...args} />,
  args: Default.args,
};
```

---

## 11. FSD 프로젝트에서 가져다 쓰는 방법

### 이식 위치

chart-templates의 컴포넌트는 모두 비즈니스 로직이 없는 순수 UI이므로,  
FSD 프로젝트의 **`shared/ui/`** 레이어에 배치한다.

```
# chart-templates (이 프로젝트)
src/components/charts/TrendLineChart/

         ↓ 폴더째 복사

# 실제 FSD 프로젝트
src/shared/ui/charts/TrendLineChart/
```

### 스타일 호환성

양쪽 모두 shadcn/ui + Tailwind를 사용하므로,  
`globals.css`의 CSS 변수 정의가 실제 프로젝트에도 동일하게 있다면 **추가 스타일 작업 없이 바로 작동**한다.

```
체크리스트 (복사 시):
  ✓ 실제 프로젝트에 tailwind.config.ts의 status.* 색상 확장 추가
  ✓ globals.css에 --status-* 및 --lag-* CSS 변수 추가
  ✓ src/tokens/colors.ts 복사 (LAG_THRESHOLDS, PROGRESS_THRESHOLDS 등)
  ✓ ECharts 사용 컴포넌트의 경우 echarts, echarts-for-react 패키지 설치
```

### import 경로 조정

chart-templates에서는 `@/components/...` 경로 alias를 사용.  
실제 프로젝트 복사 후 `@/shared/ui/...`로 경로만 조정하면 된다.

---

## 12. 구현 페이즈

### Phase 0 — 프로젝트 초기화 (1–2일)

- [ ] Vite + React + TypeScript + Tailwind CSS 셋업
- [ ] shadcn/ui init + 필요 컴포넌트 add (card, table, tabs, progress, badge, skeleton, select, dropdown-menu, switch, tooltip, scroll-area, separator)
- [ ] ECharts, echarts-for-react, recharts, D3 설치
- [ ] `@tanstack/react-table` 설치
- [ ] Storybook 8 셋업 (Vite builder, Tailwind 통합, globals.css 데코레이터)
- [ ] `globals.css` DL OPS 다크 테마 CSS 변수 정의
- [ ] `tailwind.config.ts` status.* 색상 확장
- [ ] `src/tokens/colors.ts`, `theme.echarts.ts` 작성
- [ ] 목 데이터 JSON 4개 파일 초안

### Phase 1 — 레이아웃 & 카드 컴포넌트 (3–5일)

- [ ] `SectionPanel` (shadcn Card 래퍼)
- [ ] `DashboardShell` (CSS Grid 뼈대)
- [ ] `TopHeader` (shadcn Select, Switch, DropdownMenu)
- [ ] `SideNav` (shadcn ScrollArea, Tooltip)
- [ ] `PipelineStageTimeline`
- [ ] `KpiCard` (shadcn Card + Badge + SparklineChart) + Story
- [ ] `KpiCardCompound` + Story
- [ ] `ProgressKpiCard` (shadcn Progress) + Story

### Phase 2 — ECharts 차트 (5–7일)

- [ ] `SparklineChart`
- [ ] `TrendLineChart` (다중 시리즈, 줌, 툴팁)
- [ ] `BarChart` (수평/수직 전환 prop)
- [ ] `StackedBarChart`
- [ ] `DonutRingChart`
- [ ] `GaugeRing` (목표선 + 경고 임계선)
- [ ] 각 Story: Default / WithWarning / Loading / Empty

### Phase 3 — recharts 대응 (3–4일, 학습)

- [ ] `TrendLineChart.recharts.tsx` (동일 props)
- [ ] `BarChart.recharts.tsx`
- [ ] `DonutRingChart.recharts.tsx`
- [ ] 각 Story에 `RechartsVariant` 추가

### Phase 4 — 테이블 (3–4일)

- [ ] `StatusDataTable` (shadcn Table + TanStack Table 정렬·필터)
- [ ] `AlertEventTable` (shadcn Table + Tabs + Badge)
- [ ] 각 Story

### Phase 5 — 파이프라인 & 토폴로지 (4–6일)

- [ ] `PipelineFlowNode` (shadcn Card + Badge + SparklineChart 내장)
- [ ] `PipelineFlowConnector` (D3 Bezier SVG)
- [ ] `TopologyDiagram` (D3 force layout)
- [ ] Story: Kafka 5-broker / MinIO 8-node 목 데이터

### Phase 6 — 4개 대시보드 화면 조립 (5–7일)

- [ ] Home (2-1 ~ 2-11)
- [ ] Kafka 상세 (3-1 ~ 3-10)
- [ ] Spark 상세 (4-1 ~ 4-13)
- [ ] PPS Agent/MinIO 상세 (5-1 ~ 5-14)
- [ ] React Router SideNav 라우팅
- [ ] Auto Refresh 인터벌 (mock 데이터 주기 업데이트)

---

## 13. 컴포넌트별 라이브러리 배정표

| 컴포넌트 | 차트 엔진 | shadcn/ui | 비고 |
|----------|----------|-----------|------|
| `SparklineChart` | ECharts | - | KpiCard 내장, 극소형 |
| `TrendLineChart` | ECharts (+recharts) | - | 다중 시리즈, 실시간 |
| `BarChart` | ECharts (+recharts) | - | h/v 전환 prop |
| `StackedBarChart` | ECharts | - | 누적 영역 포함 |
| `DonutRingChart` | ECharts (+recharts) | - | 범례 클릭 필터 |
| `GaugeRing` | ECharts | - | 목표선 + 임계선 |
| `PipelineFlowConnector` | D3 SVG | - | Bezier, 점선 애니메이션 |
| `TopologyDiagram` | D3 force | Tooltip | 노드 드래그 |
| `PipelineFlowNode` | SparklineChart 내장 | Card, Badge, Skeleton | |
| `StatusDataTable` | - | Table | + @tanstack/react-table |
| `AlertEventTable` | - | Table, Tabs, Badge | |
| `KpiCard` | SparklineChart 내장 | Card, Badge, Skeleton | |
| `KpiCardCompound` | - | Card, Badge, Skeleton | |
| `ProgressKpiCard` | - | Card, Progress, Badge, Skeleton | |
| `TopHeader` | - | Select, Switch, DropdownMenu | |
| `SideNav` | - | ScrollArea, Tooltip, Separator | |
| `DashboardShell` | - | - | CSS Grid |
| `PipelineStageTimeline` | - | Badge | CSS Flex + SVG 화살표 |
| `SectionPanel` | - | Card, CardHeader, CardContent | |
| `MiniStatCell` | - | - | 순수 CSS |
| `RankedList` | - | Badge (선택) | |

---

## 참고 문서

- `DL_OPS_Dashboard_Spec.docx` — 4개 대시보드 전체 스펙
- `DataPipeLineDashboard.pptx` — 화면 디자인 원본
- [ECharts 공식 문서](https://echarts.apache.org/en/option.html)
- [echarts-for-react GitHub](https://github.com/hustcc/echarts-for-react)
- [recharts 공식 문서](https://recharts.org/)
- [D3.js 공식 문서](https://d3js.org/)
- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Storybook 8 공식 문서](https://storybook.js.org/docs)
- [TanStack Table v8](https://tanstack.com/table/v8)
