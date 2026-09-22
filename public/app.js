import { updateCategoryList } from "./categoryList.js";
import { getCategories, getProfile, fetchDataList, fetchProfile, getData, updateData } from "./data.js";
import { renderMonthlyBreakdownCategories, renderMonthlyBreakdownOverview } from "./monthlyCharts.js";
import { populateThemes } from "./themes.js";
import { showAlert, escapeHtml } from "./utils.js";
import { updateTable } from "./expenseTable.js";
import { updateMonthlyStats } from "./monthlyStats.js";
import { getSelectedYearAndMonth, initializeMonthNavigator } from "./monthNavigator.js";
import { setCurrencyInput } from "./currencyForm.js";


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

window.addEventListener('DOMContentLoaded', async () => {
  hashChangeHandler();
  initializeMonthNavigator();
  reloadAll();
});

// reloads everything
export async function reloadAll() {
  const loadSuccess = await fetchProfile();
  if (!loadSuccess) {
    showAlert('home', `
      <div role="alert" class="alert alert-error">
        <i class="bi bi-exclamation-triangle"></i>
        <span>Profile was not loaded.</span>
      </div>`, 
    5000);
  }

  await fetchDataList();

  const yearAndMonth = getSelectedYearAndMonth();
  const data = await getData(yearAndMonth.year, yearAndMonth.month);
  const profile = getProfile();

  updateMonthlyStats(data);
  renderMonthlyBreakdownCategories(data);
  renderMonthlyBreakdownOverview(data);

  updateTable(data);

  setCurrencyInput(profile.currency);

  updateCategoryList();
  populateCategories();

  resetCalendar();
  populateThemes();
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

function populateCategories() {
  const profile = getProfile();
  const coreCategories = getCategories().core;

  const selector = document.getElementById("category");
  const categories = [...coreCategories, ...profile.categories];

  selector.innerHTML = categories.map(category => `
    <option>${category.name}</option>
  `).join('');
}

document.getElementById('expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const yearAndMonth = getSelectedYearAndMonth();
  const data = await getData(yearAndMonth.year, yearAndMonth.month);
  
  const date = document.getElementById('date').value;
  const description = escapeHtml(document.getElementById('description').value);
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  data.push({ description, amount, category, date });
  await updateData(data, yearAndMonth.year, yearAndMonth.month);

  // Reset form and reload
  e.target.reset();
  resetCalendar();
  reloadAll();
});

