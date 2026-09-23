const monthSelector = document.getElementById("annualSubscriptionMonth");

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
