export function getRemainingBalance(data) {
  const remaining = data.reduce((sum, item) => {
    return item.category === "income" ? sum + item.amount : sum - item.amount;
  }, 0);

  return remaining;
}

export function getTotalIncome(data) {
  const income = data.reduce((sum, item) => {
    return item.category === "income" ? sum + item.amount : sum;
  }, 0);

  return income;
}

export function updateMonthlyStats(data) {
  const income = getTotalIncome(data);
  const remaining = getRemainingBalance(data);
  const spent = income - remaining;

  const numberFormatter = new Intl.NumberFormat();

  document.getElementById("statIncome").innerHTML = `${numberFormatter.format(income)}`;
  document.getElementById("statSpent").innerHTML = `${numberFormatter.format(spent)}`;
  if (remaining >= 0)
    document.getElementById("statRemaining").innerHTML = `${numberFormatter.format(remaining)}`;
  else
    document.getElementById("statRemaining").innerHTML = `<span class="text-error">${numberFormatter.format(remaining)}</span>`;
}