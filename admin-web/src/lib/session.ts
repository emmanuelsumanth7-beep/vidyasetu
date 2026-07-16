'use client';

export type ClientRole =
  | 'principal'
  | 'vice_principal'
  | 'teacher'
  | 'clerk'
  | 'accountant'
  | 'librarian'
  | 'nurse'
  | 'driver'
  | 'warden'
  | 'parent'
  | 'student'
  | 'alumnus'
  | 'super_admin'
  | 'staff'
  | 'admin';

export interface ClientUser {
  id: string;
  role: ClientRole;
  name: string;
  schoolId?: string;
  phoneNumber?: string;
  email?: string;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

export function normalizeRole(role?: string): ClientRole {
  const normalized = (role || 'parent').toLowerCase() as ClientRole;
  if (normalized === 'super_admin') return 'admin';
  if (normalized === 'vice_principal') return 'principal';
  if (['accountant', 'librarian', 'nurse', 'driver', 'warden'].includes(normalized)) return 'staff';
  return normalized;
}

export function normalizeUserSession(user: unknown): ClientUser {
  const data = asRecord(user);

  return {
    ...data,
    id: String(data.id || 'session-user'),
    role: normalizeRole(typeof data.role === 'string' ? data.role : undefined),
    name: typeof data.name === 'string' ? data.name : 'Vidya Setu User',
    schoolId: typeof data.schoolId === 'string' ? data.schoolId : undefined,
    phoneNumber: typeof data.phoneNumber === 'string' ? data.phoneNumber : undefined,
    email: typeof data.email === 'string' ? data.email : undefined,
  };
}

export function saveUserSession(user: unknown) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(normalizeUserSession(user)));
}

export function readUserSession(): ClientUser | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = normalizeUserSession(JSON.parse(userStr));
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('DEV_BYPASS_TOKEN');
  localStorage.removeItem('mfa_token');
}
