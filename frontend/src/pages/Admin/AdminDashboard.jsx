import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { productLabels, productImages, productListOrder } from '../../constants/products';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const { isStoreOpen, refreshStoreStatus, refreshProducts } = useStore();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  // Edit Product Form State
  const [editKey, setEditKey] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Vegetables');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editAvailable, setEditAvailable] = useState(true);
  const [editP250, setEditP250] = useState('');
  const [editP500, setEditP500] = useState('');
  const [editP1000, setEditP1000] = useState('');

  // Add Rider Form State
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderPin, setNewRiderPin] = useState('');

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, ridRes] = await Promise.all([
        api.getProducts().catch(() => ({ products: [] })),
        api.getOrders().catch(() => ({ orders: [] })),
        api.getRiders().catch(() => ({ riders: [] }))
      ]);

      if (Array.isArray(prodRes.products)) setProducts(prodRes.products);
      if (Array.isArray(ordRes.orders)) setOrders(ordRes.orders);
      if (Array.isArray(ridRes.riders)) setRiders(ridRes.riders);
    } catch (err) {
      console.warn('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectProductToEdit = (prod) => {
    const key = prod.key || prod.id;
    setEditKey(key);
    setEditTitle(prod.title || productLabels[key] || key);
    setEditCategory(prod.category || 'Vegetables');
    setEditDescription(prod.description || '');
    setEditImage(prod.image || productImages[key] || '');
    setEditAvailable(prod.available !== false);

    if (prod.prices) {
      setEditP250(prod.prices['250g'] || '');
      setEditP500(prod.prices['500g'] || '');
      setEditP1000(prod.prices['1kg'] || '');
    } else {
      setEditP250(Math.round((Number(prod.price) || 100) * 0.3));
      setEditP500(Math.round((Number(prod.price) || 100) * 0.55));
      setEditP1000(prod.price || 100);
    }
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editKey.trim() || !editTitle.trim()) {
      alert('Product key and title are required.');
      return;
    }

    const payload = {
      key: editKey.trim().toLowerCase().replace(/[^a-z0-9]/g, ''),
      title: editTitle.trim(),
      category: editCategory,
      description: editDescription.trim(),
      image: editImage.trim() || productImages[editKey] || '/images/vegback.png',
      available: editAvailable,
      prices: {
        '250g': Number(editP250) || 0,
        '500g': Number(editP500) || 0,
        '1kg': Number(editP1000) || 0
      }
    };

    try {
      await api.updateProduct(payload.key, payload);
      showNotification(`✅ Product "${payload.title}" saved & synced to cloud database!`);
      loadAllData();
      refreshProducts();
      const data = await api.updateProduct(payload.key, payload);
      if (data && data.success !== false) {
        showNotification(`✅ Product "${payload.title}" saved & synced to cloud database!`);
        loadAllData();
        refreshProducts();
      } else {
        alert('Update failed: ' + (data?.message || 'Unauthorized'));
      }
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  const handleToggleStoreStatus = async () => {
    const newStatus = !isStoreOpen;
    try {
      await api.setStoreStatus(newStatus);
      await refreshStoreStatus();
      showNotification(`Store status updated: ${newStatus ? 'OPEN' : 'CLOSED'}`);
      const data = await api.setStoreStatus(newStatus);
      if (data && data.success !== false) {
        await refreshStoreStatus();
        showNotification(`Store status updated: ${newStatus ? 'OPEN' : 'CLOSED'}`);
      } else {
        alert('Store status update failed: ' + (data?.message || 'Unauthorized'));
      }
    } catch (err) {
      alert('Store status update failed: ' + err.message);
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      showNotification(`Order #${orderId} marked as ${newStatus}`);
      loadAllData();
    } catch (err) {
      alert('Order update failed: ' + err.message);
    }
  };

  const handleAssignRider = async (orderId, riderId) => {
    const selectedRider = riders.find((r) => r.id === riderId || r._id === riderId);
    try {
      await api.updateOrderStatus(orderId, {
        deliveryBoyId: riderId,
        deliveryBoyName: selectedRider ? selectedRider.name : '',
        deliveryBoyPhone: selectedRider ? selectedRider.phone : '',
        status: 'Out for delivery'
      });
      showNotification(`Order assigned to ${selectedRider ? selectedRider.name : 'Rider'}!`);
      loadAllData();
    } catch (err) {
      alert('Rider assignment failed: ' + err.message);
    }
  };

  const handleCreateRider = async (e) => {
    e.preventDefault();
    if (!newRiderName.trim() || !newRiderPhone.trim() || !newRiderPin.trim()) {
      alert('Name, phone and PIN are required.');
      return;
    }

    try {
      await api.createRider({
        name: newRiderName.trim(),
        phone: newRiderPhone.trim(),
        pin: newRiderPin.trim()
      });
      showNotification(`Rider "${newRiderName}" created successfully!`);
      setNewRiderName('');
      setNewRiderPhone('');
      setNewRiderPin('');
      loadAllData();
    } catch (err) {
      alert('Failed to create rider: ' + err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f4', padding: '20px' }}>
      {/* Top Bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '16px 24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
          <h2 style={{ margin: 0, color: '#1e7a4b' }}>Vegetable Mart Admin Portal</h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={handleToggleStoreStatus}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: isStoreOpen ? '#e8f5e9' : '#ffebee',
              color: isStoreOpen ? '#2e7d32' : '#c62828'
            }}
          >
            Store: {isStoreOpen ? '🟢 OPEN' : '🔴 CLOSED'}
          </button>
          <Link to="/" style={{ textDecoration: 'none', color: '#1e7a4b', fontWeight: 'bold' }}>
            View Store ➔
          </Link>
        </div>
      </div>

      {notice && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 20px', padding: '12px 20px', background: '#e8f5e9', border: '1px solid #a5d6a7', borderRadius: '10px', color: '#2e7d32', fontWeight: 'bold' }}>
          {notice}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 20px', display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: activeTab === 'products' ? '#1e7a4b' : '#fff',
            color: activeTab === 'products' ? '#fff' : '#333'
          }}
        >
          🥦 Products & Prices ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: activeTab === 'orders' ? '#1e7a4b' : '#fff',
            color: activeTab === 'orders' ? '#fff' : '#333'
          }}
        >
          📦 Orders & Delivery ({orders.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riders')}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: activeTab === 'riders' ? '#1e7a4b' : '#fff',
            color: activeTab === 'riders' ? '#fff' : '#333'
          }}
        >
          🛵 Delivery Boys ({riders.length})
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* TAB 1: PRODUCTS & PRICING */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Form */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>
                {editKey ? `Edit "${editTitle}"` : 'Add / Select Vegetable'}
              </h3>

              <form onSubmit={handleSaveProduct}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Product Key</label>
                  <input
                    type="text"
                    required
                    value={editKey}
                    onChange={(e) => setEditKey(e.target.value)}
                    placeholder="e.g. bittergourd"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Title (with Hindi)</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Bitter Gourd (करेला)"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Price 250g (₹)</label>
                    <input
                      type="number"
                      value={editP250}
                      onChange={(e) => setEditP250(e.target.value)}
                      placeholder="250g"
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Price 500g (₹)</label>
                    <input
                      type="number"
                      value={editP500}
                      onChange={(e) => setEditP500(e.target.value)}
                      placeholder="500g"
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px' }}>Price 1kg (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editP1000}
                      onChange={(e) => setEditP1000(e.target.value)}
                      placeholder="1kg"
                      style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Availability</label>
                  <select
                    value={editAvailable ? 'available' : 'not-available'}
                    onChange={(e) => setEditAvailable(e.target.value === 'available')}
                    style={{ width: '100%', padding: '9px', border: '1px solid #ddd', borderRadius: '8px' }}
                  >
                    <option value="available">🟢 Available for purchase</option>
                    <option value="not-available">🔴 Out of stock / Not available</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1e7a4b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Save & Update Storefront ➔
                </button>
              </form>
            </div>

            {/* List */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxHeight: '700px', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>Product Catalog ({products.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {products.map((p) => {
                  const key = p.key || p.id;
                  const price1kg = p.prices?.['1kg'] || p.price || 0;

                  return (
                    <div
                      key={key}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #eee',
                        background: '#fafafa'
                      }}
                    >
                      <div>
                        <strong>{p.title || productLabels[key] || key}</strong>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          ₹{price1kg} / 1kg · {p.available !== false ? '🟢 Available' : '🔴 Out'}
                        </div>
                      </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleSelectProductToEdit(p)}
                        style={{
                          padding: '6px 14px',
                          background: '#e8f5e9',
                          color: '#1e7a4b',
                          border: '1px solid #c8e6c9',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete ${p.title || key}?`)) {
                            try {
                              await api.deleteProduct(key);
                              showNotification(`Deleted product: ${p.title || key}`);
                              loadAllData();
                              refreshProducts();
                            } catch (err) {
                              alert('Error deleting product: ' + err.message);
                            }
                          }
                        }}
                        style={{
                          padding: '6px 14px',
                          background: '#ffebee',
                          color: '#c62828',
                          border: '1px solid #ffcdd2',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

        {/* TAB 2: ORDERS & DELIVERY BOY ASSIGNMENT */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>Live Orders Management ({orders.length})</h3>

            {orders.length === 0 ? (
              <p>Koi orders nahi mile.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((ord) => {
                  const id = ord.id || ord._id;

                  return (
                    <div
                      key={id}
                      style={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        background: '#fafafa'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <strong>Order #{id}</strong> — Customer: <strong>{ord.customer}</strong> ({ord.phone})
                          <div style={{ fontSize: '13px', color: '#666' }}>📍 {ord.address}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#1e7a4b', fontSize: '1.1rem' }}>
                          ₹{ord.total}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '10px', flexWrap: 'wrap', gap: '12px' }}>
                        {/* Status Select */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Status:</span>
                          <select
                            value={ord.status || 'Received'}
                            onChange={(e) => handleOrderStatusChange(id, e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
                          >
                            <option value="Received">Received</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for delivery">Out for delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Delivery Boy Assignment */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>🛵 Delivery Boy:</span>
                          <select
                            value={ord.deliveryBoyId || ''}
                            onChange={(e) => handleAssignRider(id, e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #1e7a4b', background: '#f5fbf3', fontWeight: '600' }}
                          >
                            <option value="">-- Assign Delivery Boy --</option>
                            {riders.map((r) => (
                              <option key={r.id || r._id} value={r.id || r._id}>
                                {r.name} ({r.onDuty ? '🟢 On Duty' : '⚪ Off Duty'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DELIVERY BOYS / RIDERS */}
        {activeTab === 'riders' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Create Rider */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>Add Delivery Boy (Captain)</h3>
              <form onSubmit={handleCreateRider}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Captain Name *</label>
                  <input
                    type="text"
                    required
                    value={newRiderName}
                    onChange={(e) => setNewRiderName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={newRiderPhone}
                    onChange={(e) => setNewRiderPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Login PIN *</label>
                  <input
                    type="password"
                    required
                    value={newRiderPin}
                    onChange={(e) => setNewRiderPin(e.target.value)}
                    placeholder="4-digit PIN (e.g. 1234)"
                    style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1e7a4b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Create Delivery Boy ➔
                </button>
              </form>
            </div>

            {/* Rider List */}
            <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px', color: '#1e7a4b' }}>Active Delivery Captains ({riders.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {riders.map((r) => (
                  <div
                    key={r.id || r._id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <strong>{r.name}</strong>
                      <div style={{ fontSize: '13px', color: '#666' }}>📱 {r.phone}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: r.onDuty ? '#e8f5e9' : '#f5f5f5',
                          color: r.onDuty ? '#2e7d32' : '#757575'
                        }}
                      >
                        {r.onDuty ? '🟢 On Duty' : '⚪ Off Duty'}
                      </span>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to remove delivery boy ${r.name}?`)) {
                            try {
                              await api.deleteRider(r.id || r._id);
                              showNotification(`Removed delivery boy: ${r.name}`);
                              loadAllData();
                            } catch (err) {
                              alert('Error removing rider: ' + err.message);
                            }
                          }
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#ffebee',
                          color: '#c62828',
                          border: '1px solid #ffcdd2',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

