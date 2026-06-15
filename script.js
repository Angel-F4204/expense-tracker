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

  // Clear form

  expenseForm.reset();
});
