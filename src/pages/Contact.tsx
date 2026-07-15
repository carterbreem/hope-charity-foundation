import { useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHeader, ErrorBanner, Spinner } from '../components/ui';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['United States'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['hello@hopecharityfoundation.net', 'Replies within 24 hours'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    lines: ['Mon-Fri: 9AM - 5PM', 'Sat: 10AM - 2PM', 'Sun: Emergency Only'],
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.message.trim().length < 10) {
      setError('Please provide a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <PageHeader
        title="Contact Us"
        subtitle="Have a question or want to get in touch? We would love to hear from you. Reach out using the form below or through any of our contact channels."
      />

      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact info */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.title} className="card p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
                      <info.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{info.title}</h3>
                      {info.lines.map((line) => (
                        <p key={line} className="mt-0.5 text-sm text-neutral-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {success ? (
                <div className="card p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                    <CheckCircle2 className="h-9 w-9 text-success-600" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                    Message Sent
                  </h2>
                  <p className="mt-3 text-sm text-neutral-600">
                    Thank you for reaching out. We will get back to you within
                    24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="btn-outline mt-6"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary-600" />
                    <h2 className="text-lg font-bold text-neutral-900">Send a Message</h2>
                  </div>

                  {error && <div className="mt-4"><ErrorBanner message={error} /></div>}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="input-field"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      className="input-field"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      className="input-field resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary mt-6 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-neutral-100">
        <div className="container-max px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-neutral-100">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary-300" />
              <p className="mt-3 text-sm font-medium text-neutral-500">
                United States
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
