// sanitizer
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function showAlert(page, innerHTML, timeoutMs) {
    const pageParent = document.getElementById(page);
    const homeContainer = pageParent.querySelector('.content-container');
    const error = document.createElement('div');

    error.innerHTML = innerHTML

    homeContainer.insertBefore(error, homeContainer.firstChild)

    setTimeout(() => {
      if (error) {
        error.remove()
      }
    }, timeoutMs)
}