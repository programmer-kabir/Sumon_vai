import React, { useState } from 'react';
import { X, Copy, CheckCircle, ShieldAlert, CreditCard } from 'lucide-react';
import { api } from '../services/api';

const CHANNELS = [
  { id: 'BKASH', name: 'বিকাশ (bKash)', agent: '01712-345678', min: 200, bonus: 'ওয়েলকাম বোনাস' },
  { id: 'NAGAD', name: 'নগদ (Nagad)', agent: '01899-876543', min: 200, bonus: 'ক্যাশব্যাক অফার' },
  { id: 'ROCKET', name: 'রকেট (Rocket)', agent: '01911-223344', min: 200, bonus: 'দ্রুত প্রসেসিং' },
  { id: 'USDT_TRC20', name: 'USDT (TRC20)', agent: 'TYDzsxdczSu4mE9GfF1k4eBq8yL3K9wP3e', min: 1000, bonus: '+১.৫% এক্সট্রা বোনাস' },
];

export const DepositModal = ({ onClose, onSuccess }) => {
  const [selectedChannel, setSelectedChannel] = useState(CHANNELS[0]);
  const [amount, setAmount] = useState('500');
  const [trxId, setTrxId] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedChannel.agent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trxId || !amount) {
      alert('অনুগ্রহ করে পরিমাণ ও TrxID প্রদান করুন');
      return;
    }

    setLoading(true);
    setMsg('');
    try {
      const res = await api.deposit({
        channel: selectedChannel.id,
        amount: Number(amount),
        trxId: trxId.trim(),
        senderMobile: senderMobile.trim(),
      });
      alert(res.message || 'ডিপোজিট সফলভাবে জমা হয়েছে!');
      onSuccess();
      onClose();
    } catch (err) {
      setMsg(err.message);
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
            <CreditCard size={18} color="#fbbf24" />
            <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>টাকা ডিপোজিট করুন</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 20px' }}>
          {/* Channel Selector */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            পেমেন্ট মেথড নির্বাচন করুন:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 14 }}>
            {CHANNELS.map((ch) => {
              const isSelected = selectedChannel.id === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch)}
                  style={{
                    background: isSelected ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: isSelected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#fbbf24' : '#fff' }}>
                    {ch.name}
                  </span>
                  <span style={{ fontSize: 10, color: '#10b981', marginTop: 2 }}>{ch.bonus}</span>
                </div>
              );
            })}
          </div>

          {/* Agent Number Copy Box */}
          <div style={{
            background: 'rgba(2, 26, 23, 0.8)',
            border: '1px dashed rgba(251, 191, 36, 0.4)',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>
              টাকা পাঠানোর অফিসিয়াল {selectedChannel.id === 'USDT_TRC20' ? 'ওয়ালেট অ্যাড্রেস' : 'ক্যাশ-আউট নম্বর'}:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <span style={{
                fontSize: 14,
                fontWeight: 800,
                color: '#fbbf24',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {selectedChannel.agent}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  border: '1px solid #fbbf24',
                  color: '#fbbf24',
                  borderRadius: 6,
                  padding: '4px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                {copied ? <CheckCircle size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>
          </div>

          {/* Amount Pills */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            ডিপোজিট পরিমাণ (টাকা):
          </label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {['200', '500', '1000', '2000', '5000'].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(amt)}
                style={{
                  background: amount === amt ? 'var(--gold-gradient)' : 'rgba(255, 255, 255, 0.08)',
                  color: amount === amt ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                ৳{amt}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="পরিমাণ লিখুন"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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

          {/* TrxID Input */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            ট্রানজ্যাকশন আইডি (TrxID / Hash):
          </label>
          <input
            type="text"
            placeholder="যেমন: 8N7D9S734"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
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

          {/* Sender Phone */}
          <label style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6, display: 'block' }}>
            আপনার প্রেরক নম্বর (ঐচ্ছিক):
          </label>
          <input
            type="text"
            placeholder="যে নম্বর থেকে টাকা পাঠিয়েছেন"
            value={senderMobile}
            onChange={(e) => setSenderMobile(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(2, 26, 23, 0.8)',
              border: '1px solid rgba(255, 215, 0, 0.25)',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#fff',
              fontSize: 14,
              marginBottom: 16,
              outline: 'none',
            }}
          />

          {msg && (
            <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gold-btn"
            style={{ width: '100%', padding: '12px', fontSize: 15 }}
          >
            {loading ? 'প্রসেসিং হচ্ছে...' : 'ডিপোজিট সাবমিট করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};
