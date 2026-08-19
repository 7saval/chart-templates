# 데이터 파이프라인 용어 정리

`Home.tsx`의 "Real-time Data Pipeline Flow"(`homeFlowNodes`, `src/mocks/home.mock.ts:71~228`)에 등장하는 흐름을 기준으로,
각 구성 요소가 무엇을 뜻하는지와 왜 이런 다단계 구조로 설계됐는지를 정리한 문서입니다.

## 전체 흐름

```
KOVIS / XROIS / IRIS / KOTRIS / 문서-VOC (외부 데이터 소스)
   → Adapter-CDC / Adapter-DLHWP
      → Kafka (RealTime / Batch Topics)
         → Iceberg Sink → MinIO → Spark → Trino/Milvus → AI Agent
```

## 단계별 용어

### 1. 데이터 소스 — `KOVIS` / `XROIS` / `IRIS` / `KOTRIS` / `문서-VOC`
파이프라인 바깥에 있는 원본 업무 시스템. `home.mock.ts:71~105` 기준 각 소스는 `rec/s`(초당 생성 건수)를 가지며,
`문서-VOC`만 `mode: "batch"`로 표시되어 실시간이 아닌 주기적 일괄 처리 대상임을 나타낸다.
(이 프로젝트는 템플릿/목업이라 소스 이름 자체는 실제 공식 약어가 아니라 "외부 소스 예시"로 이해하면 된다.)

### 2. 수집 어댑터 — `Adapter-CDC` / `Adapter-DLHWP`
서로 다른 소스 시스템의 고유 형식을 파이프라인 공통 형식으로 변환해주는 **번역가/수집가** 역할.
- **CDC(Change Data Capture)**: 원본 DB 등에서 변경된 부분만 실시간으로 감지해 뽑아오는 기술. 실시간 소스 4개(KOVIS/XROIS/IRIS/KOTRIS)를 담당.
- **DLHWP**: `문서-VOC`처럼 배치성 문서 데이터를 처리하는 어댑터.

소스 하나하나와 1:1로 붙어 그 소스 전용 통역을 한다는 점이 특징.

### 3. 메시지 큐 — `Kafka RealTime Topics` / `Kafka Batch Topics`
데이터를 안전하게 줄 세워 다음 단계로 전달하는 **중앙 우체국**. Topic은 데이터 종류별로 나눠 담는 우편함 칸이며,
여기선 실시간용(`msg/s: 2,400`)과 배치용(`msg/s: 180`) 칸이 분리되어 있다.
소스가 어디든 신경 쓰지 않고, 형식만 맞으면 받아서 순서대로 쌓아두고 여러 소비자에게 각자의 속도로 나눠주는 범용 분배 시스템.

### 4. `Iceberg Sink`
Apache Iceberg는 대용량 데이터를 표(테이블) 형태로 정리해 저장하는 파일 포맷/테이블 관리 방식.
Sink는 "Kafka에 쌓인 데이터를 꺼내 최종 저장소에 써넣는 역할"(반대말은 Source).

### 5. `MinIO`
실제 파일이 저장되는 창고. AWS S3와 호환되는 오브젝트 스토리지로, Iceberg가 정리한 표(파일들)가 실제로 놓이는 바닥 저장소.

### 6. `Spark`
MinIO에 쌓인 대용량 데이터를 꺼내 가공·집계·변환하는 대규모 연산 엔진. 원본 데이터를 분석하기 좋은 형태로 재가공하는 공장.

### 7. `Trino` / `Milvus`
- **Trino**: 가공된 데이터를 SQL로 빠르게 조회하는 쿼리 엔진.
- **Milvus**: 텍스트/이미지 등을 벡터로 변환한 임베딩 데이터를 저장·검색하는 전용 DB. 의미적으로 비슷한 데이터를 빠르게 찾을 때 사용.

### 8. `AI Agent`
Trino(정형 데이터 조회)와 Milvus(벡터 검색)를 도구처럼 활용해 사용자 질문에 답하거나 자동으로 분석을 수행하는 AI 에이전트.

## 어댑터 vs 메시지 큐(Kafka) — 차이

두 구성 요소 모두 "데이터를 다음 단계로 넘겨주는" 중간다리처럼 보이지만 역할이 다르다.

| 구분 | 어댑터 | Kafka(메시지 큐) |
|------|--------|-------------------|
| 역할 | 번역가/수집가 | 중앙 우체국(버퍼/분배) |
| 연결 대상 | 특정 소스 하나와 1:1 | 다수의 소비자에게 1:N 분배 |
| 하는 일 | 소스 고유 형식 → 공통 형식 변환 | 형식이 맞는 메시지를 받아 순서대로 보관·분배 |
| 소스 인지 여부 | 소스별 프로토콜을 알아야 함 | 어떤 소스에서 왔는지 신경 쓰지 않음 |

비유: 어댑터는 각국 공항의 통역사(현지어→공통어 변환), Kafka는 번역된 편지를 분류함에 쌓아두고 여러 수신자가 각자 편한 시간에 찾아가게 해주는 대형 우체국.

## 왜 바로 안 보내고 여러 단계를 거치는가

가장 중요한 이유는 **소스와 목적지를 직접 연결하지 않는 것(결합도를 낮추는 것, decoupling)**.

1. **속도 차이 흡수(버퍼링)** — 소스가 계속 쏟아내는 데이터를, 뒷단이 바빠도 Kafka가 대신 쌓아둔다.
   실제로 `AlertEventTable`의 "Consumer lag exceeded 500k" 경고가 이 상황 — 데이터 유실 없이 "지연 중" 경고만 뜨고 시스템은 멈추지 않는다.
2. **장애 격리** — 소스가 목적지에 직접 연결돼 있었다면 목적지 장애가 소스 수집까지 막아버린다. 지금 구조에선 `Iceberg` 단계가 `warning`이어도(`homeStages`) 앞단(어댑터, Kafka)은 영향 없이 계속 동작한다.
3. **여러 소비자가 같은 데이터를 나눠 쓸 수 있음** — Kafka에 쌓인 데이터는 Iceberg Sink 외에 다른 소비자가 추가돼도 소스 쪽 코드를 건드리지 않고 토픽만 하나 더 구독하면 된다.
4. **각 단계가 전문 분야에 집중** — Iceberg/MinIO(대량 저장), Spark(무거운 가공), Trino(빠른 조회), Milvus(벡터 검색)처럼 각 도구가 잘하는 일에 특화되어 있고, 그 사이를 연결하는 구조.

정리하면: 어댑터는 "형식을 맞추는 번역", Kafka는 "속도 차이를 흡수하고 여러 소비자에게 나눠주는 완충 창고"이며,
여러 단계를 거치는 이유는 한쪽이 느려지거나 죽어도 전체 파이프라인이 같이 무너지지 않게 하기 위함이다.

## Pipeline Overview 타임라인 — `homeStages` (`Home.tsx` 최상단, `src/mocks/home.mock.ts:89~99`)

위 8단계 흐름(`homeFlowNodes`)을 요약해서 원형 노드 8개로 보여주는 상단 타임라인. `_docs/images/PipelineStageTimeline1.png` 참고 이미지를 기준으로 구현했다.

```
Data Source(16) → PPS Adapter(9) → Kafka(24) → PPS Agent/DWP(12, 경고)
   → Iceberg Sink(7) → MinIO/Iceberg(18) → Spark/Trino(17) → Milvus/AI Agent(7)
```

각 원이 무엇을 묶은 것인지:

| 타임라인 단계 | 대응하는 `homeFlowNodes` |
|---|---|
| Data Source | KOVIS / XROIS / IRIS / KOTRIS / 문서-VOC |
| PPS Adapter | Adapter-CDC / Adapter-DLHWP |
| Kafka | Kafka RealTime Topics / Kafka Batch Topics |
| PPS Agent/DWP | PPS Agent DLHWP (C2) — Kafka **배치 토픽**을 소비 |
| Iceberg Sink | Iceberg Sink (C1) — Kafka **실시간 토픽**을 소비 |
| MinIO/Iceberg | MinIO/NAS |
| Spark/Trino | SPARK / TRINO |
| Milvus/AI Agent | Vector DB(Milvus) / AI Agent/RAG Search |

**PPS Agent/DWP와 Iceberg Sink가 나뉜 이유**: Kafka 이후 실시간 경로(Iceberg Sink)와 배치 경로(PPS Agent/DWP)가 갈라지기 때문. 서로 독립된 소비자라, 배치 쪽이 지연(Lag)으로 경고 상태여도 실시간 쪽은 영향받지 않는다 — 위 "장애 격리" 항목과 같은 이유.

### 원 안의 숫자(count) — ⚠️ 의미 확인 필요

`PipelineStageTimeline` 컴포넌트에서 `count`는 원 안에 표시되는 숫자이자, 스테이지 사이 연결선의 굵기/흐름 속도를 정하는 상대 스케일 값이다(`PipelineStageTimeline.types.ts`의 `volume`/`count` 참고). 즉 컴포넌트 자체는 "이 단계의 상대적 규모"를 나타내는 범용 지표로 설계돼 있고, 단위가 고정돼 있지 않다.

지금 `homeStages`에 들어간 16 / 9 / 24 / 12 / 7 / 18 / 17 / 7 은 참고 이미지(`PipelineStageTimeline1.png`)에 적힌 숫자를 그대로 옮긴 값으로, **각 숫자가 정확히 무엇을 세는 건지(노드 수인지 처리량인지 등)는 아직 확인되지 않았다**. 일부만 다른 mock 값과 우연히 일치:

- **PPS Adapter (9)** — Adapter-CDC의 `"9개 노드"`(`home.mock.ts` Adapter-CDC 카드)와 일치. 노드 수로 보임.
- **Kafka (24)** — 원본 참고 이미지(`_docs/images/PipelineFlowDiagram.png`)의 RealTime Topics `"24 MB/s"`와 값이 같음. 이 경우엔 노드 수가 아니라 처리량(MB/s)으로 보임.
- 나머지(Data Source 16, PPS Agent/DWP 12, Iceberg Sink 7, MinIO/Iceberg 18, Spark/Trino 17, Milvus/AI Agent 7)는 현재 다른 mock 데이터와 맞아떨어지는 근거가 없는 placeholder.

→ 스테이지별로 단위가 섞여 있을 가능성이 있어(노드 수 vs 처리량), 실제 의미를 쓸 일이 생기면 원본 디자인/기획 의도를 확인하고 이 문서를 갱신할 것.

### `(C1)` / `(C2)` — 컨슈머 인스턴스 번호

`Iceberg Sink (C1)`, `PPS Agent DLHWP (C2)`의 `C1`/`C2`는 Kafka 토픽을 읽어가는 컨슈머(소비자) 인스턴스 번호. 이 파이프라인이 실시간/배치 두 갈래로 나뉘어 있어서, 그걸 각각 처리하는 소비자를 1번(C1, 실시간 토픽 소비)·2번(C2, 배치 토픽 소비)으로 구분해둔 식별자다. 특별한 약어라기보다 "1번 소비자 / 2번 소비자"에 가깝다.

### Lag(지연) — Kafka 컨슈머가 밀린 메시지 수

```
Lag = (Kafka에 쌓인 최신 메시지 위치) − (컨슈머가 현재까지 읽은 위치)
```

생산자(Kafka에 데이터를 넣는 쪽)가 컨슈머(꺼내가는 쪽)보다 빨리 쌓으면 Lag가 늘어난다. 데이터가 유실된 건 아니고 Kafka에 안전하게 쌓여만 있는 상태 — 위 "속도 차이 흡수(버퍼링)" 항목이 실제로 드러나는 지표다.

`src/tokens/colors.ts`의 `LAG_THRESHOLDS` 기준 임계치:

| Lag 범위 | 상태 | 색상 |
|---|---|---|
| < 50,000 | normal | 초록 |
| < 200,000 | caution | 주황 |
| < 500,000 | warning | 적주황 |
| ≥ 500,000 | critical | 빨강 |

`PPS Agent DLHWP (C2)`의 Lag가 210,000이라 이 구간에 걸려 타임라인/플로우 다이어그램에서 주황(경고)으로 표시된다.

## KPI 카드 — `homeKpis` (`Home.tsx` 2-2~2-4, `src/mocks/home.mock.ts:14~68`)

### 필드 구조 (`KpiCard.types.ts`)

| 필드 | 의미 |
|---|---|
| `label` | 카드 제목 |
| `value` | 현재 값(숫자/문자열) |
| `unit` | 값 옆에 붙는 단위 |
| `deltaPct` | 비교 시점 대비 증감률(%). 화살표(▲/▼)·색상을 결정 |
| `compareLabel` | 증감률의 비교 기준 시점 텍스트 (예: "vs 14:00") |
| `trend` | 카드 우측 미니 스파크라인용 시계열 데이터 |
| `status` | 지정 시 증감 화살표 색을 상태색으로 고정. 없으면 `deltaPct` 부호로 자동(양수=초록/음수=빨강) |
| `breakdown` | 값을 하위 항목별로 쪼개 보여줄 때 사용(예: Critical/Warning 개수). 지정되면 우측 상단에 종 아이콘이 뜨고, 스파크라인 대신 항목별 카운트가 표시됨 |

### 카드 6개가 각각 뭘 뜻하는지

파이프라인 특정 단계가 아니라 소스→AI Agent까지 전 구간을 관통하는 요약 지표.

1. **Total Traffic (In/Out)** — 파이프라인에 들어오고 나가는 전체 데이터량. 소스 유입 트래픽과 최종 산출 트래픽을 합친 처리 용량 지표.
2. **Total Events / sec** — 초당 처리되는 이벤트(레코드) 개수. 모든 소스에서 발생한 이벤트를 합산한 처리 속도.
3. **Pipeline Latency (End-to-End)** — 데이터가 소스에서 발생해 최종 단계까지 도달하는 데 걸리는 총 소요 시간. 낮을수록 실시간에 가깝다는 뜻.
4. **Processing Throughput** — 파이프라인이 실제로 처리(소화)해내는 처리량. Total Events가 "들어오는 양"이면 이건 "처리해낸 양" — 둘의 차이가 벌어지면 Lag가 쌓인다는 신호.
5. **Error Rate** — 처리 중 실패/오류가 발생한 비율. 변환 실패, 파싱 오류, 적재 실패 등을 포괄.
6. **Active Alerts** — 현재 발생 중인 알림 개수. `breakdown`으로 Critical/Warning 개수를 나눠 보여주는 유일한 카드로, `AlertEventTable`과 연결되는 요약 게이트웨이 역할.

축으로 정리하면: 1·2번은 "얼마나 들어오는가", 4번은 "얼마나 처리해내는가", 3번은 "얼마나 빨리 끝까지 가는가", 5·6번은 "그 과정에서 뭐가 잘못되고 있는가".

### `unit`이 각각 뭘 뜻하는지

| 카드 | unit | 뜻 |
|---|---|---|
| Total Traffic (In/Out) | `GB/s` | 초당 기가바이트 — 데이터의 **용량(크기)** 속도 |
| Total Events / sec | `eps` (events per second) | 초당 이벤트(레코드) **건수** |
| Pipeline Latency (End-to-End) | `sec` | 소스 발생~최종 단계 도달까지 걸린 **시간(초)**. 유일하게 낮을수록 좋은 지표 |
| Processing Throughput | `K rec/s` (thousand records/sec) | 초당 처리해낸 레코드 수(천 단위). eps와 같은 성격(건수/초)이지만 "들어오는 양"이 아니라 "실제 처리해낸 양" |
| Error Rate | `%` | 전체 처리 건수 대비 오류/실패 건수의 비율 |
| Active Alerts | (없음) | 단위 없는 순수 개수. `breakdown`으로 Critical/Warning 건수만 별도 표시 |

**단위 짝 정리:**
- **속도(rate) 계열**: `GB/s`(용량), `eps`/`K rec/s`(건수), 플로우 다이어그램의 `MB/s`(Kafka 처리량) — 전부 "초당 얼마나"를 재지만 대상(바이트 vs 건수)이 다름
- **시간 계열**: `sec`(Latency), 플로우 다이어그램의 `freshness`(예: `2m`, `9m`) — 지연·최신성을 나타내는 시간값
- **비율 계열**: `%` — Error Rate 외에 MinIO 용량 사용률(`68%`)에도 동일하게 쓰임

플로우 다이어그램/스토리지 카드 쪽에는 `rec/s`(소스별 초당 레코드), `msg/s`(Kafka 메시지), `qps`(Trino/AI Agent 초당 쿼리), `write/h`·`docs/hr`(시간당 처리 건수) 같은 단위도 나오는데, 전부 "초당/시간당 몇 건"이라는 같은 계열이고 대상(메시지 vs 쿼리 vs 문서)만 다르다.
