'use client';

/**
 * /school-setup
 *
 * Shown on first launch when no school code is stored in localStorage.
 * The user enters their school's short code (given to them by the admin at
 * onboarding) and taps "Continue".  On success the theme is applied and the
 * user is sent to the login page.
 *
 * What this screen does:
 *   1. Fetches GET /api/schools/:code/theme to validate the code exists.
 *   2. Applies the returned theme immediately.
 *   3. Writes the code + theme to localStorage.
 *   4. Navigates to "/" (the OTP login page).
 *
 * The screen can also be reached from Settings → "Change School" to let a
 * demo operator switch between school tenants without reinstalling the app.
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, ArrowRight, Search, CheckCircle2,
  AlertCircle, Globe, Loader2,
} from 'lucide-react';
import {
  fetchAndApplyTheme,
  setSchoolCode,
  getSchoolCode,
  DEFAULT_THEME,
  type ThemeConfig,
} from '@/lib/theme';

// ── Demo school codes (for the on-screen hint) ───────────────────────────────
const DEMO_HINT = 'e.g. springdale-blr';

export default function SchoolSetupPage() {
  const router = useRouter();

  const [code,      setCode]      = useState('');
  const [status,    setStatus]    = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg,  setErrorMsg]  = useState('');
  const [theme,     setTheme]     = useState<ThemeConfig>(DEFAULT_THEME);
  const inputRef = useRef<HTMLInputElement>(null);

  // If a code is already set (e.g. user navigated here from Settings),
  // pre-fill the input.
  useEffect(() => {
    const existing = getSchoolCode();
    if (existing) setCode(existing);
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMsg('');

    const fetched = await fetchAndApplyTheme(trimmed);

    if (!fetched) {
      setStatus('error');
      setErrorMsg(
        `No school found with code "${trimmed}". Check the code your school admin gave you.`,
      );
      return;
    }

    // Persist
    setSchoolCode(trimmed);
    setTheme(fetched);
    setStatus('success');

    // Brief pause so the user sees the success state + branded preview
    await new Promise((r) => setTimeout(r, 900));
    router.replace('/');
  };

  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-5 relative overflow-hidden"
      style={{ background: '#07111f' }}
    >
      {/* Ambient aurora blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 10%, rgba(0,122,255,0.25) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 60% 40% at 80% 90%, rgba(175,82,222,0.22) 0%, transparent 55%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-sm flex flex-col gap-6"
      >
        {/* Brand mark */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{
              background: status === 'success'
                ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                : 'linear-gradient(135deg,#007AFF,#5856D6)',
              boxShadow: '0 10px 30px rgba(0,122,255,0.35)',
            }}
          >
            {status === 'success'
              ? <CheckCircle2 size={30} className="text-white" strokeWidth={2.5} />
              : <GraduationCap size={30} className="text-white" strokeWidth={2.5} />
            }
          </div>

          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {status === 'success' ? theme.appName : 'Welcome to Vidya Setu'}
            </h1>
            <p className="text-sm text-white/50 font-medium mt-1">
              {status === 'success'
                ? 'School verified — taking you in…'
                : 'Enter your school code to get started'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-[24px] border border-white/15 backdrop-blur-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.09)' }}
        >
          {/* Preview band — shows school colours after success */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                key="preview"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 56, opacity: 1 }}
                exit={{   height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex items-center justify-between px-5 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${theme.primary}CC, ${theme.secondary}99)` }}
              >
                <span className="text-sm font-black" style={{ color: theme.textOnPrimary }}>
                  {theme.appName}
                </span>
                {theme.logoUrl && (
                  <img
                    data-school-logo
                    src={theme.logoUrl}
                    alt="School logo"
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
            {/* Code input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="school-code"
                className="text-[10px] font-black uppercase tracking-widest text-white/50"
              >
                School Code
              </label>

              <div className="relative flex items-center">
                <Search
                  className="absolute left-4 pointer-events-none"
                  size={16}
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                />
                <input
                  id="school-code"
                  ref={inputRef}
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={DEMO_HINT}
                  value={code}
                  onChange={(e) => {
                    // Allow only URL-safe characters
                    setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setStatus('idle');
                    setErrorMsg('');
                  }}
                  disabled={status === 'loading' || status === 'success'}
                  required
                  className="w-full rounded-2xl pl-10 pr-4 py-3.5 text-sm font-mono focus:outline-none transition-all"
                  style={{
                    background:   'rgba(255,255,255,0.07)',
                    border:       `1px solid ${status === 'error' ? 'rgba(255,59,48,0.50)' : 'rgba(255,255,255,0.15)'}`,
                    color:        '#FFFFFF',
                  }}
                />
              </div>

              <p className="text-[10px] text-white/30 font-mono pl-1">
                Your school admin provides this code at onboarding.
              </p>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {status === 'error' && errorMsg && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{   opacity: 0, height: 0 }}
                  className="flex items-start gap-2 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.30)' }}
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#FF3B30' }} />
                  <p className="text-xs font-medium" style={{ color: '#FF3B30' }}>{errorMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success' || !code.trim()}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50"
              style={{
                background: status === 'success'
                  ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
                  : 'rgba(255,255,255,0.95)',
                color: status === 'success' ? theme.textOnPrimary : '#1C1C1E',
              }}
            >
              {status === 'loading' && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 size={16} />
              )}
              {status === 'loading' ? 'Verifying…'
                : status === 'success' ? 'Verified!'
                : 'Continue'}
              {status === 'idle' && <ArrowRight size={16} />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/20 font-mono tracking-widest">
          VIDYA SETU · MULTI-TENANT · v3.0
        </p>
      </motion.div>
    </div>
  );
}
