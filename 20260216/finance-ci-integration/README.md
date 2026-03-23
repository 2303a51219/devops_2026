# Personal Finance Tracker - CI Integration

A professional Full-Stack Personal Finance Tracker with a Node.js backend, React frontend, and automated CI pipeline.

## Project Structure
- `backend/`: Express.js API with Integration Tests (Jest/Supertest).
- `frontend/`: Vite + React + Tailwind CSS dashboard.
- `.github/workflows/`: CI pipeline configuration.

## Setup & Running

### 1. Backend
```bash
cd backend
npm install
npm start
```
*Backend runs at http://localhost:5000*

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at http://localhost:5173*

## Features
- **Dashboard**: Real-time balance, income, and expense tracking.
- **Transactions**: Add and list income/expense entries.
- **CI Pipeline**: Automated testing on every push to GitHub.
- **Responsive UI**: Built with modern Tailwind CSS and Lucide icons.