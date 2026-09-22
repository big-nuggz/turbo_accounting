import { getCategories } from "./app.js";

export function renderMonthlyBreakdownCategories(data) {
  const ctx = document.getElementById('monthlyBreakdownChartCategories');

  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  const totals = data.reduce((total, {category, amount}) => {
    if (category !== "income")
      total[category] = (total[category] || 0) + amount;
    return total;
  }, {});

  const totalsSorted = Object.entries(totals)
    .map(([category, amount]) => ({category, amount}))
    .sort((a, b) => b.amount - a.amount);

  const categoriesAll = getCategories();
  const categories = [...categoriesAll.core, ...categoriesAll.user];

  const colorMap = new Map(categories.map(item => [item.name, item.color]));
  const colors = totalsSorted.map(item => colorMap.get(item.category));

  new Chart(
    ctx, {
    type: 'doughnut', 
    data: {
      datasets: [{
        data: totalsSorted.map(item => item.amount), 
        backgroundColor: colors, 
        borderColor: "rgba(0.0,0.0,0.0,0.0)"
      }], 
      labels: totalsSorted.map(item => item.category)
    }
  });
}

export function renderMonthlyBreakdownOverview(data) {
  const ctx = document.getElementById('monthlyBreakdownChartOverview');
  
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }

  const totals = data.reduce((total, {category, amount}) => {
    if (category === "income") {
      total["savings"] = (total["savings"] || 0) + amount;
    }
    else if (category === "investment") {
      total["savings"] = (total["savings"] || 0) - amount;
      total["investment"] = (total["investment"] || 0) + amount;
    }
    else {
      total["savings"] = (total["savings"] || 0) - amount;
      total["spendings"] = (total["spendings"] || 0) + amount;
    }

    return total;
  }, {});

  if (totals["savings"] < 0)
    totals["savings"] = 0;

  const totalsSorted = Object.entries(totals)
    .map(([category, amount]) => ({category, amount}))
    .sort((a, b) => b.amount - a.amount);

  const categories = getCategories().core;

  const colorMap = new Map(categories.map(item => [item.name, item.color]));
  const colors = totalsSorted.map(item => {
    if (item.category == "savings")
      return colorMap.get("income")
    else if (item.category == "spendings")
      return colorMap.get("other")
    
    return colorMap.get(item.category)
  });

  new Chart(
    ctx, {
    type: 'doughnut', 
    data: {
      datasets: [{
        data: totalsSorted.map(item => item.amount), 
        backgroundColor: colors,
        borderColor: "rgba(0.0,0.0,0.0,0.0)"
      }], 
      labels: totalsSorted.map(item => item.category)
    }
  });
}