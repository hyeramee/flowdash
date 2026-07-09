---
## 1. 프로젝트 개요

단순한 Todo List를 넘어 **칸반 구조**(할 일/진행 중/완료)의 작업 보드 + 기간 기반 필터(전체/오늘/7일) + 검색/정렬 + 통계 및 달성률을 제공하는 태스크 관리 대시보드. 팀명: FlowDash. 선생님이 제공한 공통 과제이며, 디자인 시안(Figma)도 선생님이 제공.
---

## 2. 핵심 데이터 모델

```js
Todo {
  id: Date.now() 또는 crypto.randomUUID() (유니크, 팀 합의 필요)
  title: string (필수)
  content: string (선택)
  status: 'todo' | 'doing' | 'done'
  priority: 'high' | 'mid' | 'low'
  createdAt: number (timestamp)
  updatedAt: number (timestamp)
  completedAt: number (timestamp) | null
}
```

---

## 3. 보드 구조 (칸반)

- TODO(할 일) / DOING(진행 중) / DONE(완료) — 3개 보드로 항상 분리 표시
- 각 Todo는 자신의 status에 해당하는 보드에 렌더링됨
- status 변경 시 즉시 다른 보드로 이동
- **상태 보드가 이미 분리되어 있으므로 별도의 상태 기반 필터는 제공하지 않음**

---

## 4. 핵심 기능 (CRUD)

- **생성**: Todo 추가, 생성 시 createdAt 저장
- **조회**: 목록 조회, 상태별 보드에 자동 배치
- **수정**: 제목/내용/우선순위 수정 가능, 수정 시 updatedAt 갱신, status 변경 가능(보드 간 이동)
- **삭제**: 개별 Todo 삭제 가능
- **완료 처리**:
  - DONE 상태 시 취소선 스타일 적용
  - DONE 전환 시 completedAt 기록
  - DONE → TODO/DOING 시 completedAt은 **null로 초기화**

---

## 5. 우선순위

- 3단계: HIGH(높음) / MID(중간) / LOW(낮음)
- 드롭다운 메뉴명: 전체 우선순위, 높음, 중간, 낮음

---

## 6. 검색/기간 필터/정렬 — ⚠️ 채점 포인트

- **검색**: 제목 및 내용 기준, 기간 필터 적용 결과 내에서 검색 동작
- **기간 필터**: Todo의 status와 무관한 UI 상태값, `createdAt` 기준
  - 전체 / 오늘 / 7일 (사용자 로컬 타임존 기준)
- **정렬**: 제목 기준 오름차순/내림차순
- **적용 순서 (고정, 반드시 지킬 것)**:
  ```
  1. 기간 필터
  2. 정렬
  3. 검색
  ```

---

## 7. 통계 대시보드

- 상단 고정 영역: 전체 개수 / TODO 개수 / DOING 개수 / DONE 개수 / 달성률(%)
- 달성률 = (DONE / 전체) \* 100, 전체가 0이면 0% 또는 '-'
- **⚠️ 통계는 기간 필터와 무관하게 항상 전체 Todo 기준으로 계산** (필터링된 목록 기준 아님!)

---

## 8. 전체 초기화 (Reset)

- Todo 데이터만 초기화 (테마/닉네임 등 환경설정은 유지)
- 버튼은 Todo 보드 영역 내부에 위치
- 확인 문구: "정말 삭제하시겠습니까? 초기화 후엔 되돌릴 수 없습니다."
- 확인 시: 모든 Todo 삭제 → LocalStorage 즉시 반영 → 통계 초기화
- 취소 시: 아무 동작 없음

---

## 9. 테마 (Theme)

- Light / Dark 제공, LocalStorage에 저장, 새로고침/재접속 시 마지막 테마 유지

---

## 10. 인사말 / 닉네임

- 시간대별 인사: 05-11 좋은 아침이에요 / 11-17 좋은 오후에요 / 17-22 좋은 저녁이에요 / 그 외 안녕하세요
- 인사 문구에 닉네임 표시 (예: "좋은 아침이에요, FlowDash님")
- 닉네임 영역 클릭 시 인라인 수정, Enter/blur 시 저장, 빈 값 입력 시 이전값/기본값 복원
- 초기 닉네임 기본값: `FlowDash`, LocalStorage 저장

---

## 11. 반응형 (최소 3 브레이크포인트)

- Mobile: 320–767px (1열 중심, 세로 스택 또는 탭/아코디언 가능)
- Tablet: 768–1199px (2열 이상 배치 가능)
- Desktop: 1200px 이상 (3보드 동시 표시)
- 정확한 px는 팀 합의로 조정 가능 (최소 3구간 보장)

---

## 12. LocalStorage 키

```
flowdash-todos
flowdash-theme
flowdash-nickname
(선택) 마지막 기간필터/정렬 상태
```

---

## 13. 디자인 정책

- 기본 제공 Figma 디자인 시안 기준으로 구현 (선생님 제공, Figma 파일: 라이트/다크 모드 대시보드 + "새 할 일" 입력 폼 등)
- 기본 기능 완성 이후, 시간 여유 있으면 자체 디자인/컬러/레이아웃 커스터마이징 (가산 요소)

**주요 화면 구조 (Figma에서 확인)**

- 헤더: 인사말 + 닉네임 + 날짜 + 테마 토글 버튼
- 통계 5칸: Total Tasks / To Do / In Progress / Done / Achievement
- 컨트롤 바: 검색창 + 기간필터 드롭다운 + 우선순위필터 드롭다운 + 정렬버튼 + "+ 새 할 일" 버튼
- 3열 보드: 할 일 / 진행 중 / 완료 (각 보드 헤더에 개수 뱃지)
- "새 할 일" 폼: 제목(필수) / 내용(textarea) / 우선순위(3버튼) / 상태(드롭다운) / 취소·저장하기 버튼
- 하단: "정렬: 오름차순" 태그, "전체 데이터 초기화" 링크

- ***

  ***

## 16. 파일 구조

```
flowdash/
├─ README.md
├─ index.html                # #header, #controls, #board, #modal-root 마운트 지점
├─ assets/
│  ├─ icons/
│  └─ fonts/
├─ css/
│  ├─ reset.css
│  ├─ base.css                # 공통 변수(색상/폰트) + 전체 레이아웃 기본값
│  ├─ theme.css                # 라이트/다크 테마
│  ├─ responsive.css           # 메인 레이아웃 반응형
│  └─ components/
│     ├─ board.css
│     ├─ card.css
│     ├─ modal.css
│     └─ controls.css
└─ js/
   ├─ main.js                  # 진입점, 각 UI 모듈 init 호출만
   ├─ config.js                # STATUS, PRIORITY 등 상수
   ├─ storage.js                # loadTodos/saveTodos
   ├─ state.js                  # getState/setState/subscribe
   ├─ selectors.js              # 공용 selector 함수 (getFilteredTodos 등)
   ├─ utils/
   │  ├─ date.js                # 오늘/7일 판단, 포맷팅
   │  └─ dom.js                 # DOM 조작 공통 함수
   └─ ui/
      ├─ header.js              # 인사말, 날짜, 닉네임, 테마토글
      ├─ controls.js            # 검색/기간필터/우선순위필터/정렬 UI
      ├─ board.js                # 칸반 보드 전체 렌더링
      ├─ card.js                 # 카드 렌더링
      ├─ modal.js                # 추가/수정 모달, 유효성 검사, 저장
      └─ stats.js                # 통계 계산/표시
```

---

## 17. 팀 진행 계획 (0단계 프로세스)

### 스텝 1 — 빈 골격 세우기 (팀원 1인, 완료)

- 레포 생성 → dev 브랜치 → 폴더구조/빈파일 전부 생성
- index.html에 마운트 지점 구성, ES 모듈 연결
- 각 JS 파일 빈 함수 껍데기 + main.js에 초기화 호출 나열
- .gitignore + .prettierrc.js 설정
- 콘솔에 초기화 로그 5개 확인 후 dev에 push

### 스텝 2 — 공통 규칙 수립 (전원 회의, CONVENTION.md 작성)

**PDF에 이미 정해진 것 (그대로 옮기기)**

- LocalStorage 키 3개, Todo 스키마, status/priority 값

**새로 정해야 하는 것**

- state 함수명: `getState()` / `setState(patch)` / `subscribe(fn)`
- id 생성 방식: `Date.now()` 대신 `crypto.randomUUID()` 권장 (충돌 방지)
- CSS 변수명: `--bg`, `--text`, `--primary`, `--card-bg` 등
- 초기 로딩 규칙: 앱 시작 시 저장된 데이터 → 상태 반영 흐름
- 자동저장 규칙: 상태 변경 시 자동으로 저장까지 연결 (각자 저장 함수 호출 불필요)
- 반응형 소유 경계: `#board` 큰 구조는 스텝1에서 완료, 내부 반응형 값은 본 개발에서 담당자가 채움
- 공유 함수명: `getFilteredTodos()`, `changeStatus(id, status)`
- **config.js 담당자 지정 필요** (STATUS/PRIORITY 상수 — A팀원(state.js 담당)이 함께 채우는 것을 제안)

### 스텝 3 — 바닥 파일 채우기 (feature 브랜치 → dev PR)

| 담당 | 파일          | 내용                                        |
| ---- | ------------- | ------------------------------------------- |
| A    | state.js      | getState/setState/subscribe + 자동저장 로직 |
| C    | storage.js    | loadTodos/saveTodos + 예외처리              |
| D    | utils/date.js | 오늘/7일 판단, 날짜 포맷                    |
| E    | base.css      | CSS 변수 정의 + reset.css                   |

진행방식: feature 브랜치 → dev PR (승인절차 생략, 대신 팀 채팅 공지 + 셀프 확인)

---

## 18. 팀원별 담당표 (본 개발)

| 담당 | 소유 파일                                      | 본 개발 기능                                  | 공유 함수                  |
| ---- | ---------------------------------------------- | --------------------------------------------- | -------------------------- |
| A    | state.js                                       | Reset(전체초기화) + 빈 상태 처리              | state 기본 API             |
| B    | ui/board.js, ui/card.js, board.css, card.css   | 보드/카드 (렌더링·삭제·상태이동)              | `changeStatus(id, status)` |
| C    | ui/modal.js, modal.css, storage.js             | 모달/CRUD (추가·수정 폼, 유효성검사, 저장)    | —                          |
| D    | ui/controls.js, controls.css, utils/date.js    | 컨트롤(검색·기간필터·우선순위필터·정렬)       | `getFilteredTodos()`       |
| E    | ui/header.js, ui/stats.js, theme.css, base.css | 테마·통계·헤더(다크모드·달성률·인사말·닉네임) | —                          |

> `utils/dom.js`, `selectors.js`는 특정 담당 없이 필요한 사람이 그때그때 작성. 중복되면 통합일에 공용 파일로 분리 논의.

---

## 19. ⚠️ 현재 이슈 — D팀원 참여 불가 상태

**결정**: D팀원 문제는 "일단 발생하면 나중에 챙기기"로 팀 결정.

**리스크**: D팀원이 담당하는 `getFilteredTodos()`는 단순 기능이 아니라 **B팀원(보드 렌더링)이 의존하는 공유 함수**이자, 요구사항 6번(필터→정렬→검색 고정 파이프라인, 채점 10점)의 핵심. 이게 없으면 B팀원은 임시로 `getState().todos` 전체를 그대로 쓰게 되고, 나중에 D 파트가 들어오면 B팀원 코드를 다시 손봐야 하는 "마감 직전 구조 변경" 리스크가 있음.

---

## 20. GitHub 협업 방법

- 브랜치: `main`(배포/최종), `dev`(통합)
- 기능 작업은 `feature/*` 브랜치에서 하고 dev로 PR
- 팀장 레포 생성 → 팀원 Collaborator 초대 → dev를 기본 브랜치로 설정 → main 브랜치 보호(PR 필수, 강제 push 금지, 삭제 금지)

**팀원 로컬 셋업**

```
git clone <repo>
git switch dev
git switch -c feature/[기능명]
# 작업 → 커밋 → 푸시 → PR (feature/[기능명] → dev)
```

**PR 직전 루틴**

```
git switch dev
git pull origin dev
git switch feature/[브랜치명]
git rebase origin/dev
# 충돌 없으면
git push
# 충돌 있으면 해결 후
git add .
git rebase --continue
git push
# 이미 push한 브랜치를 리베이스했다면
git push --force-with-lease
```

**커밋 메세지 규칙**: `feat:` 기능 / `fix:` 버그 / `typo:` 오탈자 / `chore:` 기타

**PR 최소 규칙**: 무엇을/왜/테스트방법 3줄 설명, 가능하면 스크린샷 첨부

---

## 21. Prettier 설정 (.prettierrc.js)

```js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
};
```

---
