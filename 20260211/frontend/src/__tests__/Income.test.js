import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Income from '../components/Income';

test('Income component shows salary and freelance', () => {
  render(<Income />);
  expect(screen.getByText(/Salary/)).toBeInTheDocument();
  expect(screen.getByText(/Freelance/)).toBeInTheDocument();
});
