import { updateCategoryList } from "./categoryList.js";
import { renderMonthlyBreakdownCategories, renderMonthlyBreakdownOverview } from "./monthlyCharts.js";
import { getRemainingBalance, updateMonthlyStats } from "./monthlyStats.js";
import { populateThemes } from "./themes.js";
import { escapeHtml } from "./utils.js";

// core categories are not editable by user
const coreCategories = [
  {name: 'other', color: "#FF6080"}, 
  {name: 'income', color: "#359DE7"}, 
  {name: 'investment', color: "#FF9F47"}, 
  {name: 'subscription', color: "#985AFA"}, 
];

var data = {
  categories: [
    {name: 'food', color: "#FFCE5E"}, 
    {name: 'medical', color: "#EBA3B5"}
  ], 
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
  const categories = [...coreCategories, ...data.categories];

  selector.innerHTML = categories.map(category => `
    <option>${category.name}</option>
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

  updateCategoryList(data.categories);

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
  tbody.innerHTML = data.data.map(item => {
    const category = [...coreCategories, ...data.categories].find((category) => category.name === item.category);

    const name = category !== undefined ? category.name : item.category;
    const color = category !== undefined ? category.color : '#FFF';

    return `
      <tr>
        <td>${item.date}</td>
        <td class="truncate" title="${item.description}">${item.description}</td>
        <td class="text-right">${numberFormatter.format(item.amount)}</td>
        <td class="flex flex-row items-center"><div style="background-color: ${color}" class="rounded-full border border-base-300 size-4 mr-1"></div>${name}</td>
      </tr>
    `
  }).join('');

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
  const description = escapeHtml(document.getElementById('description').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  data.data.push({ description, amount, category, date });
  saveData();

  // Reset form and reload
  e.target.reset();
  resetCalendar();
  loadData();
});

async function saveData() {
  const response = await fetch('/api/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error(response.error)
  }
}

export function getCategories() {
  return {core: coreCategories, user: data.categories};
}

export function updateUserCategories(categories) {
  data.categories = categories;
  saveData();
  loadData();
}