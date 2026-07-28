'use client';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: unknown;
  }
}

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
  ArrowRight, Smartphone, TriangleAlert, CheckCircle2, Shield,
  BookOpen, Users, Sun, Moon, Globe, CalendarCheck, MessageCircle,
  BarChart3, ChevronRight, Lock, UserCog, KeyRound
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/LanguageContext';
import { SchoolConfig } from '@/config/school.config';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { saveUserSession } from '@/lib/session';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

type RoleId = 'parent' | 'staff' | 'principal';

const ROLES = [
  { id: 'parent' as RoleId,    label: 'Parent',          icon: Users,   placeholder: '+91 98765 43210' },
  { id: 'staff' as RoleId,     label: 'Faculty & Staff', icon: UserCog, placeholder: '+91 98765 43210' },
  { id: 'principal' as RoleId, label: 'Principal',       icon: Shield,  placeholder: '+91 98765 43210' },
];

const OB_SLIDES = [
  { title: 'Track Progress', desc: 'Real-time updates on academics and attendance.', icon: BarChart3, color: '#3B82F6' },
  { title: 'Stay Connected', desc: 'Seamless communication with school staff.', icon: MessageCircle, color: '#10B981' },
  { title: 'Never Miss Out', desc: 'Stay updated with school events and exams.', icon: CalendarCheck, color: '#F59E0B' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState<'onboarding' | 'login' | 'success'>('onboarding');
  const [role, setRole] = useState<RoleId>('parent');
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');
  const [password, setPassword] = useState('');
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

  const isDark = theme === 'dark';

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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const phone = getFormattedPhone();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://bot-api.smha.co.in/api'}/auth/login-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Password login failed');
      localStorage.setItem('AUTH_TOKEN', data.token);
      localStorage.removeItem('DEV_BYPASS_TOKEN');
      saveUserSession(data.user);
      setScreen('success');
      setTimeout(() => router.push('/dashboard'), 2800);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Check phone and password.'));
      setShakeError(true);
      setTimeout(() => setShakeError(false), 400);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  const roleIdx = ROLES.findIndex(r => r.id === role);

  return (
    <>
      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════════════════════════
           SCREEN 1: GET STARTED / ONBOARDING
           ══════════════════════════════════════════════════════════════ */}
        {screen === 'onboarding' && (
          <motion.div
            key="onboarding"
            className="screen theme-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ob-layout">
              {/* Ultra premium glowing logo */}
              <motion.div
                className="ob-logo-wrap"
                initial={{ opacity: 0, y: 40, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, type: 'spring', stiffness: 100, damping: 20 }}
              >
                {isDark && <div className="ob-logo-glow" />}
                <div className="ob-logo-glass">
                  <img src={SchoolConfig.logoPath} alt="" className="ob-logo-img" />
                  <div className="ob-logo-reflection" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="ob-title">{SchoolConfig.shortName}</h1>
                <p className="ob-school-name">{SchoolConfig.name}</p>
                <div className="ob-divider" />
              </motion.div>

              {/* Feature pills */}
              <div className="ob-pills">
                {OB_SLIDES.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.title}
                      className="ob-pill"
                      initial={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="ob-pill-icon-wrap" style={{ '--accent': s.color } as React.CSSProperties}>
                        <Icon size={18} className="ob-pill-icon" />
                      </div>
                      <div className="ob-pill-text">
                        <span className="ob-pill-title">{s.title}</span>
                        <span className="ob-pill-desc">{s.desc}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div
                className="ob-cta-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <button className="btn-ultra-gold" onClick={handleGetStarted}>
                  <span>Get Started</span>
                  <ChevronRight size={18} />
                  <div className="btn-sweep" />
                </button>
                <p className="ob-signin-link">
                  Already a member?{' '}
                  <button onClick={handleGetStarted} className="text-link-gold">Sign in</button>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════
           SCREEN 2: LOGIN
           ══════════════════════════════════════════════════════════════ */}
        {screen === 'login' && (
          <motion.div
            key="login"
            className="screen theme-layer"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Floating actions */}
            <div className="login-actions-top">
              <button onClick={() => setLang(lang === 'en' ? 'kn' : 'en')} className="glass-icon-btn">
                <Globe size={16} />
              </button>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="glass-icon-btn">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>

            <div className="login-scroll">
              {/* Hero Branding */}
              <motion.div
                className="login-brand-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, type: 'spring' }}
              >
                <div className="brand-logo-container">
                  {isDark && <div className="brand-logo-glow" />}
                  <img src={SchoolConfig.logoPath} alt="" className="brand-logo-img" />
                </div>
                <h2 className="brand-title">{SchoolConfig.name}</h2>
                <p className="brand-subtitle">Secure Access Portal</p>
              </motion.div>

              {/* Ultra Premium Glass Card */}
              <motion.div
                className="login-card-3d"
                initial={{ opacity: 0, y: 30, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: 'spring', stiffness: 100 }}
                style={{ perspective: 1000 }}
              >
                <div className="login-card-inner">
                  {/* Card border glow (only dark) */}
                  {isDark && <div className="card-border-glow" />}
                  
                  {/* Role selector */}
                  <div className="role-segment-control">
                    <motion.div
                      className="role-segment-active"
                      layout
                      style={{ width: `${100 / ROLES.length}%`, left: `${(roleIdx / ROLES.length) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                    {ROLES.map((r) => {
                      const Icon = r.icon;
                      const active = role === r.id;
                      return (
                        <button
                          key={r.id}
                          className={`role-btn ${active ? 'active' : ''}`}
                          onClick={() => {
                            setRole(r.id);
                            if (r.id === 'staff' || r.id === 'principal') setLoginMode('password');
                            resetOtp();
                            setError('');
                          }}
                        >
                          <Icon size={14} />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Auth Mode Toggle (for staff/clerks/teachers/principal) */}
                  {role !== 'parent' && (
                    <div className="flex justify-center mb-4">
                      <div className="inline-flex rounded-full bg-black/20 p-1 border border-white/10 backdrop-blur-md">
                        <button
                          type="button"
                          onClick={() => { setLoginMode('otp'); resetOtp(); setError(''); }}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${loginMode === 'otp' ? 'bg-[#D4AF37] text-black shadow-md scale-102' : 'text-gray-400 hover:text-white'}`}
                        >
                          Mobile OTP
                        </button>
                        <button
                          type="button"
                          onClick={() => { setLoginMode('password'); resetOtp(); setError(''); }}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${loginMode === 'password' ? 'bg-[#D4AF37] text-black shadow-md scale-102' : 'text-gray-400 hover:text-white'}`}
                        >
                          Password Login
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Forms */}
                  <AnimatePresence mode="wait">
                    {loginMode === 'password' && role !== 'parent' ? (
                      <motion.form
                        key="password"
                        onSubmit={handlePasswordLogin}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="form-group"
                      >
                        <label className="input-label">Mobile Number</label>
                        <motion.div
                          className="input-wrapper mb-4"
                          animate={shakeError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <Smartphone size={18} className="input-icon" />
                          <input
                            type="tel"
                            placeholder={ROLES[roleIdx].placeholder}
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            className="premium-input"
                            required
                            disabled={isLoading}
                          />
                          <div className="input-focus-ring" />
                        </motion.div>

                        <label className="input-label">Password</label>
                        <motion.div
                          className="input-wrapper mb-2"
                          animate={shakeError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <KeyRound size={18} className="input-icon" />
                          <input
                            type="password"
                            placeholder="Enter your confidential password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="premium-input"
                            required
                            disabled={isLoading}
                          />
                          <div className="input-focus-ring" />
                        </motion.div>

                        <button
                          type="submit"
                          disabled={isLoading || !password || phoneNumber.replace(/\D/g, '').length < 10}
                          className="btn-ultra-gold mt-4"
                        >
                          {isLoading ? <div className="spinner spinner-dark" /> : <>Sign In instantly <ArrowRight size={18} /></>}
                          <div className="btn-sweep" />
                        </button>
                      </motion.form>
                    ) : !otpSent ? (
                      <motion.form
                        key="phone"
                        onSubmit={handleSendOtp}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="form-group"
                      >
                        <label className="input-label">Mobile Number</label>
                        <motion.div
                          className="input-wrapper"
                          animate={shakeError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          <Smartphone size={18} className="input-icon" />
                          <input
                            type="tel"
                            inputMode="tel"
                            placeholder={ROLES[roleIdx].placeholder}
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                            className="premium-input"
                            required
                            disabled={isLoading}
                            autoComplete="tel"
                          />
                          <div className="input-focus-ring" />
                        </motion.div>

                        <button
                          type="submit"
                          disabled={isLoading || phoneNumber.replace(/\D/g, '').length < 10}
                          className="btn-ultra-primary mt-4"
                        >
                          {isLoading ? <div className="spinner" /> : <>Continue <ArrowRight size={18} /></>}
                          <div className="btn-sweep" />
                        </button>
                      </motion.form>
                    ) : (
                      <motion.form
                        key="otp"
                        onSubmit={handleVerifyOtp}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="form-group"
                      >
                        <div className="flex justify-between items-end mb-2">
                          <label className="input-label mb-0">Verification Code</label>
                          <button type="button" onClick={resetOtp} className="text-link-gold text-xs">Edit Number</button>
                        </div>

                        <motion.div
                          className="otp-grid"
                          animate={shakeError ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          {otpDigits.map((d, i) => (
                            <div key={i} className="otp-input-wrap">
                              <input
                                ref={el => { otpRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                onPaste={i === 0 ? handleOtpPaste : undefined}
                                className={`premium-otp-input ${d ? 'filled' : ''}`}
                                autoFocus={i === 0}
                                disabled={isLoading}
                              />
                              <div className="otp-focus-ring" />
                            </div>
                          ))}
                        </motion.div>

                        <p className="otp-sent-text">
                          <CheckCircle2 size={14} className="text-[#34C759]" />
                          Code sent to <span className="tracking-wider text-[var(--vs-text-primary)]">{sentTo}</span>
                        </p>

                        <button
                          type="submit"
                          disabled={isLoading || otpDigits.join('').length < 6}
                          className="btn-ultra-gold mt-4"
                        >
                          {isLoading ? <div className="spinner spinner-dark" /> : <>Verify & Access <ArrowRight size={18} /></>}
                          <div className="btn-sweep" />
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Error Notification */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="premium-error"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <TriangleAlert size={16} />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="login-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                <p><Lock size={12} className="mr-1 inline" /> Enterprise Grade Security &middot; DPDP Compliant</p>
                <p className="mt-1 opacity-50">&copy; {new Date().getFullYear()} Petersys Technology</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════════════
           SCREEN 3: SUCCESS (Cinematic Unveil)
           ══════════════════════════════════════════════════════════════ */}
        {screen === 'success' && (
          <motion.div
            key="success"
            className="screen theme-layer success-screen-layout"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="success-center"
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="success-logo-wrap">
                {/* Expanding sonar rings */}
                <motion.div
                  className="sonar-ring"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0 }}
                />
                <motion.div
                  className="sonar-ring"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
                />
                
                <div className="success-logo-glass">
                  <img src={SchoolConfig.logoPath} alt="" className="success-logo-img" />
                </div>

                <motion.div
                  className="success-check-badge"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 size={24} />
                </motion.div>
              </div>

              <motion.h2
                className="success-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Access Granted
              </motion.h2>
              <motion.p
                className="success-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Initializing your dashboard...
              </motion.p>

              <motion.div
                className="success-loader-track"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 240 }}
                transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
              >
                <motion.div
                  className="success-loader-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.5, duration: 1.2, ease: 'easeInOut' }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="recaptcha-container" />
    </>
  );
}

