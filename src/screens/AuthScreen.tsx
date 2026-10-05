import React, { useState } from 'react';
import { ArrowLeft, Key, Check, AlertCircle } from '../components/icons';
import { useAuthStore } from '../store/auth.store';
import { useUIStore } from '../store/ui.store';
import { AuthService } from '../services';
import { normalizePhone } from '../utils/normalizePhone';

export const AuthScreen: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'recovery'>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedRecovery, setGeneratedRecovery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { loginWithPhone } = useAuthStore();
  const { navigate, addToast, setTermsSheet, setPrivacySheet } = useUIStore();

  const normalizedPhone = normalizePhone(phoneInput);
  const isValidPhone = /^\+234\d{10}$/.test(normalizedPhone);

  const handlePhoneSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isValidPhone) {
      setErrorMsg('Enter a valid Nigerian phone number');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const startedAt = Date.now();
    try {
      await AuthService.requestPhoneOtp(normalizedPhone);
      const elapsed = Date.now() - startedAt;
      const minWait = 1000;
      if (elapsed < minWait) {
        await new Promise((r) => setTimeout(r, minWait - elapsed));
      }
      setStep('otp');
    } catch {
      setErrorMsg('Could not send the code. Try again.');
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

    const startedAt = Date.now();
    try {
      const session = await AuthService.verifyPhoneOtp(normalizedPhone, otpCode.trim());
      await loginWithPhone(normalizedPhone, otpCode.trim());
      const elapsed = Date.now() - startedAt;
      const minWait = 1000;
      if (elapsed < minWait) {
        await new Promise((r) => setTimeout(r, minWait - elapsed));
      }
      setGeneratedRecovery(session.recoveryCode);
      setStep('recovery');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'That code is not correct. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryConfirm = (): void => {
    addToast('Welcome to Abihani', 'success');
    navigate('home');
  };

  const handleChangeNumber = (): void => {
    setOtpCode('');
    setErrorMsg('');
    setStep('phone');
  };

  return (
    <div className="w-full min-h-[100dvh] bg-[#0B0B0F] text-[#F5F0E6] flex flex-col justify-between p-6 select-none pt-safe pb-safe">
      <div className="flex items-center justify-between">
        {step === 'phone' ? (
          <div />
        ) : (
          <button
            onClick={handleChangeNumber}
            className="p-1 rounded text-neutral-400 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-[17px] font-[800] tracking-[-0.6px] text-[#F5F0E6]">
            Abihani
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C41E3A] animate-blink-dot" />
        </div>

        <div className="w-5" />
      </div>

      <div className="w-full max-w-sm mx-auto my-auto space-y-6">
        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h1 className="text-xl font-extrabold text-[#F5F0E6]">
                Welcome to Abihani
              </h1>
              <p className="text-xs text-[#B8B2A6] mt-1">
                Discover. Like. Buy.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#B8B2A6] mb-1">
                Country
              </label>
              <div className="w-full h-11 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-[#F5F0E6] flex items-center justify-between">
                <span>🇳🇬 Nigeria (+234)</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Launch Market</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F5F0E6] mb-1">
                Phone number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="080675551684"
                required
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full h-12 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-[#F5F0E6] placeholder-neutral-500 focus:outline-none focus:border-[#C41E3A]"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-[#FF3B3B] font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}

            <div className="text-[11px] text-[#B8B2A6] leading-relaxed pt-2 space-y-1">
              <p>By continuing, you confirm you are 18 or older.</p>
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
              disabled={loading || !phoneInput}
              className="w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-xs tracking-wide shadow-lg hover:bg-[#b01a33] active:scale-[0.98] disabled:opacity-40 transition-transform flex items-center justify-center"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Continue'
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4 text-center">
            <div>
              <h2 className="text-xl font-extrabold text-[#F5F0E6]">Enter the code</h2>
              <p className="text-xs text-[#B8B2A6] mt-1">
                We sent a 6-digit code to <strong className="text-white">{normalizedPhone}</strong>
              </p>
              <span className="text-[10px] text-[#E7C27A] block mt-1">
                Mock code printed in the browser console
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
              className="w-full h-12 rounded-xl bg-[#C41E3A] text-white font-bold text-xs shadow-lg hover:bg-[#b01a33] active:scale-[0.98] disabled:opacity-40 flex items-center justify-center"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Verify'
              )}
            </button>

            <button
              type="button"
              onClick={handleChangeNumber}
              className="text-[11px] text-[#B8B2A6] font-medium underline"
            >
              Change number
            </button>
          </form>
        )}

        {step === 'recovery' && (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#E7C27A]/15 text-[#E7C27A] flex items-center justify-center mx-auto mb-2">
              <Key className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#F5F0E6]">Save your code</h2>
              <p className="text-xs text-[#B8B2A6] mt-1 leading-relaxed">
                Write this down. It is your last door if you lose access.
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
              <span>I wrote it down</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center pt-6">
        <span className="text-[10px] text-neutral-500 block">
          Abihani. Damaturu, Yobe State, Nigeria.
        </span>
      </div>
    </div>
  );
};