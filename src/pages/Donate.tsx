import { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Mail,
  User,
  MessageSquare,
  CreditCard,
  Building2,
  Bitcoin,
  Apple,
  Wallet,
  DollarSign,
  Gift,
  Phone,
} from 'lucide-react';
import { useNavigate } from '../router';
import { supabase } from '../lib/supabase';
import { PageHeader, ErrorBanner, Spinner } from '../components/ui';

const presetAmounts = [25, 50, 100, 250, 500, 1000];

const paymentMethods = [
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
  { id: 'bitcoin', label: 'Bitcoin', icon: Bitcoin },
  { id: 'apple_pay', label: 'Apple Pay', icon: Apple },
  { id: 'venmo', label: 'Venmo', icon: Wallet },
  { id: 'cash_app', label: 'Cash App', icon: DollarSign },
  { id: 'paypal', label: 'PayPal', icon: CreditCard },
  { id: 'gift_card', label: 'Gift Card', icon: Gift },
];

const impactExamples = [
  { amount: 25, desc: 'Provides a week of groceries for a family' },
  { amount: 50, desc: 'Covers a medical prescription co-pay' },
  { amount: 100, desc: 'Supplies school materials for a student' },
  { amount: 250, desc: 'Helps with emergency utility assistance' },
  { amount: 500, desc: 'Supports a month of housing stability' },
];

export default function Donate() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number | ''>(50);
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({
    donor_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const selectedAmount = customAmount ? parseFloat(customAmount) : amount;

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalAmount = selectedAmount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount <= 0) {
      setError('Please select or enter a valid donation amount.');
      return;
    }
    if (!form.donor_name.trim() || !form.email.trim()) {
      setError('Please provide your name and email.');
      return;
    }

    setSubmitting(true);

    // Create a pending donation record. A real payment provider (e.g. Stripe)
    // would be integrated here via an edge function to create a payment intent
    // and confirm the charge before marking the donation as 'completed'.
    if (!selectedPayment) {
      setError('Please select a payment method.');
      setSubmitting(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('donations').insert({
        donor_name: form.donor_name,
        email: form.email,
        phone: form.phone || null,
        amount: finalAmount,
        message: form.message || null,
        status: 'pending',
        provider: selectedPayment,
        provider_payment_id: null,
      });

      setSubmitting(false);

      if (insertError) {
        // eslint-disable-next-line no-console
        console.error('[Donate] insert error', insertError.message);
        setError('We were unable to record your donation. Please try again later.');
        return;
      }

      setSuccess(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[Donate] unexpected error', err);
      setSubmitting(false);
      setError('We encountered an unexpected error. Please try again later.');
    }
  };

  if (success) {
    return (
      <div>
        <PageHeader title="Thank You for Your Donation" />
        <section className="section-padding bg-white">
          <div className="container-max max-w-2xl">
            <div className="card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                <Heart className="h-9 w-9 text-success-600" fill="currentColor" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                Your generosity makes a difference
              </h2>
              <p className="mt-3 text-sm text-neutral-600">
                We have recorded your donation of{' '}
                <span className="font-bold text-primary-700">
                  ${selectedAmount?.toLocaleString()}
                </span>
                . A confirmation email will be sent to {form.email}.
              </p>
              <div className="mt-6 rounded-lg bg-primary-50 p-4 text-left">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold">Next step:</span> Your donation
                  is currently pending. When a payment provider is connected,
                  you will be redirected to complete the secure payment process.
                  A receipt for your tax-deductible donation will be emailed to
                  you.
                </p>
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => navigate('home')} className="btn-primary">
                  Return Home
                </button>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setAmount(50);
                    setCustomAmount('');
                    setForm({ donor_name: '', email: '', phone: '', message: '' });
                  }}
                  className="btn-outline"
                >
                  Make Another Donation
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Donate to Hope Charity Foundation"
        subtitle="Your donation provides critical assistance to individuals and families in need. Every contribution, no matter the size, makes a meaningful difference."
      />

      <section className="section-padding bg-white">
        <div className="container-max max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="card p-8">
                {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

                {/* Amount selection */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-neutral-900">
                    Choose an amount
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`rounded-xl border-2 px-4 py-3 text-center font-bold transition-all ${
                          amount === amt && !customAmount
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-neutral-200 text-neutral-700 hover:border-primary-300'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount('');
                        }}
                        className="input-field pl-8"
                        placeholder="Custom amount"
                      />
                    </div>
                  </div>
                </div>

                {/* Donor info */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={form.donor_name}
                        onChange={(e) => update('donor_name', e.target.value)}
                        className="input-field pl-10"
                        placeholder="Jane Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="input-field pl-10"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="input-field pl-10"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Message (optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className="input-field resize-none pl-10"
                      placeholder="Share why you are donating or a message of hope..."
                    />
                  </div>
                </div>

                {/* Payment method selection */}
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-semibold text-neutral-900">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-all ${
                          selectedPayment === method.id
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-neutral-200 text-neutral-600 hover:border-primary-300'
                        }`}
                      >
                        <method.icon className="h-6 w-6" />
                        <span className="text-xs font-semibold">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent mt-6 w-full disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" fill="white" />
                      Donate ${selectedAmount && selectedAmount > 0 ? selectedAmount.toLocaleString() : ''}
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-500">
                  <Lock className="h-3.5 w-3.5" />
                  Secure donation · Tax-deductible · Tax ID: 12-3456789
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 lg:col-span-2">
              <div className="card p-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary-600" />
                  <h3 className="text-base font-bold text-neutral-900">Your Impact</h3>
                </div>
                <div className="mt-4 space-y-3">
                  {impactExamples.map((ex) => (
                    <div
                      key={ex.amount}
                      className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                        selectedAmount === ex.amount
                          ? 'bg-primary-50 ring-1 ring-primary-200'
                          : ''
                      }`}
                    >
                      <CheckCircle2
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          selectedAmount === ex.amount ? 'text-primary-600' : 'text-neutral-300'
                        }`}
                      />
                      <div>
                        <p className="text-sm font-bold text-neutral-900">${ex.amount}</p>
                        <p className="text-xs text-neutral-500">{ex.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-primary-700 p-6 text-white">
                <CreditCard className="h-8 w-8 text-primary-200" />
                <h3 className="mt-4 text-lg font-bold">98% to Programs</h3>
                <p className="mt-2 text-sm text-primary-100">
                  Thanks to our dedicated volunteers and low overhead, nearly
                  every dollar you donate goes directly to helping families in
                  need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
