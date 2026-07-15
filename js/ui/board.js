import { createCardElement } from './card.js';
import { subscribe } from '../state.js';
import { getFilteredTodos } from '../selectors.js';

// 보드 렌더링 함수
function renderBoard() {
  const columns = {
    todo: document.querySelector('[data-status="todo"] .card-list'),
    doing: document.querySelector('[data-status="doing"] .card-list'),
    done: document.querySelector('[data-status="done"] .card-list'),
  };

  //1. 각 컬럼의 카드 리스트를 초기화
  const statusMessages = {
    todo: '할 일이 없습니다',
    doing: '진행 중인 일이 없습니다',
    done: '완료된 일이 없습니다',
  };

  // 현재 상태에 맞는 카드들을 생성하여 각 컬럼에 추가
  const todos = getFilteredTodos();

  Object.keys(columns).forEach((status) => {
    const list = columns[status];
    list.innerHTML = '';

    const filtered = todos.filter((todo) => todo.status === status);

    if (filtered.length === 0) {
      // 1. 카드가 없을때 컬럼에 안내 문구 표시
      list.innerHTML = `<div class="empty-message">${statusMessages[status]}</div>`;
    } else {
      //2. 카드가 있을때 카드 생성 후 컬럼에 추가
      filtered.forEach((todo) => {
        const cardEl = createCardElement(todo);
        list.appendChild(cardEl);
      });
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

export function initBoard() {
  // 앱이 시작될 때 한 번 렌더링한다.
  renderBoard();

  // state가 변경될 때마다 다시 렌더링한다.
  subscribe(() => {
    renderBoard();
  });
}
