import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardCard from './DashboardCard';
import { Wallet } from 'lucide-react';
import React from 'react';

describe('DashboardCard Component', () => {
  it('renders title and formatted amount correctly', () => {
    render(
      <DashboardCard 
        title="Total Balance" 
        amount={12500} 
        color="border-blue-500" 
        icon={Wallet} 
      />
    );
    
    expect(screen.getByText('Total Balance')).toBeInTheDocument();
    expect(screen.getByText('$12,500')).toBeInTheDocument();
  });

  it('applies the correct border color class', () => {
    const { container } = render(
      <DashboardCard 
        title="Test" 
        amount={0} 
        color="border-red-500" 
        icon={Wallet} 
      />
    );
    
    const cardDiv = container.firstChild;
    expect(cardDiv).toHaveClass('border-red-500');
  });
});
