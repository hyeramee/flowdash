// 날짜 관련 계산 함수 (오늘/7일 이내 판단, 날짜 포맷팅)

export function isToday(timestamp) {
  const targetDate = new Date(timestamp);
  const today = new Date();

  return (
    targetDate.getFullYear() === today.getFullYear() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getDate() === today.getDate()
  );
}

export function isWithinLast7Days(timestamp) {
  const now = Date.now();

  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  return timestamp >= startDate.getTime() && timestamp <= now;
}

function padTwoDigits(value) {
  return String(value).padStart(2, '0');
}

export function formatHeaderDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

export function formatCardDate(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = padTwoDigits(date.getMonth() + 1);
  const day = padTwoDigits(date.getDate());
  const hours = padTwoDigits(date.getHours());
  const minutes = padTwoDigits(date.getMinutes());

  return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
}
