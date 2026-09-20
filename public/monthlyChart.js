function renderMonthlyBreakdown() {
  const donut = new Chart(
    document.getElementById('monthlyBreakdownDoughnut'), {
    type: 'doughnut', 
    data: {
      datasets: [{
        data: [10, 20, 30]
      }], 
      labels: [
        'butt', 'cheeks', 'fart'
      ]
    }
  });
}

window.addEventListener("DOMContentLoaded", renderMonthlyBreakdown)