export function initHeader() {
  console.log('header 초기화됨');
}

// 다크모드 버튼 클릭 이벤트를 연결하는 함수
export function initThemeToggle() {
  const toggleBtn = document.querySelector('button[aria-label="다크 모드 전환"]');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault();

      // 💡 [핵심] body 태그에 'dark' 클래스가 있으면 빼고, 없으면 넣어줍니다.
      document.body.classList.toggle('dark');

      // 잘 작동하는지 확인용 콘솔 로그
      console.log('현재 body의 클래스 목록:', document.body.className);
    });
  } else {
    console.log('ui/header.js 오류: 다크모드 버튼을 찾지 못했습니다.');
  }
}
