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

function updateFilters(filterPatch) {
  setState({
    filters: {
      ...getState().filters,
      ...filterPatch,
    },
  });
}

function renderControls(elements, labels, filters) {
  elements.searchInput.value = filters.search;

  renderSortState(elements.sortButton, elements.sortValue, filters.sortOrder);

  setCustomSelectValue(elements.periodSelect, filters.period);

  setCustomSelectValue(elements.prioritySelect, filters.priority);

  renderLabels(labels, filters);
}

function renderSortState(sortButton, sortValue, sortOrder) {
  const isAscending = sortOrder === SORT_ORDER.ASC;

  sortButton.textContent = isAscending ? '정렬: 오름차순 ↑' : '정렬: 내림차순 ↓';

  if (sortValue) {
    sortValue.textContent = isAscending ? '오름차순' : '내림차순';
  }
}

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

  labels.search.element.hidden = searchKeyWord === '';
  labels.search.value.textContent = `"${searchKeyWord}"`;

  labels.period.element.hidden = periodText === undefined;
  labels.period.value.textContent = periodText ?? '';

  labels.priority.element.hidden = priorityText === undefined;
  labels.priority.value.textContent = priorityText ?? '';
}

export function initControls() {
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

  if (!searchInput || !periodSelect || !prioritySelect || !sortButton || !sortLabel || !sortValue) {
    console.error('컨트롤 요소를 찾지 못했습니다.');
    return;
  }

  elements.sortLabel.before(labels.period.element, labels.priority.element);

  elements.sortLabel.after(labels.search.element);

  searchInput.addEventListener('input', (event) => {
    updateFilters({
      search: event.target.value,
    });
  });

  periodSelect.addEventListener('change', (event) => {
    updateFilters({
      period: event.target.value,
    });
  });

  prioritySelect.addEventListener('change', (event) => {
    updateFilters({
      priority: event.target.value,
    });
  });

  sortButton.addEventListener('click', () => {
    const { sortOrder } = getState().filters;
    const nextSortOrder = sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;

    updateFilters({
      sortOrder: nextSortOrder,
    });
  });

  renderControls(elements, labels, getState().filters);

  subscribe((state) => {
    renderControls(elements, labels, state.filters);
  });
}
