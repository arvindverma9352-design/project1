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
  const [showPassword, setShowPassword] = useState(false);
  
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await api.sendOtp({
        name: name.trim(),
        email: email.trim(),
        mobile: phone.trim(),
        password
      });

      if (data && data.success !== false) {
        setSuccessMsg(data.message || 'OTP sent successfully!');
        setIsOtpMode(true);
      } else {
        throw new Error(data?.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.verifyOtpAndSignup(phone.trim(), otp.trim());

      if (data && data.user) {
        if (data.token) data.user.token = data.token;
        loginUser(data.user, true);
        navigate('/');
      } else {
        throw new Error(data?.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast />
      <Navbar />

      <div style={{ maxWidth: '440px', margin: '50px auto', padding: '36px 28px', background: '#fff', borderRadius: '18px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e7a4b', textAlign: 'center' }}>
          {isOtpMode ? 'Verify OTP' : 'Create Account'}
        </h2>
        <p style={{ margin: '0 0 24px', color: '#666', textAlign: 'center', fontSize: '14px' }}>
          {isOtpMode ? `Enter the 4-digit code sent to ${phone}` : 'Join Vegetable Mart for fresh daily greens'}
        </p>

        {error && (
          <div style={{ padding: '10px 14px', background: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        {successMsg && (
          <div style={{ padding: '10px 14px', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
            {successMsg}
          </div>
        )}

        {!isOtpMode ? (
          <form onSubmit={handleSendOtp}>
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  style={{ width: '100%', padding: '11px 40px 11px 14px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#666', padding: '0' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
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
              {loading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', textAlign: 'center' }}>Enter 4-Digit OTP *</label>
              <input
                type="text"
                required
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="XXXX"
                style={{ width: '100%', padding: '16px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
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
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Sign Up'}
            </button>
            
            <button
              type="button"
              onClick={() => setIsOtpMode(false)}
              style={{
                width: '100%',
                padding: '13px',
                background: 'transparent',
                color: '#1e7a4b',
                border: '1px solid #1e7a4b',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Back to Edit Details
            </button>
          </form>
        )}

        {!isOtpMode && (
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
            Pehle se account hai?{' '}
            <Link to="/login" style={{ color: '#1e7a4b', fontWeight: 'bold' }}>
              Login here
            </Link>
          </p>
        )}
      </div>
    </>
  );
}

