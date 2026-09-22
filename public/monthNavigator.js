import { reloadAll } from "./app.js";

const yearInput = document.getElementById('pageYearSelector');
const monthSelector = document.getElementById('pageMonthSelector');

yearInput.addEventListener('change', monthChanged)
monthSelector.addEventListener('change', monthChanged)

async function monthChanged(e) {
  await reloadAll()
}

export function initializeMonthNavigator() {
  populateMonthSelector();
  setCurrentYear();
  setCurrentMonth();
}

export function getSelectedYearAndMonth() {
  const year = yearInput.value;
  const month = monthSelector.value;

  return {year: year, month: month};
}

function setCurrentYear() {
  yearInput.value = new Date().getFullYear();
}

function setCurrentMonth() {
  monthSelector.value = new Date().getMonth() + 1;
}

function populateMonthSelector() {
  monthSelector.innerHTML = ``;

  for (let i=1; i <=12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    monthSelector.appendChild(option);
  }
}
