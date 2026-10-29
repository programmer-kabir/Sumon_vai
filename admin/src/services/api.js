const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? '/api' : 'https://ck44-backend.onrender.com/api');

export const getAdminToken = () => localStorage.getItem('ck44_admin_token');
export const setAdminToken = (token) => localStorage.setItem('ck44_admin_token', token);
export const setAuthToken = setAdminToken;
export const removeAdminToken = () => localStorage.removeItem('ck44_admin_token');

const request = async (endpoint, options = {}) => {
  const token = getAdminToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }
  return data;
};

export const api = {
  // Auth
  login: (payload) => request('/wps/session/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/wps/session/me'),

  // Financial & Operational Reports
  getReports: (period = 'today') => request(`/admin/reports?period=${period}`),

  // Admin Direct Control
  getAdminStats: () => request('/admin/stats'),
  getGameAnalytics: (period = 'all') => request(`/admin/games-analytics${period ? `?period=${period}` : ''}`),
  getGameTransactions: () => request('/admin/game-transactions'),
  getAdminDeposits: () => request('/admin/deposits'),
  getAdminWithdrawals: () => request('/admin/withdrawals'),
  getPaymentSettings: () => request('/admin/payment-settings'),
  updatePaymentSettings: (payload) => request('/admin/payment-settings', { method: 'PUT', body: JSON.stringify(payload) }),
  getPlatformLimits: () => request('/admin/limits'),
  updatePlatformLimits: (payload) => request('/admin/limits', { method: 'PUT', body: JSON.stringify(payload) }),
  
  // Players, Dossier & Limits
  getPlayersList: () => request('/admin/players'),
  getPlayerDossier: (id) => request(`/admin/players/${id}/dossier`),
  updatePlayerLimits: (id, payload) => request(`/admin/players/${id}/limits`, { method: 'PUT', body: JSON.stringify(payload) }),
  adjustPlayerBalance: (id, payload) => request(`/admin/players/${id}/balance`, { method: 'PUT', body: JSON.stringify(payload) }),
  updatePlayerStatus: (id, payload) => request(`/admin/players/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  updatePlayerRole: (id, payload) => request(`/admin/players/${id}/role`, { method: 'PUT', body: JSON.stringify(payload) }),
  
  // Cashflow Approvals
  approveDeposit: (id) => request(`/admin/deposits/${id}/approve`, { method: 'PUT' }),
  rejectDeposit: (id) => request(`/admin/deposits/${id}/reject`, { method: 'PUT' }),
  payWithdrawal: (id) => request(`/admin/withdrawals/${id}/pay`, { method: 'PUT' }),
  rejectWithdrawal: (id) => request(`/admin/withdrawals/${id}/reject`, { method: 'PUT' }),

  // Config & CMS
  getPublicConfig: () => request('/config/public'),
  updatePublicConfig: (payload) => request('/config/update', { method: 'PUT', body: JSON.stringify(payload) }),
};
