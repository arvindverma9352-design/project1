import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function DeliveryPortal() {
  const { currentRider, loginRider, logoutRider } = useAuth();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [dutyLoading, setDutyLoading] = useState(false);

  const riderId = currentRider?.id || currentRider?._id;

  const loadRiderOrders = useCallback(async () => {
    if (!riderId) return;
    try {
      const data = await api.getOrders(`?riderId=${riderId}`);
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Could not load rider orders:', err);
    }
  }, [riderId]);

  useEffect(() => {
    if (riderId) {
      loadRiderOrders();
      const interval = setInterval(loadRiderOrders, 10000); // 10s live poll for new orders
      return () => clearInterval(interval);
    }
  }, [riderId, loadRiderOrders]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.riderLogin({ phone: phone.trim(), pin: pin.trim() });
      if (data && data.rider) {
        if (data.token) data.rider.token = data.token;
        loginRider(data.rider);
      } else {
        throw new Error(data?.message || 'Invalid mobile number or PIN');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDuty = async () => {
    if (!riderId) return;
    setDutyLoading(true);
    const newDuty = !currentRider.onDuty;

    try {
      await api.toggleRiderDuty(riderId, newDuty);
      loginRider({ ...currentRider, onDuty: newDuty });
    } catch (err) {
      alert('Could not change duty status: ' + err.message);
    } finally {
      setDutyLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    if (!window.confirm('Kya order successfully deliver ho gaya hai?')) return;
    try {
      await api.updateOrderStatus(orderId, { status: 'Delivered' });
      alert('Order marked as Delivered! Great job.');
      loadRiderOrders();
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  // LOGIN SCREEN
  if (!currentRider) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #183525, #0d5432)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ maxWidth: '400px', width: '100%', background: '#fff', borderRadius: '18px', padding: '36px 28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/delivery-icon-192.png" alt="VM Delivery" style={{ width: '64px', height: '64px', borderRadius: '14px', marginBottom: '10px' }} />
            <h2 style={{ margin: '0 0 4px', color: '#1e7a4b' }}>VM Delivery Captain</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Partner Login</p>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Registered Mobile</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                style={{ width: '100%', padding: '11px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Security PIN</label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="4-digit PIN"
                style={{ width: '100%', padding: '11px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                background: '#1e7a4b',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '15px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Logging in...' : 'Login as Captain ➔'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ color: '#666', fontSize: '13px', textDecoration: 'none' }}>
              ← Return to Customer Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD SCREEN
  const isOnDuty = currentRider.onDuty;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5', padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '18px 20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem' }}>🛵</span>
            <div>
              <h3 style={{ margin: '0 0 2px', color: '#1e7a4b' }}>{currentRider.name}</h3>
              <p style={{ margin: 0, color: '#777', fontSize: '13px' }}>Captain ID: {riderId}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutRider}
            style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
          >
            Logout
          </button>
        </div>

        {/* Duty Toggle Button */}
        <div style={{ marginTop: '16px' }}>
          <button
            type="button"
            onClick={handleToggleDuty}
            disabled={dutyLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: dutyLoading ? 'not-allowed' : 'pointer',
              background: isOnDuty ? '#2e7d32' : '#757575',
              color: '#fff',
              boxShadow: isOnDuty ? '0 4px 14px rgba(46,125,50,0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {dutyLoading ? 'Updating Duty...' : isOnDuty ? '🟢 DUTY ON (Receiving Orders)' : '⚪ DUTY OFF (Click to Start)'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      <h3 style={{ color: '#1e7a4b', margin: '0 0 12px 6px' }}>Assigned Deliveries ({orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length})</h3>

      {!isOnDuty ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '16px', color: '#666' }}>
          <p style={{ fontSize: '2rem', margin: 0 }}>💤</p>
          <h4>Aap abhi Off Duty hain</h4>
          <p style={{ fontSize: '13px' }}>Orders receive karne ke liye 'DUTY ON' karein.</p>
        </div>
      ) : orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '16px', color: '#666' }}>
          <p style={{ fontSize: '2rem', margin: 0 }}>📦</p>
          <h4>Koi active order nahi hai</h4>
          <p style={{ fontSize: '13px' }}>Naye orders aane par yahan auto-display honge.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').map((ord) => {
            const id = ord.id || ord._id;
            const isDelivered = ord.status === 'Delivered';

            return (
              <div
                key={id}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '18px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  border: isDelivered ? '1px solid #c8e6c9' : '1px solid #e0e0e0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>Order #{id}</strong>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: isDelivered ? '#e8f5e9' : '#fff3e0',
                      color: isDelivered ? '#2e7d32' : '#e65100'
                    }}
                  >
                    {ord.status || 'Assigned'}
                  </span>
                </div>

                <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                  👤 Customer: <strong>{ord.customer}</strong>
                </div>

                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                  📍 Address: {ord.address}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <a
                    href={`tel:${ord.phone}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px',
                      background: '#f1f8e9',
                      color: '#2e7d32',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      border: '1px solid #c5e1a5'
                    }}
                  >
                    📞 Call Customer
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(ord.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px',
                      background: '#e3f2fd',
                      color: '#1565c0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '13px',
                      border: '1px solid #90caf9'
                    }}
                  >
                    🗺️ Navigate
                  </a>
                </div>

                {!isDelivered && (
                  <button
                    type="button"
                    onClick={() => handleMarkDelivered(id)}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                      padding: '12px',
                      background: '#1e7a4b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Mark as Delivered (Collect ₹{ord.total})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

