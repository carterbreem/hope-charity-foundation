import { useState, useRef, useEffect } from 'react';
import {
  HandHeart,
  Stethoscope,
  GraduationCap,
  Home as HomeIcon,
  Zap,
  Wallet,
  Heart,
  FileText,
  CheckCircle2,
  ArrowRight,
  User,
  DollarSign,
  ClipboardList,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import {
  supabase,
  type AssistanceType,
  ASSISTANCE_CATEGORIES,
  COUNTRIES,
} from '../lib/supabase';
import { PageHeader, ErrorBanner, Spinner } from '../components/ui';

const categoryIcons: Record<AssistanceType, typeof Stethoscope> = {
  medical_bills: Stethoscope,
  education: GraduationCap,
  housing: HomeIcon,
  emergency_relief: Zap,
  financial_hardship: Wallet,
  other_community: Heart,
};

function CountrySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field flex items-center justify-between"
      >
        <span className={value ? 'text-neutral-900' : 'text-neutral-400'}>
          {value || 'Select your country...'}
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="border-b border-neutral-100 p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 py-1.5 pl-8 pr-2 text-sm outline-none focus:border-primary-400"
                placeholder="Search countries..."
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-neutral-400">No countries found</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-primary-50 ${
                    value === c ? 'bg-primary-50 font-medium text-primary-700' : 'text-neutral-700'
                  }`}
                >
                  {c}
                  {value === c && <Check className="h-4 w-4 text-primary-600" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Apply() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const [form, setForm] = useState({
    applicant_name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postal_code: '',
    country: '',
    assistance_type: '' as AssistanceType | '',
    amount_requested: '',
    description: '',
    why_needed: '',
    how_helps: '',
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const resetForm = () => ({
    applicant_name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phone: '',
    address: '',
    city: '',
    region: '',
    postal_code: '',
    country: '',
    assistance_type: '' as AssistanceType | '',
    amount_requested: '',
    description: '',
    why_needed: '',
    how_helps: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.assistance_type) {
      setError('Please select an assistance category.');
      return;
    }
    if (!form.country) {
      setError('Please select your country.');
      return;
    }
    const amount = parseFloat(form.amount_requested);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid requested amount.');
      return;
    }
    if (form.description.trim().length < 20) {
      setError('Please provide a description of your situation (at least 20 characters).');
      return;
    }
    if (form.why_needed.trim().length < 10) {
      setError('Please explain why you need assistance (at least 10 characters).');
      return;
    }
    if (form.how_helps.trim().length < 10) {
      setError('Please explain how the assistance will help (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: insertError } = await supabase
        .from('applications')
        .insert({
          applicant_name: form.applicant_name,
          email: form.email,
          phone: form.phone || null,
          address: form.address || null,
          city: form.city || null,
          region: form.region || null,
          postal_code: form.postal_code || null,
          country: form.country || null,
          assistance_type: form.assistance_type,
          amount_requested: amount,
          description: form.description,
          why_needed: form.why_needed,
          how_helps: form.how_helps,
        })
        .select('id, reference_number')
        .single();

      setSubmitting(false);

      if (insertError) {
        // eslint-disable-next-line no-console
        console.error('[Apply] insert error', insertError.message);
        setError('We were unable to submit your application at this time. Please try again later.');
        return;
      }

      setSubmittedRef(data.reference_number ?? data.id);
      setSuccess(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Apply] unexpected error', err);
      setSubmitting(false);
      setError('We encountered an unexpected error. Please try again later.');
    }
  };

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Apply for Assistance"
          subtitle="We are here to help. Please sign in or create an account to submit your application."
        />
        <section className="section-padding bg-white">
          <div className="container-max max-w-2xl">
            <div className="card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                <HandHeart className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                Account Required
              </h2>
              <p className="mt-3 text-sm text-neutral-600">
                To protect your privacy and allow you to track your application
                status, you need an account to apply for assistance. It only
                takes a minute to create one.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => navigate('auth')} className="btn-primary">
                  Sign In or Sign Up
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate('home')} className="btn-ghost">
                  Back to Home
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: FileText, title: '1. Create Account', desc: 'Sign up with your email' },
                { icon: HandHeart, title: '2. Fill Application', desc: 'Tell us about your needs' },
                { icon: CheckCircle2, title: '3. Track Status', desc: 'Monitor your application' },
              ].map((step) => (
                <div key={step.title} className="card p-5 text-center">
                  <step.icon className="mx-auto h-8 w-8 text-primary-600" />
                  <h3 className="mt-3 text-sm font-bold text-neutral-900">{step.title}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-900/50 p-4 backdrop-blur-sm">
        <div className="relative my-8 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
          <div className="p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-9 w-9 text-success-600" />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-neutral-900">
              Application Received Successfully
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              Thank you for reaching out to Hope Charity Foundation.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Your application has been successfully received and is now awaiting review by our team.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              Please save your application reference number. You will need it to track your application.
            </p>
            {submittedRef && (
              <div className="mt-5 rounded-lg bg-primary-50 p-5">
                <p className="text-xs uppercase tracking-wider text-primary-600">
                  Your Application Reference Number
                </p>
                <p className="mt-2 font-mono text-xl font-bold text-primary-800">
                  {submittedRef}
                </p>
              </div>
            )}
            <div className="mt-5 rounded-lg border-2 border-accent-300 bg-accent-50 p-4 text-left">
              <p className="text-sm font-bold text-accent-800">
                IMPORTANT:
              </p>
              <p className="mt-1 text-sm font-semibold text-accent-800">
                For faster assistance, click the Green LIVE CHAT button at the top of this page and provide your application reference number to our support team.
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              Our team will contact you with the next steps.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate('tracker')} className="btn-primary">
                Track My Application
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  setSubmittedRef(null);
                  setForm(resetForm());
                }}
                className="btn-outline"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Apply for Assistance"
        subtitle="Please complete the form below. All information is kept strictly confidential and used only for evaluating your request. Applicants from any country are welcome to apply."
      />

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <form onSubmit={handleSubmit} className="card p-8">
            {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

            {/* Section: Applicant Information */}
            <div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                <h3 className="text-base font-bold text-neutral-900">Applicant Information</h3>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.applicant_name}
                    onChange={(e) => update('applicant_name', e.target.value)}
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="input-field"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="input-field"
                    placeholder="+44 20 1234 5678"
                  />
                </div>
              </div>

