var data = {
  categories: ['income', 'other', 'food', 'medical'], 
  subscriptions: {
    monthly: [], 
    annual: []
  }, 
  data: []
};

function hashChangeHandler() {
  if (!window.location.hash) {
    window.location.hash = "#main"
  }
}

window.addEventListener('hashchange', () => {
  hashChangeHandler();
});

window.addEventListener('DOMContentLoaded', () => {
  hashChangeHandler();
  loadData();
  resetCalendar();
});

function resetCalendar() {
  document.getElementById('date').valueAsDate = new Date();
}

async function loadData() {
  const response = await fetch('/api/budget');

  if (response.ok) {
    data = await response.json();
  }

  cleanDates();
  updateTable();
}

function cleanDates() {
  data.data.map(item => {
    item.date = new Date(item.date).toISOString().split('T')[0];
  });

  return data;
}

function updateTable() {
  const table = document.getElementById('expenseTable');
  table.innerHTML = '';
 
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Amount</th>
      <th>Category</th>
    </tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  tbody.innerHTML = data.data.map(item => `
    <tr>
      <td>${item.date}</td>
      <td>${item.description}</td>
      <td class="text-right">${item.amount}</td>
      <td>${item.category}</td>
    </tr>
  `).join('');
  table.appendChild(tbody);
}

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  // 2. Append new item
  data.data.push({ id: Date.now(), description, amount, category, date });

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