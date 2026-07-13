// controls.js
// 검색·기간·우선순위·정렬 컨트롤의 이벤트를 처리한다

import { getState, setState, subscribe } from '../state.js';
import { SORT_ORDER } from '../constants.js';

// 기존 filters를 유지하면서 전달받은 필터 항목만 변경한다.
// setState()는 얕은 병합만 하므로 중첩 객체인 filters를 직접 펼쳐야 한다.
function updateFilters(filterPatch) {
  setState({
    filters: {
      ...getState().filters,
      ...filterPatch,
    },
  });
}

// state.filters 값을 컨트롤 UI에 반영한다.
function renderControls(elements, filters) {
  elements.searchInput.value = filters.search;
  elements.periodSelect.value = filters.period;
  elements.prioritySelect.value = filters.priority;

  renderSortState(elements.sortButton, elements.sortValue, filters.sortOrder);
}

// 정렬 방향에 맞게 상단 버튼과 하단 문구를 갱신한다.
function renderSortState(sortButton, sortValue, sortOrder) {
  const isAscending = sortOrder === SORT_ORDER.ASC;

  sortButton.textContent = isAscending ? '정렬: 오름차순 ↑' : '정렬: 내림차순 ↓';

  if (sortValue) {
    sortValue.textContent = isAscending ? '오름차순' : '내림차순';
  }
}

export function initControls() {
  // 컨트롤 UI 요소를 찾아 이벤트 연결을 준비한다.
  const elements = {
    searchInput: document.querySelector('#search'),
    periodSelect: document.querySelector('.period-filter'),
    prioritySelect: document.querySelector('.priority-filter'),
    sortButton: document.querySelector('.sort-btn'),
    sortValue: document.querySelector('.sort-value'),
  };

  const { searchInput, periodSelect, prioritySelect, sortButton } = elements;

  // DOM 찾기
  if (!searchInput || !periodSelect || !prioritySelect || !sortButton) {
    console.error('컨트롤 요소를 찾지 못했습니다.');
    return;
  }

  // 검색창의 현재 문자열을 filters.search에 반영한다. 실제 제목·내용 검색은 selectors.js가 수행한다.
  searchInput.addEventListener('input', (event) => {
    updateFilters({
      search: event.target.value,
    });
  });

  // 선택한 기간 값(all/today/recently)을 state에 반영한다. createdAt 날짜 판단은 selectors.js와 date.js가 담당한다.
  periodSelect.addEventListener('change', (event) => {
    updateFilters({
      period: event.target.value,
    });
  });

  // 선택한 우선순위 값(all/high/mid/low)을 state에 반영한다.
  prioritySelect.addEventListener('change', (event) => {
    updateFilters({
      priority: event.target.value,
    });
  });

  // 현재 정렬 방향을 읽어 오름차순과 내림차순을 전환한다.
  sortButton.addEventListener('click', () => {
    const { sortOrder } = getState().filters;
    const nextSortOrder = sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;

    updateFilters({
      sortOrder: nextSortOrder,
    });
  });

  // 최초 state를 컨트롤 UI에 반영한다.
  renderControls(elements, getState().filters);

  // 초기화 등 다른 기능이 filters를 변경해도 컨트롤 UI가 state와 일치하도록 구독한다.
  subscribe((state) => {
    renderControls(elements, state.filters);
  });
}
