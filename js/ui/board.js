import { createCardElement } from './card.js';
import { subscribe } from '../state.js';
import { getFilteredTodos } from '../selectors.js';

function renderBoard() {
  const columns = {
    todo: document.querySelector('[data-status="todo"] .card-list'),
    doing: document.querySelector('[data-status="doing"] .card-list'),
    done: document.querySelector('[data-status="done"] .card-list'),
  };

  const statusMessages = {
    todo: '할 일이 없습니다',
    doing: '진행 중인 일이 없습니다',
    done: '완료된 일이 없습니다',
  };

  const todos = getFilteredTodos();

  Object.keys(columns).forEach((status) => {
    const list = columns[status];
    list.innerHTML = '';

    const filtered = todos.filter((todo) => todo.status === status);

    if (filtered.length === 0) {
      list.innerHTML = `<div class="empty-message">${statusMessages[status]}</div>`;
    } else {
      filtered.forEach((todo) => {
        const cardEl = createCardElement(todo);
        list.appendChild(cardEl);
      });
    }
  });
  updateCounts(todos);
}

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
  renderBoard();

  subscribe(() => {
    renderBoard();
  });
}
