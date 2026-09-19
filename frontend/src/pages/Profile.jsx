import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userId = currentUser._id || currentUser.id;
    api.getOrders(userId ? `?userId=${userId}` : '')
      .then((data) => {
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleLogout = () => {
    if (window.confirm('Kya aap sachme logout karna chahte hain?')) {
      logoutUser();
      navigate('/');
    }
  };

  if (!currentUser) {
    return (
      <>
        <Toast />
        <Navbar />
        <div style={{ maxWidth: '600px', margin: '60px auto', padding: '40px', background: '#fff', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <h2>👤 User Login Required</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Apne orders aur profile dekhne ke liye login karein.</p>
          <Link to="/login" className="hero-button" style={{ display: 'inline-block' }}>
            Login Now ➔
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Toast />
      <Navbar />

      <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
        {/* Profile Card */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h2 style={{ margin: '0 0 6px', color: '#1e7a4b' }}>{currentUser.name || 'Customer'}</h2>
              <p style={{ margin: '0 0 4px', color: '#666' }}>📧 {currentUser.email || 'No email'}</p>
              {currentUser.phone && <p style={{ margin: '0', color: '#666' }}>📱 {currentUser.phone}</p>}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: '#ffebee',
                color: '#c62828',
                border: '1px solid #ffcdd2',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Order History */}
        <h2 style={{ color: '#1e7a4b', fontFamily: "'Space Grotesk', sans-serif" }}>📦 Order History</h2>

        {loading ? (
          <p>Orders load ho rahe hain...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px' }}>
            <p>Abhi tak koi order nahi mila.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const orderId = order.id || order._id || 'VM-ORDER';
              const status = order.status || 'Received';
              const statusColors = {
                Received: '#ff9800',
                Packed: '#2196f3',
                'Out for delivery': '#9c27b0',
                Delivered: '#4caf50',
                Cancelled: '#f44336'
              };

              return (
                <div
                  key={orderId}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '18px 22px',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong>Order #{orderId}</strong>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#fff',
                        background: statusColors[status] || '#757575'
                      }}
                    >
                      {status}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                    {Array.isArray(order.items) && (
                      <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                        {order.items.map((it, i) => (
                          <span key={i} style={{ marginRight: '10px' }}>
                            {it.title || it.name} ({it.weight || '1kg'}) × {it.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e7a4b', fontSize: '15px' }}>
                      <span>Total Amount:</span>
                      <span>₹{order.total || 0}</span>
                    </div>
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

