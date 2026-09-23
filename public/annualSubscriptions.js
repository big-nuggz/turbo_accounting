import { reloadAll } from "./app.js";
import { getProfile, getCategories, updateProfile } from "./data.js";
import { escapeHtml } from "./utils.js";


const form = document.getElementById('annualSubscriptionForm');
const amountInput = document.getElementById('annualSubscriptionAmount');
const categoryInput = document.getElementById('annualSubscriptionCategory');
const descriptionInput = document.getElementById('annualSubscriptionDescription');
const monthSelector = document.getElementById("annualSubscriptionMonth");

export function updateAnnualSubscriptions() {
  const coreCategories = getCategories().core;

  const profile = getProfile();
  const subscriptions = profile.subscription.annual;

  const table = document.getElementById('annualSubscriptionTable');
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
        ${subscription.month}
      </td>
      <td>
        <p title="${subscription.description}" class="truncate text-slate-700 text-sm font-medium">${subscription.description}</p>
      </td>
      <td class="text-right">
        ${profile.currency}${numberFormatter.format(subscription.amount)}
      </td>
      <td class="flex flex-row items-center">
        <div style="background-color: ${categoryColor}" class="rounded-full border border-base-300 size-4 mr-1"></div>
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

    profile.subscription.annual.splice(index, 1);

    await updateProfile(profile);
    reloadAll();
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const description = escapeHtml(descriptionInput.value);
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const month = parseInt(monthSelector.value);

  const profile = getProfile();
  profile.subscription.annual.push({ description, amount, category, month });

  await updateProfile(profile);
  updateAnnualSubscriptions();
  e.target.reset();
  categoryInput.value = "subscription";
});

export function initializeAnnualSubscriptionForm() {
  populateMonthSelector();
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
