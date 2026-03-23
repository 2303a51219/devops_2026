import React, { useState, useEffect, useCallback } from 'react';
import { financeService } from './services/api';
import DashboardCard from './components/DashboardCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Wallet, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';

function App() {
  const [dashboard, setDashboard] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, expRes, incRes] = await Promise.all([
        financeService.getDashboard(),
        financeService.getExpenses(),
        financeService.getIncome()
      ]);
      
      setDashboard(dashRes.data);
      
      // Combine and label transactions
      const combined = [
        ...incRes.data.map(t => ({ ...t, type: 'income' })),
        ...expRes.data.map(t => ({ ...t, type: 'expense' }))
      ];
      setTransactions(combined);
      setError(null);
    } catch (err) {
      setError("Failed to connect to backend server. Is it running at localhost:5000?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTransaction = async (data) => {
    try {
      if (data.type === 'income') {
        await financeService.addIncome({ description: data.description, amount: Number(data.amount) });
      } else {
        await financeService.addExpense({ description: data.description, amount: Number(data.amount) });
      }
      await fetchData(); // Refresh data
    } catch (err) {
      alert("Error adding transaction");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FinanceTracker CI</h1>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard 
            title="Total Balance" 
            amount={dashboard.balance} 
            color="border-blue-500" 
            icon={Wallet} 
          />
          <DashboardCard 
            title="Total Income" 
            amount={dashboard.totalIncome} 
            color="border-green-500" 
            icon={TrendingUp} 
          />
          <DashboardCard 
            title="Total Expenses" 
            amount={dashboard.totalExpenses} 
            color="border-red-500" 
            icon={TrendingDown} 
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <TransactionForm onTransactionAdded={handleAddTransaction} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList transactions={transactions} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-gray-200 text-center text-sm text-gray-500">
        Built with React, Vite & Tailwind CSS • Integrated with CI Pipeline
      </footer>
    </div>
  );
}

export default App;