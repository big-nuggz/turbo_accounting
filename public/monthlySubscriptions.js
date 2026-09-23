import { reloadAll } from "./app.js";
import { getProfile, getCategories, updateProfile } from "./data.js";
import { escapeHtml } from "./utils.js";

const form = document.getElementById('monthlySubscriptionForm');
const amountInput = document.getElementById('monthlySubscriptionAmount');
const categoryInput = document.getElementById('monthlySubscriptionCategory');
const descriptionInput = document.getElementById('monthlySubscriptionDescription');

export function updateMonthlySubscriptions() {
  const coreCategories = getCategories().core;

  const profile = getProfile();
  const subscriptions = profile.subscription.monthly;

  const table = document.getElementById('monthlySubscriptionTable');
  const tbody = table.querySelector('tbody');

  const numberFormatter = new Intl.NumberFormat();

  tbody.innerHTML = '';
  subscriptions.forEach((subscription, index) => {
    const category = [...coreCategories, ...profile.categories].find((category) => category.name === subscription.category);
    const categoryColor = category !== undefined ? category.color : '#FFF';

    const tr = document.createElement('tr');
    tr.dataset.index = index;

    tr.innerHTML = `
      <td>
        <p title="${subscription.description}" class="truncate text-slate-700 text-sm font-medium">${subscription.description}</p>
      </td>
      <td class="text-right">
        ${profile.currency}${numberFormatter.format(subscription.amount)}
      </td>
      <td class="flex flex-row items-center">
        <div style="background-color: ${categoryColor}" class="rounded-full border border-base-300 size-4 min-w-4 min-h-4 mr-1"></div>
        ${subscription.category}
        <button class="delete-btn text-slate-400 hover:text-red-500 p-1 rounded ml-auto" aria-label="delete">
          <i class="bi bi-trash-fill"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);

    tr.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteItem(index);
    });
  });
}

async function deleteItem(index) {
  const userConfirmation = confirm("Are you sure?");

  if (userConfirmation) {
    const profile = getProfile();

    profile.subscription.monthly.splice(index, 1);

    await updateProfile(profile);
    reloadAll();
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const description = escapeHtml(descriptionInput.value);
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  const profile = getProfile();
  profile.subscription.monthly.push({ description, amount, category });

  await updateProfile(profile);
  updateMonthlySubscriptions();
  e.target.reset();
  categoryInput.value = "subscription";
});
