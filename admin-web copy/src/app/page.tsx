'use client';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: unknown;
  }
}

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Smartphone, Key, Globe, GraduationCap, Users, BookOpen, ChevronRight, Lock, ChevronLeft, TriangleAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SchoolConfig } from '@/config/school.config';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { clearUserSession, saveUserSession } from '@/lib/session';

const DEMO_PERSONAS = [
  {
    role: 'principal' as const,
    label: 'Principal',
    name: 'Dr. Anjali Rao',
    desc: 'Analytics & Administration',
    icon: Shield,
    color: '#4F46E5', // Indigo 600
  },
  {
    role: 'teacher' as const,
    label: 'Teacher',
    name: 'Mr. Ravi Kumar',
    desc: 'Attendance & Academics',
    icon: BookOpen,
    color: '#059669', // Emerald 600
  },
  {
    role: 'parent' as const,
    label: 'Parent',
    name: 'Mrs. Sunita Sharma',
    desc: 'Fees & Student Tracking',
    icon: Users,
    color: '#EA580C', // Orange 600
  },
  {
    role: 'super_admin' as const,
    label: 'System Admin',
    name: 'System Admin',
    desc: 'Super Admin Access',
    icon: Shield,
    color: '#475569',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
];

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const { lang, setLang, t: tFunc } = useLanguage();

  const [role, setRole] = useState<'parent' | 'teacher' | 'principal'>('parent');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [bypassLoading, setBypassLoading] = useState<string | null>(null);
  const [showOtpLogin, setShowOtpLogin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch {}
      window.recaptchaVerifier = undefined;
    }
  };

  const getFormattedPhone = () => {
    const trimmed = phoneNumber.trim();
    const digits = trimmed.replace(/\D/g, '');
    if (trimmed.startsWith('+') && digits.length >= 10 && digits.length <= 15) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
    throw new Error('Please enter a valid mobile number.');
  };

  const resetOtp = () => { setOtpSent(false); setOtpCode(''); setConfirmationResult(null); setSentTo(''); clearRecaptcha(); };

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
      setError(getErrorMessage(err, 'Failed to send OTP. Please try again.'));
      clearRecaptcha();
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error('Please request a code first.');
      const cred = await confirmationResult.confirm(otpCode);
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
      router.push('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid OTP code.'));
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (persona: typeof DEMO_PERSONAS[0]) => {
    setBypassLoading(persona.role);
    clearUserSession();
    localStorage.setItem('DEV_BYPASS_TOKEN', `DEV_BYPASS_${persona.role.toUpperCase()}`);
    saveUserSession({ id: `demo-${persona.role}`, role: persona.role, name: persona.name, schoolId: 'demo-school-1' });
    await new Promise(r => setTimeout(r, 600));
    router.push('/dashboard');
  };

  if (!mounted) return null;

  return (
    <div className="flex min-h-[100dvh] w-full bg-white font-sans text-slate-900">
      
      {/* ── LEFT HALF: BRAND PRESENTATION ── */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#0B0F19] relative overflow-hidden border-r border-slate-800">
        
        {/* Subtle Grid Pattern (No glowing lights, just structured elegance) */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="relative z-10 p-16 flex flex-col h-full justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${SchoolConfig.theme.primaryLight}, ${SchoolConfig.theme.secondaryLight})` }}>
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">{SchoolConfig.name} OS</span>
          </div>

          <div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              The operational <br/> nervous system <br/> for modern schools.
            </h1>
            <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-10 font-medium">
              A meticulously crafted ERP bringing Live Transport, AI Analytics, and fully automated Finance into a single, unified workspace.
            </p>
            
            <div className="space-y-4">
              {['End-to-End Encrypted Data', 'Role-Based Access Control', 'DPDP Act Compliant'].map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-indigo-400" />
                  </div>
                  <span className="text-slate-300 font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT HALF: LOGIN INTERFACE ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6 bg-slate-50">
        
        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 flex items-center gap-4 z-50">
          <ThemeToggle />
          <button onClick={() => setLang(lang === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            <Globe size={14} />
            {lang === 'en' ? 'ಕನ್ನಡ (KN)' : 'English (EN)'}
          </button>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-[440px]">
          
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">
            
            <AnimatePresence mode="wait">
              
              {/* DEMO PERSONA SELECTOR */}
              {!showOtpLogin && (
                <motion.div key="personas" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Select a demo persona to explore the dashboard.</p>
                  </div>

                  <div className="space-y-3">
                    {DEMO_PERSONAS.map(persona => {
                      const Icon = persona.icon;
                      const loading = bypassLoading === persona.role;
                      return (
                        <button
                          key={persona.role}
                          onClick={() => handleDemoLogin(persona)}
                          disabled={!!bypassLoading}
                          className="w-full group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md transition-all duration-200 text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-200"
                                 style={{ backgroundColor: `${persona.color}15`, color: persona.color }}>
                              {loading ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Icon size={22} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{persona.label}</p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">{persona.name} · {persona.desc}</p>
                            </div>
                          </div>
                          {!loading && <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative flex justify-center items-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <span className="relative bg-white px-4 text-xs font-bold uppercase tracking-widest text-slate-400">Or continue with</span>
                  </div>

                  <button onClick={() => setShowOtpLogin(true)}
                    className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm">
                    <Smartphone size={16} /> Phone Number (OTP)
                  </button>
                </motion.div>
              )}

              {/* OTP LOGIN FORM */}
              {showOtpLogin && (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Secure Sign In</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Verify your identity using a One-Time Password.</p>
                  </div>

                  {/* Role selection tabs */}
                  <div className="flex p-1 bg-slate-100 rounded-lg">
                    {(['parent', 'teacher', 'principal'] as const).map(r => (
                      <button key={r} onClick={() => { setRole(r); resetOtp(); setError(''); }}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${role === r ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                        {r}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {!otpSent ? (
                      <motion.form key="send" onSubmit={handleSendOtp} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2">Mobile Number</label>
                          <div className="relative">
                            <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel" placeholder="+91 98765 43210"
                              value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 text-slate-900 text-sm font-semibold transition-all outline-none"
                              required disabled={isLoading}
                            />
                          </div>
                        </div>
                        <button type="submit" disabled={isLoading}
                          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{tFunc('reqKey')} <ArrowRight size={16} /></>}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.form key="verify" onSubmit={handleVerifyOtp} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-2 flex justify-between">
                            <span>Verification Code</span>
                            <span className="text-indigo-600">Sent to {sentTo}</span>
                          </label>
                          <div className="relative">
                            <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text" placeholder="• • • • • •"
                              value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 text-slate-900 text-xl tracking-[0.4em] font-mono font-bold transition-all outline-none"
                              required disabled={isLoading} maxLength={6}
                            />
                          </div>
                        </div>
                        <button type="submit" disabled={isLoading}
                          className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                          {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{tFunc('confirmKey')} <ArrowRight size={16} /></>}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 text-center">
                    <button type="button" onClick={() => { setShowOtpLogin(false); resetOtp(); setError(''); }}
                      className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1 mx-auto">
                      <ChevronLeft size={16} /> Back to Demo Roles
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-6 px-4 py-3 rounded-lg flex items-start gap-3 text-sm font-semibold bg-red-50 text-red-700 border border-red-200">
                  <TriangleAlert size={16} className="shrink-0 mt-0.5" /> 
                  <span className="leading-tight">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>

          <div className="mt-8 text-center text-xs font-medium text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy & Terms of Service</Link>
          </div>

          <p className="text-center text-xs font-semibold text-slate-400 mt-4">
            © {new Date().getFullYear()} {SchoolConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
      
      <div id="recaptcha-container" />
    </div>
  );
}
