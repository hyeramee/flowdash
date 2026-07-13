import { getState } from './state.js';
import { isToday, isWithinLast7Days } from './utils/date.js';
import { PERIOD, SORT_ORDER, FILTER_ALL } from './constants.js';

export function getFilteredTodos() {
  const { todos, filters } = getState();
  const { period, priority, sortOrder, search } = filters;

  // 1. 기간 필터 + 우선순위 필터
  let result = todos.filter((todo) => {
    const matchesPeriod =
      period === PERIOD.ALL ||
      (period === PERIOD.TODAY && isToday(todo.createdAt)) ||
      (period === PERIOD.RECENTLY && isWithinLast7Days(todo.createdAt));

    const matchesPriority = priority === FILTER_ALL || todo.priority === priority;

    return matchesPeriod && matchesPriority;
  });

  // 2. 정렬 (제목 기준)
  result = [...result].sort((a, b) => {
    if (sortOrder === SORT_ORDER.DESC) {
      return b.title.localeCompare(a.title, 'ko');
    }
    return a.title.localeCompare(b.title, 'ko');
  });

  // 3. 검색 (제목 + 내용, 기간/우선순위 필터링된 결과 안에서 동작)
  const keyword = search.trim().toLowerCase();
  if (keyword !== '') {
    result = result.filter(
      (todo) =>
        todo.title.toLowerCase().includes(keyword) ||
        todo.content.toLowerCase().includes(keyword),
    );
  }

  return result;
}
