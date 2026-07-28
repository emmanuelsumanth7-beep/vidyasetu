import { auth } from './firebase';
import { clearUserSession } from './session';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bot-api.smha.co.in/api';
export const api = {
  async get(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'GET' });
  },
  
  async post(endpoint: string, body: unknown) {
    return fetchWithAuth(endpoint, { 
      method: 'POST',
      body: JSON.stringify(body)
    });
  },
  
  async postFormData(endpoint: string, formData: FormData) {
    return fetchWithAuth(endpoint, {
      method: 'POST',
      body: formData
    }, true);
  },
  
  async delete(endpoint: string) {
    return fetchWithAuth(endpoint, { method: 'DELETE' });
  },

  async put(endpoint: string, body: unknown) {
    return fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },
  
  // Expose unauthenticated methods if needed (like login)
  async postUnauth(endpoint: string, body: unknown) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await parseResponse(res);
    if (!res.ok) throw new Error(data.error || 'API Request failed');
    return data;
  }
};

let memoryTokenCache: string | null = null;
let memoryTokenExpiry: number = 0;

async function fetchWithAuth(endpoint: string, options: RequestInit = {}, isFormData: boolean = false) {
  // Try to get the latest Firebase ID Token
  let token: string | null = null;
  // 1. Check for Developer Bypass Token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('DEV_BYPASS_TOKEN');
  }
  
  // 2. Fallback to real Firebase Auth Token
  if (!token) {
    await auth.authStateReady(); // Wait for Firebase to hydrate from IndexedDB
    if (auth.currentUser) {
      if (memoryTokenCache && Date.now() < memoryTokenExpiry) {
      token = memoryTokenCache;
    } else {
      token = await auth.currentUser.getIdToken();
      memoryTokenCache = token;
      memoryTokenExpiry = Date.now() + 50 * 60 * 1000; // Cache for 50 minutes (Firebase tokens last 60m)
    }
    }
  }
  
  // 3. Attach MFA Token if available
  let mfaToken: string | null = null;
  if (typeof window !== 'undefined') {
    mfaToken = localStorage.getItem('mfa_token');
  }
  
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(mfaToken ? { 'x-mfa-token': mfaToken } : {}),
    ...headersToRecord(options.headers),
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

  const data = await parseResponse(response);
  
  if (!response.ok) {
    if (response.status === 403 && data.mfaRequired) {
      if (typeof window !== 'undefined') {
        window.location.href = '/mfa-setup';
      }
    } else if (response.status === 401) {
      await auth.signOut();
      clearUserSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    throw new Error(data.error || 'API Request failed');
  }

  return data;
}

function headersToRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  if (headers instanceof Headers) return Object.fromEntries(headers.entries());
  if (Array.isArray(headers)) return Object.fromEntries(headers);
  return headers;
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}
