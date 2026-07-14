// storage.js

import { STORAGE_KEYS } from './constants.js';

export function loadTodos() {
  // 1. TODOS 키의 문자열 가져오기
  const storedTodos = localStorage.getItem(STORAGE_KEYS.TODOS);

  // 2. 값이 없으면 빈 배열 반환
  if (storedTodos === null) {
    return [];
  }

  try {
    // 3. JSON 문자열을 배열로 복원해 반환
    return JSON.parse(storedTodos);
  } catch (error) {
    console.error('할 일 목록을 불러오지 못했습니다.', error);
    return [];
  }
}

export function saveTodos(todos) {
  try {
    // 1. todos 배열을 JSON 문자열로 변환
    const todosJson = JSON.stringify(todos);
    // 2. TODOS 키에 저장
    localStorage.setItem(STORAGE_KEYS.TODOS, todosJson);
  } catch (error) {
    console.error('할 일 목록을 저장하지 못했습니다.', error);
  }
}

export function loadTheme() {
  // THEME 키의 문자열 반환
  return localStorage.getItem(STORAGE_KEYS.THEME);
}

export function saveTheme(theme) {
  // THEME 키에 theme 저장
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function loadNickname() {
  // NICKNAME 키의 문자열 반환
  return localStorage.getItem(STORAGE_KEYS.NICKNAME);
}

export function saveNickname(nickname) {
  // NICKNAME 키에 nickname 저장
  localStorage.setItem(STORAGE_KEYS.NICKNAME, nickname);
}

export function loadWelcomeIndex() {
  // WELCOME_INDEX 키의 문자열 반환
  return localStorage.getItem(STORAGE_KEYS.WELCOME_INDEX);
}

export function saveWelcomeIndex(index) {
  // WELCOME_INDEX 키에 index 저장
  localStorage.setItem(STORAGE_KEYS.WELCOME_INDEX, index);
}
