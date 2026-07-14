import { createCardElement } from './card.js';
import { state, getFilteredTodos } from './state.js';

// 보드 렌더링 함수
function renderBoard() {
  const columns = {
    todo: document.querySelector('[data-status="todo"] .card-list'),
    doing: document.querySelector('[data-status="doing"] .card-list'),
    done: document.querySelector('[data-status="done"] .card-list'),
  };

  // 1. 각 컬럼의 기존 카드들을 모두 제거
  Object.values(columns).forEach((list) => {
    if (list) list.innerHTML = '';
  });

  // 2. 현재 상태에 맞는 카드들을 생성하여 각 컬럼에 추가
  const todos = getFilteredTodos();

  todos.forEach((todo) => {
    const cardEl = createCardElement(todo);
    const targetList = columns[todo.status];

    if (targetList) {
      targetList.appendChild(cardEl);
    }
  });

  updateCounts(todos);
}

// 카드 수 업데이트 함수
function updateCounts(todos) {
  const statuses = ['todo', 'doing', 'done'];
  statuses.forEach((status) => {
    const column = document.querySelector(`[data-status="${status}"]`);
    const countEl = column?.querySelector('.count');
    if (countEl) {
      countEl.innerText = todos.filter((item) => item.status === status).length;
    }
  });
}

// 3. 상태 변경 구독
state.subscribe(() => {
  renderBoard();
});

// 초기 실행
document.addEventListener('DOMContentLoaded', () => {
  renderBoard();
});
