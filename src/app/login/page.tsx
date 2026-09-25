'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: isAuthChecking } = useAuth();
  const { success } = useToast();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectUrl = searchParams.get('redirect') || '/products';
  const isSessionExpired = searchParams.get('session_expired') === 'true';

  // If already authenticated, redirect to products immediately
  useEffect(() => {
    if (!isAuthChecking && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isAuthChecking, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!username.trim()) {
      setErrorMessage('Please enter your username.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await login({
        username: username.trim(),
        password,
      });

      success('Welcome back!', 'Successfully signed in to NexGensis Dashboard.');
      router.replace(redirectUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid username or password. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-4 transform hover:scale-105 transition-transform duration-200">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          NexGensis Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sign in to manage your product catalog
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        {/* Quick Demo Pill Helper */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="text-xs text-slate-700">
              <span className="font-semibold text-blue-900">Demo account:</span>{' '}
              <span className="font-mono text-slate-600">emilys / emilyspass</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100/60 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors shrink-0"
          >
            Fill Demo
          </button>
        </div>

        {/* Session Expired Notice */}
        {isSessionExpired && !errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Your session has expired. Please log in again to continue.</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            id="username"
            type="text"
            placeholder="e.g. emilys"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            leftIcon={<User className="w-4 h-4" />}
            autoComplete="username"
            required
          />

          <Input
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none hover:text-slate-600 cursor-pointer"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
            autoComplete="current-password"
            required
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md shadow-blue-500/25"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In to Dashboard
            </Button>
          </div>
        </form>
      </div>

      {/* Assignment Footer Note */}
      <p className="text-center text-xs text-slate-400 mt-6">
        NexGensis Product Admin &bull; Built with Next.js, Tailwind CSS & Axios
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Soft blue ambient glow accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
