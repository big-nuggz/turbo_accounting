import { reloadAll } from "./app.js";
import { getProfile, updateProfile } from "./data.js";

const currencyInput = document.getElementById('currencyInput');

export function setCurrencyInput(currency) {
  currencyInput.value = currency;
}

document.getElementById('currencyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const profile = getProfile();
  const currency = currencyInput.value;

  profile.currency = currency;
  await updateProfile(profile);
  reloadAll();
});

