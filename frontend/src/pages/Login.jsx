import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Normal API login (handles both customers and admin)
      const data = await api.login({ email, password });
      if (data && data.user) {
        if (data.token) data.user.token = data.token;
        loginUser(data.user, true);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        throw new Error(data?.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Kripya details check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast />
      <Navbar />

      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '36px 28px', background: '#fff', borderRadius: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e7a4b', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ margin: '0 0 24px', color: '#666', textAlign: 'center', fontSize: '14px' }}>
          Login to your Vegetable Mart account
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Email / Username</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or 'admin'"
              style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
            {loading ? 'Logging in...' : 'Login ➔'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          Naya account banana hai?{' '}
          <Link to="/signup" style={{ color: '#1e7a4b', fontWeight: 'bold' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </>
  );
}

