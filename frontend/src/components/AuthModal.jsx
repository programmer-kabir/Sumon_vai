import React, { useState } from 'react';
import { X, Lock, User, Phone, Zap, Gift } from 'lucide-react';
import { api, setAuthToken } from '../services/api';

export const AuthModal = ({ initialMode = 'login', onClose, onSuccess }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let res;
      if (mode === 'login') {
        res = await api.login({ username, password });
      } else {
        res = await api.register({ username, password, mobile, affiliateCode });
      }

      if (res.data?.token) {
        setAuthToken(res.data.token);
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Auto Guest Registration
  const handleAutoGuest = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.autoGuest();
      if (res.data?.token) {
        setAuthToken(res.data.token);
        alert(`গেস্ট অ্যাকাউন্ট তৈরি হয়েছে!\nইউজারনেম: ${res.data.username}\nপাসওয়ার্ড: ${res.data.autoPassword}`);
        onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
    }}>
      <div style={{
        background: '#042924',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 420,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Top Header */}
        <div style={{
          background: 'rgba(2, 26, 23, 0.95)',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: mode === 'login' ? '#fbbf24' : '#94a3b8',
                fontWeight: 800,
                fontSize: 16,
                cursor: 'pointer',
                borderBottom: mode === 'login' ? '2px solid #fbbf24' : 'none',
                paddingBottom: 4,
              }}
            >
              লগইন
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: mode === 'register' ? '#fbbf24' : '#94a3b8',
                fontWeight: 800,
                fontSize: 16,
                cursor: 'pointer',
                borderBottom: mode === 'register' ? '2px solid #fbbf24' : 'none',
                paddingBottom: 4,
              }}
            >
              রেজিস্ট্রেশন
            </button>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Username / Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
              ইউজারনেম অথবা ইমেইল:
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="text"
                placeholder="ইউজারনেম অথবা ইমেইল (যেমন: kabir@gmail.com)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(2, 26, 23, 0.8)',
                  border: '1px solid rgba(255, 215, 0, 0.25)',
                  borderRadius: 8,
                  padding: '10px 12px 10px 36px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
              পাসওয়ার্ড:
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="password"
                placeholder="পাসওয়ার্ড লিখুন (অ্যাডমিন: 123456)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'rgba(2, 26, 23, 0.8)',
                  border: '1px solid rgba(255, 215, 0, 0.25)',
                  borderRadius: 8,
                  padding: '10px 12px 10px 36px',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Register Extra Fields */}
          {mode === 'register' && (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  মোবাইল নম্বর (ঐচ্ছিক):
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input
                    type="text"
                    placeholder="01XXXXXXXXX"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(2, 26, 23, 0.8)',
                      border: '1px solid rgba(255, 215, 0, 0.25)',
                      borderRadius: 8,
                      padding: '10px 12px 10px 36px',
                      color: '#fff',
                      fontSize: 14,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-btn"
            style={{ width: '100%', padding: '11px', fontSize: 15, marginBottom: 10 }}
          >
            {loading ? 'প্রসেসিং...' : mode === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন'}
          </button>

          {/* 1-Click Quick Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {/* Quick 1-Click Guest Signup Option */}
            <button
              type="button"
              onClick={handleAutoGuest}
              disabled={loading}
              className="secondary-btn"
              style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
            >
              <Zap size={14} color="#fbbf24" />
              <span>⚡ ১-ক্লিকে তাৎক্ষণিক গেস্ট রেজিস্ট্রেশন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
