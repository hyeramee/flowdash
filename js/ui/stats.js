import { getState, subscribe } from '../state.js';
import { STATUS } from '../constants.js';

/**
 * 상태별 할 일 개수와 달성률을 계산하여 화면에 렌더링합니다.
 */
function updateStats(todos) {
  // DOM 요소 선택
  const totalEl = document.querySelector('[data-stat="total"]');
  const todoEl = document.querySelector('[data-stat="todo"]');
  const progressEl = document.querySelector('[data-stat="progress"]');
  const doneEl = document.querySelector('[data-stat="done"]');
  const achievementEl = document.querySelector('[data-stat="achievement"]');

  // 요소가 없으면 안전하게 리턴
  if (!totalEl || !todoEl || !progressEl || !doneEl || !achievementEl) return;

  // 통계 계산
  const total = todos.length;
  const todoCount = todos.filter((t) => t.status === STATUS.TODO).length;
  const progressCount = todos.filter((t) => t.status === STATUS.DOING).length;
  const doneCount = todos.filter((t) => t.status === STATUS.DONE).length;

  // 분모가 0일 때 NaN 방지
  const achievement = total ? Math.round((doneCount / total) * 100) : 0;

  // 렌더링
  totalEl.textContent = total;
  todoEl.textContent = todoCount;
  progressEl.textContent = progressCount;
  doneEl.textContent = doneCount;
  achievementEl.textContent = `${achievement}%`;
}

/**
 * 통계 컴포넌트 초기화 및 구독
 */
export function initStats() {
  // 1. 초기 데이터로 화면 먼저 그리기
  const initialTodos = getState().todos || [];
  updateStats(initialTodos);

  // 2. 상태가 변경될 때마다 자동으로 다시 그리도록 구독
  subscribe(() => {
    const currentTodos = getState().todos || [];
    updateStats(currentTodos);
  });
}
