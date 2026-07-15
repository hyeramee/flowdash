// modal의 생성, 수정, 삭제, 초기화

import { getState, setState, resetTodos } from '../state.js';
import { STATUS, PRIORITY } from '../constants.js';
import { toggleHidden } from '../utils/dom.js';
import { setCustomSelectValue } from './custom-select.js';

let editingTodoId = null;
let confirmAction = null;

function showFormModal(elements) {
  toggleHidden(elements.modalRoot, true);
  toggleHidden(elements.formModal, true);
  toggleHidden(elements.confirmModal, false);

  document.body.classList.add('modal-open');
}

function showConfirmModal(elements) {
  toggleHidden(elements.modalRoot, true);
  toggleHidden(elements.formModal, false);
  toggleHidden(elements.confirmModal, true);

  document.body.classList.add('modal-open');
}

function closeModal(elements) {
  toggleHidden(elements.modalRoot, false);
  toggleHidden(elements.formModal, false);
  toggleHidden(elements.confirmModal, false);

  document.body.classList.remove('modal-open');

  editingTodoId = null;
  confirmAction = null;
}

function openCreateModal(elements) {
  editingTodoId = null;

  elements.todoForm.reset();
  elements.formTitle.textContent = '새 할 일';

  elements.todoForm.elements.priority.value = PRIORITY.MID;
  setCustomSelectValue(elements.todoForm.elements.status, STATUS.TODO);

  showFormModal(elements);

  elements.todoForm.elements.title.focus();
}

function openEditModal(elements, todoId) {
  const todo = getState().todos.find((item) => String(item.id) === String(todoId));

  if (!todo) {
    console.error('수정할 할 일을 찾지 못했습니다.');
    return;
  }

  editingTodoId = todo.id;
  elements.formTitle.textContent = '할 일 수정';
  elements.todoForm.elements.title.value = todo.title;
  elements.todoForm.elements.content.value = todo.content ?? '';
  elements.todoForm.elements.priority.value = todo.priority;
  setCustomSelectValue(elements.todoForm.elements.status, todo.status);

  showFormModal(elements);
}

function getFormValues(todoForm) {
  const formData = new FormData(todoForm);

  return {
    title: formData.get('title').trim(),
    content: formData.get('content').trim(),
    priority: formData.get('priority'),
    status: formData.get('status'),
  };
}

function createTodo(values) {
  const now = Date.now();

  return {
    id: now,
    title: values.title,
    content: values.content,
    status: values.status,
    priority: values.priority,
    createdAt: now,
    updatedAt: now,
    completedAt: values.status === STATUS.DONE ? now : null,
  };
}

function updateTodo(todo, values) {
  const hasChanges =
  todo.title !== values.title ||
  todo.content !== values.content ||
  todo.priority !== values.priority ||
  todo.status !== values.status;
  
  if (!hasChanges) {
    return todo;
  }
  
  const now = Date.now();
  let completedAt = todo.completedAt;

  if (todo.status !== STATUS.DONE && values.status === STATUS.DONE) {
    completedAt = now;
  }

  if (values.status !== STATUS.DONE) {
    completedAt = null;
  }

  return {
    ...todo,
    ...values,
    updatedAt: now,
    completedAt,
  };
}

function handleFormSubmit(event, elements) {
  event.preventDefault();

  const values = getFormValues(elements.todoForm);

  if (values.title === '') {
    alert('제목을 입력해 주세요.');
    elements.todoForm.elements.title.focus();
    return;
  }

  const { todos } = getState();

  if (editingTodoId === null) {
    const newTodo = createTodo(values);

    setState({
      todos: [...todos, newTodo],
    });
  } else {
    const nextTodos = todos.map((todo) =>
      String(todo.id) === String(editingTodoId) ? updateTodo(todo, values) : todo
    );

    setState({
      todos: nextTodos,
    });
  }

  closeModal(elements);
}

function openDeleteConfirm(elements, todoId) {
  confirmAction = {
    type: 'delete',
    todoId,
  };

  elements.confirmTitle.textContent = '할 일 삭제';
  elements.confirmParagraphs[0].textContent = '이 할 일을 정말 삭제하시겠습니까?';
  elements.confirmParagraphs[1].textContent = '삭제된 할 일은 복구할 수 없습니다.';
  elements.confirmButton.textContent = '삭제';

  showConfirmModal(elements);
}

function deleteTodo(todoId) {
  const nextTodos = getState().todos.filter((todo) => String(todo.id) !== String(todoId));

  setState({
    todos: nextTodos,
  });
}

function openResetConfirm(elements) {
  confirmAction = { type: 'reset' };

  elements.confirmTitle.textContent = '전체 데이터 초기화';
  elements.confirmParagraphs[0].textContent = '정말 삭제하겠습니까?';
  elements.confirmParagraphs[1].textContent = '초기화 후엔 되돌릴 수 없습니다.';
  elements.confirmButton.textContent = '초기화';

  showConfirmModal(elements);
}

function handleConfirm(elements) {
  if (!confirmAction) {
    return;
  }

  if (confirmAction.type === 'delete') {
    deleteTodo(confirmAction.todoId);
  }

  if (confirmAction.type === 'reset') {
    resetTodos();
  }

  closeModal(elements);
}

export function initModal() {
  const elements = {
    modalRoot: document.querySelector('#modal-root'),
    formModal: document.querySelector('.modal-form'),
    todoForm: document.querySelector('.modal--form'),
    formTitle: document.querySelector('#todo-modal-title'),
    confirmModal: document.querySelector('.modal-confirm'),
    confirmTitle: document.querySelector('#confirm-modal-title'),
    confirmParagraphs: document.querySelectorAll('.modal-confirm p'),
    confirmButton: document.querySelector('[data-action="confirm-modal"]'),
  };

  const { modalRoot, formModal, todoForm, formTitle, confirmModal, confirmTitle, confirmButton } =
    elements;

  if (
    !modalRoot ||
    !formModal ||
    !todoForm ||
    !formTitle ||
    !confirmModal ||
    !confirmTitle ||
    !confirmButton ||
    elements.confirmParagraphs.length < 2
  ) {
    console.error('모달 요소를 찾지 못했습니다.');
    return;
  }

  document.body.addEventListener('click', (event) => {
    const addButton = event.target.closest('.add-btn');
    const clickedCard = event.target.closest('.card');
    const deleteButton = event.target.closest('.delete-btn');
    const resetButton = event.target.closest('[data-action="open-reset-confirm"]');
    const closeButton = event.target.closest('[data-action="close-modal"]');

    const confirmButton = event.target.closest('[data-action="confirm-modal"]');

    if (addButton) {
      openCreateModal(elements);
      return;
    }

    if (deleteButton) {
      const card = deleteButton.closest('.card');

      if (card) {
        openDeleteConfirm(elements, card.dataset.id);
      }

      return;
    }

    if (clickedCard) {
      openEditModal(elements, clickedCard.dataset.id);
      return;
    }

    if (resetButton) {
      openResetConfirm(elements);
      return;
    }

    if (closeButton) {
      closeModal(elements);
      return;
    }

    if (confirmButton) {
      handleConfirm(elements);
      return;
    }
  });

  elements.todoForm.addEventListener('submit', (event) => {
    handleFormSubmit(event, elements);
  });
}
