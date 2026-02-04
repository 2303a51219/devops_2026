import React from 'react';

function Dashboard() {
    return (
        <div className="page dashboard">
            <header className="page-header">
                <h2>Dashboard</h2>
                <p className="welcome-text">Welcome back, Sushruth!</p>
            </header>

            <div className="dashboard-grid">
                <div className="card summary-card">
                    <h3>GPA</h3>
                    <p className="big-number">3.8</p>
                    <span className="subtitle">Out of 4.0</span>
                </div>
                <div className="card summary-card">
                    <h3>Attendance</h3>
                    <p className="big-number">95%</p>
                    <span className="subtitle">Overall</span>
                </div>
                <div className="card summary-card">
                    <h3>Credits</h3>
                    <p className="big-number">45</p>
                    <span className="subtitle">Earned</span>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
