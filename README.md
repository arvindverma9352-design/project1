# 🥬 Vegetable Mart

A modern farm-fresh vegetable shopping platform. Upgraded from vanilla HTML/JS/CSS to a robust, full-stack **React + Node.js (Express) + MongoDB** architecture.

## 🚀 Key Features
- **Customer Portal**: Browse categorized fresh vegetables, add to cart, maintain a wishlist, and place orders seamlessly.
- **Rapido-Style Live Order Tracking**: Customers can track their delivery boy in real-time on a live GPS map using `react-leaflet`.
- **Fast2SMS OTP Verification**: Secure real-time mobile OTP verification during user sign-up.
- **Admin Dashboard**: Manage 45+ products, assign delivery boys to orders, monitor live order statuses, and toggle global store availability.
- **Delivery Rider Portal**: A dedicated secure portal for riders to clock in (Duty ON/OFF), accept assigned orders, broadcast their live GPS location, and mark orders as delivered.
- **Auto Scroll-to-Top**: Enhanced UX logic to ensure perfect navigation transitions across pages.
- **Responsive UI**: Fully optimized for smooth experience across mobile, tablet, and desktop devices.

## 📁 Project Structure
- `/frontend`: Contains the React Vite Single Page Application (SPA), Context API states, and Leaflet Maps.
- `/backend`: Contains the Express server, MongoDB (Mongoose) models, and secure REST API routes.
- `/backend/.env`: Environment configuration for MongoDB URI, JWT Secrets, and Fast2SMS API Key.

## ⚙️ How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- MongoDB running locally or a MongoDB Atlas connection string.
- Fast2SMS API Key (for real OTPs).

### Steps
1. Clone or open the project folder in VS Code.
2. Install dependencies for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Start the Backend API (runs on `http://localhost:5000`):
   ```bash
   cd backend
   npm start
   ```
4. Start the Frontend App (runs on `http://localhost:5173`):
   ```bash
   cd frontend
   npm run dev
   ```
5. Open your browser:
   - **Main App**: `http://localhost:5173/`
   - **Admin Panel**: `http://localhost:5173/admin`
   - **Delivery Captain Portal**: `http://localhost:5173/delivery`

## 🌍 Live Deployment (Vercel & Render)
This project is configured for seamless deployment:
- **Frontend**: Deploy `frontend/` directory to **Vercel** as a Vite project.
- **Backend**: Deploy `backend/` directory to **Render.com** as a Node web service.
- *Note:* Make sure to add the `FAST2SMS_API_KEY` and `MONGODB_URI` to your Render Environment Variables!

## 👨‍💻 Author
Designed and developed for **Vegetable Mart**.
