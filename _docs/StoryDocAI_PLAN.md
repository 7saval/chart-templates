# StoryDoc AI — 구현 플래닝

> 컴포넌트 코드(Props, JSDoc)를 분석해 Storybook MDX 문서 초안 + variant Story 코드를 자동 생성하는 CLI 도구  
> chart-templates(CBA) 21개 컴포넌트를 실제 파일럿 대상으로 삼아 문서화율·소요시간 지표를 실측

---

## 목차

1. [문제 정의](#1-문제-정의)
2. [아키텍처](#2-아키텍처)
3. [프로젝트 구조 결정](#3-프로젝트-구조-결정)
4. [기술 스택](#4-기술-스택)
5. [출력 스펙](#5-출력-스펙)
6. [측정 지표 설계](#6-측정-지표-설계)
7. [포트폴리오 문장 초안](#7-포트폴리오-문장-초안)
8. [단계별 일정](#8-단계별-일정)
9. [리스크 & 오픈 이슈](#9-리스크--오픈-이슈)
10. [독립 레포 승격 계획](#10-독립-레포-승격-계획)

---

## 1. 문제 정의

컴포넌트 수가 많아지면 Storybook MDX 문서 작성이 항상 뒤로 밀린다.  
컴포넌트 코드(props, JSDoc)는 있는데 문서는 비어있거나 outdated인 경우가 흔하다.

**해결 방향**: 컴포넌트 코드를 정적 분석해서 "사용법 문서 초안 + variant Story 코드"를 자동 생성하는 CLI로, 0→1을 AI가 만들고 사람은 리뷰·수정만 하도록 워크플로우를 바꾼다.

### 스코프 경계 (중요)

- **자동화하는 것**: 문서/Story의 **초안** 생성 (사람이 반드시 리뷰)
- **자동화하지 않는 것**: 최종 병합, props 타입 자체의 정확성 검증, 디자인 의도 판단
- StoryDoc AI는 "작성 시간 단축 도구"이지 "문서 검수 없이 자동 배포되는 도구"가 아니다 — 지표 설계(6장)에서도 이 경계를 그대로 반영한다.

---

## 2. 아키텍처

```
.tsx 컴포넌트 파일
      │
      ▼
① AST 파서 (react-docgen-typescript)
   - Props 인터페이스/타입, JSDoc 주석, default export 추출
   - 기존 *.stories.tsx가 있으면 함께 파싱 (증분 업데이트 판단용)
      │
      ▼
② 프롬프트 빌더
   - 추출한 메타데이터 → 구조화된 프롬프트로 변환
   - 기존 디자인시스템 컨벤션(Story 2~3개, 예: TrendLineChart.stories.tsx)을 few-shot으로 주입
   - JSON Schema로 출력 형식 고정 (tool use / structured output)
      │
      ▼
③ Claude API 호출 (claude-sonnet-5)
   - 출력 1: MDX 문서 초안 (설명, props 테이블, 사용 예시)
   - 출력 2: *.stories.tsx variant 코드 (Default, Loading, Empty, WithWarning 등)
      │
      ▼
④ 후처리
   - Prettier 포맷팅
   - 기존 파일과 diff 비교 → 변경분만 표시, 사람이 리뷰할 수 있게 로컬 diff / PR로 생성
```

### ① AST 파서: TS Compiler API 대신 `react-docgen-typescript`

원안은 "TypeScript Compiler API 또는 react-docgen-typescript"를 병기했지만, 하나로 확정한다.

| 항목 | TS Compiler API 직접 사용 | react-docgen-typescript |
|------|---------------------------|--------------------------|
| Props 추출 | 직접 AST 순회 구현 필요 | Props 인터페이스 + JSDoc을 이미 구조화해서 반환 |
| 구현 비용 | 높음 (checker, symbol 순회) | 낮음 (설정만) |
| 커스터마이징 | 완전 자유 | `propFilter`, `shouldExtractLiteralValuesFromEnum` 등으로 대부분 충분 |
| 생태계 검증 | - | Storybook 자체가 내부적으로 사용하는 라이브러리 |

**결정**: `react-docgen-typescript`로 1차 구현. 이 라이브러리로 못 뽑는 정보(예: 컴포넌트 폴더 내 mock 데이터 사용 패턴)만 TS Compiler API로 보완한다.

### ② 프롬프트 빌더 — few-shot 소스는 실제 파일

few-shot 예시는 새로 작성하지 않고, 이미 컨벤션이 잡혀 있는 기존 Story를 그대로 사용한다.

- `src/components/charts/TrendLineChart/TrendLineChart.stories.tsx` — Default / WithWarning / Loading / Empty 패턴
- `src/components/kpi/KpiCard/KpiCard.stories.tsx` — shadcn 조합형 컴포넌트 패턴
- `src/components/tables/AlertEventTable/AlertEventTable.stories.tsx` — Tabs/필터가 있는 복합 컴포넌트 패턴

### ③ Claude API — 모델명 정정

> 원안의 `claude-sonnet-4-6`은 존재하지 않는 모델 ID다. 실제 사용 가능한 모델은 `claude-sonnet-5`(Sonnet 5)이며, 본 계획은 이 모델 ID로 진행한다. 모델 ID는 Anthropic 콘솔에서 항상 재확인 후 설정값으로 분리해 관리한다(하드코딩 금지).

출력은 **JSON 모드(structured output)** 로 강제해서 두 파일로 분리 저장한다.

```typescript
// 기대 출력 스키마 (개념)
interface StoryDocOutput {
  mdx: string;        // 문서 초안 전체 (설명 + props 테이블 + 사용 예시)
  storyVariants: {
    name: string;      // "Default" | "Loading" | "Empty" | ...
    args: Record<string, unknown>;
  }[];
}
```

### ④ 후처리

- Prettier로 두 출력 모두 포맷팅 (레포의 `.prettierrc` 재사용)
- 기존 `*.stories.tsx` / `*.mdx`가 있으면 diff만 보여주고 **덮어쓰지 않음** — 새 파일은 `*.stories.ai.tsx.diff`처럼 별도 산출물로 만들어 사람이 머지
- CI(GitHub Actions)에 붙이는 경우: 문서 없는 컴포넌트가 새로 추가되면 초안을 PR 코멘트로 자동 첨부 (자동 커밋은 하지 않음 — AI 생성물이 리뷰 없이 머지되는 것을 원천 차단)

---

## 3. 프로젝트 구조 결정

원안은 "pnpm 모노레포 패키지(`packages/storydoc-ai`)"를 전제로 하지만, **chart-templates는 현재 pnpm 워크스페이스가 아니라 단일 Vite 패키지**다(`package.json` 확인 결과 `workspaces`/`packages/` 없음). 이 전제를 그대로 가져오면 없는 인프라를 먼저 만드는 작업이 선행돼야 한다.

| 옵션 | 설명 | 채택 여부 |
|------|------|-----------|
| A. `packages/storydoc-ai` (pnpm workspace) | 모노레포 전환이 선행 조건 | ✗ (범위 밖 선행 작업 발생) |
| B. `tools/storydoc-ai/` 독립 Node CLI | chart-templates 루트에 자체 `package.json`을 가진 폴더로 시작, 레포 구조 변경 없음 | ✓ 1차 채택 |
| C. 별도 레포로 분리 | 재사용성은 높지만 "실제 컴포넌트에 적용한 지표"를 뽑기 전엔 분리 이득이 없음 | 추후 검토 |

**결론**: `tools/storydoc-ai/`로 시작하고, PoC가 다른 프로젝트에서도 재사용할 가치가 검증되면 그때 별도 패키지/레포로 승격한다. 이 판단 자체도 "무엇이든 처음부터 모노레포로 설계하지 않는다"는 실무적 근거로 포트폴리오에 쓸 수 있다.

```
chart-templates/
├── src/                        기존 컴포넌트 라이브러리 (분석 대상)
├── tools/
│   └── storydoc-ai/
│       ├── package.json        독립 의존성 (commander, @anthropic-ai/sdk, react-docgen-typescript, prettier)
│       ├── src/
│       │   ├── cli.ts          commander 진입점
│       │   ├── parser/         AST 파싱 (react-docgen-typescript 래퍼)
│       │   ├── prompt/         프롬프트 빌더 + few-shot 템플릿
│       │   ├── client/         Anthropic SDK 어댑터 (인터페이스 분리, 3장 참고)
│       │   └── postprocess/    Prettier, diff 생성
│       └── tsconfig.json
└── _docs/
    └── StoryDocAI_PLAN.md      ← 이 문서
```

### 폐쇄망 대응: 어댑터 패턴

```typescript
// client/LLMClient.ts — 인터페이스만 고정
interface LLMClient {
  generate(prompt: string, schema: JSONSchema): Promise<StoryDocOutput>;
}

// client/AnthropicClient.ts   — 기본 구현 (claude-sonnet-5)
// client/LocalLLMClient.ts    — 사내 배포 가능한 sLLM으로 교체 (폐쇄망 환경)
```

CLI는 `LLMClient` 인터페이스에만 의존하므로, 폐쇄망 환경에서는 `AnthropicClient` → `LocalLLMClient`로 구현체만 바꿔 끼우면 된다. 이 경계는 처음부터 설계에 반영해야 나중에 리팩터링 비용이 없다.

---

## 4. 기술 스택

```
CLI 프레임워크    commander
AST 파싱         react-docgen-typescript
LLM 호출         @anthropic-ai/sdk (claude-sonnet-5, JSON 구조화 출력)
포맷팅           prettier (레포 기존 설정 재사용)
CI 통합          GitHub Actions (PR 코멘트로 초안 첨부, 자동 커밋 없음)
```

이미 이 레포에서 쓰고 있는 도구(Prettier, GitHub Actions 가능성)를 재사용하고, 새로 들여오는 것은 `commander`, `@anthropic-ai/sdk`, `react-docgen-typescript` 세 개로 최소화한다.

---

## 5. 출력 스펙

### MDX 문서 초안 (예시 형태)

```mdx
import { Meta, Canvas, Controls } from '@storybook/blocks';
import * as TrendLineChartStories from './TrendLineChart.stories';

<Meta of={TrendLineChartStories} />

# TrendLineChart

다중 시리즈 시계열을 표시하는 라인 차트. Consumer Lag, Traffic 등 실시간 추세 확인에 사용.

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `series` | `SeriesConfig[]` | - | 표시할 시계열 데이터 |
| `height` | `number` | `240` | 차트 높이(px) |
| `status` | `StatusLevel` | `'normal'` | 색상 강조 상태 |

## 사용 예시

<Canvas of={TrendLineChartStories.Default} />
```

### Story variant 코드 (예시 형태)

```tsx
export const Loading: Story = {
  args: { ...Default.args, isLoading: true },
};
export const Empty: Story = {
  args: { ...Default.args, series: [] },
};
```

두 출력 모두 **기존 컨벤션(PLANNING.md 10장 "모든 차트 Story 필수 Controls")을 그대로 따르도록 프롬프트에 강제**한다 — `status` / `isLoading` / `error` / `height` variant는 항상 포함.

---

## 6. 측정 지표 설계

| 지표 | 측정 방법 |
|------|-----------|
| 컴포넌트당 문서 작성 시간 (Before) | 기존 컴포넌트 3~5개를 수동으로 문서화하며 시간 측정 → baseline |
| 초안 생성 시간 (After) | CLI 실행 ~ 산출물 생성까지 소요 시간 (자동 로깅) |
| 리뷰/수정 시간 (After) | 초안을 실제로 머지 가능한 상태로 고치는 데 걸린 시간 (사람이 기록) |
| 문서화율 | (Storybook 문서가 존재하는 컴포넌트 수) / (전체 컴포넌트 수) — chart-templates 기준 분모는 21 |
| 초안 채택률 | 초안 대비 최종 머지본의 변경 비율 (git diff 라인 수 기반, 참고 지표) |

### 실측 대상: chart-templates 자체 컴포넌트 21개

`src/components/` 하위 실제 폴더 기준 (2026-07-14 현재):

```
charts/     BarChart, DonutRingChart, GaugeRing, SparklineChart, StackedBarChart, TrendLineChart  (6)
flow/       PipelineFlowConnector, PipelineFlowDiagram, PipelineFlowNode                            (3)
kpi/        KpiCard, KpiCardCompound, ProgressKpiCard                                                (3)
layout/     DashboardShell, PipelineStageTimeline, SectionPanel, SideNav, TopHeader                  (5)
misc/       MiniStatCell, RankedList                                                                 (2)
tables/     AlertEventTable, StatusDataTable                                                         (2)
topology/   TopologyDiagram                                                                          (1)
                                                                                          합계: 21개
```

원안의 "10~20개 실제 적용"보다 범위를 넓혀, **이 레포에 실제로 존재하는 컴포넌트 21개 전량**을 파일럿 대상으로 삼는다 — 표본을 임의로 줄이지 않아야 문서화율 수치가 조작처럼 보이지 않는다.

---

## 7. 포트폴리오 문장 초안

> FSD 기반 디자인 시스템(chart-templates, 컴포넌트 21개)에서 AST 파싱 + Claude API 구조화 출력으로 Storybook 문서 초안을 자동 생성하는 CLI를 설계·구현. 문서화율을 OO% → OO%로, 컴포넌트당 문서 작성 소요 시간을 평균 X분 → Y분(초안 생성 + 리뷰)으로 단축. 폐쇄망 배포를 고려해 LLM 클라이언트를 어댑터 패턴으로 분리 설계.

숫자(OO%, X분, Y분)는 4주차에 실측하기 전까지 채우지 않는다 — 임의로 채워 넣으면 면접에서 근거를 못 대는 리스크가 더 크다.

---

## 8. 단계별 일정

### 1주차 — AST 파서 + 메타데이터 추출 PoC

- [ ] `tools/storydoc-ai/` 스캐폴딩 (package.json, tsconfig, commander 진입점)
- [ ] `react-docgen-typescript`로 `KpiCard`, `TrendLineChart` 2개 컴포넌트 파싱 PoC
- [ ] Props/JSDoc/default export 추출 결과를 JSON으로 덤프해서 검증

### 2주차 — 프롬프트 설계 + Claude API 연동

- [ ] few-shot 소스 확정 (TrendLineChart / KpiCard / AlertEventTable Story)
- [ ] JSON Schema 기반 structured output 정의 및 `LLMClient` 인터페이스 구현
- [ ] `AnthropicClient` 구현체 연동 (claude-sonnet-5)

### 3주차 — MDX/Story 파일 생성 + 후처리

- [ ] MDX 문서 생성 → Prettier 포맷팅
- [ ] Story variant 코드 생성 → 기존 파일과 diff 비교 로직
- [ ] 기존 문서 있는 컴포넌트에 대한 "덮어쓰기 방지" 처리

### 4주차 — 실측 + 정리

- [ ] chart-templates 21개 컴포넌트 전체에 적용
- [ ] Before/After 시간, 문서화율 실측 후 표로 정리
- [ ] README + 데모 영상/GIF 정리
- [ ] 7장 포트폴리오 문장에 실측치 반영

---

## 9. 리스크 & 오픈 이슈

| 리스크 | 대응 |
|--------|------|
| AI 생성 문서가 사실과 다른 설명을 만들어낼 가능성(hallucination) | 초안은 항상 사람 리뷰 후 머지, CI는 코멘트만 남기고 자동 커밋 금지 |
| props 타입만으로는 "왜 이 prop이 필요한지" 맥락 파악 불가 | 컴포넌트 폴더 내 기존 JSDoc/README가 있으면 우선 few-shot에 포함해 맥락 보강 |
| 폐쇄망용 로컬 sLLM의 structured output 품질이 Claude 대비 떨어질 가능성 | 어댑터 경계는 미리 잡되, 로컬 모델 성능 검증은 이번 4주 일정에서 제외(범위 외로 명시) |
| 21개 전량 실측 시 API 비용 | 1주차 PoC 단계에서 컴포넌트 2~3개로 토큰 사용량 먼저 측정 후 전체 실행 여부 판단 |

---

## 10. 독립 레포 승격 계획

3장에서 `tools/storydoc-ai/`로 시작하기로 한 결정의 후속 조치. **4주차 실측이 끝나고 아래 승격 기준을 만족할 때만** 진행한다 — 검증 전에 미리 분리하면 대상 컴포넌트와 왔다갔다하며 개발 마찰만 커진다.

### 승격 기준 (하나라도 걸리면 보류)

- [ ] 문서화율 개선치가 실측으로 나왔다 (8장 4주차 산출물)
- [ ] chart-templates 이외의 프로젝트(예: 실제 FSD 대시보드 프로젝트)에도 적용해볼 필요가 실제로 생겼다
- [ ] `LLMClient` 어댑터 경계가 최소 1회 이상 실사용으로 검증됐다 (AnthropicClient 기준)

### 승격 절차

```
1) 이력 보존 분리
   git subtree split --prefix=tools/storydoc-ai -b storydoc-ai-extract
   → 새 레포 생성 후 push (커밋 이력이 유지되어야 "직접 만든 도구"라는 근거가 남는다)

2) chart-templates 의존 제거
   - few-shot 템플릿에서 chart-templates 전용 예시(TrendLineChart 등) 제거
   - 대신 범용 예시 1~2개로 교체하거나, --examples 옵션으로 외부에서 주입받게 변경
   - 프롬프트/문서에서 "chart-templates 전용" 표현 정리

3) 패키지 독립화
   - package.json name을 배포 가능한 이름으로 변경 (예: storydoc-ai)
   - README에 설치법 + 사용법 + 데모 GIF 추가 (7장 포트폴리오 문장과 연결)
   - LICENSE 추가

4) chart-templates 쪽 정리
   - tools/storydoc-ai/ 폴더 제거
   - 필요 시 devDependency로 새 패키지를 설치해서 "실제로 자기 도구를 자기 프로젝트에 쓰는" 구조로 되돌림 (dogfooding 근거)

5) 배포 여부 결정
   - 비공개로 GitHub 레포만 두고 포트폴리오 링크로 사용할지
   - npm에 공개 배포할지(선택) — 공개 배포는 유지보수 부담이 생기므로 필수는 아님
```

### 원칙

- **분리 자체가 목적이 아니다.** 승격 기준을 만족 못 하면 `tools/storydoc-ai/`에 그대로 두는 것도 정당한 결정이다.
- 분리 시점의 커밋 이력을 보존해서(`git subtree split`), "새 레포를 만들었다"가 아니라 "레포 안에서 검증한 도구를 분리했다"는 서사가 그대로 남게 한다.

---

## 참고 문서

- `PLANNING.md` — chart-templates 컴포넌트 카탈로그, Storybook 운영 전략(10장), CBA 구조
- [react-docgen-typescript GitHub](https://github.com/styleguidist/react-docgen-typescript)
- [Storybook CSF3 + MDX 공식 문서](https://storybook.js.org/docs/writing-docs/mdx)
