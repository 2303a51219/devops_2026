# Personal Finance Tracker - Deployment Guide

## Prerequisites
- Node.js installed (v14 or higher)
- npm installed

## Local Deployment

### 1. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Start the backend server:
```bash
npm start
```
The server will run on `http://localhost:5001`.

### 2. Frontend Setup
Open a new terminal, navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Production Build

To build the frontend for production:
```bash
cd frontend
npm run build
```
The build artifacts will be in the `dist` directory. You can serve these static files using any static file server or integrate them with the backend.
