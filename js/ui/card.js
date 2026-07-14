// 별도 init 함수 없음 — 이 파일은 board.js에서 카드 생성 함수를 가져다 쓰는 용도로 사용될 예정
// (보드가 카드들을 렌더링할 때 이 파일의 함수를 호출)

export function createCardElement(todo) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.id = String(todo.id);

  card.innerHTML = `
    <button class="delete-btn" aria-label="삭제">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="card__priority priority--${todo.priority}">${todo.priorityText}</div>
    <h3 class="card__title">${todo.title}</h3>
    <p class="card__content">${todo.content}</p>
    <div class="card__footer">
      <time class="card__date">${todo.startDate}</time>
    </div>
  `;

  return card;
}
