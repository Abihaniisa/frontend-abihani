import React, { useState } from 'react';
import { ArrowLeft, Mail, ShieldCheck, Key, Check } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import { AuthService } from '../services';

export const AuthScreen: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'recovery'>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedRecovery, setGeneratedRecovery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginWithOtp } = useAuthStore();
  const { navigate, addToast, setTermsSheet, setPrivacySheet } = useUIStore();

  const handleEmailSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await AuthService.requestEmailOtp(email.trim());
      addToast('OTP sent! Check your browser console', 'success');
      setStep('otp');
    } catch {
      setErrorMsg('Could not send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMsg('Enter the 6-digit code');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const session = await AuthService.verifyEmailOtp(email.trim(), otpCode.trim());
      await loginWithOtp(email.trim(), otpCode.trim());
      setGeneratedRecovery(session.recoveryCode);
      setStep('recovery');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryConfirm = (): void => {
    addToast('Account ready. Welcome to Abihani!', 'success');
    navigate('home');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] flex flex-col justify-between p-6 select-none pt-safe pb-safe">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        {step !== 'email' ? (
          <button
            onClick={() => setStep('email')}
            className="p-1 rounded text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-[17px] font-[800] tracking-[-0.6px] text-[#F5F0E6]">
            Abihani
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-blink-dot" />
        </div>

        <div className="w-5" />
      </div>

      {/* Main Flow Content */}
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">
        {/* Step 1: Email & Country */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-xl font-extrabold text-[#F5F0E6]">
                Welcome to Abihani
              </h1>
              <p className="text-xs text-[#B8B2A6] mt-1">
                The social marketplace. Discover. Like. Buy.
              </p>
            </div>

            {/* Country Picker: Nigeria Only */}
            <div>
              <label className="block text-xs font-semibold text-[#B8B2A6] mb-1">
                Country
              </label>
              <div className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] flex items-center justify-between">
                <span>🇳🇬 Nigeria (+234)</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Launch Market</span>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full h-12 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] placeholder-neutral-500 focus:outline-none focus:border-[#C41E3A]"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-[#FF3B3B] font-medium">{errorMsg}</p>
            )}

            {/* Age Gate and Terms Consent locked by prompt Part 3 & Part 21 */}
            <div className="text-[11px] text-[#B8B2A6] leading-relaxed pt-2 space-y-1">
              <p>
                By continuing, you confirm you are 18 or older.
              </p>
              <p>
                By continuing, you agree to our{' '}
                <button
                  type="button"
                  onClick={() => setTermsSheet(true)}
                  className="text-[#E7C27A] font-semibold underline"
                >
                  Terms
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setPrivacySheet(true)}
                  className="text-[#E7C27A] font-semibold underline"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-xs tracking-wide shadow-lg hover:bg-[#b01a33] active:scale-[0.98] disabled:opacity-40 transition-transform"
            >
              {loading ? 'Sending code...' : 'Continue'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
            <div>
              <h2 className="text-xl font-extrabold text-[#F5F0E6]">Check your email</h2>
              <p className="text-xs text-[#B8B2A6] mt-1">
                Enter the 6-digit verification code sent to <strong className="text-white">{email}</strong>
              </p>
              <span className="text-[10px] text-[#E7C27A] block mt-1">
                (Mock code printed in browser developer console)
              </span>
            </div>

            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              autoFocus
              className="w-full h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-center font-mono text-2xl font-extrabold text-[#E7C27A] tracking-widest focus:outline-none focus:border-[#C41E3A] tabular-nums"
            />

            {errorMsg && <p className="text-xs text-[#FF3B3B]">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-xs shadow-lg hover:bg-[#b01a33] active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? 'Verifying...' : 'Verify & Log in'}
            </button>
          </form>
        )}

        {/* Step 3: Recovery Code Shown Once */}
        {step === 'recovery' && (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E7C27A]/15 text-[#E7C27A] flex items-center justify-center mx-auto mb-2">
              <Key className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#F5F0E6]">Your Recovery Code</h2>
              <p className="text-xs text-[#B8B2A6] mt-1 leading-relaxed">
                Save this 8-digit code. It is shown once and is your last door into this account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-[#E7C27A]/40 font-mono text-2xl font-extrabold text-[#E7C27A] tracking-widest tabular-nums">
              {generatedRecovery}
            </div>

            <button
              onClick={handleRecoveryConfirm}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-xs shadow-lg hover:bg-[#b01a33] active:scale-[0.98]"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>I saved my recovery code</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Legal Entity */}
      <div className="text-center pt-6">
        <span className="text-[10px] text-neutral-500 block">
          Abihani is a product of Abihani Express, registered in Nigeria.
        </span>
      </div>
    </div>
  );
};
