'use client';

declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: any;
  }
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Smartphone, Key, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { api } from '@/lib/api';

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

  const [role, setRole] = useState<'parent' | 'staff'>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    // Initialize invisible recaptcha for Firebase Auth
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (!window.recaptchaVerifier) throw new Error("Recaptcha not initialized");
      // Format phone number to E.164 if missing +91
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const confResult = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confResult);
      setOtpSent(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send OTP. Please try again.');
      setIsLoading(false);
      // Reset recaptcha if failed so they can try again
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId: any) => {
          window.grecaptcha.reset(widgetId);
        });
      }
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
      localStorage.setItem('user', JSON.stringify(res.user));
      localStorage.removeItem('DEV_BYPASS_TOKEN'); // Ensure dev bypass is clear
      
      // Force hard navigation to prevent chunk loading issues on first load
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid OTP code.');
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex flex-col md:flex-row relative overflow-hidden font-body">
      
      {/* Liquid Abstract Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000"></div>

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
          
          <div className="mt-8 border-l-4 border-white/30 pl-6">
            <p className="text-xl text-white/80 font-medium leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Overlapping Login Glass Sheet */}
      <div className="flex-1 md:flex-none md:w-[500px] xl:w-[600px] flex items-center justify-center p-3 relative z-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="w-full w-max-[400px] mx-auto p-5 sm:p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[24px] md:rounded-[32px] flex flex-col gap-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-white max-h-full overflow-y-auto"
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
            <span className="text-xs font-mono text-white/50">{t.sysAuth}</span>
          </div>

          {/* Liquid Role Toggle */}
          <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => { setRole('parent'); setOtpSent(false); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${role === 'parent' ? 'bg-white/20 shadow-lg text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {t.guardian}
            </button>
            <button
              onClick={() => { setRole('staff'); setOtpSent(false); setError(''); }}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${role === 'staff' ? 'bg-white/20 shadow-lg text-white' : 'text-white/50 hover:text-white/80'}`}
            >
              {t.faculty}
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
                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">{t.keyLabel} {phoneNumber})</label>
                      <div className="relative flex items-center">
                        <Key className="absolute left-4 text-white/50" size={20} />
                        <input
                          type="text"
                          placeholder={t.keyPlaceholder}
                          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-mono tracking-[0.2em] text-xl placeholder:text-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all backdrop-blur-md"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
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
                      onClick={() => setOtpSent(false)}
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
                      <label className="text-xs font-bold uppercase tracking-widest text-white/70">{t.keyLabel} {phoneNumber})</label>
                      <div className="relative flex items-center">
                        <Key className="absolute left-4 text-white/50" size={20} />
                        <input
                          type="text"
                          placeholder={t.keyPlaceholder}
                          className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white font-mono tracking-[0.2em] text-xl placeholder:text-white/30 focus:outline-none focus:border-white/60 focus:bg-white/10 transition-all backdrop-blur-md"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
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
                      onClick={() => setOtpSent(false)}
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
          
        </motion.div>
      </div>

    </div>
  );
}
