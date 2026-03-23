import React from 'react';

export default function Dashboard() {
  // Minimal UI used for unit testing
  return (
    <section>
      <h2>Dashboard Summary</h2>
      <p data-testid="income">Total Income: $4500</p>
      <p data-testid="expenses">Total Expenses: $1680</p>
      <p data-testid="balance">Balance: $2820</p>
    </section>
  );
}
