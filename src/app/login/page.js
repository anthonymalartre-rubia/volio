'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import AuthBackgroundDecor from '@/components/AuthBackgroundDecor';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = getSupabase();
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError(t('auth.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4 relative overflow-hidden">
      <AuthBackgroundDecor />
      <ThemeToggle className="absolute top-4 right-4 z-10" />
      <Link href="/" className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 text-xs text-content-tertiary hover:text-content-primary transition">
        <ArrowLeft size={12} />
        Prospectia
      </Link>
      <div
        className={`relative w-full max-w-sm space-y-8 transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <span className="text-lg font-bold text-white">P</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-content-primary">Prospectia<span className="text-rose-400">.ai</span></h1>
          <p className="mt-2 text-sm text-content-tertiary">
            {t('auth.loginTitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-600/50 bg-red-600/10 px-4 py-3 text-sm text-red-400 animate-in fade-in">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-content-secondary mb-1.5">
              {t('common.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-line bg-surface-card pl-10 pr-4 py-2.5 text-sm text-content-primary placeholder-content-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-content-secondary mb-1.5">
              {t('common.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-line bg-surface-card pl-10 pr-10 py-2.5 text-sm text-content-primary placeholder-content-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                placeholder={t('auth.passwordPlaceholder')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-secondary transition-colors duration-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="/forgot-password" className="text-xs text-content-muted hover:text-indigo-400 transition-colors duration-200">
                {t('auth.forgotPassword')}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 disabled:bg-indigo-600/50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('auth.loginLoading')}</span>
              </>
            ) : (
              t('auth.loginAction')
            )}
          </button>
        </form>

        <p className="text-center text-sm text-content-tertiary">
          {t('auth.noAccount')}{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 hover:underline underline-offset-4 font-medium transition-colors duration-200">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
