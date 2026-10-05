import { useState } from "react";

function Money() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions =
      localStorage.getItem("zayra-transactions");

    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [];
  });

  const [transactionName, setTransactionName] =
    useState("");

  const [transactionAmount, setTransactionAmount] =
    useState("");

  const [transactionType, setTransactionType] =
    useState("expense");

  const saveTransactions = (updatedTransactions) => {
    setTransactions(updatedTransactions);

    localStorage.setItem(
      "zayra-transactions",
      JSON.stringify(updatedTransactions)
    );
  };

  const handleAddTransaction = (event) => {
    event.preventDefault();

    if (
      !transactionName.trim() ||
      !transactionAmount
    ) {
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name: transactionName.trim(),
      amount: Number(transactionAmount),
      type: transactionType,
    };

    saveTransactions([
      ...transactions,
      newTransaction,
    ]);

    setTransactionName("");
    setTransactionAmount("");
    setTransactionType("expense");
  };

  const handleDeleteTransaction = (transactionId) => {
    const updatedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.id !== transactionId
      );

    saveTransactions(updatedTransactions);
  };

  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + transaction.amount,
      0
    );

  const balance = income - expenses;

  return (
    <section className="money-page">
      <div className="money-header">
        <div>
          <p className="eyebrow">
            ♡ MONEY & FINANCES
          </p>

          <h2>
            My Money
          </h2>

          <p className="money-subtitle">
            financially delusional 
          </p>
        </div>
      </div>

      <div className="money-summary">
        <div className="dashboard-card money-card">
          <p className="card-label">
            BALANCE
          </p>

          <h3>
            ${balance.toFixed(2)}
          </h3>

          <span>
            available
          </span>
        </div>

        <div className="dashboard-card money-card">
          <p className="card-label">
            INCOME
          </p>

          <h3>
            ${income.toFixed(2)}
          </h3>

          <span>
            coming in
          </span>
        </div>

        <div className="dashboard-card money-card">
          <p className="card-label">
            EXPENSES
          </p>

          <h3>
            ${expenses.toFixed(2)}
          </h3>

          <span>
            going out
          </span>
        </div>
      </div>

      <div className="money-layout">
        <div className="dashboard-card transaction-card">
          <div className="card-heading">
            <div>
              <p className="card-label">
                TRANSACTIONS
              </p>

              <h3>
                Where did all my money go? ♡
              </h3>
            </div>

            <span className="card-icon">
              $
            </span>
          </div>

          <form
            className="transaction-form"
            onSubmit={handleAddTransaction}
          >
            <input
              type="text"
              placeholder="e.g. Groceries"
              value={transactionName}
              onChange={(event) =>
                setTransactionName(
                  event.target.value
                )
              }
            />

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={transactionAmount}
              onChange={(event) =>
                setTransactionAmount(
                  event.target.value
                )
              }
            />

            <select
              value={transactionType}
              onChange={(event) =>
                setTransactionType(
                  event.target.value
                )
              }
            >
              <option value="expense">
                Expense
              </option>

              <option value="income">
                Income
              </option>
            </select>

            <button type="submit">
              + Add
            </button>
          </form>

          {transactions.length === 0 ? (
            <div className="money-empty">
              <span>
                ♡
              </span>

              <p>
                No transactions yet.
              </p>

              <small>
                Add your first one above ✨
              </small>
            </div>
          ) : (
            <div className="transaction-list">
              {transactions.map(
                (transaction) => (
                  <div
                    className="transaction-item"
                    key={transaction.id}
                  >
                    <div className="transaction-info">
                      <span className="transaction-icon">
                        {transaction.type ===
                        "income"
                          ? "↑"
                          : "↓"}
                      </span>

                      <span>
                        {transaction.name}
                      </span>
                    </div>

                    <div className="transaction-right">
                      <strong
                        className={
                          transaction.type ===
                          "income"
                            ? "income-text"
                            : "expense-text"
                        }
                      >
                        {transaction.type ===
                        "income"
                          ? "+"
                          : "-"}
                        $
                        {transaction.amount.toFixed(
                          2
                        )}
                      </strong>

                      <button
                        className="transaction-delete"
                        onClick={() =>
                          handleDeleteTransaction(
                            transaction.id
                          )
                        }
                        aria-label={`Delete ${transaction.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <aside className="dashboard-card money-tip-card">
          <p className="card-label">
            LITTLE REMINDER
          </p>

          <h3>
            Girl, Check Your Bank Account ♡
          </h3>

          <p>
            Keep adding your income and expenses so ZAYRA.EXE can investigate the financial crime scene.
          </p>

          <div className="money-mini-stats">
            <div>
              <strong>
                {transactions.length}
              </strong>

              <span>
                transactions
              </span>
            </div>

            <div>
              <strong>
                {income > 0
                  ? `${Math.round(
                      (expenses / income) *
                        100
                    )}%`
                  : "0%"}
              </strong>

              <span>
                spent of income
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Money;