const API_BASE = '/api';

export const getAuthToken = () => localStorage.getItem('ck44_token');
export const setAuthToken = (token) => localStorage.setItem('ck44_token', token);
export const removeAuthToken = () => localStorage.removeItem('ck44_token');

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
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
  register: (payload) => request('/wps/member/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/wps/session/login', { method: 'POST', body: JSON.stringify(payload) }),
  autoGuest: () => request('/wps/member/register/autoUsername', { method: 'POST' }),
  getMe: () => request('/wps/session/me'),

  // Games
  getGames: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/games?${query}`);
  },
  launchGame: (payload) => request('/games/launch', { method: 'POST', body: JSON.stringify(payload) }),

  // Payments
  deposit: (payload) => request('/wallet/deposit', { method: 'POST', body: JSON.stringify(payload) }),
  withdraw: (payload) => request('/wallet/withdraw', { method: 'POST', body: JSON.stringify(payload) }),
  getHistory: () => request('/wallet/history'),

  // Seamless Wallet Provider Simulator
  seamlessBalance: (payload) => request('/seamless/balance', { method: 'POST', body: JSON.stringify(payload) }),
  seamlessDebit: (payload) => request('/seamless/debit', { method: 'POST', body: JSON.stringify(payload) }),
  seamlessCredit: (payload) => request('/seamless/credit', { method: 'POST', body: JSON.stringify(payload) }),
  seamlessRollback: (payload) => request('/seamless/rollback', { method: 'POST', body: JSON.stringify(payload) }),

  // Admin Direct Control & Full Management
  getAdminStats: () => request('/admin/stats'),
  getGameAnalytics: () => request('/admin/games-analytics'),
  getGameTransactions: () => request('/admin/game-transactions'),
  getAdminDeposits: () => request('/admin/deposits'),
  getAdminWithdrawals: () => request('/admin/withdrawals'),
  getPaymentSettings: () => request('/admin/payment-settings'),
  updatePaymentSettings: (payload) => request('/admin/payment-settings', { method: 'PUT', body: JSON.stringify(payload) }),
  getPlatformLimits: () => request('/admin/limits'),
  updatePlatformLimits: (payload) => request('/admin/limits', { method: 'PUT', body: JSON.stringify(payload) }),
  getPlayersList: () => request('/admin/players'),
  adjustPlayerBalance: (id, payload) => request(`/admin/players/${id}/balance`, { method: 'PUT', body: JSON.stringify(payload) }),
  updatePlayerStatus: (id, payload) => request(`/admin/players/${id}/status`, { method: 'PUT', body: JSON.stringify(payload) }),
  updatePlayerRole: (id, payload) => request(`/admin/players/${id}/role`, { method: 'PUT', body: JSON.stringify(payload) }),
  approveDeposit: (id) => request(`/admin/deposits/${id}/approve`, { method: 'PUT' }),
  rejectDeposit: (id) => request(`/admin/deposits/${id}/reject`, { method: 'PUT' }),
  payWithdrawal: (id) => request(`/admin/withdrawals/${id}/pay`, { method: 'PUT' }),
  rejectWithdrawal: (id) => request(`/admin/withdrawals/${id}/reject`, { method: 'PUT' }),

  // Platform CMS, Banners, Notices & Live Winners
  getPublicConfig: () => request('/config/public'),
  updatePlatformConfig: (payload) => request('/config/update', { method: 'PUT', body: JSON.stringify(payload) }),
  getLiveWinners: () => request('/config/live-winners'),

  // Daily Lucky Wheel
  getLuckyWheelStatus: () => request('/lucky-wheel/status'),
  spinLuckyWheel: () => request('/lucky-wheel/spin', { method: 'POST' }),
};
