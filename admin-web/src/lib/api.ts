import { auth } from './firebase';

const BASE_URL = 'https://bot-api.smha.co.in/api';
const AI_URL = 'https://bot-ai.smha.co.in/api/ai';

export const api = {
  async get(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'GET' });
  },
  
  async post(endpoint: string, body: any) {
    return fetchWithAuth(endpoint, { 
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  
  async delete(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'DELETE' });
  },

  async put(endpoint: string, body: any) {
    return fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },
  
  // Expose unauthenticated methods if needed (like login)
  async postUnauth(endpoint: string, body: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Request failed');
    return data;
  }
};

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Try to get the latest Firebase ID Token
  let token = null;
  // 1. Check for Developer Bypass Token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('DEV_BYPASS_TOKEN');
  }
  
  // 2. Fallback to real Firebase Auth Token
  if (!token && auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  }
  
  // 3. Attach MFA Token if available
  let mfaToken = null;
  if (typeof window !== 'undefined') {
    mfaToken = localStorage.getItem('mfa_token');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(mfaToken ? { 'x-mfa-token': mfaToken } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 403 && data.mfaRequired) {
      if (typeof window !== 'undefined') {
        window.location.href = '/mfa-setup';
      }
    } else if (response.status === 401 || response.status === 403) {
      auth.signOut();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}
