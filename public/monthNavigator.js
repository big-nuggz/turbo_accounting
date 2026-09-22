import { reloadAll } from "./app.js";

const yearInput = document.getElementById('pageYearSelector');
const monthSelector = document.getElementById('pageMonthSelector');

const backButton = document.getElementById('buttonLastMonth');
const nextButton = document.getElementById('buttonNextMonth');

yearInput.addEventListener('change', monthChanged)
monthSelector.addEventListener('change', monthChanged)

backButton.addEventListener('click', async (e) => {
  e.stopPropagation();

  const month = Number(monthSelector.value);
  const year = Number(yearInput.value);

  if (monthSelector.value > 1) {
    monthSelector.value = month - 1;
  } else {
    yearInput.value = year - 1;
    monthSelector.value = 12;
  }

  await monthChanged();
});

nextButton.addEventListener('click', async (e) => {
  e.stopPropagation();

  const month = Number(monthSelector.value);
  const year = Number(yearInput.value);

  if (monthSelector.value < 12) {
    monthSelector.value = month + 1;
  } else {
    yearInput.value = year + 1;
    monthSelector.value = 1;
  }

  await monthChanged();
});

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
