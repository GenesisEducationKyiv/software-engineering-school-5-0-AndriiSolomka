export function showElement(el) {
  el.classList.remove('hidden');
}

export function hideElement(el) {
  el.classList.add('hidden');
}

export function showError(el, message) {
  el.textContent = message;
  showElement(el);
}

export function resetButton(button, text = 'Submit') {
  button.textContent = text;
  button.disabled = false;
}
