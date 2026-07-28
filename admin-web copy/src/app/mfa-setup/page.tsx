'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function MFASetupPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSetupRequired, setIsSetupRequired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkMfaStatus();
  }, []);

  const checkMfaStatus = async () => {
    try {
      const data = await api.get('/auth/mfa/status');
      if (data.mfaEnabled) {
        setIsSetupRequired(false);
        setLoading(false);
      } else {
        setIsSetupRequired(true);
        initiateSetup();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to check MFA status');
      setLoading(false);
    }
  };

  const initiateSetup = async () => {
    try {
      const data = await api.post('/auth/mfa/setup', {});
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setLoading(false);
    } catch (err) {
      setError('Failed to initiate MFA setup');
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const data = await api.post('/auth/mfa/verify', { token });
      if (data.success && data.mfaToken) {
        localStorage.setItem('mfa_token', data.mfaToken);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid MFA code');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      
      {/* Liquid Abstract Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-4xl font-extrabold font-display tracking-tighter text-white">
          Security Verification
        </h2>
        <p className="mt-2 text-center text-sm text-white/70">
          Your role requires Multi-Factor Authentication.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-2xl py-8 px-4 sm:rounded-[32px] sm:px-10 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-white">
          
          {isSetupRequired ? (
            <div className="text-center mb-6">
              <p className="text-sm text-white/80 mb-4">
                Scan this QR code with Google Authenticator or a similar TOTP app.
              </p>
              {qrCode && (
                <div className="flex justify-center mb-4 bg-white/90 p-4 rounded-2xl inline-block shadow-lg">
                  <img src={qrCode} alt="MFA QR Code" className="mx-auto rounded" />
                </div>
              )}
              {secret && (
                <p className="text-xs text-white/60 font-mono mt-2">
                  Secret Key: {secret}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center mb-6">
              <p className="text-sm text-white/80 mb-4">
                Enter the 6-digit code from your authenticator app.
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleVerify}>
            <div>
              <label htmlFor="token" className="block text-xs font-bold uppercase tracking-widest text-white/70">
                6-Digit Code
              </label>
              <div className="mt-2">
                <input
                  id="token"
                  name="token"
                  type="text"
                  maxLength={6}
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="appearance-none block w-full px-4 py-4 bg-white/5 border border-white/20 rounded-2xl shadow-inner placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 sm:text-lg text-white text-center tracking-[0.3em] font-mono backdrop-blur-md transition-all"
                  placeholder="000000"
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-100 font-mono text-sm text-center font-bold tracking-wide backdrop-blur-md">{error}</div>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold uppercase tracking-widest text-indigo-900 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5"
              >
                Verify Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
