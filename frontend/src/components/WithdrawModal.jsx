import React, { useState } from 'react';
import { X, ArrowDownCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export const WithdrawModal = ({ wallet, onClose, onSuccess }) => {
  const [channel, setChannel] = useState('BKASH');
  const [amount, setAmount] = useState('500');
  const [payoutAccount, setPayoutAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const target = wallet ? wallet.wageringTarget || 0 : 0;
  const current = wallet ? wallet.wageringCurrent || 0 : 0;
  const progressPercent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 100;
  const canWithdraw = progressPercent >= 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !payoutAccount) {
      alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন');
      return;
    }

    if (Number(amount) > (wallet ? wallet.realBalance : 0)) {
      alert('অপর্যাপ্ত ব্যালেন্স');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.withdraw({
        channel,
        amount: Number(amount),
        payoutAccount: payoutAccount.trim(),
      });
      alert(res.message || 'উইথড্রল রিকোয়েস্ট জমা দেওয়া হয়েছে!');
      onSuccess();
      onClose();
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
        maxWidth: 480,
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(2, 26, 23, 0.95)',
          padding: '14px 18px',
          borderBottom: '1px solid rgba(255, 215, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowDownCircle size={18} color="#fbbf24" />
            <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>উইথড্রল (টাকা উত্তোলন)</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 20px' }}>
          {/* Turnover Guard Section */}
          <div style={{
            background: 'rgba(2, 26, 23, 0.85)',
            border: `1px solid ${canWithdraw ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            borderRadius: 10,
            padding: '12px 14px',
            marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                টার্নওভার অগ্রগতি (Turnover Rollover):
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: canWithdraw ? '#6ee7b7' : '#fbbf24' }}>
                {progressPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: 7,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 6,
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: canWithdraw
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                borderRadius: 4,
                transition: 'width 0.4s ease',
              }} />
            </div>

            <div style={{ fontSize: 11, color: '#94a3b8' }}>
              সম্পন্ন: ৳{current.toFixed(1)} / লক্ষ্যমাত্রা: ৳{target.toFixed(1)}
              {!canWithdraw && (
                <span style={{ color: '#ef4444', display: 'block', marginTop: 2 }}>
                  * মানি লন্ডারিং সুরক্ষার জন্য উইথড্র করতে অবশিষ্ট টার্নওভার পূরণ করুন।
                </span>
              )}
            </div>
          </div>

          {/* Current Balance */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>বর্তমান ব্যালেন্স:</span>
            <span style={{ fontWeight: 800, color: '#fbbf24' }}>
              ৳ {wallet ? Number(wallet.realBalance).toFixed(2) : '0.00'}
            </span>
          </div>

          {/* Channel Selector */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            উত্তোলনের মাধ্যম:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 14 }}>
            {[
              { id: 'BKASH', name: 'বিকাশ' },
              { id: 'NAGAD', name: 'নগদ' },
              { id: 'ROCKET', name: 'রকেট' },
              { id: 'USDT_TRC20', name: 'USDT' },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannel(ch.id)}
                style={{
                  background: channel === ch.id ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  color: channel === ch.id ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 4px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {ch.name}
              </button>
            ))}
          </div>

          {/* Payout Account */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            {channel === 'USDT_TRC20' ? 'TRON (TRC20) ওয়ালেট অ্যাড্রেস:' : 'টাকা পাওয়ার মোবাইল নম্বর:'}
          </label>
          <input
            type="text"
            placeholder={channel === 'USDT_TRC20' ? 'T...' : '017XXXXXXXX'}
            value={payoutAccount}
            onChange={(e) => setPayoutAccount(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(2, 26, 23, 0.8)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#fff',
              fontSize: 14,
              marginBottom: 12,
              outline: 'none',
            }}
          />

          {/* Amount */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            উইথড্রল পরিমাণ (নূন্যতম ৳ ৫০০):
          </label>
          <input
            type="number"
            min="500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(2, 26, 23, 0.8)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#fff',
              fontSize: 14,
              marginBottom: 8,
              outline: 'none',
            }}
          />

          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px dashed rgba(251, 191, 36, 0.3)',
            borderRadius: 6,
            padding: '6px 10px',
            marginBottom: 14,
            fontSize: 11,
            color: '#fbbf24',
          }}>
            🛡️ দৈনিক উইথড্রল সীমা: নূন্যতম ৳ ৫০০ — সর্বোচ্চ ৳ ৫,০০০ পর্যন্ত।
          </div>

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-btn"
            style={{ width: '100%', padding: '12px', fontSize: 15 }}
          >
            {loading ? 'যাচাই করা হচ্ছে...' : 'উইথড্রল রিকোয়েস্ট পাঠান'}
          </button>
        </form>
      </div>
    </div>
  );
};
