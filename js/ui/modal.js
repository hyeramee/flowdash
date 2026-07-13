import { resetTodos } from '../state.js';

export function initModal() {
  console.log('modal 초기화됨');
}

// 전체 데이터 초기화 확인
function openResetConfirm(onConfirm) {
  const confirmed = window.confirm(
    '여기를 실제 초기화 확인 모달으로 교체해주세요.(임시로 브라우저 기본 사용)'
  );

  if (confirmed) {
    onConfirm();
  }
}

export function initReset() {
  const resetBtn = document.querySelector('[data-action="open-reset-confirm"]');

  if (!resetBtn) {
    console.error('전체 초기화 버튼을 찾지 못했습니다.');
    return;
  }

  resetBtn.addEventListener('click', () => {
    openResetConfirm(() => {
      resetTodos();
    });
  });
}
