import { renderMonthlyBreakdownCategories, renderMonthlyBreakdownOverview } from "./monthlyCharts.js";
import { getRemainingBalance, updateMonthlyStats } from "./monthlyStats.js";
import { populateThemes } from "./themes.js";

// core categories are not editable by user
const coreCategory = [
  'other', 
  'income', 
  'investment'
];

var data = {
  categories: ['food', 'medical'], 
  subscriptions: {
    monthly: [], 
    annual: []
  }, 
  data: []
};

function hashChangeHandler() {
  if (!window.location.hash) {
    window.location.hash = "#home"
  }

  const sidebar = document.getElementById("sidebar-drawer");
  sidebar.checked = false;
}

window.addEventListener('hashchange', () => {
  hashChangeHandler();
});

window.addEventListener('DOMContentLoaded', () => {
  hashChangeHandler();
  loadData();
  resetCalendar();
  populateMonthSelector();
  populateYearSelector();
  populateThemes();
});

function resetCalendar() {
  const today = new Date();
  const localDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'), 
    String(today.getDate()).padStart(2, '0'), 
  ].join('-');

  document.getElementById('date').value = localDate;
}

function populateYearSelector() {
  const select = document.getElementById('pageYearSelector');
  for (let i=1990; i <=2030; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
}

function populateMonthSelector() {
  const select = document.getElementById('pageMonthSelector');
  for (let i=1; i <=12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
}

function populateCategories() {
  const selector = document.getElementById("category");
  const categories = [...coreCategory, ...data.categories];

  selector.innerHTML = categories.map(item => `
    <option>${item}</option>
  `).join('');
}

async function loadData() {
  const response = await fetch('/api/budget');

  if (response.ok) {
    data = await response.json();
  }

  renderMonthlyBreakdownCategories(data.data);
  renderMonthlyBreakdownOverview(data.data);

  updateMonthlyStats(data.data);

  cleanDates();
  updateTable();
  populateCategories();
}

function cleanDates() {
  data.data.map(item => {
    item.date = new Date(item.date).toISOString().split('T')[0];
  });

  return data;
}

function updateTable() {
  const numberFormatter = new Intl.NumberFormat();

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

  const remaining = getRemainingBalance(data.data)

  const tbody = document.createElement('tbody');
  tbody.innerHTML = data.data.map(item => `
    <tr>
      <td>${item.date}</td>
      <td class="truncate" title="${item.description}">${item.description}</td>
      <td class="text-right">${numberFormatter.format(item.amount)}</td>
      <td>${item.category}</td>
    </tr>
  `).join('');

  // last row showing remaining balance
  tbody.innerHTML += `
    <tr class="bg-accent">
      <td class="text-accent-content">Remaining</td>
      <td></td>
      <td class="text-right text-accent-content">${numberFormatter.format(remaining)}</td>
      <td></td>
    </tr>`;
  table.appendChild(tbody);
}

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const date = document.getElementById('date').value;
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  // 2. Append new item
  data.data.push({ description, amount, category, date });

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
  resetCalendar();
  loadData();
});