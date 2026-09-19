import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ searchTerm, onSearchChange, activeCategory, onCategoryChange }) {
  const { cartCount } = useCart();
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  const categories = [
    { id: 'all', label: '🌿 Sabhi' },
    { id: 'hari-sabzi', label: '🥬 Hari Sabzi' },
    { id: 'jad', label: '🥕 Jad Sabjhi' },
    { id: 'masale', label: '🧅 Masale' },
    { id: 'fruits', label: '🍎 Fruits' },
    { id: 'mushroom', label: '🍄 Mushroom' }
  ];

  return (
    <nav className="navbar">
      {/* Top Row: Logo, Brand & Search Bar */}
      <div className="nav-top-row">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Vegetable Mart logo" className="brand-logo" />
          <span>VEGETABLE MART</span>
        </Link>

        {isHomePage ? (
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              id="product-search"
              placeholder="Search (e.g. aloo, tamatar, onion)..."
              value={searchTerm || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              aria-label="Search vegetables"
            />
          </div>
        ) : (
          <div style={{ flex: 1 }}></div>
        )}
      </div>

      {/* Bottom Row: Feature links and Category Filters */}
      <div className="nav-bottom-row">
        <Link to="/" className={`nav-btn-link ${isHomePage ? 'active' : ''}`}>
          🏠 Home
        </Link>
        <Link to="/cart" className="nav-btn-link cart-link">
          🛒 Cart <span className="cart-badge">{cartCount}</span>
        </Link>
        <Link to="/wishlist" className="nav-btn-link">
          ♥ Wishlist
        </Link>
        {currentUser ? (
          <Link to="/profile" className="nav-btn-link">
            👤 {currentUser.name || 'Profile'}
          </Link>
        ) : (
          <Link to="/login" className="nav-btn-link">
            🔑 Login
          </Link>
        )}
        {isAdmin && (
          <Link to="/admin" className="nav-btn-link admin-pill">
            ⚙️ Admin
          </Link>
        )}
        <Link to="/delivery" className="nav-btn-link rider-pill">
          🛵 Captain
        </Link>

        {/* Category filters shown on Home */}
        {isHomePage && categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange && onCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
