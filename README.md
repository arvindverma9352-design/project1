# Vegetable Mart

A modern farm-fresh vegetable shopping platform. Upgraded from vanilla HTML/JS/CSS to a full-stack **React + Node.js (Express) + MongoDB** architecture.

## Project Overview
This project is a complete e-commerce solution including:
- **Frontend App**: Built with React and Vite (React Router, Context API).
- **Backend API**: Built with Node.js and Express.
- **Database**: MongoDB for storing products, users, riders, and orders.

## Key Features
- **Customer Portal**: Browse products, add to cart, wishlist, and place orders.
- **Admin Dashboard**: Manage products (add/edit/delete), assign delivery boys, track live orders, and toggle store availability.
- **Delivery Rider Portal**: A dedicated app/portal for delivery boys to accept orders, manage their duty status, and mark orders as delivered.
- **Secure Authentication**: Passwords hashed with bcrypt, protecting user data.
- **Responsive UI**: Works smoothly on mobile and desktop devices.

## Project Structure
- `/frontend`: Contains the React Vite SPA.
- `/backend`: Contains the Express server, Mongoose models, and REST API routes.
- `package.json`: A unified configuration for simple deployment and dependency installation.

## How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- MongoDB running locally or a MongoDB Atlas connection string.

### Steps
1. Open the project folder in VS Code.
2. Install dependencies for both frontend and backend:
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. Start the Backend API (runs on `http://localhost:5000`):
   ```bash
   cd backend
   node server.js
   ```
4. Start the Frontend App (runs on `http://localhost:5173`):
   ```bash
   cd frontend
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.
   - For Admin Panel: Go to `http://localhost:5173/admin`
   - For Delivery Boy Portal: Go to `http://localhost:5173/delivery`

## Author
Vegetable Mart Project
