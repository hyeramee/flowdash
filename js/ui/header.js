export function initHeader() {
  // 기존 헤더 초기화 로그 (팀원 코드 유지)
  console.log('header 초기화됨');

  // 1. [초기화] 새로고침 및 재접속 시 이전 테마 상태 유지
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // 2. [이벤트 수신] 다크모드 토글 버튼 클릭 이벤트 처리
  // (HTML이 나중에 렌더링되는 타이밍 문제를 해결하기 위해 body 전체에 이벤트를 위임합니다)
  document.body.addEventListener('click', (event) => {
    // 클릭된 요소나 그 부모 중 '다크 모드 전환' 버튼이 있는지 확인
    const themeToggleBtn = event.target.closest('button[aria-label="다크 모드 전환"]');

    // 다크모드 버튼을 누른 게 아니라면 무시
    if (!themeToggleBtn) return;

    // 다크모드 클래스 토글 (켜고 끄기)
    document.body.classList.toggle('dark-mode');

    // 3. [저장] 현재 변경된 테마 상태를 LocalStorage에 기록
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}
