import {
  loadTodos,
  saveTodos,
  loadTheme,
  saveTheme,
  loadNickname,
  saveNickname,
} from './storage.js';

const DEFAULT_THEME = 'light';
const DEFAULT_NICKNAME = 'FlowDash';

const initialTodos = loadTodos();

let state = {
  todos: Array.isArray(initialTodos) ? initialTodos : [],
  theme: loadTheme() || DEFAULT_THEME,
  nickname: loadNickname() || DEFAULT_NICKNAME,
  // 기간/우선순위 필터, 검색어, 정렬 순서는 LocalStorage에 저장하지 않음 — 새로고침 시 항상 기본값
  filters: {
    period: 'all',
    priority: 'all',
    search: '',
    sortOrder: 'asc',
  },
};

const listeners = new Set();

export function getState() {
  return state;
}

// 주의: 얕은 병합(shallow merge)만 함. filters처럼 중첩된 객체를 바꿀 땐
// setState({ filters: { ...getState().filters, period: 'today' } }) 처럼 직접 펼쳐서 넘겨야 함
export function setState(patch) {
  state = { ...state, ...patch };

  if (Object.prototype.hasOwnProperty.call(patch, 'todos')) {
    saveTodos(state.todos);
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'theme')) {
    saveTheme(state.theme);
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'nickname')) {
    saveNickname(state.nickname);
  }

  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetTodos() {
  setState({ todos: [] });
}
