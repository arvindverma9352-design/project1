import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { productLabels, productImages } from '../constants/products';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (item) => {
    const key = typeof item === 'string' ? item : item.name || item.id;
    const price = item.price || 50;
    const image = item.image || productImages[key] || '/images/vegback.png';

    addToCart(key, price, image, '1kg');
    removeFromWishlist(key);
  };

  return (
    <>
      <Toast />
      <Navbar />

      <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: '#1e7a4b', fontFamily: "'Space Grotesk', sans-serif" }}>♥ Your Wishlist</h1>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>💚</p>
            <h3 style={{ fontSize: '1.5rem', color: '#333' }}>Aapki wishlist khali hai</h3>
            <p style={{ color: '#666' }}>Apni pasand ki sabziyon ko save karne ke liye heart button click karein.</p>
            <Link to="/" className="hero-button" style={{ display: 'inline-block', marginTop: '15px' }}>
              Explore vegetables ↓
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {wishlist.map((item) => {
              const key = typeof item === 'string' ? item : item.name || item.id;
              const title = productLabels[key] || key;
              const image = item.image || productImages[key] || '/images/vegback.png';
              const price = item.price || 50;

              return (
                <div
                  key={key}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    padding: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src={image}
                    alt={title}
                    style={{ width: '100%', height: '140px', objectFit: 'contain', background: '#f5fbf3', borderRadius: '12px' }}
                  />
                  <h3 style={{ margin: '12px 0 6px', fontSize: '1.05rem', color: '#1e7a4b' }}>{title}</h3>
                  <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '14px' }}>₹{price} / 1kg</div>

                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#1e7a4b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Move to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(key)}
                      style={{
                        padding: '10px 14px',
                        background: '#ffebee',
                        color: '#c62828',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

