// 기존 select의 option을 이용해 디자인 가능한 커스텀 드롭다운을 생성하고 동기화한다.
const customSelectInstances = new Map();

let customSelectId = 0;

export function initCustomSelect() {
  const selectElements = document.querySelectorAll('select[data-custom-select]');

  selectElements.forEach((selectElement) => {
    createCustomSelect(selectElement);
  });

  document.addEventListener('click', handleDocumentClick);
}

function createCustomSelect(selectElement) {
  customSelectId += 1;

  const listId = `custom-select-list-${customSelectId}`;

  const wrapper = document.createElement('div');
  const trigger = document.createElement('button');
  const valueText = document.createElement('span');
  const arrow = document.createElement('span');
  const list = document.createElement('ul');

  wrapper.classList.add('custom-select');

  trigger.type = 'button';
  trigger.classList.add('custom-select__trigger');
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', listId);

  valueText.classList.add('custom-select__value');
  arrow.classList.add('custom-select__arrow');
  arrow.setAttribute('aria-hidden', 'true');

  arrow.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
     <path d="M6 8L2 4H10L6 8Z" fill="currentColor" />
    </svg>
  `;

  list.id = listId;
  list.classList.add('custom-select__list');
  list.setAttribute('role', 'listbox');
  list.hidden = true;

  selectElement.before(wrapper);

  wrapper.append(selectElement);
  trigger.append(valueText, arrow);
  wrapper.append(trigger, list);

  selectElement.tabIndex = -1;

  const nativeOptions = Array.from(selectElement.options);

  const customOptions = nativeOptions.map((nativeOption, index) => {
    const customOption = document.createElement('li');
    customOption.id = `${listId}-option-${index}`;
    customOption.classList.add('custom-select__option');
    customOption.setAttribute('role', 'option');
    customOption.dataset.value = nativeOption.value;
    customOption.textContent = nativeOption.textContent;
    customOption.setAttribute('aria-selected', String(nativeOption.selected));
    list.append(customOption);
    return customOption;
  });

  const activeIndex = Math.max(selectElement.selectedIndex, 0);

  const instance = {
    selectElement,
    wrapper,
    trigger,
    valueText,
    list,
    customOptions,
    activeIndex,
  };

  customSelectInstances.set(selectElement, instance);

  syncCustomSelect(instance);
  connectCustomSelectEvents(instance);
}

function syncCustomSelect(instance) {
  const { selectElement, valueText, customOptions } = instance;

  const selectedOption = selectElement.selectedOptions[0];

  valueText.textContent = selectedOption?.textContent ?? '';

  customOptions.forEach((customOption) => {
    const isSelected = customOption.dataset.value === selectElement.value;

    customOption.setAttribute('aria-selected', String(isSelected));
  });

  instance.activeIndex = Math.max(selectElement.selectedIndex, 0);
}

function isCustomSelectOpen(instance) {
  return instance.trigger.getAttribute('aria-expanded') === 'true';
}

function openCustomSelect(instance) {
  closeOtherCustomSelects(instance);

  instance.list.hidden = false;

  instance.trigger.setAttribute('aria-expanded', 'true');

  setFocusedOption(instance, instance.selectElement.selectedIndex);
}

function closeCustomSelect(instance) {
  instance.list.hidden = true;

  instance.trigger.setAttribute('aria-expanded', 'false');

  clearFocusedOptions(instance);
}

function closeOtherCustomSelects(currentInstance) {
  customSelectInstances.forEach((instance) => {
    if (instance !== currentInstance) {
      closeCustomSelect(instance);
    }
  });
}

function clearFocusedOptions(instance) {
  instance.customOptions.forEach((customOption) => {
    customOption.classList.remove('is-focused');
  });

  instance.trigger.removeAttribute('aria-activedescendant');
}

function setFocusedOption(instance, index) {
  const optionCount = instance.customOptions.length;

  if (optionCount === 0) {
    return;
  }

  clearFocusedOptions(instance);

  instance.activeIndex = index;

  const focusedOption = instance.customOptions[index];

  if (!focusedOption) {
    return;
  }

  focusedOption.classList.add('is-focused');

  instance.trigger.setAttribute('aria-activedescendant', focusedOption.id);

  focusedOption.scrollIntoView({ block: 'nearest' });
}

function moveFocusedOption(instance, direction) {
  const optionCount = instance.customOptions.length;

  let nextIndex = instance.activeIndex + direction;

  if (nextIndex < 0) {
    nextIndex = optionCount - 1;
  }

  if (nextIndex >= optionCount) {
    nextIndex = 0;
  }

  setFocusedOption(instance, nextIndex);
}

function selectOption(instance, index) {
  const selectedCustomOption = instance.customOptions[index];

  if (!selectedCustomOption) {
    return;
  }

  instance.selectElement.value = selectedCustomOption.dataset.value;

  syncCustomSelect(instance);

  instance.selectElement.dispatchEvent(
    new Event('change', {
      bubbles: true,
    })
  );

  closeCustomSelect(instance);
  instance.trigger.focus();
}

function connectCustomSelectEvents(instance) {
  const { trigger, list, customOptions, selectElement } = instance;

  trigger.addEventListener('click', () => {
    if (isCustomSelectOpen(instance)) {
      closeCustomSelect(instance);
    } else {
      openCustomSelect(instance);
    }
  });

  list.addEventListener('click', (event) => {
    const clickedOption = event.target.closest('.custom-select__option');

    if (!clickedOption) {
      return;
    }

    const clickedIndex = customOptions.indexOf(clickedOption);

    selectOption(instance, clickedIndex);
  });

  customOptions.forEach((customOption, index) => {
    customOption.addEventListener('mouseenter', () => {
      setFocusedOption(instance, index);
    });
  });

  trigger.addEventListener('keydown', (event) => {
    handleCustomSelectKeydown(event, instance);
  });

  selectElement.addEventListener('change', () => {
    syncCustomSelect(instance);
  });
}

function handleCustomSelectKeydown(event, instance) {
  const isOpen = isCustomSelectOpen(instance);

  if (event.key === 'ArrowDown') {
    event.preventDefault();

    if (isOpen) {
      moveFocusedOption(instance, 1);
    } else {
      openCustomSelect(instance);
    }

    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();

    if (isOpen) {
      moveFocusedOption(instance, -1);
    } else {
      openCustomSelect(instance);
    }

    return;
  }

  if (event.key === 'Home' && isOpen) {
    event.preventDefault();
    setFocusedOption(instance, 0);
    return;
  }

  if (event.key === 'End' && isOpen) {
    event.preventDefault();

    setFocusedOption(instance, instance.customOptions.length - 1);

    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();

    if (isOpen) {
      selectOption(instance, instance.activeIndex);
    } else {
      openCustomSelect(instance);
    }

    return;
  }

  if (event.key === 'Escape' && isOpen) {
    event.preventDefault();
    closeCustomSelect(instance);
    return;
  }

  if (event.key === 'Tab' && isOpen) {
    closeCustomSelect(instance);
  }
}

function handleDocumentClick(event) {
  customSelectInstances.forEach((instance) => {
    const clickedInside = instance.wrapper.contains(event.target);

    if (!clickedInside) {
      closeCustomSelect(instance);
    }
  });
}

export function setCustomSelectValue(selectElement, value) {
  selectElement.value = value;

  const instance = customSelectInstances.get(selectElement);

  if (instance) {
    syncCustomSelect(instance);
  }
}
