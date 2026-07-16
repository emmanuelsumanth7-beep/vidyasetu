'use client';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: unknown;
  }
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Smartphone, Key, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { api } from '@/lib/api';
import { clearUserSession, saveUserSession } from '@/lib/session';

export default function ArchitecturalLogin() {
  const router = useRouter();
  
  const { lang, setLang, t: tFunc } = useLanguage();
  const t = {
    appName: tFunc('appName'),
    subtitle: tFunc('subtitle'),
    guardian: tFunc('guardian'),
    faculty: tFunc('faculty'),
    phoneLabel: tFunc('phoneLabel'),
    facultyPhone: tFunc('facultyPhone'),
    phonePlaceholder: tFunc('phonePlaceholder'),
    reqKey: tFunc('reqKey'),
    transmitting: tFunc('transmitting'),
    keyLabel: tFunc('keyLabel'),
    keyPlaceholder: tFunc('keyPlaceholder'),
    verifying: tFunc('verifying'),
    confirmKey: tFunc('confirmKey'),
    reenter: tFunc('reenter'),
    devBypass: tFunc('devBypass'),
    principal: tFunc('principal'),
    teacher: tFunc('teacher'),
    parent: tFunc('parent'),
    clerk: tFunc('clerk'),
    idCheck: tFunc('idCheck'),
    sysAuth: tFunc('sysAuth')
  };

  const [role, setRole] = useState<'parent' | 'teacher' | 'principal'>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch {}
      window.recaptchaVerifier = undefined;
    }
  };

  const getFormattedPhoneNumber = () => {
    const trimmed = phoneNumber.trim();
    const digits = trimmed.replace(/\D/g, '');

    if (trimmed.startsWith('+') && digits.length >= 10 && digits.length <= 15) {
      return `+${digits}`;
    }

    if (digits.length === 10) {
      return `+91${digits}`;
    }

    if (digits.length === 12 && digits.startsWith('91')) {
      return `+${digits}`;
    }

    throw new Error('Please enter a valid mobile number with country code.');
  };

  const resetOtpState = () => {
    setOtpSent(false);
    setOtpCode('');
    setConfirmationResult(null);
    setSentTo('');
    clearRecaptcha();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const formattedPhone = getFormattedPhoneNumber();
      clearRecaptcha();

      auth.languageCode = lang;
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible'
      });
      await window.recaptchaVerifier.render();
      
      const confResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confResult);
      setSentTo(formattedPhone);
      setOtpSent(true);
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err, 'Failed to send OTP. Please try again.'));
      clearRecaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error("Please request a code first.");
      
      // 1. Verify code with Firebase
      await confirmationResult.confirm(otpCode);
      
      // 2. Sync with Backend to get Role/User Data
      const res = await api.post('/auth/sync', { role });
      
      // 3. Store user and navigate
      saveUserSession(res.user);
      localStorage.removeItem('DEV_BYPASS_TOKEN'); // Ensure dev bypass is clear
      
      // Soft navigation preserves the Firebase Auth state in memory
      router.push('/dashboard');
    } catch (err: unknown) {
      console.error(err);
      setError(getErrorMessage(err, 'Invalid OTP code.'));
      setIsLoading(false);
    }
  };

  const handleDevBypass = async () => {
    clearUserSession();
    // 1. Set the bypass token matching the selected role
    const bypassToken = `DEV_BYPASS_${role.toUpperCase()}`;
    localStorage.setItem('DEV_BYPASS_TOKEN', bypassToken);
    
    // 2. Mock a user object so the dashboard doesn't crash before the first API load
    saveUserSession({
        id: 'dev-bypass-id',
        role,
        name: `Dev ${role.toUpperCase()}`,
        schoolId: 'dev-school'
    });

    // 3. Force route
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[100dvh] bg-[#07111f] flex flex-col md:flex-row relative overflow-hidden font-body">
      
      <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="loginAurora" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="42%" stopColor="#6366f1" />
            <stop offset="72%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path d="M0 0H1440V900H0z" fill="#07111f" />
        <path d="M0 116C148 184 236 185 373 134C520 79 630 72 766 140C912 213 1028 234 1164 174C1280 123 1367 80 1440 94V0H0Z" fill="url(#loginAurora)" opacity="0.42" />
        <path d="M0 728C146 650 280 634 434 700C594 769 716 811 900 732C1053 666 1223 636 1440 703V900H0Z" fill="url(#loginAurora)" opacity="0.24" />
        <path d="M102 198H1304M102 366H1304M102 534H1304M102 702H1304M224 70V824M448 70V824M672 70V824M896 70V824M1120 70V824" stroke="white" strokeOpacity="0.055" strokeWidth="1" />
      </svg>

      {/* Brand Hero Canvas */}
      <div className="hidden md:flex flex-col flex-1 p-16 justify-center relative z-10 text-white">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 max-w-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl text-white">
                <Shield size={32} strokeWidth={2.5} />
              </div>
              <div className="h-0.5 w-16 bg-white/30" />
            </div>
            <button 
              onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all font-bold tracking-widest text-sm"
            >
              <Globe size={18} />
              {lang === 'en' ? 'KANNADA' : 'ENGLISH'}
            </button>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-bold font-display tracking-tighter leading-[0.9] text-white">
            {lang === 'en' ? 'Vidya' : 'ವಿದ್ಯಾ'}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
              {lang === 'en' ? 'Setu' : 'ಸೇತು'}
            </span>
          </h1>
          
          <div className="mt-8 border-l-4 border-cyan-300/60 pl-6">
            <p className="text-xl text-white/80 font-medium leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
            {['OTP Secure', 'Role Aware', 'DPDP Ready'].map((item) => (
              <div key={item} className="border border-white/15 bg-white/[0.08] backdrop-blur-xl px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-white/75">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Overlapping Login Glass Sheet */}
      <div className="flex-1 md:flex-none md:w-[500px] xl:w-[600px] flex items-center justify-center p-4 relative z-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="w-full max-w-[430px] mx-auto p-5 sm:p-10 bg-white/[0.12] backdrop-blur-2xl border border-white/20 rounded-[24px] flex flex-col gap-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] text-white max-h-[calc(100dvh-2rem)] overflow-y-auto"
        >
          
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="flex md:hidden flex-row items-center justify-between mb-2 border-b border-white/20 pb-4">
            <div className="flex flex-row items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-xl text-white shrink-0">
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold font-display text-white tracking-tighter">{t.appName}</h2>
            </div>
            <button 
              onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-all font-bold text-xs flex items-center justify-center"
            >
              <Globe size={16} className={lang === 'en' ? 'mr-1' : ''} />
              {lang === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>
          </div>

          <div className="flex justify-between items-end border-b border-white/20 pb-4">
            <h3 className="font-bold text-xl font-display uppercase tracking-wide text-white/90">{t.idCheck}</h3>
            <button 
                type="button"
                onClick={handleDevBypass}
                className="text-xs font-mono text-white/50 hover:text-white transition-colors cursor-pointer"
                title="Developer Bypass Login"
            >
                {t.sysAuth}
            </button>
          </div>

          {/* Liquid Role Toggle */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => { setRole('parent'); resetOtpState(); setError(''); }}
              className={`flex-1 min-w-[100px] px-2 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${role === 'parent' ? 'bg-white/20 shadow-lg text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {t.guardian}
            </button>
            <button
              onClick={() => { setRole('teacher'); resetOtpState(); setError(''); }}
              className={`flex-1 min-w-[100px] px-2 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${role === 'teacher' ? 'bg-white/20 shadow-lg text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {t.faculty}
            </button>
            <button
              onClick={() => { setRole('principal'); resetOtpState(); setError(''); }}
              className={`flex-1 min-w-[100px] px-2 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${role === 'principal' ? 'bg-white/20 shadow-lg text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {t.principal}
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role + (otpSent ? 'otp' : 'phone')}
              initial={{ opacity: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              
              {role === 'parent' ? (
                /* Parent Flow */
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">{t.phoneLabel}</label>
                      <div className="relative flex items-center">
                        <Smartphone className="absolute left-4 text-white/50" size={20} />
                        <input
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          autoComplete="tel"
                          inputMode="tel"
                          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all backdrop-blur-md"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 mt-2 bg-white text-indigo-900 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" disabled={isLoading}>
                      {isLoading ? t.transmitting : t.reqKey}
                      {!isLoading && <ArrowRight size={20} />}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">{t.keyLabel} {sentTo || phoneNumber})</label>
                      <div className="relative flex items-center">
                        <Key className="absolute left-4 text-white/50" size={20} />
                        <input
                          type="text"
                          placeholder={t.keyPlaceholder}
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          maxLength={6}
                          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-mono tracking-[0.2em] text-xl placeholder:text-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all backdrop-blur-md"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 mt-2 bg-white text-indigo-900 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" disabled={isLoading}>
                      {isLoading ? t.verifying : t.confirmKey}
                      {!isLoading && <ArrowRight size={20} />}
                    </button>
                    <button 
                      type="button" 
                      className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors text-center mt-2"
                      onClick={resetOtpState}
                      disabled={isLoading}
                    >
                      {t.reenter}
                    </button>
                  </form>
                )
              ) : (
                /* Staff Flow */
                !otpSent ? (
                  <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">{t.facultyPhone}</label>
                      <div className="relative flex items-center">
                        <Smartphone className="absolute left-4 text-white/50" size={20} />
                        <input
                          type="tel"
                          placeholder={t.phonePlaceholder}
                          autoComplete="tel"
                          inputMode="tel"
                          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all backdrop-blur-md"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 mt-2 bg-white text-indigo-900 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" disabled={isLoading}>
                      {isLoading ? t.transmitting : t.reqKey}
                      {!isLoading && <ArrowRight size={20} />}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">{t.keyLabel} {sentTo || phoneNumber})</label>
                      <div className="relative flex items-center">
                        <Key className="absolute left-4 text-white/50" size={20} />
                        <input
                          type="text"
                          placeholder={t.keyPlaceholder}
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          maxLength={6}
                          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-mono tracking-[0.2em] text-xl placeholder:text-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all backdrop-blur-md"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-4 mt-2 bg-white text-indigo-900 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" disabled={isLoading}>
                      {isLoading ? t.verifying : t.confirmKey}
                      {!isLoading && <ArrowRight size={20} />}
                    </button>
                    <button 
                      type="button" 
                      className="text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors text-center mt-2"
                      onClick={resetOtpState}
                      disabled={isLoading}
                    >
                      {t.reenter}
                    </button>
                  </form>
                )
              )}

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-100 font-mono text-sm font-bold tracking-wide backdrop-blur-md"
                >
                  ERROR: {error}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          <div id="recaptcha-container"></div>
          
        </motion.div>
      </div>

    </div>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
