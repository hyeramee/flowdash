# 6조 핑퐁

- 공통 과제: 칸반형 태스크 대시보드 제작
- 팀원: 이혜란, 김영은, 박근영, 김채가
- 저장소: [GitHub](https://github.com/hyeramee/flowdash#)
- 배포: [GitHub Pages](https://hyeramee.github.io/flowdash/)

---

## 0. 프로젝트 개요

본 프로젝트는 공통 요구사항을 기반으로 한
칸반 형태의 태스크 관리 대시보드 구현 과제이다.

CRUD, 기간 필터, 통계, 테마 및 UX 요소를 포함하며
바닐라 JavaScript로 상태 관리·리렌더링·이벤트 처리 아키텍처를
직접 설계하여 구현했다. 팀 단위 협업을 통해 설계 및 구현을 진행했다.

---

## 1. 팀 구성 및 역할 분담 (Team & Roles)

| 이름   | 역할              | 주요 담당                        | 비고 |
| ------ | ----------------- | -------------------------------- | ---- |
| 이혜란 | 상태 관리, 초기화 | reset, 초기 셋팅                 |      |
| 김영은 | 보드, 카드 렌더링 | 렌더링, 삭제, 상태 이동          |      |
| 박근영 | 모달 CRUD 컨트롤  | 추가/수정 폼, 검색/필터/정렬     |      |
| 김채가 | 헤더/통계/테마    | 다크모드, 달성률, 인사말, 닉네임 |      |

---

## 2. 수행 절차 및 방법 (Process & Strategy)

### 2-1. 진행 순서

1. 요구사항 전체 리뷰 및 필수 / 가산 구분
2. 데이터 모델 및 LocalStorage 키 합의
3. 보드 구조 및 렌더링 전략 결정
4. 필터 / 정렬 / 검색 파이프라인 구현
5. UX / 테마 / 반응형 구현
6. 통합 및 QA (Lighthouse 성능/접근성 점검 포함)

### 2-2. 협업 규칙

- 브랜치 전략: main / dev / `feat·fix·chore·style` 등 목적별 접두사 브랜치, PR로 dev에 병합
- PR 단위: 기능 1개 기준
- PR 전 rebase 필수
- 스펙 변경은 dev merge 전까지만 허용

---

## 3. 프로젝트 구조 및 아키텍처

### 3-1. 디렉터리 구조

```
flowdash/
├─ README.md
├─ index.html
├─ css/
│  ├─ reset.css
│  ├─ base.css
│  ├─ theme.css
│  ├─ responsive.css
│  └─ components/
│     ├─ header.css
│     ├─ board.css
│     ├─ card.css
│     ├─ controls.css
│     ├─ custom-select.css
│     └─ modal.css
└─ js/
   ├─ main.js
   ├─ state.js
   ├─ selectors.js
   ├─ storage.js
   ├─ constants.js
   ├─ utils/
   │  ├─ date.js
   │  └─ dom.js
   └─ ui/
      ├─ board.js
      ├─ card.js
      ├─ header.js
      ├─ stats.js
      ├─ modal.js
      ├─ controls.js
      └─ custom-select.js
```

### 3-2. 모듈 책임 분리

- **state.js**: 앱의 단일 상태 관리 (`getState`/`setState`/`subscribe`), 변경된 키에 한해 localStorage 자동 저장 및 구독자 리렌더링 트리거
- **selectors.js**: `getFilteredTodos()` — 기간 필터 → 정렬 → 검색 순서로 todos를 가공해 반환
- **storage.js**: LocalStorage IO 전담 (todos/theme/nickname/welcomeIndex), JSON 직렬화·역직렬화 및 파싱 실패 방어
- **constants.js**: STATUS/PRIORITY/PERIOD/SORT_ORDER 등 앱 전역 상수 정의
- **ui/board.js**: 필터링된 todos를 컬럼별로 렌더링, 컬럼별 카드 개수 표시
- **ui/card.js**: 카드 DOM 생성 (사용자 입력은 XSS 방지를 위해 textContent로 처리)
- **ui/modal.js**: 할 일 생성/수정/삭제 확인 및 전체 초기화 확인 모달 처리
- **ui/controls.js**: 검색/기간/우선순위/정렬 필터 이벤트 처리, 활성 필터 라벨 표시
- **ui/custom-select.js**: 네이티브 select를 감싸는 커스텀 드롭다운 UI, 키보드 조작 지원
- **ui/header.js**: 다크모드 토글, 시간대별 인사말, 닉네임 인라인 수정, 환영 아이콘 로테이션
- **ui/stats.js**: 상태별 개수 및 달성률 계산·렌더링
- **utils/date.js**: 날짜 판별(오늘/최근 7일) 및 포맷팅
- **utils/dom.js**: hidden 클래스 토글 유틸

### 3-3. 데이터 흐름

```
User Action (클릭, 입력 등)
  → setState(patch)                    # state.js
      ├─ 변경된 키만 LocalStorage에 저장   # storage.js
      └─ 구독 중인 모든 리스너 실행         # subscribe()
           ├─ renderBoard()             # ui/board.js  (selectors.js 결과로 재렌더링)
           ├─ renderControls()          # ui/controls.js
           └─ updateStats()             # ui/stats.js
```

컴포넌트는 서로를 직접 호출하지 않고, `state.js`가 제공하는 `subscribe()`로 상태 변경을 구독하는 옵저버 패턴을 사용한다. 이 덕분에 `state.js`는 어떤 UI 모듈이 존재하는지 몰라도 되고, 새 UI 모듈이 추가돼도 `state.js`를 수정할 필요가 없다.

---

## 4. 핵심 설계 결정 사항 (Design Decisions)

- status 기반 보드 분리 → 상태 필터 제거
- 모든 날짜 데이터는 timestamp(number)로 통일
- 기간 필터 → 정렬 → 검색 순서의 고정 파이프라인 적용
- 통계는 기간 필터와 무관하게 전체 Todo 기준으로 계산
- 검색/필터/정렬 상태는 LocalStorage에 저장하지 않고 새로고침 시 항상 기본값으로 초기화
- 사용자 입력이 들어가는 DOM 영역은 `innerHTML` 대신 `textContent`로 삽입하여 XSS 방지
- **모든 색상·간격·radius 값을 하드코딩 없이 CSS 변수(디자인 토큰)로 관리**하여, 다크모드 전환이나 디자인 변경 시 변수 값 하나만 바꾸면 전체에 일관되게 반영되도록 설계

---

## 5. 수행 결과 (Implementation Result)

### 5-1. 구현 완료 기능

- CRUD 전 기능
- TODO / DOING / DONE 칸반 보드
- 기간 필터 / 검색 / 정렬
- 통계 대시보드 및 달성률
- 라이트 / 다크 테마 (아이콘 스와핑 포함)
- 인사말 및 닉네임 UX
- 반응형 레이아웃

### 5-2. 요구사항 충족 범위

**필수 요구사항**

- o Todo CRUD 기능이 모두 정상 동작한다 (생성 / 조회 / 수정 / 삭제)
- o TODO / DOING / DONE 상태별 칸반 보드가 분리되어 렌더링된다
- o status 변경 시 Todo가 즉시 해당 보드로 이동한다
- o DONE 전환 시 completedAt이 기록되며, 해제 시 null로 초기화된다
- o 우선순위(HIGH / MID / LOW)를 설정 및 수정할 수 있다
- o 기간 필터(전체 / 오늘 / 7일)가 createdAt 기준으로 동작한다
- o 필터 적용 순서(기간 → 정렬 → 검색)가 항상 유지된다
- o 제목/내용 기준 검색이 필터 결과 내에서 정상 동작한다
- o 제목 기준 오름차순 / 내림차순 정렬이 가능하다
- o 통계 대시보드에 전체 / TODO / DOING / DONE / 달성률이 표시된다
- o 달성률은 (DONE / 전체) \* 100 기준으로 계산된다
- o 전체 초기화 시 Todo 데이터만 삭제되며 확인 절차가 존재한다
- o 테마(Light / Dark) 전환이 가능하며 LocalStorage에 저장된다
- o 인사말이 시간대 기준으로 표시된다
- o 닉네임을 인라인으로 수정할 수 있으며 LocalStorage에 저장된다
- o 새로고침 후에도 Todo / 테마 / 닉네임 상태가 유지된다
- x 반응형 레이아웃이 Mobile / Tablet / Desktop 기준으로 동작한다 _(점검 필요)_
- o 콘솔에 치명적인 에러가 발생하지 않는다

**가산 요소**

- o 디자인 커스터마이징 (디자인 토큰 기반 색상/간격 시스템)
- o 예외 처리 강화 (XSS 방지, 요소 존재 여부 방어 코드, localStorage 파싱 실패 대응 등)
- o 성능 최적화 (Lighthouse Performance 66 → 100)
- x UX 개선 아이디어 적용
- x 추가 기능 구현 (명세 외)

---

## 6. 트러블슈팅 (Troubleshooting)

### 6-1. Lighthouse Performance 저하 (66점) — 폰트 리소스 병목

- **원인**: Pretendard 폰트 4종을 `base.css`에 `@font-face`로 개별 선언(총 약 3MB)해 렌더링을 차단
- **해결**: `@font-face` 선언을 제거하고 Pretendard 다이나믹 서브셋 CDN으로 교체 — unicode-range 기반이라 실제 렌더링되는 문자만 요청되고, 사용자가 자유 입력하는 텍스트에도 폰트 깨짐 없이 대응
- **결과**: Lighthouse Performance **66 → 100**

### 6-2. `innerHTML`에 사용자 입력 직접 삽입 — XSS 취약점

- **원인**: `todo.title`/`todo.content`를 `innerHTML`에 직접 삽입해 악성 스크립트 실행 가능
- **해결**: 정적 마크업은 `innerHTML`로 두고, 사용자 입력이 들어가는 제목/내용만 `textContent`로 분리 삽입

---

## 7. 자체 평가 및 회고 (Self Review)

### 7-1. 잘한 점

- 팀원 모두가 의견 통일이 잘 되고, 각자 맡은 바에 최선을 다한 프로젝트였다
- `state.js` 중심의 단일 상태 관리 구조로, 어떤 기능에서 상태를 변경하든 저장과 리렌더링이 자동으로 처리됨
- 이벤트 위임 패턴을 적용해, 동적으로 생성되는 카드에도 별도 리스너 등록 없이 이벤트가 정상 동작함
- XSS 등 보안 이슈를 사전에 점검하고 수정함
- Lighthouse로 실측 기반 성능 진단 후 Performance 66 → 100으로 개선함
- 모든 색상을 디자인 토큰(CSS 변수)으로 관리해 일관성과 유지보수성을 확보함

### 7-2. 아쉬운 점

- 테스트 케이스를 코드로 남기지 못했다
- XSS, 함수명 불일치 등 설계 단계에서 더 꼼꼼하게 점검했다면 피할 수 있었던 문제를 구현 후 발견하여 수정하게 되었다
- 폰트 용량 등 성능 이슈를 초기 세팅 단계에서 점검하지 않아, 이후 Lighthouse 측정 후에야 문제를 인지함

### 7-3. 다음에 개선할 점

- 로직 테스트 자동화
- 구현 전 보안/성능/접근성 체크리스트를 먼저 세우고 개발 착수

---

## 8. 실행 방법

Live Server 실행 또는 index.html 직접 실행

---

## 9. 결론

공통 과제를 통해 협업 구조와 상태 관리의 중요성을 체감했으며
요구사항을 코드 구조로 해석하는 경험을 얻었다. 특히 React 없이
상태 관리·리렌더링·이벤트 처리 아키텍처를 직접 설계하고, XSS 취약점
발견부터 Lighthouse 실측 기반 성능 개선까지 스스로 진단하고 해결하는
과정을 통해 실전 트러블슈팅 역량을 기를 수 있었다.
