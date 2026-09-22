import { updateCategoryList } from "./categoryList.js";
import { getCategories, getData, updateData } from "./data.js";
import { renderMonthlyBreakdownCategories, renderMonthlyBreakdownOverview } from "./monthlyCharts.js";
import { populateThemes } from "./themes.js";
import { escapeHtml } from "./utils.js";
import { updateTable } from "./expenseTable.js";


function hashChangeHandler() {
  if (!window.location.hash) {
    window.location.hash = "#home"
  }

  const sidebar = document.getElementById("sidebar-drawer");
  sidebar.checked = false;
}

window.addEventListener('hashchange', () => {
  hashChangeHandler();
  loadData();
});

window.addEventListener('DOMContentLoaded', () => {
  hashChangeHandler();
  loadData();
  resetCalendar();
  populateMonthSelector();
  populateYearSelector();
  populateThemes();
});

export async function loadData() {
  const response = await fetch('/api/budget');

  var data = getData();

  if (response.ok) {
    data = await response.json();
    updateData(data);
  }

  renderMonthlyBreakdownCategories(data.data);
  renderMonthlyBreakdownOverview(data.data);

  updateCategoryList(data.categories);

  cleanDates();
  updateTable();
  populateCategories();
}

function cleanDates() {
  var data = getData();
  data.data.map(item => {
    item.date = new Date(item.date).toISOString().split('T')[0];
  });
  updateData(data);
}

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
  const data = getData();
  const coreCategories = getCategories().core;

  const selector = document.getElementById("category");
  const categories = [...coreCategories, ...data.categories];

  selector.innerHTML = categories.map(category => `
    <option>${category.name}</option>
  `).join('');
}

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  var data = getData();
  
  const date = document.getElementById('date').value;
  const description = escapeHtml(document.getElementById('description').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  data.data.push({ description, amount, category, date });
  updateData(data);

  // Reset form and reload
  e.target.reset();
  resetCalendar();
  loadData();
});

