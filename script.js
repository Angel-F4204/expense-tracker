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
const sortOption = document.getElementById("sort-option");
const convertButton = document.getElementById("convert-button");
const convertedTotal = document.getElementById("converted-total");
const conversionError = document.getElementById("conversion-error");

/* =========================
   localStorage Functions
========================= */

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadExpenses() {
  try {
    const savedExpenses = localStorage.getItem("expenses");

    if (savedExpenses === null) {
      expenses = [];
    } else {
      expenses = JSON.parse(savedExpenses);
    }
  } catch (error) {
    expenses = [];
  }
}

/* =========================
   Helper Functions
========================= */

function getFilteredExpenses() {
  let filteredExpenses = expenses;

  if (filterCategory.value !== "All") {
    filteredExpenses = expenses.filter(function (expense) {
      return expense.category === filterCategory.value;
    });
  }

  if (sortOption.value === "amount-asc") {
    filteredExpenses = [...filteredExpenses].sort(function (a, b) {
      return a.amount - b.amount;
    });
  } else if (sortOption.value === "amount-desc") {
    filteredExpenses = [...filteredExpenses].sort(function (a, b) {
      return b.amount - a.amount;
    });
  } else if (sortOption.value === "date-asc") {
    filteredExpenses = [...filteredExpenses].sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    });
  } else if (sortOption.value === "date-desc") {
    filteredExpenses = [...filteredExpenses].sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  return filteredExpenses;
}

/* =========================
   Render Expenses
========================= */

function renderExpenses() {
  expenseList.innerHTML = "";
  categoryTotals.innerHTML = "";
  convertedTotal.textContent = "";
  conversionError.textContent = "";

  const filteredExpenses = getFilteredExpenses();

  if (filteredExpenses.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  const total = filteredExpenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  overallTotal.textContent = `$${total.toFixed(2)}`;
  expenseCount.textContent = filteredExpenses.length;

  const totalsByCategory = filteredExpenses.reduce(function (totals, expense) {
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

      saveExpenses();
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

  const expense = {
    id: Date.now(),
    description,
    amount,
    category,
    date,
  };

  expenses.push(expense);

  saveExpenses();
  renderExpenses();

  expenseForm.reset();
});

/* =========================
   Filter and Sort Changes
========================= */

filterCategory.addEventListener("change", function () {
  renderExpenses();
});

sortOption.addEventListener("change", function () {
  renderExpenses();
});

/* =========================
   Currency Conversion
========================= */

convertButton.addEventListener("click", async function () {
  const filteredExpenses = getFilteredExpenses();

  const total = filteredExpenses.reduce(function (sum, expense) {
    return sum + expense.amount;
  }, 0);

  convertedTotal.textContent = "";
  conversionError.textContent = "";
  convertButton.disabled = true;
  convertButton.textContent = "Converting...";

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error("Could not fetch exchange rate.");
    }

    const data = await response.json();
    const eurRate = data.rates.EUR;
    const euroTotal = total * eurRate;

    convertedTotal.textContent = `EUR Total: €${euroTotal.toFixed(2)}`;
  } catch (error) {
    conversionError.textContent = "Conversion failed. Please try again later.";
  }

  convertButton.disabled = false;
  convertButton.textContent = "Convert to EUR";
});

/* =========================
   Initial Page Load
========================= */

dateInput.value = new Date().toISOString().split("T")[0];

loadExpenses();
renderExpenses();
