import { useState, useEffect } from 'react';
import {
  Heart,
  Mail,
  Lock,
  User,
  ArrowRight,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { ErrorBanner, Spinner } from '../components/ui';

export default function Auth() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate('home');
  }, [user, navigate]);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === 'signup' && form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setSubmitting(false);
      return;
    }

    const result =
      mode === 'signin'
        ? await signIn(form.email, form.password)
        : await signUp(form.email, form.password, form.fullName);

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // On success, the auth state change listener will navigate
    navigate('home');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <button onClick={() => navigate('home')} className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <span className="font-serif text-xl font-bold text-neutral-900">
              Hope Charity Foundation
            </span>
          </button>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex gap-2 rounded-xl bg-neutral-100 p-1">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                mode === 'signin'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {mode === 'signin'
              ? 'Sign in to track your applications and manage your account.'
              : 'Create an account to apply for assistance and track your applications.'}
          </p>

          {error && <div className="mt-4"><ErrorBanner message={error} /></div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className="input-field pl-10"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="input-field pl-10"
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                  Please wait...
                </>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-500">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
              }}
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Your information is secure and will never be shared with third parties.
        </p>
      </div>
    </div>
  );
}
