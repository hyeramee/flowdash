import { getState, subscribe } from '../state.js';
import { STATUS } from '../constants.js';

function updateStats(todos) {
  const totalEl = document.querySelector('[data-stat="total"]');
  const todoEl = document.querySelector('[data-stat="todo"]');
  const progressEl = document.querySelector('[data-stat="progress"]');
  const doneEl = document.querySelector('[data-stat="done"]');
  const achievementEl = document.querySelector('[data-stat="achievement"]');

  if (!totalEl || !todoEl || !progressEl || !doneEl || !achievementEl) return;

  const total = todos.length;
  const todoCount = todos.filter((t) => t.status === STATUS.TODO).length;
  const progressCount = todos.filter((t) => t.status === STATUS.DOING).length;
  const doneCount = todos.filter((t) => t.status === STATUS.DONE).length;

  const achievement = total ? Math.round((doneCount / total) * 100) : 0;

  totalEl.textContent = total;
  todoEl.textContent = todoCount;
  progressEl.textContent = progressCount;
  doneEl.textContent = doneCount;
  achievementEl.textContent = `${achievement}%`;
}

export function initStats() {
  const initialTodos = getState().todos || [];
  updateStats(initialTodos);

  subscribe(() => {
    const currentTodos = getState().todos || [];
    updateStats(currentTodos);
  });
}
