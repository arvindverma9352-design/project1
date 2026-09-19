import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { StoreProvider } from './context/StoreContext';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DeliveryPortal from './pages/Delivery/DeliveryPortal';

// Preserved stylesheets
import './styles/Af-lo-sin-.css';
import './styles/product-details.css';
import './styles/admin.css';
import './styles/delivery.css';
import './styles/profile.css';
import './styles/wishlist.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Customer Store Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/product/:key" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Portals */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/delivery" element={<DeliveryPortal />} />

                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
