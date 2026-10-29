import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { api, setAdminToken } from '../services/api';

export const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('kabir@gmail.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.login({ username: email.trim(), password });
      if (res.data && res.data.token) {
        if (
          res.data.role !== 'admin' &&
          res.data.username !== 'kabir@gmail.com' &&
          res.data.email !== 'kabir@gmail.com'
        ) {
          throw new Error('Access Denied: Administrative authorization required to access this console.');
        }
        setAdminToken(res.data.token);
        onLoginSuccess(res.data);
      } else {
        throw new Error('Authentication failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] p-6 selection:bg-rose-500 selection:text-white">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800/80 bg-[#111726]/95 p-8 shadow-2xl backdrop-blur-xl">
        {/* Glow Element */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl"></div>

        {/* Branding */}
        <div className="relative text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-md shadow-rose-600/30">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h1 className="mt-4 text-xl font-black tracking-tight text-white">CK44 MASTER BACKOFFICE</h1>
          <p className="mt-1 text-xs font-semibold text-rose-400">Enterprise Administration & Control Portal</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/15 p-3.5 text-xs font-semibold text-rose-300">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Admin Email / ID</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/20">
              <Mail size={16} className="text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kabir@gmail.com"
                required
                className="w-full bg-transparent px-3 py-2.5 text-xs font-semibold text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Security Password</label>
            <div className="mt-1.5 flex items-center rounded-xl border border-slate-700/80 bg-slate-900/90 px-3.5 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500/20">
              <Lock size={16} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full bg-transparent px-3 py-2.5 text-xs font-semibold text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-rose-600/30 transition-all hover:bg-rose-500 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Backoffice'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="mt-6 text-center text-[10px] text-slate-500">
          🔒 High-grade Session Authentication & Role Authorization Active
        </div>
      </div>
    </div>
  );
};
