import { updateCategoryList } from "./categoryList.js";
import { getCategories, getProfile, fetchDataList, fetchProfile, getData, updateData } from "./data.js";
import { renderMonthlyBreakdownCategories, renderMonthlyBreakdownOverview } from "./monthlyCharts.js";
import { populateThemes } from "./themes.js";
import { showAlert, escapeHtml } from "./utils.js";
import { updateTable } from "./expenseTable.js";
import { updateMonthlyStats } from "./monthlyStats.js";
import { getSelectedYearAndMonth, initializeMonthNavigator } from "./monthNavigator.js";
import { setCurrencyInput } from "./currencyForm.js";
import { initializeAnnualSubscriptionForm, updateAnnualSubscriptions } from "./annualSubscriptions.js";
import { updateMonthlySubscriptions } from "./monthlySubscriptions.js";


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
  initializeAnnualSubscriptionForm();
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

  updateMonthlyStats(data, profile.currency);
  renderMonthlyBreakdownCategories(data);
  renderMonthlyBreakdownOverview(data);

  updateTable(data, profile.currency);

  setCurrencyInput(profile.currency);

  updateCategoryList();
  populateCategories();

  updateMonthlySubscriptions();
  updateAnnualSubscriptions();

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

export function populateCategories() {
  const profile = getProfile();
  const coreCategories = getCategories().core;
  const categories = [...coreCategories, ...profile.categories];

  const selectorMain = document.getElementById("category");
  const selectorMonthlySubscription = document.getElementById("monthlySubscriptionCategory");
  const selectorAnnualSubscription = document.getElementById("annualSubscriptionCategory");

  const options = categories.map(category => `
    <option>${category.name}</option>
  `).join('');

  selectorMain.innerHTML = options;
  selectorMonthlySubscription.innerHTML = options;
  selectorAnnualSubscription.innerHTML = options;

  selectorMonthlySubscription.value = "subscription";
  selectorAnnualSubscription.value = "subscription";
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

