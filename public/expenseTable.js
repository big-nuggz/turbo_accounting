import { reloadAll } from "./app.js";
import { getCategories, getData, updateData } from "./data.js";
import { getRemainingBalance } from "./monthlyStats.js";
import { getSelectedYearAndMonth } from "./monthNavigator.js";

export function updateTable(data) {
  const categories = getCategories();
  const coreCategories = categories.core;
  const userCategories = categories.user;

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

  const remaining = getRemainingBalance(data)

  const tbody = document.createElement('tbody');

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.dataset.index = index;

    const category = [...coreCategories, ...userCategories].find((category) => category.name === item.category);

    const name = category !== undefined ? category.name : item.category;
    const color = category !== undefined ? category.color : '#FFF';

    row.innerHTML = `
    <td>${item.date}</td>
    <td class="truncate" title="${item.description}">${item.description}</td>
    <td class="text-right">${numberFormatter.format(item.amount)}</td>
    <td class="flex flex-row items-center">
      <div style="background-color: ${color}" class="rounded-full border border-base-300 size-4 mr-1"></div>
      ${name}
      <button class="delete-btn text-slate-400 hover:text-red-500 p-1 rounded ml-auto" aria-label="delete">
        <i class="bi bi-trash-fill"></i>
      </button>
    </td>`

    row.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteItem(index);
    });

    tbody.appendChild(row);
  });

  // last row showing remaining balance
  const lastRow = document.createElement('tr');
  lastRow.classList += "bg-accent";
  lastRow.innerHTML += `
    <td class="text-accent-content">Remaining</td>
    <td></td>
    <td class="text-right text-accent-content">${numberFormatter.format(remaining)}</td>
    <td></td>`;
  tbody.appendChild(lastRow);
  
  table.appendChild(tbody);
}

async function deleteItem(index) {
  const userConfirmation = confirm("Are you sure?");

  if (userConfirmation) {
    const yearAndMonth = getSelectedYearAndMonth();
    const data = await getData(yearAndMonth.year, yearAndMonth.month);

    data.splice(index, 1);

    await updateData(data, yearAndMonth.year, yearAndMonth.month);
    reloadAll();
  }
}