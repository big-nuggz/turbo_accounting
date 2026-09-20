function renderMonthlyBreakdownCategories() {
  const ctx = document.getElementById('monthlyBreakdownChartCategories');

  const donut = new Chart(
    ctx, {
    type: 'doughnut', 
    data: {
      datasets: [{
        data: [10, 20, 30, 5, 15, 20]
      }], 
      labels: [
        'food', 'bills', 'medical', 'transport', 'hygiene', 'generic'
      ]
    }
  });
}

function renderMonthlyBreakdownOverview() {
  const ctx = document.getElementById('monthlyBreakdownChartOverview');
  
  const donut = new Chart(
    ctx, {
    type: 'doughnut', 
    data: {
      datasets: [{
        data: [20, 70, 10]
      }], 
      labels: [
        'saving', 'spent', 'invested'
      ]
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  renderMonthlyBreakdownCategories();
  renderMonthlyBreakdownOverview();
});