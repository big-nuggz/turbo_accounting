import { getCategories, getData } from "./data.js";
import { getRemainingBalance } from "./monthlyStats.js";

export function updateTable() {
  const coreCategories = getCategories().core;
  const data = getData();

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