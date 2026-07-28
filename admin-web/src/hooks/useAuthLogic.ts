import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { saveUserSession } from '@/lib/session';

export type RoleId = 'parent' | 'teacher' | 'principal';

export const ROLES = [
  { id: 'parent' as RoleId,    label: 'Parent',    placeholder: '+91 98765 43210' },
  { id: 'teacher' as RoleId,   label: 'Teacher',   placeholder: '+91 98765 43210' },
  { id: 'principal' as RoleId, label: 'Principal', placeholder: '+91 98765 43210' },
];

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useAuthLogic(lang: string) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<'onboarding' | 'login' | 'success'>('onboarding');
  const [role, setRole] = useState<RoleId>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [shakeError, setShakeError] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem('jips_onboarding_seen') === 'true') {
      setScreen('login');
    }
  }, []);

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch {}
      window.recaptchaVerifier = undefined;
    }
  };

  const getFormattedPhone = () => {
    const d = phoneNumber.trim().replace(/\D/g, '');
    if (phoneNumber.startsWith('+') && d.length >= 10 && d.length <= 15) return `+${d}`;
    if (d.length === 10) return `+91${d}`;
    if (d.length === 12 && d.startsWith('91')) return `+${d}`;
    throw new Error('Enter a valid 10-digit mobile number.');
  };

  const resetOtp = () => {
    setOtpSent(false); setOtpDigits(['', '', '', '', '', '']);
    setConfirmationResult(null); setSentTo(''); clearRecaptcha();
  };

  const handleGetStarted = () => {
    localStorage.setItem('jips_onboarding_seen', 'true');
    setScreen('login');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      const phone = getFormattedPhone();
      clearRecaptcha();
      auth.languageCode = lang;
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      await window.recaptchaVerifier.render();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result); setSentTo(phone); setOtpSent(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send OTP.'));
      setShakeError(true); setTimeout(() => setShakeError(false), 400);
      clearRecaptcha();
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) return;
    setError(''); setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error('Request a code first.');
      const cred = await confirmationResult.confirm(code);
      const token = await cred.user.getIdToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://bot-api.smha.co.in/api'}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      saveUserSession(data.user);
      localStorage.removeItem('DEV_BYPASS_TOKEN');
      setScreen('success');
      setTimeout(() => router.push('/dashboard'), 2800);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid code.'));
      setShakeError(true); setTimeout(() => setShakeError(false), 400);
      setIsLoading(false);
    }
  };

  const handleOtpChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const u = [...otpDigits]; u[i] = d; setOtpDigits(u);
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const u = [...otpDigits]; p.split('').forEach((d, i) => { u[i] = d; }); setOtpDigits(u);
    otpRefs.current[Math.min(p.length, 5)]?.focus();
  };

  const roleIdx = ROLES.findIndex(r => r.id === role);

  return {
    mounted, screen, role, roleIdx, phoneNumber, setPhoneNumber,
    sentTo, otpSent, otpDigits, error, isLoading, shakeError,
    otpRefs, setRole, resetOtp, handleGetStarted, handleSendOtp,
    handleVerifyOtp, handleOtpChange, handleOtpKeyDown, handleOtpPaste,
    setError
  };
}
