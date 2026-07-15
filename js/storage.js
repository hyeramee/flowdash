import { STORAGE_KEYS } from './constants.js';

export function loadTodos() {
  const storedTodos = localStorage.getItem(STORAGE_KEYS.TODOS);

  if (storedTodos === null) {
    return [];
  }

  try {
    return JSON.parse(storedTodos);
  } catch (error) {
    console.error('할 일 목록을 불러오지 못했습니다.', error);
    return [];
  }
}

export function saveTodos(todos) {
  try {
    const todosJson = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEYS.TODOS, todosJson);
  } catch (error) {
    console.error('할 일 목록을 저장하지 못했습니다.', error);
  }
}

export function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME);
}

export function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function loadNickname() {
  return localStorage.getItem(STORAGE_KEYS.NICKNAME);
}

export function saveNickname(nickname) {
  localStorage.setItem(STORAGE_KEYS.NICKNAME, nickname);
}

export function loadWelcomeIndex() {
  return localStorage.getItem(STORAGE_KEYS.WELCOME_INDEX);
}

export function saveWelcomeIndex(index) {
  localStorage.setItem(STORAGE_KEYS.WELCOME_INDEX, index);
}
