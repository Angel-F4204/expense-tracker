/* =========================
   Application State
========================= */

// Main expense array
let expenses = [];

/* =========================
   DOM Elements
========================= */

const expenseForm = document.getElementById("expense-form");

const descriptionInput = document.getElementById("description");

const amountInput = document.getElementById("amount");

const categoryInput = document.getElementById("category");

const dateInput = document.getElementById("date");

const formError = document.getElementById("form-error");

const expenseList = document.getElementById("expense-list");

const emptyMessage = document.getElementById("empty-message");

const overallTotal = document.getElementById("overall-total");

const expenseCount = document.getElementById("expense-count");

/* =========================
   Render Expenses
========================= */

function renderExpenses() {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    emptyMessage.style.display = "block";

    return;
  }

  emptyMessage.style.display = "none";
  /* =========================
   Update Totals
========================= */

  const total = expenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  overallTotal.textContent = `$${total.toFixed(2)}`;

  expenseCount.textContent = expenses.length;

  expenses.forEach(function (expense) {
    const expenseItem = document.createElement("div");

    expenseItem.classList.add("expense-item");

    expenseItem.innerHTML = `
            <div>
                <strong>${expense.description}</strong>
                -
                $${expense.amount.toFixed(2)}
                -
                ${expense.category}
                -
                ${expense.date}
            </div>
        `;

    expenseList.appendChild(expenseItem);
  });
}
/* =========================
   Form Submission
========================= */

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  formError.textContent = "";

  const description = descriptionInput.value.trim();

  const amount = Number(amountInput.value);

  const category = categoryInput.value;

  const date = dateInput.value;

  // Validation

  if (description === "") {
    formError.textContent = "Description is required.";

    return;
  }

  if (amount <= 0) {
    formError.textContent = "Amount must be greater than 0.";

    return;
  }

  if (date === "") {
    formError.textContent = "Date is required.";

    return;
  }

  // Create expense object

  const expense = {
    id: Date.now(),

    description,

    amount,

    category,

    date,
  };

  // Add to state array

  expenses.push(expense);

  console.log(expenses);

  renderExpenses();

  // Clear form

  expenseForm.reset();
});
