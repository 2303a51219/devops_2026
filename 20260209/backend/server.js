const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Mock Data
const dashboardData = {
    totalIncome: 125000,
    totalExpenses: 45000,
    balance: 80000,
    recentTransactions: [
        { id: 1, description: 'Freelance Project', amount: 5000, type: 'income', date: '2026-02-08' },
        { id: 2, description: 'Grocery Shopping', amount: 150, type: 'expense', date: '2026-02-07' },
        { id: 3, description: 'Electric Bill', amount: 200, type: 'expense', date: '2026-02-06' },
        { id: 4, description: 'Investment Return', amount: 1200, type: 'income', date: '2026-02-05' },
    ]
};

// Routes
app.get('/api/dashboard', (req, res) => {
    // Simulate network delay for loading state demo
    setTimeout(() => {
        res.json(dashboardData);
    }, 1000);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
