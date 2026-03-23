import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';

test('renders dashboard summary with income/expenses/balance', () => {
  render(<Dashboard />);
  expect(screen.getByTestId('income')).toHaveTextContent('Total Income');
  expect(screen.getByTestId('expenses')).toHaveTextContent('Total Expenses');
  expect(screen.getByTestId('balance')).toHaveTextContent('Balance');
});
