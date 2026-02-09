import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/dashboard');
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data. Please ensure the backend server is running.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading Dashboard...</div>;
    if (error) return <div className="error">{error}</div>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Financial Overview</h1>

            <div className="stats-grid">
                <div className="stat-card income">
                    <h3>Total Income</h3>
                    <p className="amount">{formatCurrency(data.totalIncome)}</p>
                </div>
                <div className="stat-card expenses">
                    <h3>Total Expenses</h3>
                    <p className="amount">{formatCurrency(data.totalExpenses)}</p>
                </div>
                <div className="stat-card balance">
                    <h3>Current Balance</h3>
                    <p className="amount">{formatCurrency(data.balance)}</p>
                </div>
            </div>

            <div className="transactions-section">
                <h2>Recent Transactions</h2>
                <ul className="transaction-list">
                    {data.recentTransactions.map(transaction => (
                        <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
                            <div className="transaction-info">
                                <span className="transaction-desc">{transaction.description}</span>
                                <span className="transaction-date">{transaction.date}</span>
                            </div>
                            <span className="transaction-amount">
                                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
