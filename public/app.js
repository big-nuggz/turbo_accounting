import { updateCategoryList } from "./categoryList.js";
import { getCategories, getData, loadData, updateData } from "./data.js";
import { renderMonthlyBreakdownCategories, renderMonthlyBreakdownOverview } from "./monthlyCharts.js";
import { populateThemes } from "./themes.js";
import { showAlert, escapeHtml } from "./utils.js";
import { updateTable } from "./expenseTable.js";
import { updateMonthlyStats } from "./monthlyStats.js";


function hashChangeHandler() {
  if (!window.location.hash) {
    window.location.hash = "#home"
  }

  const sidebar = document.getElementById("sidebar-drawer");
  sidebar.checked = false;
}

window.addEventListener('hashchange', () => {
  hashChangeHandler();
  reloadAll();
});

window.addEventListener('DOMContentLoaded', () => {
  hashChangeHandler();
  reloadAll();
  resetCalendar();
  populateMonthSelector();
  populateYearSelector();
  populateThemes();
});

// reloads everything
export async function reloadAll() {
  const loadSuccess = await loadData();
  if (!loadSuccess) {
    showAlert('home', `
      <div role="alert" class="alert alert-error">
        <i class="bi bi-exclamation-triangle"></i>
        <span>Data was not loaded.</span>
      </div>`, 
    5000);
  }

  updateMonthlyStats();
  renderMonthlyBreakdownCategories();
  renderMonthlyBreakdownOverview();

  updateCategoryList();

  updateTable();
  populateCategories();
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

  const data = getData();
  
  const date = document.getElementById('date').value;
  const description = escapeHtml(document.getElementById('description').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  data.data.push({ description, amount, category, date });
  updateData(data);

  // Reset form and reload
  e.target.reset();
  resetCalendar();
  reloadAll();
});

