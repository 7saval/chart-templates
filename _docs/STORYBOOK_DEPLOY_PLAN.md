# Storybook 배포 계획

> 작성일: 2026-07-27
> 목적: `npm run storybook`(로컬 실행)에 그치던 컴포넌트 라이브러리(23개 스토리)를 외부에서 URL로 열람 가능한 형태로 배포하기 위한 계획.
> 전제: 현재 CI/CD 파이프라인이 전혀 없다(`.github/workflows` 디렉터리 자체가 없음). 이 문서는 그 첫 파이프라인을 Storybook 배포부터 시작하는 계획이다.

---

## 0. 현재 상태 점검 (배포 전 베이스라인)

- **빌드 확인**: `npm run build-storybook` 로컬 실행 결과 **정상 빌드 성공**, 출력 디렉터리 `storybook-static/`, Vite 빌드 자체는 약 6초.
  - 단, `storybook-static`이 아직 `.gitignore`에 없다 — 로컬에서 빌드하면 git이 추적하려 든다. 배포 방식과 무관하게 먼저 추가해야 함.
- **프레임워크**: `@storybook/react-vite` 10.4.6, 애드온: `@chromatic-com/storybook`, `@storybook/addon-a11y`, `@storybook/addon-docs`, `@storybook/addon-vitest`, `@storybook/addon-mcp`.
  - **`@chromatic-com/storybook`가 이미 설치·설정되어 있다** — Chromatic 배포를 염두에 두고 세팅된 흔적으로 보이며, Phase 1 결정에 참고할 것.
- **저장소**: GitHub `7saval/chart-templates`(public), 기존 워크플로 없음.
- **Node**: 로컬 개발 환경 v22.19.0 사용 중 — CI도 동일 메이저 버전(22.x) 권장.
- **알려진 이슈 — 스토리 파일 전수 lint 위반**: `npx eslint .` 기준 **스토리 파일 23개 중 22개**가 `storybook/no-renderer-packages`(렌더러 패키지 `@storybook/react`를 프레임워크 패키지 대신 직접 import) 위반. 여러 데브로그(7/23, 7/26)에서 "보류 중"으로 이월되어 온 항목이다.
  - **빌드 자체는 깨지지 않는다**(방금 확인). 하지만 CI에 `npm run lint`를 게이트로 넣으면 스토리 파일 22개 때문에 항상 실패한다 — Phase 3에서 CI 설계 시 반드시 고려해야 함.

---

## 1. 시작 전 결정해야 할 것 (Open Decisions)

### 1-1. 배포 대상 플랫폼

| 옵션 | 장점 | 단점 |
|---|---|---|
| **GitHub Pages** ★ 기본값 | 이 저장소만으로 완결(추가 외부 계정 불필요), public repo라 무료, 도메인이 `7saval.github.io/chart-templates`로 고정 | PR별 프리뷰 URL이 기본 제공 안 됨(직접 구성 시 추가 워크플로 필요), "최신 main" 스냅샷만 보여주는 단순 배포 |
| **Chromatic** | 애드온이 이미 설치되어 있어 추가 설정이 적음, PR마다 프리뷰 URL 자동 생성, 비주얼 회귀 테스트(스냅샷 diff)까지 겸함 | **외부 계정 생성 필요**(chromatic.com에 GitHub 저장소 연동 + `CHROMATIC_PROJECT_TOKEN` 발급) — 이 단계는 사용자가 직접 해야 함(에이전트가 대신 가입 불가) |

**권장**: Chromatic. 애드온이 이미 깔려있다는 것 자체가 원래 의도였을 가능성이 높고, 컴포넌트 라이브러리는 "PR에서 바로 변경된 컴포넌트를 눈으로 확인" 흐름의 가치가 커서 정적 배포보다 이점이 크다. 다만 Phase 2 착수 전 **사용자가 chromatic.com 계정을 만들고 프로젝트 토큰을 발급**해야 진행 가능 — 이 부분만 선행되면 나머지는 워크플로 파일 하나로 끝난다.

대안으로 GitHub Pages를 원하면 Phase 3-B로 바로 진행 가능(추가 계정 불필요, 가장 빠르게 "URL 하나"를 만드는 경로).

### 1-2. CI에 lint 게이트를 넣을지

★ 기본값: **일단 넣지 않는다.** 스토리 파일 22개의 `no-renderer-packages` 위반을 배포 파이프라인 구축의 선행 조건으로 묶으면 배포 자체가 늦어진다. 대신 Phase 4에서 별도 정리 작업으로 분리하고, 배포 워크플로는 `build-storybook`(타입체크 포함, `tsc -b`)만 게이트로 건다.

### 1-3. 배포 트리거 범위

★ 기본값: `main` 브랜치 push 시 배포(정식 URL 갱신) + PR 시 빌드만 검증(Chromatic 선택 시 PR 프리뷰까지 자동 포함). 모든 브랜치 push마다 배포하지 않음 — 불필요한 배포 소음 방지.

---

## Phase 1 — 사전 정리 (플랫폼 결정과 무관하게 공통)

### 1-A. `.gitignore`에 빌드 산출물 추가

```gitignore
storybook-static
```

### 1-B. Node 버전 고정

레포에 `.nvmrc` 또는 `.node-version`이 없다. CI와 로컬 환경을 맞추기 위해 `.node-version`에 `22`(또는 정확히 `22.19.0`) 기록 권장. GitHub Actions의 `actions/setup-node`가 이 파일을 자동 인식한다.

---

## Phase 2 — (Chromatic 선택 시) 계정 준비 — **사용자 작업**

1. https://www.chromatic.com 에서 GitHub 계정으로 로그인 후 `7saval/chart-templates` 저장소 연동.
2. 프로젝트 생성 시 발급되는 **project token** 확보.
3. GitHub 저장소 `Settings → Secrets and variables → Actions`에 `CHROMATIC_PROJECT_TOKEN`으로 등록.

이 3단계는 에이전트가 대신 수행할 수 없다(외부 서비스 가입·시크릿 발급은 사용자 계정 소유 행위). 완료되면 Phase 3-A로 이어서 진행.

---

## Phase 3-A — GitHub Actions 워크플로 (Chromatic 배포)

`.github/workflows/chromatic.yml` (참고용 초안, 실제 생성은 Phase 2 완료 후):

```yaml
name: Chromatic

on:
  push:
    branches: [main]
  pull_request:

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # Chromatic이 베이스라인 비교를 위해 git 히스토리 필요
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
      - run: npm ci
      - uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

PR에는 자동으로 프리뷰 URL이 코멘트로 달리고, `main` push는 정식 배포로 반영된다.

---

## Phase 3-B — GitHub Actions 워크플로 (GitHub Pages 배포, 대안)

`.github/workflows/deploy-storybook.yml` (참고용 초안):

```yaml
name: Deploy Storybook to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
      - run: npm ci
      - run: npm run build-storybook
      - uses: actions/upload-pages-artifact@v3
        with:
          path: storybook-static

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

저장소 `Settings → Pages → Build and deployment → Source`를 **GitHub Actions**로 설정해야 이 워크플로가 배포 대상으로 인식된다(이것도 사용자가 웹 UI에서 한 번 설정 필요).

---

## Phase 4 — 스토리 파일 lint 정리 (배포와 독립적으로 진행 가능)

22개 스토리 파일이 공통적으로 아래 패턴을 쓰고 있다:

```ts
import type { Meta, StoryObj } from '@storybook/react';   // ❌ 렌더러 패키지 직접 import
```

프레임워크 패키지로 교체:

```ts
import type { Meta, StoryObj } from '@storybook/react-vite';   // ✅
```

23개 파일 전부가 동일한 한 줄 치환이라 스크립트(`sed`/일괄 replace)로 처리 가능. 배포 파이프라인과는 독립적인 작업이므로 원하는 시점에 별도로 진행 — Phase 1-3과 순서 의존성 없음.

---

## Phase 5 — 배포 후 확인

- [ ] (Chromatic) `main` push 후 Chromatic 대시보드에 새 빌드 등록, 공개 URL로 스토리 정상 열람
- [ ] (Chromatic) 임의 PR을 열어 프리뷰 URL이 코멘트로 자동 생성되는지 확인
- [ ] (GitHub Pages) `https://7saval.github.io/chart-templates/`에서 스토리 정상 열람
- [ ] README에 배포된 Storybook URL 추가(현재 README 유무 미확인 — 없으면 이 계획과 별개로 생성 여부 논의)

---

## 진행 순서 요약

1. **Open Decision 확정**: Chromatic vs GitHub Pages, lint 게이트 여부 → 사용자 확인
2. Phase 1 (사전 정리, 공통) 즉시 진행 가능
3. (Chromatic 선택 시) Phase 2 사용자 작업 선행 → Phase 3-A
   (GitHub Pages 선택 시) Phase 3-B 바로 진행 + 저장소 Pages 설정
4. Phase 4는 아무 때나 독립적으로 진행
5. Phase 5로 검증 후 완료
