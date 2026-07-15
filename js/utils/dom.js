export function toggleHidden(element, show) {
  if (show) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}
