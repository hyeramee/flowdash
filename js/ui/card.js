// 별도 init 함수 없음 — 이 파일은 board.js에서 카드 생성 함수를 가져다 쓰는 용도로 사용될 예정
// (보드가 카드들을 렌더링할 때 이 파일의 함수를 호출)
import { PRIORITY, STATUS } from '../constants.js';
import { formatCardDate } from '../utils/date.js';

const PRIORITY_TEXT = {
  [PRIORITY.HIGH]: '높음',
  [PRIORITY.MID]: '중간',
  [PRIORITY.LOW]: '낮음',
};

export function createCardElement(todo) {
  const card = document.createElement('div');
  card.classList.add('card', `card--priority-${todo.priority}`);
  card.dataset.id = String(todo.id);

  let completedDateMarkup = '';

  if (todo.status === STATUS.DONE && todo.completedAt !== null) {
    completedDateMarkup = `<time class="card__date card__date--end">${formatCardDate(todo.completedAt)}</time>`;
  }

  card.innerHTML = `
    <button class="delete-btn" aria-label="삭제">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="card__priority priority--${todo.priority}">${PRIORITY_TEXT[todo.priority]}</div>
    <h3 class="card__title">$</h3>
    <p class="card__content">$</p>
    <div class="card__footer">
     <time class="card__date card__date--start">
    ${formatCardDate(todo.createdAt)}
    </time>
    ${completedDateMarkup}
    </div>
  `;

  // 카드의 제목과 내용을 설정
  card.querySelector('.card__title').textContent = todo.title;
  card.querySelector('.card__content').textContent = todo.content;

  return card;
}
