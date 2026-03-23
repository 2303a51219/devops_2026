import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Expenses from '../components/Expenses';

test('Expenses component shows rent and groceries', () => {
  render(<Expenses />);
  expect(screen.getByText(/Rent/)).toBeInTheDocument();
  expect(screen.getByText(/Groceries/)).toBeInTheDocument();
});
