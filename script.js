const expenseForm = document.getElementById('expense-form');
const expenseText = document.getElementById('expense-text');
const expenseAmount = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');

let expenses = [];

function addExpense(e) {
    e.preventDefault();

    if (expenseText.value.trim() === '' || expenseAmount.value.trim() === '') {
        return;
    }

    const expense = {
        id: generateID(),
        text: expenseText.value,
        amount: +expenseAmount.value
    };

    expenses.push(expense);

    addExpenseToDOM(expense);
    updateLocalStorage();

    expenseText.value = '';
    expenseAmount.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addExpenseToDOM(expense) {
    const item = document.createElement('li');

    item.innerHTML = `
        ${expense.text} <span>$${expense.amount}</span>
        <button class="delete-btn" onclick="removeExpense(${expense.id})">x</button>
    `;

    expenseList.appendChild(item);
}

function removeExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function init() {
    expenseList.innerHTML = '';
    const localExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (localExpenses) {
        expenses = localExpenses;
        expenses.forEach(addExpenseToDOM);
    }
}

expenseForm.addEventListener('submit', addExpense);
window.addEventListener('load', init);
