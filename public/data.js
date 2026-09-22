// core categories are not editable by user
const coreCategories = [
  {name: 'other', color: "#FF6080"}, 
  {name: 'income', color: "#359DE7"}, 
  {name: 'investment', color: "#FF9F47"}, 
  {name: 'subscription', color: "#985AFA"}, 
];

// default profile
var profile = {
  categories: [
    {name: 'food', color: "#FFCE5E"}, 
    {name: 'medical', color: "#EBA3B5"}
  ], 
  subscriptions: {
    monthly: [], 
    annual: []
  }, 
  currency: "$"
};

// available data
var dataList = {}

export async function fetchDataList() {
  const response = await fetch('/api/listdata');

  if (response.ok) {
    dataList = await response.json();
  }
}

export async function fetchProfile() {
  const response = await fetch('/api/profile');

  if (response.ok) {
    profile = await response.json();
  }

  return response.ok;
}

async function saveProfile() {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });

  if (!response.ok) {
    console.error(response.error)
  }
}

export function getProfile() {
  return profile;
}

export function updateProfile(updatedProfile) {
  profile = updatedProfile;
  saveProfile();
}

export function getCategories() {
  return {core: coreCategories, user: profile.categories};
}

export function updateUserCategories(categories) {
  profile.categories = categories;
  saveProfile();
}

export function getDataList() {
  return dataList
}

export async function getData(year, month) {
  const response = await fetch(`/api/data?year=${year}&month=${month}`);

  if (response.ok)
    return await response.json();

  return [];
}

export async function updateData(data, year, month) {
  const response = await fetch(`/api/data?year=${year}&month=${month}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    console.error(response.error)
  };
}