import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { productLabels } from '../constants/products';
import { api } from '../services/api';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, showToast } = useCart();
  const { currentUser } = useAuth();
  const { isStoreOpen } = useStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerAddress, setCustomerAddress] = useState(currentUser?.address || '');
  const [customerPincode, setCustomerPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const deliveryFee = cartTotal > 0 ? 10 : 0;
  const platformFee = 0;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isStoreOpen) {
      alert('⚠️ Website abhi orders ke liye band hai. Kripya thodi der baad try karein.');
      return;
    }

    if (cart.length === 0) {
      alert('Aapka cart khali hai!');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !customerPincode.trim()) {
      alert('Kripya apna naam, mobile number, address aur pincode (compulsory) bharein.');
      return;
    }

    if (customerPincode.trim() !== '301001') {
      alert('Sorry, abhi hum sirf 301001 pincode par hi delivery karte hain.');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: customerName.trim(),
      phone: customerPhone.trim(),
      address: `${customerAddress.trim()}${customerPincode ? ' - ' + customerPincode.trim() : ''}`,
      items: cart.map((item) => ({
        name: item.name,
        title: productLabels[item.name] || item.name,
        price: item.price,
        weight: item.weight || '1kg',
        quantity: item.quantity,
        total: (item.price || 0) * (item.quantity || 1)
      })),
      total: grandTotal,
      subtotal: cartTotal,
      deliveryFee,
      paymentMethod,
      userId: currentUser?._id || currentUser?.id || null,
      status: 'Received',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await api.createOrder(orderPayload);
      const orderId = res.order?.id || res.order?._id || 'VM' + Math.floor(1000 + Math.random() * 9000);

      clearCart();
      setOrderSuccess({ id: orderId, total: grandTotal });
    } catch (err) {
      alert('Order place karne me dikkat aayi: ' + (err.message || 'Kripya network check karein'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Aapka browser location support nahi karta.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        setCustomerAddress(prev => 
          prev ? `${prev}\n\nLive Location: ${mapsLink}` : `Live Location: ${mapsLink}\n\n(Please add your house number manually)`
        );
      },
      (error) => {
        alert('Location access deny ho gaya. Kripya apna address manually type karein.');
      }
    );
  };

  return (
    <>
      <Toast />
      <Navbar />

      <div className="cart-page-container" style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
        <h1 style={{ color: '#1e7a4b', fontFamily: "'Space Grotesk', sans-serif" }}>🛒 Your Shopping Cart</h1>

        {orderSuccess ? (
          <div style={{ background: '#e8f5e9', border: '2px solid #2e7d32', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#1b5e20', fontSize: '2rem' }}>🎉 Order Placed Successfully!</h2>
            <p style={{ fontSize: '1.2rem', color: '#2e7d32' }}>
              Aapka Order ID: <strong>{orderSuccess.id}</strong>
            </p>
            <p style={{ color: '#555' }}>
              Total Amount: <strong>₹{orderSuccess.total}</strong> ({paymentMethod})
            </p>
            <p style={{ color: '#555', marginTop: '10px' }}>
              Farm-fresh vegetables jaldi hi aapke address par deliver kar di jayengi!
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link to="/" className="hero-button" style={{ display: 'inline-block' }}>
                Continue Shopping ➔
              </Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '3rem', margin: 0 }}>🛒</p>
            <h3 style={{ fontSize: '1.5rem', color: '#333' }}>Aapka cart khali hai</h3>
            <p style={{ color: '#666' }}>Taaza sabziyan dekhne ke liye home page par jayein.</p>
            <Link to="/" className="hero-button" style={{ display: 'inline-block', marginTop: '15px' }}>
              Explore vegetables ↓
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {/* Left: Cart Items List */}
            <div>
              <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>Cart Items ({cart.length})</h3>

                {cart.map((item, idx) => (
                  <div
                    key={`${item.name}-${item.weight}-${idx}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '14px 0',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '65px', height: '65px', objectFit: 'contain', borderRadius: '10px', background: '#f5fbf3' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem', textTransform: 'capitalize' }}>
                        {productLabels[item.name] || item.name}
                      </h4>
                      <span style={{ fontSize: '13px', color: '#666', background: '#eef7e8', padding: '2px 8px', borderRadius: '6px' }}>
                        {item.weight || '1kg'}
                      </span>
                      <div style={{ marginTop: '6px', fontWeight: 'bold', color: '#1e7a4b' }}>
                        ₹{item.price}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -1)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, 1)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#e53935', fontSize: '18px', cursor: 'pointer', marginLeft: '8px' }}
                      title="Remove item"
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Address & Checkout Form */}
            <div>
              <form
                onSubmit={handlePlaceOrder}
                style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
              >
                <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>Delivery Address</h3>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600' }}>Delivery Address (House/Street/Area) *</label>
                    <button 
                      type="button" 
                      onClick={handleGetLocation}
                      style={{ fontSize: '11px', padding: '4px 8px', background: '#e8f5e9', color: '#1e7a4b', border: '1px solid #c8e6c9', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      📍 Get Live Location
                    </button>
                  </div>
                  <textarea
                    required
                    rows="3"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="Complete address for delivery"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Pincode *</label>
                  <input
                    type="text"
                    required
                    value={customerPincode}
                    onChange={(e) => setCustomerPincode(e.target.value)}
                    placeholder="e.g. 302020"
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Payment Option</label>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="payment"
                        checked={true}
                        onChange={() => setPaymentMethod('COD')}
                      />
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>

                {/* Bill Summary */}
                <div style={{ background: '#f8fcf5', padding: '16px', borderRadius: '12px', border: '1px solid #e1eedf', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Items Total:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Delivery Fee:</span>
                    <span style={{ color: deliveryFee === 0 ? '#2e7d32' : 'inherit' }}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px dashed #ccc', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '17px', color: '#1e7a4b' }}>
                    <span>To Pay:</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1e7a4b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 18px rgba(30,122,75,0.25)'
                  }}
                >
                  {isSubmitting ? 'Placing Order...' : `Place Order (₹${grandTotal}) ➔`}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

