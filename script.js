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

const categoryTotals = document.getElementById("category-totals");

const filterCategory = document.getElementById("filter-category");

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

  /* =========================
   Update Category Totals
========================= */

  categoryTotals.innerHTML = "";

  const totalsByCategory = expenses.reduce(function (totals, expense) {
    if (totals[expense.category] === undefined) {
      totals[expense.category] = 0;
    }

    totals[expense.category] += expense.amount;

    return totals;
  }, {});

  Object.keys(totalsByCategory).forEach(function (category) {
    const categoryItem = document.createElement("li");

    categoryItem.textContent = `${category}: $${totalsByCategory[category].toFixed(2)}`;

    categoryTotals.appendChild(categoryItem);
  });

  /* =========================
   Filter Expenses
========================= */

  let filteredExpenses = expenses;

  if (filterCategory.value !== "All") {
    filteredExpenses = expenses.filter(function (expense) {
      return expense.category === filterCategory.value;
    });
  }

  filteredExpenses.forEach(function (expense) {
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

        <button class="delete-button">
            Delete
        </button>
    `;

    expenseList.appendChild(expenseItem);

    const deleteButton = expenseItem.querySelector(".delete-button");

    deleteButton.addEventListener("click", function () {
      expenses = expenses.filter(function (item) {
        return item.id !== expense.id;
      });

      renderExpenses();
    });
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

  /* =========================
   Filter Changes
========================= */

  filterCategory.addEventListener("change", function () {
    renderExpenses();
  });
});
