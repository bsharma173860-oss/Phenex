// ── PHENEXAI FRONTEND API CLIENT ──
// This connects all HTML pages to the real backend

const API = (() => {
  const BASE = window.location.origin + '/api';

  // ── GET TOKEN ──
  const getToken = () => localStorage.getItem('phenex_token');

  // ── BASE FETCH ──
  const req = async (method, path, body = null) => {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      }
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(BASE + path, opts);
    const data = await res.json();

    if (!res.ok) {
      // If 401 - redirect to login
      if (res.status === 401) {
        localStorage.removeItem('phenex_token');
        localStorage.removeItem('phenex_user');
        window.location.href = '/login.html';
        return;
      }
      throw new Error(data.error || 'Request failed');
    }
    return data;
  };

  return {
    // ── AUTH ──
    auth: {
      login:    (email, pass)  => req('POST', '/auth/login',    { email, password: pass }),
      register: (data)         => req('POST', '/auth/register', data),
      me:       ()             => req('GET',  '/auth/me'),
    },

    // ── CONTACTS ──
    contacts: {
      list:    (params = {}) => req('GET',    '/contacts?' + new URLSearchParams(params)),
      get:     (id)          => req('GET',    `/contacts/${id}`),
      create:  (data)        => req('POST',   '/contacts', data),
      update:  (id, data)    => req('PUT',    `/contacts/${id}`, data),
      delete:  (id)          => req('DELETE', `/contacts/${id}`),
      qualify: (id)          => req('POST',   `/contacts/${id}/qualify`),
    },

    // ── DEALS ──
    deals: {
      list:   (params = {}) => req('GET',    '/deals?' + new URLSearchParams(params)),
      create: (data)        => req('POST',   '/deals', data),
      update: (id, data)    => req('PUT',    `/deals/${id}`, data),
      delete: (id)          => req('DELETE', `/deals/${id}`),
    },

    // ── CALENDAR ──
    calendar: {
      list:   (month, year) => req('GET',    `/calendar?month=${month}&year=${year}`),
      create: (data)        => req('POST',   '/calendar', data),
      delete: (id)          => req('DELETE', `/calendar/${id}`),
    },

    // ── CONVERSATIONS ──
    conversations: {
      list:      (channel) => req('GET',  '/conversations' + (channel ? `?channel=${channel}` : '')),
      messages:  (id)      => req('GET',  `/conversations/${id}/messages`),
      sendSMS:   (data)    => req('POST', '/conversations/send/sms', data),
      sendWA:    (data)    => req('POST', '/conversations/send/whatsapp', data),
    },

    // ── PAYMENTS ──
    payments: {
      invoices: ()         => req('GET',  '/payments/invoices'),
      create:   (data)     => req('POST', '/payments/invoices', data),
      markPaid: (id)       => req('PUT',  `/payments/invoices/${id}/paid`),
      stats:    ()         => req('GET',  '/payments/stats'),
    },

    // ── AI AGENT ──
    ai: {
      chat:         (message, history, contactId) => req('POST', '/ai/chat',         { message, history, contactId }),
      writeEmail:   (data)                        => req('POST', '/ai/write-email',   data),
      buildAccount: (businessName, website)       => req('POST', '/ai/build-account', { businessName, website }),
      qualify:      (data)                        => req('POST', '/ai/qualify',        data),
      history:      ()                            => req('GET',  '/ai/history'),
    },

    // ── CAMPAIGNS ──
    campaigns: {
      list:   ()       => req('GET',  '/campaigns'),
      create: (data)   => req('POST', '/campaigns', data),
      update: (id, d)  => req('PUT',  `/campaigns/${id}`, d),
    },

    // ── WORKFLOWS ──
    workflows: {
      list:   ()       => req('GET',  '/workflows'),
      create: (data)   => req('POST', '/workflows', data),
      update: (id, d)  => req('PUT',  `/workflows/${id}`, d),
    },

    // ── ANALYTICS ──
    analytics: {
      overview: () => req('GET', '/analytics/overview'),
    },

    // ── ONBOARDING ──
    onboarding: {
      createAccount: (data) => req('POST', '/onboarding/create-account', data),
    },

    // ── AUTH HELPERS ──
    isLoggedIn: () => !!getToken(),
    getUser:    () => JSON.parse(localStorage.getItem('phenex_user') || '{}'),
    saveAuth:   (token, user) => {
      localStorage.setItem('phenex_token', token);
      localStorage.setItem('phenex_user', JSON.stringify(user));
    },
    logout: () => {
      localStorage.removeItem('phenex_token');
      localStorage.removeItem('phenex_user');
      window.location.href = '/login.html';
    }
  };
})();

// ── AUTO PROTECT PAGES ──
// If not logged in and not on login page, redirect
(function() {
  const publicPages = ['login.html', 'register.html', 'onboarding.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isPublic = publicPages.some(p => currentPage.includes(p));

  if (!API.isLoggedIn() && !isPublic) {
    // Allow for now during development - uncomment below for production
    // window.location.href = '/login.html';
  }

  // Inject user name into topbar if logged in
  if (API.isLoggedIn()) {
    const user = API.getUser();
    document.addEventListener('DOMContentLoaded', () => {
      const userNameEl = document.querySelector('.user-name');
      if (userNameEl && user.name) userNameEl.textContent = user.name;
    });
  }
})();
