// controls.js
// 검색·기간·우선순위·정렬 컨트롤의 이벤트를 처리한다

import { getState, setState, subscribe } from '../state.js';
import { SORT_ORDER, PERIOD, PRIORITY } from '../constants.js';
import { setCustomSelectValue } from './custom-select.js';

const PERIOD_LABELS = {
  [PERIOD.TODAY]: '오늘',
  [PERIOD.RECENTLY]: '최근 7일',
};

const PRIORITY_LABELS = {
  [PRIORITY.HIGH]: '높음',
  [PRIORITY.MID]: '중간',
  [PRIORITY.LOW]: '낮음',
};

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
function renderControls(elements, labels, filters) {
  elements.searchInput.value = filters.search;

  renderSortState(elements.sortButton, elements.sortValue, filters.sortOrder);

  setCustomSelectValue(elements.periodSelect, filters.period);

  setCustomSelectValue(elements.prioritySelect, filters.priority);

  renderLabels(labels, filters);
}

// 정렬 방향에 맞게 상단 버튼과 하단 문구를 갱신한다.
function renderSortState(sortButton, sortValue, sortOrder) {
  const isAscending = sortOrder === SORT_ORDER.ASC;

  sortButton.textContent = isAscending ? '정렬: 오름차순 ↑' : '정렬: 내림차순 ↓';

  if (sortValue) {
    sortValue.textContent = isAscending ? '오름차순' : '내림차순';
  }
}

// 동적 라벨 생성 함수
function createLabel(labelText) {
  const label = document.createElement('span');
  label.classList.add('sort-label');
  label.hidden = true;

  const title = document.createTextNode(`${labelText}: `);

  const value = document.createElement('span');
  value.classList.add('sort-value');

  label.append(title, value);

  return {
    element: label,
    value,
  };
}

function renderLabels(labels, filters) {
  const searchKeyWord = filters.search.trim();
  const periodText = PERIOD_LABELS[filters.period];
  const priorityText = PRIORITY_LABELS[filters.priority];

  // 검색어가 있을 때만 검색 라벨을 표시한다.
  labels.search.element.hidden = searchKeyWord === '';
  labels.search.value.textContent = `"${searchKeyWord}"`;

  // 전체 기간이 아닌 경우에만 기간 라벨을 표시한다.
  labels.period.element.hidden = periodText === undefined;
  labels.period.value.textContent = periodText ?? '';

  // 전체 우선순위가 아닌 경우에만 우선순위 라벨을 표시한다.
  labels.priority.element.hidden = priorityText === undefined;
  labels.priority.value.textContent = priorityText ?? '';
}

export function initControls() {
  // 컨트롤 UI 요소를 찾아 이벤트 연결을 준비한다.
  const elements = {
    searchInput: document.querySelector('#search'),
    periodSelect: document.querySelector('.period-filter'),
    prioritySelect: document.querySelector('.priority-filter'),
    sortButton: document.querySelector('.sort-btn'),
    sortLabel: document.querySelector('.sort-label'),
    sortValue: document.querySelector('.sort-label .sort-value'),
  };

  const labels = {
    search: createLabel('검색'),
    period: createLabel('기간'),
    priority: createLabel('우선순위'),
  };

  const { searchInput, periodSelect, prioritySelect, sortButton, sortLabel, sortValue } = elements;

  // DOM 찾기
  if (!searchInput || !periodSelect || !prioritySelect || !sortButton || !sortLabel || !sortValue) {
    console.error('컨트롤 요소를 찾지 못했습니다.');
    return;
  }

  elements.sortLabel.before(labels.period.element, labels.priority.element);

  elements.sortLabel.after(labels.search.element);

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
  renderControls(elements, labels, getState().filters);

  // 초기화 등 다른 기능이 filters를 변경해도 컨트롤 UI가 state와 일치하도록 구독한다.
  subscribe((state) => {
    renderControls(elements, labels, state.filters);
  });
}
