# 구현 가이드 — chart-templates (Phase 0 ~ Phase 6)

> 이 문서는 `PLANNING.md`의 "12. 구현 페이즈"를 그대로 따라 실행할 수 있도록,
> **터미널 명령어**와 **실제 코드**를 순서대로 적은 실행 매뉴얼입니다.
> 셸은 PowerShell 기준으로 작성했습니다 (Windows 11).
> 코드는 파일 단위로 "여기에 이 내용을 저장" 형태로 제공하니, 그대로 복사해서 저장하면 됩니다.

---

## 0. 사전 준비

```powershell
node -v     # v18 이상 확인 (v20 권장)
npm -v      # v9 이상 확인
```

현재 `C:\devlab\PPS\projects\chart-templates` 폴더에는 `_docs`만 있고 소스가 없는 상태이므로,
이 폴더를 그대로 프로젝트 루트로 사용합니다.

```powershell
cd C:\devlab\PPS\projects\chart-templates
```

---

## Phase 0 — 프로젝트 초기화

### 0-1. Vite + React + TypeScript 스캐폴딩

```powershell
npm create vite@latest . -- --template react-ts
```

> `_docs` 폴더가 이미 있어서 "Current directory is not empty. Please choose how to proceed:"
> 프롬프트가 뜨면 **"Ignore files and continue"** 선택.

```powershell
npm install
```

동작 확인:

```powershell
npm run dev
```

브라우저에서 `http://localhost:5173` 접속해 Vite 기본 화면이 뜨면 OK. 확인 후 `Ctrl + C`로 종료.

### 0-2. 경로 alias (`@/*` → `src/*`) 설정

**`tsconfig.json`** 전체를 아래로 교체:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**`tsconfig.app.json`** 의 `compilerOptions`에 아래 내용 추가:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

> `baseUrl`은 넣지 않습니다. TypeScript 6에서 `baseUrl`이 deprecated 되어 `tsc -b` 빌드가 에러로 실패합니다.
> `paths`만 있으면 tsconfig 파일 위치 기준으로 정상 resolve됩니다.

`@types/node` 설치 (vite.config.ts에서 `path` 모듈 쓰기 위함):

```powershell
npm install -D @types/node
```

**`vite.config.ts`** 전체 교체 (Tailwind v4 플러그인은 0-3에서 추가):

```typescript
import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 0-3. Tailwind CSS v4 셋업

> **주의:** 2026-03 릴리스된 shadcn CLI v4는 Tailwind CSS **v3**(`tailwind.config.js` + PostCSS 방식)를 더 이상 인식하지 못합니다.
> `npx shadcn init` 실행 시 config 파일이 있어도 "No Tailwind CSS configuration found" 오류가 나므로, 처음부터 **Tailwind v4 + `@tailwindcss/vite` 플러그인** 방식으로 설치합니다. (`tailwind.config.js`, `postcss.config.js` 자체가 필요 없어집니다.)

```powershell
npm install tailwindcss @tailwindcss/vite
```

**`vite.config.ts`**에 플러그인 추가:

```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`src/index.css`** 내용을 전부 지우고 한 줄만 남깁니다 (shadcn init이 이 파일을 인식해서 나머지를 채워줍니다):

```css
@import "tailwindcss";
```

### 0-4. shadcn/ui 초기화 (CLI v4)

> shadcn CLI가 v4로 개편되면서 프롬프트도 바뀌었습니다: "Which style" 대신 **컴포넌트 라이브러리(Radix / Base UI)** 와 **preset**(Nova 등 5종 — 여백/밀도 프리셋)을 고릅니다. 스크립트에서 그대로 재현하려면 아래처럼 플래그로 비대화식 실행합니다.

```powershell
npx shadcn@latest init -t vite -b radix -p nova --no-monorepo -y
```

| 플래그 | 값 | 의미 |
|--------|-----|------|
| `-t vite` | Vite | 프레임워크 명시 |
| `-b radix` | Radix | 컴포넌트 프리미티브 라이브러리 (Base UI가 새 기본값이지만, 이 프로젝트는 문서화가 풍부한 Radix로 고정) |
| `-p nova` | Nova | 여백/밀도 프리셋 |
| `--no-monorepo` | - | 모노레포 여부 프롬프트 생략 |
| `-y` | - | 확인 프롬프트 생략 |

초기화가 끝나면:
- `components.json` 생성 (`tailwind.css` 경로가 `src/index.css`로 지정됨 — 이후 `npx shadcn add`는 항상 이 파일을 수정합니다)
- `src/lib/utils.ts`, `src/components/ui/button.tsx` 생성
- `src/index.css`가 Tailwind v4 CSS-first 테마(`@theme inline` + `:root`/`.dark` 색상 변수, oklch 컬러)로 자동 확장됨

이후 0-8 단계에서 이 색상 변수 값을 DL OPS 다크 테마 값으로 덮어씁니다.

필요한 컴포넌트 일괄 추가:

```powershell
npx shadcn@latest add card table tabs progress badge skeleton select dropdown-menu switch tooltip scroll-area separator -y
```

생성 확인:

```powershell
dir src\components\ui
```

`card.tsx`, `table.tsx`, `tabs.tsx`, `progress.tsx`, `badge.tsx`, `skeleton.tsx`, `select.tsx`, `dropdown-menu.tsx`, `switch.tsx`, `tooltip.tsx`, `scroll-area.tsx`, `separator.tsx`, `button.tsx` 가 보이면 성공.

> `tooltip` 컴포넌트를 쓰려면 앱을 `<TooltipProvider>`로 감싸야 한다는 안내가 뜹니다 — Phase 6에서 `App.tsx` 최상단에 적용합니다.

### 0-5. 차트 라이브러리 & 테이블 라이브러리 설치

```powershell
npm install echarts echarts-for-react recharts d3
npm install -D @types/d3
npm install @tanstack/react-table
npm install @xyflow/react
```

> `@xyflow/react`(React Flow)는 Ch2 파이프라인 흐름도(2-5)와 Ch4 Spark Cluster Overview(4-4, Master→Worker 트리)의 `<PipelineFlowDiagram>`에 사용합니다. Ch3/Ch5 브로커·MinIO 토폴로지(`<TopologyDiagram>`)는 계속 `d3-force`로 구현하므로 React Flow 대상이 아닙니다 — 근거는 Phase 5-0 참고.

### 0-6. Storybook 셋업 (v10)

```powershell
npx storybook@latest init
```

- Vite 기반 React 프로젝트를 자동 인식해 `@storybook/react-vite` 빌더로 설치됩니다.
- "New to Storybook?", "AI 기능(MCP addon) 설치할지" 등의 프롬프트가 뜨는데 기본값/Yes로 진행해도 됩니다 (MCP addon은 AI 에이전트가 스토리 문서·컴포넌트 목록을 조회할 수 있게 해주는 공식 addon).

> **알려진 버그 (Storybook 10.4.6, [issue #33508](https://github.com/storybookjs/storybook/issues/33508)):**
> `init`이 `.storybook/main.ts`·`preview.tsx`·`package.json`의 `storybook` 스크립트까지는 만들어 놓고,
> 그다음 "Copying framework templates" 단계에서 `Cannot find @storybook/react-vite/package.json` 에러로 죽는 경우가 있습니다.
> (`@storybook/react-vite`를 실제로 설치하기 전에 템플릿 복사를 시도하는 순서 버그. Windows + 유니코드 사용자 폴더 경로에서는 `EPERM: operation not permitted, mkdir 'C:\Users\<사용자명>'`까지 덧붙어 나올 수 있음.)
>
> 이 에러가 나면 **설정 파일은 이미 정상 생성된 상태**이므로, init을 재시도하지 말고 패키지만 직접 설치하면 됩니다:
>
> ```powershell
> npm install -D storybook@10.4.6 @storybook/react-vite@10.4.6 `
>   @storybook/addon-a11y@10.4.6 @storybook/addon-docs@10.4.6 @storybook/addon-vitest@10.4.6 `
>   @chromatic-com/storybook@latest @storybook/addon-mcp@latest eslint-plugin-storybook@latest
> ```
>
> (버전은 `.storybook/main.ts` 상단 주석이나 `npx storybook@latest init` 실행 로그의 "Adding Storybook version X.X.X" 문구를 보고 맞춰주면 됩니다.)

설치 확인:

```powershell
npm run storybook
```

`http://localhost:6006` 접속해 "Storybook ready!"가 뜨면 성공. `src/**/*.stories.tsx`가 아직 없어서 "No story files found" 경고가 뜨는 건 정상입니다 (Phase 1부터 채워짐). 확인 후 종료(`Ctrl + C`) 하고 다음 단계로.

### 0-7. 디렉토리 구조 생성

```powershell
New-Item -ItemType Directory -Force -Path `
  "src/tokens", `
  "src/components/layout/DashboardShell", `
  "src/components/layout/TopHeader", `
  "src/components/layout/SideNav", `
  "src/components/layout/SectionPanel", `
  "src/components/layout/PipelineStageTimeline", `
  "src/components/kpi/KpiCard", `
  "src/components/kpi/KpiCardCompound", `
  "src/components/kpi/ProgressKpiCard", `
  "src/components/charts/SparklineChart", `
  "src/components/charts/TrendLineChart", `
  "src/components/charts/BarChart", `
  "src/components/charts/StackedBarChart", `
  "src/components/charts/DonutRingChart", `
  "src/components/charts/GaugeRing", `
  "src/components/flow/PipelineFlowNode", `
  "src/components/flow/PipelineFlowConnector", `
  "src/components/flow/PipelineFlowDiagram", `
  "src/components/tables/StatusDataTable", `
  "src/components/tables/AlertEventTable", `
  "src/components/topology/TopologyDiagram", `
  "src/components/misc/MiniStatCell", `
  "src/components/misc/RankedList", `
  "src/mocks", `
  "src/pages", `
  "src/styles" | Out-Null
```

> PowerShell 백틱(`` ` ``)은 줄 끝에 공백 없이 붙어야 합니다. 그대로 복사-붙여넣기 하세요.

### 0-8. `src/index.css` — DL OPS 다크 테마 CSS 변수 덮어쓰기

Tailwind v4는 `tailwind.config.ts` 대신 **CSS 파일 안의 `@theme inline` 블록**으로 색상 토큰을 확장합니다.
shadcn init이 만들어 둔 `src/index.css`를 열어 아래 3곳을 수정합니다 (파일 자체를 옮기거나 지우지 않습니다 — `components.json`이 이 경로를 기억하고 있어서, 옮기면 이후 `npx shadcn add`가 엉뚱한 곳에 씁니다).

**① `@theme inline` 블록에 status/lag 색상 매핑 추가** (다른 `--color-*` 라인들 사이 아무 곳):

```css
@theme inline {
  /* ...기존 --color-sidebar-*, --color-chart-* 등은 그대로 둠... */
  --color-status-normal: var(--status-normal);
  --color-status-warning: var(--status-warning);
  --color-status-critical: var(--status-critical);
  --color-status-info: var(--status-info);
  --color-status-inactive: var(--status-inactive);
  --color-lag-safe: var(--lag-safe);
  --color-lag-caution: var(--lag-caution);
  --color-lag-warning: var(--lag-warning);
  --color-lag-critical: var(--lag-critical);
}
```

이 매핑 덕분에 `bg-status-critical`, `text-status-warning`, `border-lag-safe` 같은 Tailwind 유틸리티 클래스가 생성됩니다.

**② `:root` 블록** — shadcn이 넣어준 `oklch(...)` 값들을 DL OPS 다크 팔레트로 교체 (색상 함수는 `hsl()`이든 `oklch()`든 CSS 변수 값으로는 무엇이든 상관없으므로, 기존 v3 설계에서 쓰던 HSL 트리플렛을 그대로 `hsl(h s% l%)` 형태로 씁니다):

```css
:root {
  --background: hsl(222 47% 11%);       /* slate-900 */
  --foreground: hsl(213 31% 91%);       /* slate-200 */
  --card: hsl(215 28% 17%);             /* slate-800 */
  --card-foreground: hsl(213 31% 91%);
  --popover: hsl(215 28% 17%);
  --popover-foreground: hsl(213 31% 91%);
  --primary: hsl(217 91% 60%);          /* blue-500 */
  --primary-foreground: hsl(213 31% 91%);
  --secondary: hsl(215 25% 27%);        /* slate-700 */
  --secondary-foreground: hsl(213 31% 91%);
  --muted: hsl(215 16% 47%);            /* slate-500 */
  --muted-foreground: hsl(215 20% 65%);
  --accent: hsl(215 25% 27%);
  --accent-foreground: hsl(213 31% 91%);
  --destructive: hsl(0 84% 60%);        /* red-500 */
  --border: hsl(215 25% 27%);
  --input: hsl(215 25% 27%);
  --ring: hsl(217 91% 60%);
  /* --chart-*, --sidebar-* 는 기존 값 유지해도 무방 (이 프로젝트에선 미사용) */
  --radius: 0.5rem;

  /* DL OPS 도메인 전용 토큰 */
  --status-normal: hsl(142 71% 45%);    /* green-500 */
  --status-warning: hsl(25 95% 53%);    /* orange-500 */
  --status-critical: hsl(0 84% 60%);    /* red-500 */
  --status-info: hsl(217 91% 60%);      /* blue-500 */
  --status-inactive: hsl(220 9% 46%);   /* gray-500 */

  /* Consumer Lag 구간 색상 */
  --lag-safe: hsl(142 71% 45%);
  --lag-caution: hsl(25 95% 53%);
  --lag-warning: hsl(347 77% 50%);
  --lag-critical: hsl(0 84% 60%);
}
```

**③ `.dark` 블록** — 이 대시보드는 항상 다크 테마이므로 `:root`와 동일한 값을 그대로 복사해 넣습니다 (라이트/다크 토글을 나중에 붙일 여지를 남겨두는 것뿐, 지금은 두 블록 값이 같습니다).

**④ `index.html`**에 `class="dark"` 추가 (라이트 모드로 시스템이 설정돼 있어도 항상 다크로 렌더링):

```html
<html lang="en" class="dark">
```

> `tailwind.config.js`, `postcss.config.js`, `tailwind.config.ts` 파일은 Tailwind v4 + Vite 플러그인 조합에서는 **아예 만들지 않습니다.** `content` 스캔 경로 지정도 필요 없습니다 (Vite 플러그인이 자동으로 처리).

### 0-9. 공통 토큰 파일

**`src/tokens/colors.ts`**

```typescript
export type StatusLevel = 'normal' | 'warning' | 'critical' | 'info' | 'inactive';

export const STATUS_COLORS: Record<StatusLevel, string> = {
  normal: '#22c55e',
  warning: '#f97316',
  critical: '#ef4444',
  info: '#3b82f6',
  inactive: '#6b7280',
};

export const LAG_THRESHOLDS = [
  { max: 50_000, status: 'normal' as const, color: '#22c55e' },
  { max: 200_000, status: 'caution' as const, color: '#f97316' },
  { max: 500_000, status: 'warning' as const, color: '#f43f5e' },
  { max: Infinity, status: 'critical' as const, color: '#ef4444' },
];

export const PROGRESS_THRESHOLDS = [
  { max: 70, status: 'normal' as const },
  { max: 90, status: 'warning' as const },
  { max: 100, status: 'critical' as const },
];

export function getLagStatus(lag: number) {
  return LAG_THRESHOLDS.find((t) => lag < t.max)!;
}

export function getProgressStatus(pct: number) {
  return PROGRESS_THRESHOLDS.find((t) => pct <= t.max)!;
}
```

**`src/tokens/theme.echarts.ts`**

```typescript
export const DL_OPS_DARK_THEME = {
  backgroundColor: 'transparent',
  textStyle: { color: '#e2e8f0' },

  color: ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'],

  tooltip: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    textStyle: { color: '#e2e8f0' },
  },

  xAxis: {
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
  },
  yAxis: {
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
  },
} as const;
```

### 0-10. 공통 기반 타입

**`src/tokens/base.types.ts`**

```typescript
import type { StatusLevel } from './colors';

export interface ChartBaseProps {
  height?: number | string;
  isLoading?: boolean;
  error?: string;
  theme?: 'dark' | 'light';
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

export type { StatusLevel };
```

### 0-11. 목 데이터 초안 4개 파일

**`src/mocks/home.mock.ts`**

```typescript
import type { KpiCardData } from '@/components/kpi/KpiCard/KpiCard.types';
import type { AlertEvent } from '@/components/tables/AlertEventTable/AlertEventTable.types';

export const homeKpis: KpiCardData[] = [
  { label: 'End-to-End Latency', value: 4.2, unit: 's', deltaPct: -3.1, trend: [5, 4.8, 4.5, 4.6, 4.3, 4.2], status: 'normal' },
  { label: 'Active Alerts', value: 14, breakdown: [
    { label: 'Critical', count: 3, color: '#ef4444' },
    { label: 'Warning', count: 11, color: '#f97316' },
  ] },
  { label: 'Throughput', value: 12_400, unit: 'msg/s', deltaPct: 5.4, trend: [10, 11, 10.5, 12, 12.4], status: 'normal' },
];

export const homeAlerts: AlertEvent[] = [
  { id: '1', timestamp: '2026-07-05T09:12:00Z', severity: 'Critical', message: 'Consumer lag exceeded 500k', target: 'iceberg-sink-c1', status: 'unack' },
  { id: '2', timestamp: '2026-07-05T08:55:00Z', severity: 'Warning', message: 'Broker disk usage 82%', target: 'kafka-broker-3', status: 'ack' },
];
```

**`src/mocks/kafka.mock.ts`** / **`src/mocks/spark.mock.ts`** / **`src/mocks/pps-minio.mock.ts`** 도 동일한 패턴(해당 화면의 `KpiCardData[]`, `AlertEvent[]`)으로 우선 빈 배열 또는 위와 유사한 1~2개 샘플만 채워두고, Phase 6에서 각 대시보드 조립 시 채워 넣습니다.

```typescript
// src/mocks/kafka.mock.ts (Phase 6에서 채움)
export const kafkaKpis: import('@/components/kpi/KpiCard/KpiCard.types').KpiCardData[] = [];
export const kafkaAlerts: import('@/components/tables/AlertEventTable/AlertEventTable.types').AlertEvent[] = [];
```

`spark.mock.ts`, `pps-minio.mock.ts` 도 동일하게 만들어 둡니다.

### Phase 0 완료 체크

```powershell
npm run dev        # Vite 정상 기동
npm run storybook  # Storybook 정상 기동
```

두 서버 모두 에러 없이 뜨면 Phase 0 종료.

---

## Phase 1 — 레이아웃 & 카드 컴포넌트

> 컴포넌트 폴더 내부 구조(CBA 단위): `Component.tsx` + `Component.types.ts` + `Component.stories.tsx` + `index.ts`

### 1-1. `SectionPanel`

**`src/components/layout/SectionPanel/SectionPanel.types.ts`**

```typescript
import type { ReactNode } from 'react';

export interface SectionPanelProps {
  title: string;
  legend?: { label: string; color: string }[];
  children: ReactNode;
  className?: string;
}
```

**`src/components/layout/SectionPanel/SectionPanel.tsx`**

```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { SectionPanelProps } from './SectionPanel.types';

export function SectionPanel({ title, legend, children, className }: SectionPanelProps) {
  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {legend && (
          <div className="flex gap-3">
            {legend.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

**`src/components/layout/SectionPanel/index.ts`**

```typescript
export { SectionPanel } from './SectionPanel';
export type { SectionPanelProps } from './SectionPanel.types';
```

**`src/components/layout/SectionPanel/SectionPanel.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SectionPanel } from './SectionPanel';

const meta: Meta<typeof SectionPanel> = {
  title: '📐 Layout/SectionPanel',
  component: SectionPanel,
};
export default meta;
type Story = StoryObj<typeof SectionPanel>;

export const Default: Story = {
  args: {
    title: 'Pipeline Throughput',
    legend: [{ label: 'Normal', color: '#22c55e' }, { label: 'Warning', color: '#f97316' }],
    children: <div className="h-40 flex items-center justify-center text-muted-foreground">Chart Slot</div>,
  },
};
```

### 1-2. `DashboardShell`

**`src/components/layout/DashboardShell/DashboardShell.types.ts`**

```typescript
import type { ReactNode } from 'react';

export interface DashboardShellProps {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}
```

**`src/components/layout/DashboardShell/DashboardShell.tsx`**

```tsx
import type { DashboardShellProps } from './DashboardShell.types';

export function DashboardShell({ header, sidebar, children }: DashboardShellProps) {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr] grid-cols-[240px_1fr] bg-background">
      <div className="col-span-2">{header}</div>
      <div className="row-start-2 border-r border-border">{sidebar}</div>
      <main className="row-start-2 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
```

**`index.ts`**

```typescript
export { DashboardShell } from './DashboardShell';
export type { DashboardShellProps } from './DashboardShell.types';
```

### 1-3. `TopHeader`

**`TopHeader.types.ts`**

```typescript
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
```

**`TopHeader.tsx`**

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { TopHeaderProps } from './TopHeader.types';

export function TopHeader({
  env, envOptions, onEnvChange,
  pipeline, pipelineOptions, onPipelineChange,
  autoRefresh, onAutoRefreshChange, lastRefresh,
}: TopHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold text-foreground">DL OPS Dashboard</span>
        <Select value={env} onValueChange={onEnvChange}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {envOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={pipeline} onValueChange={onPipelineChange}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {pipelineOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground">Last refresh: {lastRefresh}</span>
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
```

`index.ts`는 이후 모든 컴포넌트에서 동일 패턴(`export { X } from './X'; export type { XProps } from './X.types';`)이므로, 이후 항목부터는 반복 서술을 생략하고 필요한 곳만 표기합니다.

### 1-4. `SideNav`

**`SideNav.types.ts`**

```typescript
export interface SideNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface SideNavProps {
  items: SideNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}
```

**`SideNav.tsx`**

```tsx
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { SideNavProps } from './SideNav.types';

export function SideNav({ items, activeId, onSelect }: SideNavProps) {
  return (
    <ScrollArea className="h-full bg-card">
      <nav className="flex flex-col gap-1 p-2">
        {items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelect(item.id)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-status-inactive/20',
                  activeId === item.id && 'bg-status-info/20 text-foreground',
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </ScrollArea>
  );
}
```

### 1-5. `PipelineStageTimeline`

**`PipelineStageTimeline.types.ts`**

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface PipelineStage {
  name: string;
  count: number;
  status: StatusLevel;
}

export interface PipelineStageTimelineProps {
  stages: PipelineStage[];
}
```

**`PipelineStageTimeline.tsx`**

```tsx
import { Badge } from '@/components/ui/badge';
import { STATUS_COLORS } from '@/tokens/colors';
import type { PipelineStageTimelineProps } from './PipelineStageTimeline.types';

export function PipelineStageTimeline({ stages }: PipelineStageTimelineProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {stages.map((stage, i) => (
        <div key={stage.name} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-xs font-semibold"
              style={{ borderColor: STATUS_COLORS[stage.status], color: STATUS_COLORS[stage.status] }}
            >
              {stage.count}
            </div>
            <span className="text-xs text-muted-foreground">{stage.name}</span>
          </div>
          {i < stages.length - 1 && <span className="text-muted-foreground">&rarr;</span>}
        </div>
      ))}
    </div>
  );
}
```

### 1-6. `KpiCard`

**`KpiCard.types.ts`**

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface KpiCardData {
  label: string;
  value: number | string;
  unit?: string;
  deltaPct?: number;
  trend?: number[];
  status?: StatusLevel;
  breakdown?: { label: string; count: number; color: string }[];
}

export interface KpiCardProps {
  data: KpiCardData;
  isLoading?: boolean;
  error?: string;
}
```

**`KpiCard.tsx`**

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { STATUS_COLORS } from '@/tokens/colors';
import type { KpiCardProps } from './KpiCard.types';

export function KpiCard({ data, isLoading, error }: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="space-y-2 pt-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6 text-sm text-status-critical">{error}</CardContent>
      </Card>
    );
  }

  const { label, value, unit, deltaPct, trend, status } = data;
  const deltaUp = (deltaPct ?? 0) >= 0;

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          {status && (
            <Badge style={{ backgroundColor: STATUS_COLORS[status] }} className="text-white">
              {status}
            </Badge>
          )}
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-foreground">{value}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
        <div className="mt-1 flex items-center justify-between">
          {deltaPct !== undefined && (
            <span className={deltaUp ? 'text-xs text-status-normal' : 'text-xs text-status-critical'}>
              {deltaUp ? '▲' : '▼'} {Math.abs(deltaPct)}%
            </span>
          )}
          {trend && <SparklineChart data={trend} height={32} status={status} />}
        </div>
      </CardContent>
    </Card>
  );
}
```

**`KpiCard.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: '📊 KPI Cards/KpiCard',
  component: KpiCard,
};
export default meta;
type Story = StoryObj<typeof KpiCard>;

const baseData = {
  label: 'End-to-End Latency',
  value: 4.2,
  unit: 's',
  deltaPct: -3.1,
  trend: [5, 4.8, 4.5, 4.6, 4.3, 4.2],
  status: 'normal' as const,
};

export const Default: Story = { args: { data: baseData } };
export const WithWarning: Story = { args: { data: { ...baseData, status: 'warning' } } };
export const Loading: Story = { args: { data: baseData, isLoading: true } };
export const Empty: Story = { args: { data: { ...baseData, trend: undefined } } };
```

### 1-7. `KpiCardCompound`

**`KpiCardCompound.types.ts`**

```typescript
export interface KpiCardCompoundData {
  label: string;
  value: number | string;
  breakdown: { label: string; count: number; color: string }[];
}

export interface KpiCardCompoundProps {
  data: KpiCardCompoundData;
  isLoading?: boolean;
}
```

**`KpiCardCompound.tsx`**

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { KpiCardCompoundProps } from './KpiCardCompound.types';

export function KpiCardCompound({ data, isLoading }: KpiCardCompoundProps) {
  if (isLoading) {
    return <Card className="bg-card border-border"><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>;
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <span className="text-xs text-muted-foreground">{data.label}</span>
        <div className="mt-1 text-2xl font-semibold text-foreground">{data.value}</div>
        <div className="mt-2 flex gap-2">
          {data.breakdown.map((b) => (
            <Badge key={b.label} style={{ backgroundColor: b.color }} className="text-white">
              {b.label} {b.count}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 1-8. `ProgressKpiCard`

**`ProgressKpiCard.types.ts`**

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface ProgressKpiData {
  label: string;
  value: number | string;
  total: number;
  usedPct: number;
  status?: StatusLevel;
}

export interface ProgressKpiCardProps {
  data: ProgressKpiData;
  isLoading?: boolean;
}
```

**`ProgressKpiCard.tsx`**

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getProgressStatus, STATUS_COLORS } from '@/tokens/colors';
import type { ProgressKpiCardProps } from './ProgressKpiCard.types';

export function ProgressKpiCard({ data, isLoading }: ProgressKpiCardProps) {
  if (isLoading) {
    return <Card className="bg-card border-border"><CardContent className="pt-6"><Skeleton className="h-12 w-full" /></CardContent></Card>;
  }

  const derived = getProgressStatus(data.usedPct).status;
  const color = STATUS_COLORS[data.status ?? derived];

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{data.label}</span>
          <Badge style={{ backgroundColor: color }} className="text-white">{data.usedPct}%</Badge>
        </div>
        <div className="mt-1 text-lg font-semibold text-foreground">
          {data.value} / {data.total}
        </div>
        <Progress value={data.usedPct} className="mt-2 h-2" style={{ ['--progress-color' as string]: color }} />
      </CardContent>
    </Card>
  );
}
```

> shadcn `Progress`는 기본적으로 `bg-primary`를 씁니다. 위처럼 threshold별 색상을 적용하려면
> `src/components/ui/progress.tsx`의 `Indicator`에 `style={{ backgroundColor: 'var(--progress-color)' }}`를 추가하세요.

### Phase 1 완료 체크

```powershell
npm run storybook
```

`📐 Layout`, `📊 KPI Cards` 그룹에 8개 컴포넌트 스토리가 모두 보이고, `status` 값 변경(Warning/Critical)에 따라 색상이 바뀌는지 Storybook Controls 패널에서 확인합니다.

---

## Phase 2 — ECharts 차트

echarts-for-react 공통 패턴: `ReactECharts option={...} theme={DL_OPS_DARK_THEME}`.

### 2-1. `SparklineChart`

**`SparklineChart.types.ts`**

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface SparklineChartProps {
  data: number[];
  height?: number;
  status?: StatusLevel;
}
```

**`SparklineChart.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { STATUS_COLORS } from '@/tokens/colors';
import type { SparklineChartProps } from './SparklineChart.types';

export function SparklineChart({ data, height = 32, status = 'info' }: SparklineChartProps) {
  const option = {
    grid: { left: 0, right: 0, top: 4, bottom: 0 },
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data,
      smooth: true,
      symbol: 'none',
      lineStyle: { color: STATUS_COLORS[status], width: 1.5 },
      areaStyle: { color: STATUS_COLORS[status], opacity: 0.15 },
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} opts={{ renderer: 'svg' }} />;
}
```

### 2-2. `TrendLineChart`

**`TrendLineChart.types.ts`**

```typescript
import type { ChartBaseProps, SeriesConfig } from '@/tokens/base.types';

export interface TrendLineChartProps extends ChartBaseProps {
  series: SeriesConfig[];
  xLabels: (string | number)[];
}
```

**`TrendLineChart.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { TrendLineChartProps } from './TrendLineChart.types';

export function TrendLineChart({ series, xLabels, height = 240, isLoading, error }: TrendLineChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;
  if (error) return <div className="flex items-center justify-center text-sm text-status-critical" style={{ height }}>{error}</div>;
  if (series.length === 0) return <div className="flex items-center justify-center text-sm text-muted-foreground" style={{ height }}>No data</div>;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    grid: { left: 40, right: 20, top: 32, bottom: 24 },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: { ...DL_OPS_DARK_THEME.xAxis, type: 'category', data: xLabels },
    yAxis: { ...DL_OPS_DARK_THEME.yAxis, type: 'value' },
    dataZoom: [{ type: 'inside' }, { type: 'slider', height: 16 }],
    series: series.map((s) => ({
      name: s.name,
      type: 'line',
      data: s.data.map((d) => d.value),
      smooth: true,
      lineStyle: { color: s.color, type: s.dashed ? 'dashed' : 'solid' },
      itemStyle: { color: s.color },
    })),
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} theme="dark" notMerge />;
}
```

### 2-3. `BarChart`

**`BarChart.types.ts`**

```typescript
import type { ChartBaseProps } from '@/tokens/base.types';

export interface BarChartProps extends ChartBaseProps {
  categories: string[];
  values: number[];
  colors?: string[];
  orientation?: 'horizontal' | 'vertical';
}
```

**`BarChart.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { BarChartProps } from './BarChart.types';

export function BarChart({ categories, values, colors, orientation = 'vertical', height = 240, isLoading }: BarChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const categoryAxis = { ...DL_OPS_DARK_THEME.xAxis, type: 'category' as const, data: categories };
  const valueAxis = { ...DL_OPS_DARK_THEME.yAxis, type: 'value' as const };

  const option = {
    ...DL_OPS_DARK_THEME,
    grid: { left: orientation === 'horizontal' ? 80 : 40, right: 20, top: 16, bottom: 24 },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: orientation === 'horizontal' ? valueAxis : categoryAxis,
    yAxis: orientation === 'horizontal' ? categoryAxis : valueAxis,
    series: [{
      type: 'bar',
      data: values.map((v, i) => ({ value: v, itemStyle: { color: colors?.[i] } })),
      barMaxWidth: 28,
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
```

### 2-4. `StackedBarChart`

**`StackedBarChart.types.ts`**

```typescript
import type { ChartBaseProps, SeriesConfig } from '@/tokens/base.types';

export interface StackedBarChartProps extends ChartBaseProps {
  categories: string[];
  series: SeriesConfig[];
}
```

**`StackedBarChart.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { StackedBarChartProps } from './StackedBarChart.types';

export function StackedBarChart({ categories, series, height = 240, isLoading }: StackedBarChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: { top: 0, textStyle: { color: '#94a3b8' } },
    grid: { left: 40, right: 20, top: 32, bottom: 24 },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'axis' },
    xAxis: { ...DL_OPS_DARK_THEME.xAxis, type: 'category', data: categories },
    yAxis: { ...DL_OPS_DARK_THEME.yAxis, type: 'value' },
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      stack: 'total',
      data: s.data.map((d) => d.value),
      itemStyle: { color: s.color },
    })),
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
```

### 2-5. `DonutRingChart`

**`DonutRingChart.types.ts`**

```typescript
import type { ChartBaseProps } from '@/tokens/base.types';

export interface DonutSlice {
  name: string;
  value: number;
  color?: string;
}

export interface DonutRingChartProps extends ChartBaseProps {
  data: DonutSlice[];
}
```

**`DonutRingChart.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import { DL_OPS_DARK_THEME } from '@/tokens/theme.echarts';
import type { DonutRingChartProps } from './DonutRingChart.types';

export function DonutRingChart({ data, height = 240, isLoading }: DonutRingChartProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const option = {
    ...DL_OPS_DARK_THEME,
    legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: '#94a3b8' } },
    tooltip: { ...DL_OPS_DARK_THEME.tooltip, trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['55%', '75%'],
      center: ['35%', '50%'],
      data: data.map((d) => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
      label: { show: false },
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
```

### 2-6. `GaugeRing`

**`GaugeRing.types.ts`**

```typescript
import type { ChartBaseProps } from '@/tokens/base.types';

export interface GaugeRingProps extends ChartBaseProps {
  value: number;
  target?: number;
  warningThreshold?: number;
  unit?: string;
}
```

**`GaugeRing.tsx`**

```tsx
import ReactECharts from 'echarts-for-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { GaugeRingProps } from './GaugeRing.types';

export function GaugeRing({ value, target, warningThreshold = 80, unit = '%', height = 200, isLoading }: GaugeRingProps) {
  if (isLoading) return <Skeleton style={{ height }} className="w-full" />;

  const option = {
    series: [{
      type: 'gauge',
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [warningThreshold / 100, '#22c55e'],
            [1, '#ef4444'],
          ],
        },
      },
      pointer: { itemStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: { valueAnimation: true, formatter: `{value}${unit}`, color: '#e2e8f0', fontSize: 20, offsetCenter: [0, '60%'] },
      data: [{ value }],
      ...(target !== undefined && {
        anchor: { show: false },
      }),
    }],
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} notMerge />;
}
```

### 각 차트 Story 공통 템플릿

각 차트 폴더에 `X.stories.tsx`를 아래 패턴으로 만듭니다 (예: `TrendLineChart.stories.tsx`):

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TrendLineChart } from './TrendLineChart';

const meta: Meta<typeof TrendLineChart> = {
  title: '📈 Charts/ECharts/TrendLineChart',
  component: TrendLineChart,
};
export default meta;
type Story = StoryObj<typeof TrendLineChart>;

const xLabels = ['09:00', '09:05', '09:10', '09:15', '09:20', '09:25'];
const series = [
  { name: 'Producer', data: xLabels.map((l, i) => ({ label: l, value: 100 + i * 5 })), color: '#3b82f6' },
  { name: 'Consumer', data: xLabels.map((l, i) => ({ label: l, value: 90 + i * 4 })), color: '#22c55e' },
];

export const Default: Story = { args: { series, xLabels, height: 240 } };
export const WithWarning: Story = { args: { ...Default.args, error: undefined } };
export const Loading: Story = { args: { ...Default.args, isLoading: true } };
export const Empty: Story = { args: { ...Default.args, series: [] } };
```

`BarChart`, `StackedBarChart`, `DonutRingChart`, `GaugeRing`, `SparklineChart` 도 각자의 props에 맞춰 동일한 4종 스토리(Default / WithWarning / Loading / Empty)를 만듭니다.

### Phase 2 완료 체크

```powershell
npm run storybook
```

`📈 Charts/ECharts` 그룹 6개 컴포넌트 모두 렌더링되고, `isLoading` 토글 시 Skeleton으로 바뀌는지 확인.

---

## Phase 3 — recharts 대응 (학습 브랜치)

같은 폴더에 `*.recharts.tsx`를 추가합니다. **props 타입은 ECharts 버전과 100% 동일**하게 유지하는 것이 핵심입니다.

```powershell
npm install recharts   # Phase 0에서 이미 설치했다면 생략
```

### 3-1. `TrendLineChart.recharts.tsx`

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrendLineChartProps } from './TrendLineChart.types';

export function TrendLineChartRecharts({ series, xLabels, height = 240, isLoading }: TrendLineChartProps) {
  if (isLoading) return <div style={{ height }} className="animate-pulse bg-muted/20 rounded" />;

  const data = xLabels.map((label, i) => {
    const row: Record<string, string | number> = { label };
    series.forEach((s) => { row[s.name] = s.data[i]?.value ?? 0; });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="label" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
        <Legend />
        {series.map((s) => (
          <Line key={s.name} type="monotone" dataKey={s.name} stroke={s.color} dot={false} strokeDasharray={s.dashed ? '4 4' : undefined} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
```

### 3-2. `BarChart.recharts.tsx`

```tsx
import { BarChart as RBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import type { BarChartProps } from './BarChart.types';

export function BarChartRecharts({ categories, values, colors, orientation = 'vertical', height = 240 }: BarChartProps) {
  const data = categories.map((c, i) => ({ name: c, value: values[i] }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} layout={orientation === 'horizontal' ? 'vertical' : 'horizontal'}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        {orientation === 'horizontal' ? (
          <><XAxis type="number" stroke="#94a3b8" /><YAxis type="category" dataKey="name" stroke="#94a3b8" /></>
        ) : (
          <><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /></>
        )}
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
        <Bar dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={colors?.[i] ?? '#3b82f6'} />)}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}
```

### 3-3. `DonutRingChart.recharts.tsx`

```tsx
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import type { DonutRingChartProps } from './DonutRingChart.types';

export function DonutRingChartRecharts({ data, height = 240 }: DonutRingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="75%">
          {data.map((d, i) => <Cell key={i} fill={d.color ?? '#3b82f6'} />)}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
        <Legend layout="vertical" align="right" verticalAlign="middle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### 3-4. 각 Story에 `RechartsVariant` 추가

`TrendLineChart.stories.tsx` 맨 아래에 추가:

```tsx
import { TrendLineChartRecharts } from './TrendLineChart.recharts';

export const RechartsVariant: Story = {
  name: 'recharts (학습 비교)',
  render: (args) => <TrendLineChartRecharts {...args} />,
  args: Default.args,
};
```

`BarChart.stories.tsx`, `DonutRingChart.stories.tsx`에도 동일하게 추가합니다.

### Phase 3 완료 체크

Storybook에서 각 차트의 `RechartsVariant` 스토리를 열어 동일한 데이터로 ECharts 버전과 시각적으로 비교되는지 확인.

---

## Phase 4 — 테이블

```powershell
npm install @tanstack/react-table   # Phase 0에서 이미 설치했다면 생략
```

### 4-1. `StatusDataTable`

**`StatusDataTable.types.ts`**

```typescript
export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  statusKey?: keyof T;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface StatusDataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
}
```

**`StatusDataTable.tsx`**

```tsx
import { useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  createColumnHelper, flexRender, type SortingState,
} from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { STATUS_COLORS, type StatusLevel } from '@/tokens/colors';
import type { StatusDataTableProps } from './StatusDataTable.types';

export function StatusDataTable<T extends Record<string, unknown>>({ columns, data, isLoading }: StatusDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<T>();

  const tableColumns = columns.map((col) =>
    columnHelper.accessor((row) => row[col.key], {
      id: String(col.key),
      header: col.header,
      enableSorting: col.sortable ?? false,
      cell: (info) => {
        const value = info.getValue();
        const row = info.row.original;
        const status = col.statusKey ? (row[col.statusKey] as StatusLevel | undefined) : undefined;
        const content = col.render ? col.render(value, row) : String(value);
        return (
          <span style={status ? { color: STATUS_COLORS[status] } : undefined}>
            {content}
          </span>
        );
      },
    }),
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? ''}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### 4-2. `AlertEventTable`

**`AlertEventTable.types.ts`**

```typescript
export type AlertSeverity = 'Critical' | 'Warning' | 'Info';

export interface AlertEvent {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  message: string;
  target: string;
  status?: 'ack' | 'unack';
  detail?: string;
}

export interface AlertEventTableProps {
  events: AlertEvent[];
  showAckColumn?: boolean;
  isLoading?: boolean;
}
```

**`AlertEventTable.tsx`**

```tsx
import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { STATUS_COLORS } from '@/tokens/colors';
import type { AlertEventTableProps, AlertSeverity } from './AlertEventTable.types';

const SEVERITY_COLOR: Record<AlertSeverity, string> = {
  Critical: STATUS_COLORS.critical,
  Warning: STATUS_COLORS.warning,
  Info: STATUS_COLORS.info,
};

export function AlertEventTable({ events, showAckColumn, isLoading }: AlertEventTableProps) {
  const [filter, setFilter] = useState<'All' | AlertSeverity>('All');

  if (isLoading) return <Skeleton className="h-40 w-full" />;

  const filtered = filter === 'All' ? events : events.filter((e) => e.severity === filter);

  return (
    <div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
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
              <TableCell className="text-xs text-muted-foreground">{new Date(e.timestamp).toLocaleTimeString()}</TableCell>
              <TableCell><Badge style={{ backgroundColor: SEVERITY_COLOR[e.severity] }} className="text-white">{e.severity}</Badge></TableCell>
              <TableCell>{e.message}</TableCell>
              <TableCell className="text-xs">{e.target}</TableCell>
              {showAckColumn && (
                <TableCell>
                  <Badge variant={e.status === 'ack' ? 'secondary' : 'destructive'}>{e.status ?? 'unack'}</Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

각 컴포넌트에 `X.stories.tsx`를 만들어 mock 이벤트 5~10개, `showAckColumn: true/false` 두 스토리를 등록합니다.

### Phase 4 완료 체크

Storybook `📋 Tables` 그룹에서 Critical/Warning/Info 탭 클릭 시 목록이 필터링되고, 컬럼 헤더 클릭 시 정렬되는지 확인.

---

## Phase 5 — 파이프라인 & 토폴로지

### 5-0. 설계 검토 — React Flow(`@xyflow/react`) 도입 여부

이 프로젝트에는 "노드를 선으로 연결해서 보여주는" 화면이 두 가지 성격으로 나뉘어 존재합니다. 둘을 구분해서 다른 방식을 채택합니다.

| | Ch2 파이프라인 흐름도(2-5) / Ch4 Cluster Overview(4-4) | Ch3 Kafka 브로커 토폴로지(3-4) / Ch5 MinIO 토폴로지 |
|---|---|---|
| 구조 | 방향성 있는 트리/DAG — Ch2는 소스 5개(KOVIS/XROIS/IRIS/KOTRIS/문서-VOC)가 Adapter → Kafka → Sink → Storage → Spark → Trino → Milvus → Agent로 분기·합류, Ch4는 Master 1개 → Worker N개 단순 fan-out | 방향성 없는 mesh network — 브로커 5개, MinIO 노드 8개가 서로 연결 |
| 원래 계획 | `PipelineFlowNode`(카드) + `PipelineFlowConnector`(수동 SVG bezier `d3.path()` 계산)를 flex/grid로 직접 배치 (5-1, 5-2) | `d3.forceSimulation`을 `useEffect`에서 돌려 `svg.select(...).join(...)`으로 **DOM을 직접 조작** (5-3) |
| 원래 계획의 한계 | 커넥터 좌표를 손으로 계산(가이드 5-2도 "지저분한 트릭"이라고 자체적으로 지적), 분기가 있는 DAG일수록 좌표 수작업 부담 증가, pan/zoom 없어 화면보다 넓어지면 잘림 | 노드 수가 적어(5~8개) 실사용상 문제는 적음 — 다만 D3가 React 렌더 트리 바깥에서 직접 DOM을 그리고 지우는 방식이라 선언형 모델과 어긋남 |
| React Flow 도입 시 | 노드/엣지가 순수 데이터(P2 "props-only reuse"에 부합), `PipelineFlowNode`를 커스텀 노드로 그대로 재사용 가능, pan/zoom/fitView 기본 제공, 필요 시 `dagre`로 자동 레이아웃 추가 가능 | React Flow의 기본 레이아웃은 DAG 지향이라 mesh에는 안 맞음 — 도입하려면 d3-force로 좌표만 계산하고 렌더링만 React Flow로 넘기는 하이브리드가 필요(완전 대체 아님) |

**결정:**
- **Ch2 / Ch4 → React Flow 도입.** 두 화면 모두 "부모→자식 방향으로 뻗어나가는" 구조라는 공통점이 있으므로, `PipelineFlowDiagram`(5-2b) 컴포넌트 하나를 만들어 두 화면에서 재사용합니다. `PipelineFlowConnector`(5-2, 수동 bezier)는 이 컴포넌트 도입 후 더 이상 쓰지 않아도 되지만, 가이드에는 비교 참고용으로 남겨둡니다.
- **Ch3 / Ch5 → 기존 `d3-force` 방식 유지.** mesh 토폴로지에는 React Flow가 이득이 크지 않고, 노드 수도 적어 원래 계획(5-3)대로 진행합니다. `useEffect` 안 DOM 직접 조작이 신경 쓰이면 "좌표만 d3-force, 렌더링은 React Flow 커스텀 노드"로 바꾸는 하이브리드를 고려할 수 있지만(5-3 하단 참고), 필수 변경 사항은 아닙니다.
- 두 다이어그램 모두 **읽기 전용 상태 표시**이므로 React Flow의 편집 기능(`nodesDraggable`, `nodesConnectable`, `elementsSelectable`)은 꺼두고 pan/zoom(`fitView`)만 남깁니다.

> `reactflow` 패키지는 v12부터 `@xyflow/react`로 이름이 바뀌었습니다. 새 패키지명으로 설치하세요(0-5 참고). React Flow를 사용하는 페이지(또는 `main.tsx`)에서 `import '@xyflow/react/dist/style.css';`를 한 번 임포트해야 기본 컨트롤/엣지 스타일이 정상 렌더링됩니다.

### 5-1. `PipelineFlowNode`

**`PipelineFlowNode.types.ts`**

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface PipelineFlowNodeProps {
  name: string;
  metrics: { label: string; value: string | number }[];
  sparklineData?: number[];
  status: StatusLevel;
  isLoading?: boolean;
}
```

**`PipelineFlowNode.tsx`**

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SparklineChart } from '@/components/charts/SparklineChart';
import { STATUS_COLORS } from '@/tokens/colors';
import type { PipelineFlowNodeProps } from './PipelineFlowNode.types';

export function PipelineFlowNode({ name, metrics, sparklineData, status, isLoading }: PipelineFlowNodeProps) {
  if (isLoading) return <Card className="w-44 bg-card border-border"><CardContent className="pt-4"><Skeleton className="h-20 w-full" /></CardContent></Card>;

  return (
    <Card className="w-44 border-2" style={{ borderColor: STATUS_COLORS[status] }}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">{name}</span>
          <Badge style={{ backgroundColor: STATUS_COLORS[status] }} className="text-white text-[10px]">{status}</Badge>
        </div>
        <div className="mt-2 space-y-0.5">
          {metrics.map((m) => (
            <div key={m.label} className="flex justify-between text-[11px] text-muted-foreground">
              <span>{m.label}</span><span className="text-foreground">{m.value}</span>
            </div>
          ))}
        </div>
        {sparklineData && <SparklineChart data={sparklineData} height={24} status={status} />}
      </CardContent>
    </Card>
  );
}
```

### 5-2. `PipelineFlowConnector` (D3 Bezier)

**`PipelineFlowConnector.types.ts`**

```typescript
export interface PipelineFlowConnectorProps {
  label?: string;
  isBottleneck?: boolean;
  width?: number;
  height?: number;
}
```

**`PipelineFlowConnector.tsx`**

```tsx
import { useMemo } from 'react';
import * as d3 from 'd3';
import type { PipelineFlowConnectorProps } from './PipelineFlowConnector.types';

export function PipelineFlowConnector({ label, isBottleneck, width = 60, height = 40 }: PipelineFlowConnectorProps) {
  const path = useMemo(() => {
    const start: [number, number] = [0, height / 2];
    const end: [number, number] = [width, height / 2];
    const c1: [number, number] = [width * 0.4, height / 2];
    const c2: [number, number] = [width * 0.6, height / 2];
    return d3.path(), `M${start} C${c1},${c2},${end}`;
  }, [width, height])[1] as unknown as string;

  const color = isBottleneck ? '#ef4444' : '#334155';

  return (
    <svg width={width} height={height}>
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeDasharray={isBottleneck ? '4 3' : undefined} markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill={color} />
        </marker>
      </defs>
      {label && (
        <text x={width / 2} y={height / 2 - 8} textAnchor="middle" fontSize={10} fill="#94a3b8">{label}</text>
      )}
    </svg>
  );
}
```

> 위 `useMemo`의 튜플 트릭이 지저분하므로 실제로는 아래처럼 단순화하는 걸 권장합니다.

```tsx
const path = `M0,${height / 2} C${width * 0.4},${height / 2} ${width * 0.6},${height / 2} ${width},${height / 2}`;
```

(d3.path()는 노드-링크가 더 복잡해지는 TopologyDiagram에서 본격적으로 사용합니다.)

> `PipelineFlowConnector`는 5-0 결정에 따라 React Flow 도입 후에는 실제로 쓰이지 않습니다(비교 참고용). Ch2/Ch4에는 5-2b `PipelineFlowDiagram`을 사용하세요.

### 5-2b. `PipelineFlowDiagram` (React Flow 조합 — Ch2/Ch4 적용, 5-1/5-2 대체)

5-0에서 결정한 대로 Ch2 파이프라인 흐름도(2-5)와 Ch4 Spark Cluster Overview(4-4, Master→Worker 트리)는 이 컴포넌트 하나로 조립합니다. `PipelineFlowNode`(5-1)는 그대로 재사용하고, 커넥터만 React Flow의 내장 edge로 대체합니다.

**`PipelineFlowDiagram.types.ts`**

```typescript
import type { Node, Edge } from '@xyflow/react';
import type { PipelineFlowNodeProps } from '@/components/flow/PipelineFlowNode/PipelineFlowNode.types';

export type PipelineFlowNodeType = Node<PipelineFlowNodeProps, 'pipelineNode'>;

export interface PipelineFlowEdgeData {
  isBottleneck?: boolean;
}

export type PipelineFlowEdgeType = Edge<PipelineFlowEdgeData>;

export interface PipelineFlowDiagramProps {
  nodes: PipelineFlowNodeType[];
  edges: PipelineFlowEdgeType[];
  height?: number;
}
```

**`PipelineFlowDiagram.tsx`**

```tsx
import { ReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PipelineFlowNode } from '@/components/flow/PipelineFlowNode';
import type { PipelineFlowDiagramProps, PipelineFlowNodeType } from './PipelineFlowDiagram.types';

function FlowNodeRenderer({ data }: NodeProps<PipelineFlowNodeType>) {
  return (
    <>
      <Handle type="target" position={Position.Top} className="border-0! bg-transparent!" />
      <PipelineFlowNode {...data} />
      <Handle type="source" position={Position.Bottom} className="border-0! bg-transparent!" />
    </>
  );
}

const nodeTypes = { pipelineNode: FlowNodeRenderer };

export function PipelineFlowDiagram({ nodes, edges, height = 360 }: PipelineFlowDiagramProps) {
  const styledEdges = edges.map((e) => ({
    ...e,
    type: 'smoothstep',
    animated: e.data?.isBottleneck === true,
    style: {
      stroke: e.data?.isBottleneck ? '#ef4444' : '#334155',
      strokeWidth: 2,
      strokeDasharray: e.data?.isBottleneck ? '4 3' : undefined,
    },
    labelStyle: { fill: '#94a3b8', fontSize: 10 },
    labelBgStyle: { fill: '#1e293b' },
  }));

  return (
    <div style={{ height }}>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll={false}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Background color="#1e293b" gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
```

**적용 예 1 — Ch2 파이프라인 흐름도** (좌우 방향, `Handle`을 `Position.Left`/`Position.Right`로 바꿔서 사용): 소스 5개(KOVIS/XROIS/IRIS/KOTRIS/문서-VOC)가 같은 x열에서 y만 분산되도록 좌표를 잡고, Adapter → Kafka → Sink → Storage → Spark → Trino → Milvus → Agent 순으로 x를 증가시킵니다. 노드/엣지 수가 늘어나 좌표를 손으로 잡기 부담스러워지면 `npm install dagre @types/dagre` 후 `dagre.layout()`으로 `position`을 자동 계산하는 것을 검토하세요.

**적용 예 2 — Ch4 Spark Cluster Overview** (위→아래 방향, 위 코드 그대로): Master 노드 1개를 상단 중앙에 두고, Worker 노드 N개를 하단에 균등 간격으로 배치합니다.

```tsx
// src/mocks/spark.mock.ts (발췌)
import type { PipelineFlowNodeType, PipelineFlowEdgeType } from '@/components/flow/PipelineFlowDiagram/PipelineFlowDiagram.types';

export const sparkClusterNodes: PipelineFlowNodeType[] = [
  { id: 'master', type: 'pipelineNode', position: { x: 300, y: 0 }, data: {
    name: 'Spark Master (Primary)', status: 'normal',
    metrics: [{ label: 'Uptime', value: '25d 14h' }, { label: 'CPU', value: '18%' }, { label: 'MEM', value: '28%' }],
  } },
  ...['Worker-01', 'Worker-02', 'Worker-03', 'Worker-04'].map((name, i) => ({
    id: `worker-${i + 1}`, type: 'pipelineNode' as const, position: { x: i * 200, y: 160 },
    data: {
      name, status: 'normal' as const,
      metrics: [{ label: 'Executors', value: 10 }, { label: 'Cores', value: '40 / 80GB' }, { label: 'CPU', value: '26%' }],
    },
  })),
];

export const sparkClusterEdges: PipelineFlowEdgeType[] = ['1', '2', '3', '4'].map((n) => ({
  id: `master-worker-${n}`, source: 'master', target: `worker-${n}`,
}));
```

```tsx
// src/pages/Spark.tsx (Cluster Overview 섹션 발췌)
<SectionPanel title="Spark Cluster Overview">
  <PipelineFlowDiagram nodes={sparkClusterNodes} edges={sparkClusterEdges} height={280} />
</SectionPanel>
```

### 5-3. `TopologyDiagram` (D3 force layout)

**`TopologyDiagram.types.ts`**

```typescript
import type { StatusLevel } from '@/tokens/colors';

export interface TopologyNode {
  id: string;
  label: string;
  status: StatusLevel;
  badges?: { label: string; value: string }[];
  isController?: boolean;
}

export interface TopologyEdge {
  source: string;
  target: string;
}

export interface TopologyDiagramProps {
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  width?: number;
  height?: number;
}
```

**`TopologyDiagram.tsx`**

```tsx
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { STATUS_COLORS } from '@/tokens/colors';
import type { TopologyDiagramProps } from './TopologyDiagram.types';

type SimNode = TopologyDiagramProps['nodes'][number] & d3.SimulationNodeDatum;

export function TopologyDiagram({ nodes, edges, width = 480, height = 320 }: TopologyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks = edges.map((e) => ({ ...e }));

    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5);

    const node = svg.append('g')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .call(
        d3.drag<SVGGElement, SimNode>()
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; }),
      );

    node.append('circle')
      .attr('r', 24)
      .attr('fill', (d) => STATUS_COLORS[d.status])
      .attr('stroke', (d) => (d.isController ? '#e2e8f0' : 'none'))
      .attr('stroke-width', 2);

    node.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 40)
      .attr('fill', '#e2e8f0')
      .attr('font-size', 11);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [nodes, edges, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
}
```

**`TopologyDiagram.stories.tsx`** — Kafka 5-broker / MinIO 8-node 목 데이터:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TopologyDiagram } from './TopologyDiagram';

const meta: Meta<typeof TopologyDiagram> = {
  title: '🔗 Flow & Topology/TopologyDiagram',
  component: TopologyDiagram,
};
export default meta;
type Story = StoryObj<typeof TopologyDiagram>;

export const KafkaBrokers: Story = {
  args: {
    nodes: [
      { id: 'b1', label: 'broker-1', status: 'normal', isController: true },
      { id: 'b2', label: 'broker-2', status: 'normal' },
      { id: 'b3', label: 'broker-3', status: 'warning' },
      { id: 'b4', label: 'broker-4', status: 'normal' },
      { id: 'b5', label: 'broker-5', status: 'critical' },
    ],
    edges: [
      { source: 'b1', target: 'b2' }, { source: 'b1', target: 'b3' },
      { source: 'b1', target: 'b4' }, { source: 'b1', target: 'b5' },
      { source: 'b2', target: 'b3' },
    ],
  },
};

export const MinioNodes: Story = {
  args: {
    nodes: Array.from({ length: 8 }, (_, i) => ({
      id: `node-${i + 1}`,
      label: `minio-${i + 1}`,
      status: (i === 6 ? 'warning' : 'normal') as const,
    })),
    edges: Array.from({ length: 8 }, (_, i) => ({ source: `node-${i + 1}`, target: `node-${((i + 1) % 8) + 1}` })),
  },
};
```

> **선택 사항(하이브리드):** 위 구현은 D3가 React 렌더 트리 바깥에서 직접 DOM을 그리고 지우는 방식이라 신경 쓰인다면, 좌표 계산만 `d3-force`에 맡기고 렌더링은 React Flow 커스텀 노드로 넘기는 방식도 가능합니다 — `useEffect`에서 `simulation.tick()`을 정적으로 여러 번 돌려 얻은 `{x, y}`를 React Flow `nodes[].position`에 매핑하면 됩니다. 다만 브로커(5개)·MinIO(8개)처럼 노드 수가 적을 때는 이런 전환의 이득이 크지 않으므로, 5-0 결정대로 **필수 변경 사항은 아닙니다.**

### Phase 5 완료 체크

- Storybook에서 `KafkaBrokers`/`MinioNodes` 스토리를 열어 노드를 드래그했을 때 위치가 물리 시뮬레이션을 따라 자연스럽게 재배치되는지 확인 (`TopologyDiagram`, d3-force).
- `PipelineFlowDiagram` 스토리(Ch2용 분기 흐름도, Ch4용 Master→Worker 트리)를 열어 `fitView`로 전체가 화면에 맞춰지고, 노드가 드래그되지 않으며(읽기 전용), 다이어그램이 컨테이너보다 넓을 때 pan으로 좌우 이동이 되는지 확인.

---

## Phase 6 — 4개 대시보드 화면 조립

### 6-1. 라우팅 설치

```powershell
npm install react-router-dom
```

**`src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**`src/App.tsx`**

```tsx
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { TopHeader } from '@/components/layout/TopHeader';
import { SideNav } from '@/components/layout/SideNav';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';
import Home from '@/pages/Home';
import Kafka from '@/pages/Kafka';
import Spark from '@/pages/Spark';
import PpsMinIO from '@/pages/PpsMinIO';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

const NAV_ITEMS = [
  { id: '/', label: 'Home', icon: <span>🏠</span> },
  { id: '/kafka', label: 'Kafka', icon: <span>📨</span> },
  { id: '/spark', label: 'Spark', icon: <span>⚡</span> },
  { id: '/pps-minio', label: 'PPS/MinIO', icon: <span>🪣</span> },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const lastRefresh = useAutoRefresh(autoRefresh, 5000);

  return (
    <TooltipProvider>
      <DashboardShell
        header={
          <TopHeader
            env="production" envOptions={['production', 'staging']} onEnvChange={() => {}}
            pipeline="all" pipelineOptions={['all', 'realtime', 'batch']} onPipelineChange={() => {}}
            autoRefresh={autoRefresh} onAutoRefreshChange={setAutoRefresh}
            lastRefresh={lastRefresh}
          />
        }
        sidebar={<SideNav items={NAV_ITEMS} activeId={location.pathname} onSelect={navigate} />}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kafka" element={<Kafka />} />
          <Route path="/spark" element={<Spark />} />
          <Route path="/pps-minio" element={<PpsMinIO />} />
        </Routes>
      </DashboardShell>
    </TooltipProvider>
  );
}
```

### 6-2. Auto Refresh 훅

**`src/hooks/useAutoRefresh.ts`**

```typescript
import { useEffect, useState } from 'react';

export function useAutoRefresh(enabled: boolean, intervalMs: number) {
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setLastRefresh(new Date().toLocaleTimeString()), intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs]);

  return lastRefresh;
}
```

목 데이터를 주기적으로 갱신하려면, 각 mock 파일을 `getXxxMock()` 함수로 감싸고 `useAutoRefresh`가 tick될 때마다 새 랜덤값을 생성하도록 바꾸면 됩니다 (예: `trend` 배열에 새 값을 push하고 shift).

### 6-3. Home 대시보드 조립 (2-1 ~ 2-11 패턴 예시)

**`src/pages/Home.tsx`**

```tsx
import { SectionPanel } from '@/components/layout/SectionPanel';
import { PipelineStageTimeline } from '@/components/layout/PipelineStageTimeline';
import { KpiCard } from '@/components/kpi/KpiCard';
import { TrendLineChart } from '@/components/charts/TrendLineChart';
import { AlertEventTable } from '@/components/tables/AlertEventTable';
import { homeKpis, homeAlerts, homeStages, homeTrend } from '@/mocks/home.mock';

export default function Home() {
  return (
    <div className="space-y-4">
      {/* 2-1: 파이프라인 전체 개요 */}
      <SectionPanel title="Pipeline Overview">
        <PipelineStageTimeline stages={homeStages} />
      </SectionPanel>

      {/* 2-2 ~ 2-4: KPI 카드 그리드 */}
      <div className="grid grid-cols-3 gap-4">
        {homeKpis.map((kpi) => <KpiCard key={kpi.label} data={kpi} />)}
      </div>

      {/* 2-5: 트래픽 트렌드 */}
      <SectionPanel title="End-to-End Latency Trend">
        <TrendLineChart series={homeTrend.series} xLabels={homeTrend.xLabels} height={260} />
      </SectionPanel>

      {/* 2-11: 최근 알림 */}
      <SectionPanel title="Recent Alerts">
        <AlertEventTable events={homeAlerts} showAckColumn />
      </SectionPanel>
    </div>
  );
}
```

`homeStages`, `homeTrend`를 `src/mocks/home.mock.ts`에 추가합니다:

```typescript
export const homeStages = [
  { name: 'CDC', count: 4, status: 'normal' as const },
  { name: 'Kafka', count: 12, status: 'normal' as const },
  { name: 'Iceberg', count: 2, status: 'warning' as const },
  { name: 'Spark', count: 6, status: 'normal' as const },
  { name: 'Milvus', count: 1, status: 'normal' as const },
];

export const homeTrend = {
  xLabels: ['09:00', '09:05', '09:10', '09:15', '09:20'],
  series: [
    { name: 'Latency', color: '#3b82f6', data: [4.5, 4.3, 4.6, 4.2, 4.2].map((v, i) => ({ label: String(i), value: v })) },
  ],
};
```

나머지 섹션(2-6~2-10)은 `📊 DL_OPS_Dashboard_Spec.docx`의 해당 섹션 스펙을 확인하며 위와 동일한 패턴(`SectionPanel`로 감싸고 알맞은 차트/카드 컴포넌트를 배치)으로 채웁니다. 이 스킬의 `ch2_home_dashboard.md` 챕터 파일에 2-1~2-11 전체 섹션 목록이 정리되어 있으니, 섹션별로 "어떤 컴포넌트를 쓸지"는 위 **cheatsheet의 Component Selection Guide**를 참고해 결정하세요.

### 6-4. Kafka / Spark / PPS-MinIO 대시보드

`Home.tsx`와 완전히 동일한 조립 패턴입니다. 차이는 **어떤 목 데이터를 넣고 어떤 컴포넌트 조합을 쓰는지** 뿐입니다.

```tsx
// src/pages/Kafka.tsx
import { SectionPanel } from '@/components/layout/SectionPanel';
import { StatusDataTable } from '@/components/tables/StatusDataTable';
import { TopologyDiagram } from '@/components/topology/TopologyDiagram';
import { kafkaKpis, kafkaBrokerTopology, kafkaConsumerLagColumns, kafkaConsumerLagRows } from '@/mocks/kafka.mock';
import { KpiCard } from '@/components/kpi/KpiCard';

export default function Kafka() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {kafkaKpis.map((kpi) => <KpiCard key={kpi.label} data={kpi} />)}
      </div>

      <SectionPanel title="Broker Cluster Topology">
        <TopologyDiagram nodes={kafkaBrokerTopology.nodes} edges={kafkaBrokerTopology.edges} />
      </SectionPanel>

      <SectionPanel title="Consumer Lag by Topic">
        <StatusDataTable columns={kafkaConsumerLagColumns} data={kafkaConsumerLagRows} />
      </SectionPanel>
    </div>
  );
}
```

`Spark.tsx`, `PpsMinIO.tsx`도 동일한 방식이며, 각각 ch4/ch5 챕터의 섹션 스펙(4-1~4-13, 5-1~5-14)을 참고해 어떤 카드/차트/테이블을 배치할지 결정합니다. 스펙 원본은 `_docs/DL_OPS_Dashboard_Spec.docx`, `_docs/DataPipeLineDashboard.pptx`를 확인하세요.

### 6-5. `src/index.ts` — 라이브러리 진입점 (컴포넌트 re-export)

```typescript
export * from './components/layout/DashboardShell';
export * from './components/layout/TopHeader';
export * from './components/layout/SideNav';
export * from './components/layout/SectionPanel';
export * from './components/layout/PipelineStageTimeline';

export * from './components/kpi/KpiCard';
export * from './components/kpi/KpiCardCompound';
export * from './components/kpi/ProgressKpiCard';

export * from './components/charts/SparklineChart';
export * from './components/charts/TrendLineChart';
export * from './components/charts/BarChart';
export * from './components/charts/StackedBarChart';
export * from './components/charts/DonutRingChart';
export * from './components/charts/GaugeRing';

export * from './components/flow/PipelineFlowNode';
export * from './components/flow/PipelineFlowConnector';
export * from './components/flow/PipelineFlowDiagram';

export * from './components/tables/StatusDataTable';
export * from './components/tables/AlertEventTable';

export * from './components/topology/TopologyDiagram';
```

### Phase 6 완료 체크

```powershell
npm run dev
```

브라우저에서 `/`, `/kafka`, `/spark`, `/pps-minio` 각각 접속해 사이드바 클릭으로 라우팅이 전환되고, 5초마다 헤더의 "Last refresh" 시각이 갱신되는지 확인.

---

## 전체 진행 순서 요약

```
Phase 0  npm create vite → Tailwind v4(@tailwindcss/vite) → shadcn init/add(Radix+Nova)
         → echarts/recharts/d3/tanstack-table 설치 → storybook init
         → src/index.css(@theme inline)/tokens 작성 → mock 초안
Phase 1  SectionPanel → DashboardShell → TopHeader → SideNav → PipelineStageTimeline
         → KpiCard → KpiCardCompound → ProgressKpiCard (각 + Story)
Phase 2  SparklineChart → TrendLineChart → BarChart → StackedBarChart
         → DonutRingChart → GaugeRing (각 + 4종 Story)
Phase 3  각 차트에 *.recharts.tsx 추가 + RechartsVariant Story
Phase 4  StatusDataTable → AlertEventTable (각 + Story)
Phase 5  (5-0: React Flow 도입 검토) → PipelineFlowNode → PipelineFlowConnector → PipelineFlowDiagram(React Flow, Ch2/Ch4용)
         → TopologyDiagram(d3-force 유지, Ch3/Ch5용) (+ Kafka/MinIO Story)
Phase 6  react-router-dom 설치 → App.tsx 라우팅 → useAutoRefresh
         → Home/Kafka/Spark/PpsMinIO.tsx 조립 → src/index.ts re-export
```

각 Phase 끝에서 `npm run storybook` (컴포넌트 단위) 과 `npm run dev` (통합 화면) 를 번갈아 확인하면서 다음 Phase로 넘어가는 것을 권장합니다.
