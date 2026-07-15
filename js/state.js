import {
  loadTodos,
  saveTodos,
  loadTheme,
  saveTheme,
  loadNickname,
  saveNickname,
  loadWelcomeIndex,
  saveWelcomeIndex,
} from './storage.js';
import { PERIOD, SORT_ORDER, THEME, FILTER_ALL } from './constants.js';

const defaultTheme = THEME.LIGHT;
const defaultNickname = 'FlowDash';

const defaultFilters = {
  period: PERIOD.ALL,
  priority: FILTER_ALL,
  search: '',
  sortOrder: SORT_ORDER.ASC,
};

const initialTodos = loadTodos();

let state = {
  todos: Array.isArray(initialTodos) ? initialTodos : [],
  theme: loadTheme() || defaultTheme,
  nickname: loadNickname() || defaultNickname,
  welcomeIndex: Number(loadWelcomeIndex()) || 0,
  filters: { ...defaultFilters },
};

const listeners = new Set();

export function getState() {
  return state;
}

export function setState(patch) {
  state = { ...state, ...patch };

  if (Object.hasOwn(patch, 'todos')) {
    saveTodos(state.todos);
  }
  if (Object.hasOwn(patch, 'theme')) {
    saveTheme(state.theme);
  }
  if (Object.hasOwn(patch, 'nickname')) {
    saveNickname(state.nickname);
  }
  if (Object.hasOwn(patch, 'welcomeIndex')) {
    saveWelcomeIndex(state.welcomeIndex);
  }

  listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetTodos() {
  setState({ todos: [], filters: { ...defaultFilters } });
}
