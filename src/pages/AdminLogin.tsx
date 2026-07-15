import { useState, useEffect } from 'react';
import {
  Heart,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import { ErrorBanner, Spinner } from '../components/ui';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn(form.email, form.password);

    setSubmitting(false);

    if (result.error) {
      setError('Invalid credentials. Please check your email and password and try again.');
      return;
    }

    // Auth state change listener will handle redirect once profile loads
    // If not an admin, show error
    setTimeout(() => {
      if (!isAdmin) {
        setError('Invalid credentials. Please check your email and password and try again.');
      }
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-50 px-4 pt-20 pb-12">
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

        {/* Restricted Access Notice */}
        <div className="mb-6 rounded-xl border border-warning-500/30 bg-warning-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning-100">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-warning-800">Restricted Access</h3>
              <p className="mt-1 text-xs leading-relaxed text-warning-700">
                This area is reserved exclusively for authorized Hope Charity
                Foundation administrators. Unauthorized access or attempts to
                gain access are prohibited.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Admin Login</h1>
              <p className="text-sm text-neutral-500">Secure administrator access</p>
            </div>
          </div>

          {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="input-field pl-10"
                  placeholder="hello@hopecharityfoundation.net"
                  autoComplete="username"
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
                  placeholder="••••••••"
                  autoComplete="current-password"
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
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition-colors hover:text-primary-600"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Protected by Supabase Authentication. All access attempts are logged.
        </p>
      </div>
    </div>
  );
}
