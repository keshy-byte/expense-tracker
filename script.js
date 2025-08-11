<<<<<<< HEAD
window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('monthly-summary');
    const chartCanvas = document.getElementById('expense-chart');
    const pieCanvas = document.getElementById('expense-pie');
    const categorySelect = document.getElementById('category');
    const defaultCategories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
  
    let monthlyTotals = {};
    const expenses = [];
    let categoryChart = null;
  
    let expenseChart = new Chart(chartCanvas, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Monthly Expenses', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)' }] },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  
    let expensePie = new Chart(pieCanvas, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ] }] },
      options: { responsive: true }
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('amount').value;
      const date = document.getElementById('date').value;
      const category = document.getElementById('category').value;
  
      if (!amount || !date || !category) return;
  
      const monthKey = date.slice(0, 7);
      if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
      monthlyTotals[monthKey] += parseFloat(amount);
  
      expenses.push({ amount: parseFloat(amount), date, category });
  
      updateSummary();
      updateCharts();
      updateExpenseList();
      updatePieChart();
      form.reset();
      document.getElementById('category').value = "Food";
    });
  
    function getCurrentWeekRange() {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
      const start = new Date(now);
      start.setDate(now.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    function getCurrentMonthRange() {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }

    function calculateTotals() {
      const weekRange = getCurrentWeekRange();
      const monthRange = getCurrentMonthRange();
      let weekTotal = 0;
      let monthTotal = 0;
      expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        if (expDate >= weekRange.start && expDate <= weekRange.end) {
          weekTotal += exp.amount;
        }
        if (expDate >= monthRange.start && expDate <= monthRange.end) {
          monthTotal += exp.amount;
        }
      });
      document.getElementById('weekTotal').textContent = `This Week: $${weekTotal.toFixed(2)}`;
      document.getElementById('monthTotal').textContent = `This Month: $${monthTotal.toFixed(2)}`;
    }
  
    function updateSummary() {
      expenseList.innerHTML = '';
      for (const month in monthlyTotals) {
        const li = document.createElement('li');
        li.textContent = `${month}: $${monthlyTotals[month].toFixed(2)}`;
        expenseList.appendChild(li);
      }
      calculateTotals();
    }
  
    function updateCharts() {
      const labels = Object.keys(monthlyTotals);
      const data = Object.values(monthlyTotals);
  
      expenseChart.data.labels = labels;
      expenseChart.data.datasets[0].data = data;
      expenseChart.update();
  
      expensePie.data.labels = labels;
      expensePie.data.datasets[0].data = data;
      expensePie.update();
    }
  
    function updateExpenseList() {
      const list = document.getElementById('expense-list');
      list.innerHTML = '';
      expenses.forEach(exp => {
        const li = document.createElement('li');
        li.textContent = `${exp.date}: ${exp.category} - $${exp.amount.toFixed(2)}`;
        list.appendChild(li);
      });
    }
  
    function updatePieChart() {
      const categoryTotals = {};
      expenses.forEach(exp => {
        if (!categoryTotals[exp.category]) {
          categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
      });
  
      const categories = Object.keys(categoryTotals);
      const amounts = Object.values(categoryTotals);
  
      if (categoryChart) {
        categoryChart.destroy();
      }
  
      const ctx = document.getElementById('categoryChart').getContext('2d');
      categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            data: amounts,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
            ],
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: false
            }
          }
        }
      });
    }
  
    categorySelect.addEventListener('change', function() {
      if (this.value === 'add_new') {
        const newCategory = prompt('Enter new category:');
        if (newCategory && !Array.from(categorySelect.options).some(opt => opt.value === newCategory)) {
          const option = document.createElement('option');
          option.value = newCategory;
          option.textContent = newCategory;
          categorySelect.insertBefore(option, categorySelect.lastElementChild);
          categorySelect.value = newCategory;
        } else {
          categorySelect.value = defaultCategories[0];
        }
      }
    });
  });
=======
window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('monthly-summary');
    const chartCanvas = document.getElementById('expense-chart');
    const pieCanvas = document.getElementById('expense-pie');
    const categorySelect = document.getElementById('category');
    const defaultCategories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];
  
    let monthlyTotals = {};
    const expenses = [];
    let categoryChart = null;
  
    let expenseChart = new Chart(chartCanvas, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Monthly Expenses', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)' }] },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  
    let expensePie = new Chart(pieCanvas, {
      type: 'pie',
      data: { labels: [], datasets: [{ data: [], backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ] }] },
      options: { responsive: true }
    });
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('amount').value;
      const date = document.getElementById('date').value;
      const category = document.getElementById('category').value;
  
      if (!amount || !date || !category) return;
  
      const monthKey = date.slice(0, 7);
      if (!monthlyTotals[monthKey]) monthlyTotals[monthKey] = 0;
      monthlyTotals[monthKey] += parseFloat(amount);
  
      expenses.push({ amount: parseFloat(amount), date, category });
  
      updateSummary();
      updateCharts();
      updateExpenseList();
      updatePieChart();
      form.reset();
      document.getElementById('category').value = "Food";
    });
  
    function updateSummary() {
      expenseList.innerHTML = '';
      for (const month in monthlyTotals) {
        const li = document.createElement('li');
        li.textContent = `${month}: $${monthlyTotals[month].toFixed(2)}`;
        expenseList.appendChild(li);
      }
    }
  
    function updateCharts() {
      const labels = Object.keys(monthlyTotals);
      const data = Object.values(monthlyTotals);
  
      expenseChart.data.labels = labels;
      expenseChart.data.datasets[0].data = data;
      expenseChart.update();
  
      expensePie.data.labels = labels;
      expensePie.data.datasets[0].data = data;
      expensePie.update();
    }
  
    function updateExpenseList() {
      const list = document.getElementById('expense-list');
      list.innerHTML = '';
      expenses.forEach(exp => {
        const li = document.createElement('li');
        li.textContent = `${exp.date}: ${exp.category} - $${exp.amount.toFixed(2)}`;
        list.appendChild(li);
      });
    }
  
    function updatePieChart() {
      const categoryTotals = {};
      expenses.forEach(exp => {
        if (!categoryTotals[exp.category]) {
          categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
      });
  
      const categories = Object.keys(categoryTotals);
      const amounts = Object.values(categoryTotals);
  
      if (categoryChart) {
        categoryChart.destroy();
      }
  
      const ctx = document.getElementById('categoryChart').getContext('2d');
      categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: categories,
          datasets: [{
            data: amounts,
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
            ],
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: {
              display: true,
              position: 'right',
              labels: {
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: false
            }
          }
        }
      });
    }
  
    categorySelect.addEventListener('change', function() {
      if (this.value === 'add_new') {
        const newCategory = prompt('Enter new category:');
        if (newCategory && !Array.from(categorySelect.options).some(opt => opt.value === newCategory)) {
          const option = document.createElement('option');
          option.value = newCategory;
          option.textContent = newCategory;
          categorySelect.insertBefore(option, categorySelect.lastElementChild);
          categorySelect.value = newCategory;
        } else {
          categorySelect.value = defaultCategories[0];
        }
      }
    });
  });
>>>>>>> 929b05eadc49915c5ddfd5871a95337f9b7c3568
  