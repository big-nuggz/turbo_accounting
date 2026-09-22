// core categories are not editable by user
const coreCategories = [
  {name: 'other', color: "#FF6080"}, 
  {name: 'income', color: "#359DE7"}, 
  {name: 'investment', color: "#FF9F47"}, 
  {name: 'subscription', color: "#985AFA"}, 
];

// default data
var data = {
  categories: [
    {name: 'food', color: "#FFCE5E"}, 
    {name: 'medical', color: "#EBA3B5"}
  ], 
  subscriptions: {
    monthly: [], 
    annual: []
  }, 
  currency: "$", 
  data: []
};

export async function loadData() {
  const response = await fetch('/api/budget');

  if (response.ok) {
    data = await response.json();
  }

  return response.ok;
}

async function saveData() {
  const response = await fetch('/api/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error(response.error)
  }
}

export function getData() {
  return data;
}

export function updateData(updatedData) {
  data = updatedData;
  saveData();
}

export function getCategories() {
  return {core: coreCategories, user: data.categories};
}

export function updateUserCategories(categories) {
  data.categories = categories;
  saveData();
}