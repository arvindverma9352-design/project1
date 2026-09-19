import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password
      });

      if (data && data.user) {
        loginUser(data.user, true);
        navigate('/');
      } else {
        throw new Error(data?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Kripya details check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast />
      <Navbar />

      <div style={{ maxWidth: '440px', margin: '50px auto', padding: '36px 28px', background: '#fff', borderRadius: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e7a4b', textAlign: 'center' }}>Create Account</h2>
        <p style={{ margin: '0 0 24px', color: '#666', textAlign: 'center', fontSize: '14px' }}>
          Join Vegetable Mart for fresh daily greens
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Sharma"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Mobile Number *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
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
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up ➔'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Pehle se account hai?{' '}
          <Link to="/login" style={{ color: '#1e7a4b', fontWeight: 'bold' }}>
            Login here
          </Link>
        </p>
      </div>
    </>
  );
}
