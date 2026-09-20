var data = {
  spendings: []
};

function hashChangeHandler() {
  if (!window.location.hash) {
    window.location.hash = "#main"
  }
}

window.addEventListener('hashchange', hashChangeHandler);
window.addEventListener('DOMContentLoaded', hashChangeHandler);
window.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
  const response = await fetch('/api/budget');

  if (response.ok) {
    data = await response.json();
  }
  
  const list = document.getElementById('expenseList');
  list.innerHTML = '';
  
  data.spendings.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.category}: ${item.desc} - $${item.amount}`;
    list.appendChild(li);
  });
}

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  // 2. Append new item
  data.spendings.push({ id: Date.now(), description, amount, category, date });

  // 3. Save back to server
  const response = await fetch('/api/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error(response.error)
  }

  // Reset form and reload
  e.target.reset();
  loadData();
});

loadData();