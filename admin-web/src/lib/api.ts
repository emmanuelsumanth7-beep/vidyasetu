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
  
  async postFormData(endpoint: string, formData: FormData) {
    return fetchWithAuth(endpoint, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' } // We will let fetch set the boundary, so actually we need to REMOVE Content-Type inside fetchWithAuth if it's FormData.
    }, true);
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

let memoryTokenCache: string | null = null;
let memoryTokenExpiry: number = 0;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}, isFormData: boolean = false) {
  // Try to get the latest Firebase ID Token
  let token = null;
  // 1. Check for Developer Bypass Token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('DEV_BYPASS_TOKEN');
  }
  
  // 2. Fallback to real Firebase Auth Token
  if (!token && auth.currentUser) {
    if (memoryTokenCache && Date.now() < memoryTokenExpiry) {
      token = memoryTokenCache;
    } else {
      token = await auth.currentUser.getIdToken();
      memoryTokenCache = token;
      memoryTokenExpiry = Date.now() + 50 * 60 * 1000; // Cache for 50 minutes (Firebase tokens last 60m)
    }
  }
  
  // 3. Attach MFA Token if available
  let mfaToken = null;
  if (typeof window !== 'undefined') {
    mfaToken = localStorage.getItem('mfa_token');
  }
  
  const headers: any = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(mfaToken ? { 'x-mfa-token': mfaToken } : {}),
    ...options.headers,
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  } else if (isFormData) {
    delete headers['Content-Type']; // Let browser set boundary automatically
  }

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
