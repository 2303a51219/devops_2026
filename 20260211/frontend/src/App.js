import React from 'react';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Income from './components/Income';

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'Segoe UI, sans-serif' }}>
      <h1>Finance Tracker (CI Demo)</h1>
      <Dashboard />
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <Income />
        <Expenses />
      </div>
    </div>
  );
}
