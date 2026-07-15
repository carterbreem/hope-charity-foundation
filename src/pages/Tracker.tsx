import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ClipboardList,
  Send,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Bell,
} from 'lucide-react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import {
  supabase,
  type Application,
  type StatusHistoryEntry,
  type ApplicationMessage,
  type ApplicationStatus,
  ASSISTANCE_CATEGORIES,
  STATUS_LABELS,
} from '../lib/supabase';
import { PageHeader, StatusBadge, Spinner, EmptyState } from '../components/ui';

const statusFlow: ApplicationStatus[] = [
  'submitted',
  'under_review',
  'approved',
  'completed',
];

const statusIcons: Record<ApplicationStatus, typeof Clock> = {
  submitted: FileText,
  under_review: Clock,
  approved: CheckCircle2,
  completed: CheckCircle2,
  declined: XCircle,
};

export default function Tracker() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [historyMap, setHistoryMap] = useState<Record<string, StatusHistoryEntry[]>>({});
  const [messagesMap, setMessagesMap] = useState<Record<string, ApplicationMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchRef, setSearchRef] = useState('');
  const [searchResult, setSearchResult] = useState<Application | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    setApplications(data as Application[]);

    if (data.length > 0) {
      const ids = data.map((a) => a.id);
      const [histRes, msgRes] = await Promise.all([
        supabase
          .from('application_status_history')
          .select('*')
          .in('application_id', ids)
          .order('created_at', { ascending: true }),
        supabase
          .from('application_messages')
          .select('*')
          .in('application_id', ids)
          .order('created_at', { ascending: true }),
      ]);

      const hMap: Record<string, StatusHistoryEntry[]> = {};
      (histRes.data as StatusHistoryEntry[] | null)?.forEach((h) => {
        if (!hMap[h.application_id]) hMap[h.application_id] = [];
        hMap[h.application_id].push(h);
      });
      setHistoryMap(hMap);

      const mMap: Record<string, ApplicationMessage[]> = {};
      (msgRes.data as ApplicationMessage[] | null)?.forEach((m) => {
        if (!mMap[m.application_id]) mMap[m.application_id] = [];
        mMap[m.application_id].push(m);
      });
      setMessagesMap(mMap);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;
    setSearching(true);
    setSearchError(null);
    setSearchResult(null);

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('reference_number', searchRef.trim())
      .maybeSingle();

    setSearching(false);

    if (error) {
      setSearchError(error.message);
      return;
    }
    if (!data) {
      setSearchError('No application found with that reference number.');
      return;
    }
    setSearchResult(data as Application);
  };

  const unreadCount = applications.reduce((sum, app) => {
    const msgs = messagesMap[app.id] ?? [];
    return sum + msgs.filter((m) => m.author_role === 'admin' && !m.read_by_applicant).length;
  }, 0);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 pt-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Applicant Dashboard"
          subtitle="Sign in to view your applications, track their status, and see messages from the foundation."
        />
        <section className="section-padding bg-white">
          <div className="container-max max-w-2xl">
            <div className="card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100">
                <ClipboardList className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                Sign In Required
              </h2>
              <p className="mt-3 text-sm text-neutral-600">
                Please sign in to view and track your assistance applications,
                see updates, and read messages from our team.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => navigate('auth')} className="btn-primary">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate('apply')} className="btn-outline">
                  Apply for Assistance
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
        title="Applicant Dashboard"
        subtitle={`Welcome, ${profile?.full_name ?? user.email}. Track your applications, view updates, and communicate with our team.`}
      >
        {unreadCount > 0 && (
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-4 py-2 text-sm font-medium text-accent-700">
            <Bell className="h-4 w-4" />
            {unreadCount} unread message{unreadCount > 1 ? 's' : ''} from the foundation
          </div>
        )}
      </PageHeader>

      <section className="section-padding bg-white">
        <div className="container-max">
          {/* Search by reference number */}
          <div className="mb-10 max-w-2xl">
            <h2 className="text-lg font-bold text-neutral-900">Track by Reference Number</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Have an application reference number? Enter it below to check its status.
            </p>
            <form onSubmit={handleSearch} className="mt-4 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  className="input-field pl-10"
                  placeholder="e.g. HCF-2026-000123"
                />
              </div>
              {searchResult ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchResult(null);
                    setSearchRef('');
                    setSearchError(null);
                  }}
                  className="btn-outline"
                >
                  Close
                </button>
              ) : (
                <button type="submit" disabled={searching} className="btn-primary disabled:opacity-60">
                  {searching ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : 'Track'}
                </button>
              )}
            </form>
            {searchError && (
              <p className="mt-3 text-sm text-error-600">{searchError}</p>
            )}
            {searchResult && (
              <div className="mt-4 card p-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-neutral-500">Reference Number</p>
                  <p className="mt-1 font-mono text-lg font-bold text-primary-700">
                    {searchResult.reference_number ?? searchResult.id.slice(0, 12)}
                  </p>
                </div>
                <div className="mt-4 rounded-lg bg-neutral-50 p-4">
                  <StatusMessage status={searchResult.status} />
                </div>
                <div className="mt-4">
                  <StatusProgress status={searchResult.status} />
                </div>
              </div>
            )}
          </div>

          {/* My Applications */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-900">My Applications</h2>
              <button onClick={() => navigate('apply')} className="btn-outline text-xs">
                <FileText className="h-3.5 w-3.5" />
                New Application
              </button>
            </div>
            {applications.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon={<FileText className="h-12 w-12" />}
                  title="No applications yet"
                  description="You have not submitted any assistance applications. Start by applying for assistance."
                  action={
                    <button onClick={() => navigate('apply')} className="btn-primary">
                      Apply for Assistance
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {applications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    history={historyMap[app.id] ?? []}
                    messages={messagesMap[app.id] ?? []}
                    onOpen={() => setSelectedApp(app)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Application detail modal with messages */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          messages={messagesMap[selectedApp.id] ?? []}
          onClose={() => setSelectedApp(null)}
          onMessageSent={loadData}
        />
      )}
    </div>
  );
}

function StatusMessage({ status }: { status: ApplicationStatus }) {
  const messages: Record<ApplicationStatus, React.ReactNode> = {
    submitted: (
      <div className="space-y-2 text-sm leading-relaxed text-neutral-700">
        <p>
          Your application has been successfully received and is waiting to be
          reviewed by our team. We appreciate your patience while we carefully
          assess your request.
        </p>
        <p>Our team will contact you with the next steps.</p>
      </div>
    ),
    under_review: (
      <div className="space-y-2 text-sm leading-relaxed text-neutral-700">
        <p>
          Your application is currently under review. Our team is carefully
          evaluating the information you provided.
        </p>
        <p>Our team will contact you with the next steps.</p>
      </div>
    ),
    approved: (
      <div className="space-y-2 text-sm leading-relaxed text-neutral-700">
        <p className="font-semibold text-success-700">Congratulations.</p>
        <p>
          Your application has been approved and is now progressing through
          the final processing stage.
        </p>
        <p>Our team will contact you with the next steps.</p>
      </div>
    ),
    completed: (
      <div className="space-y-2 text-sm leading-relaxed text-neutral-700">
        <p>Your application has been completed successfully.</p>
        <p>
          If any additional communication is required, our team will reach out
          to you.
        </p>
        <p>Our team will contact you with the next steps.</p>
      </div>
    ),
    declined: (
      <div className="space-y-2 text-sm leading-relaxed text-neutral-700">
        <p>
          Your application has been declined. If you believe this is in error or
          have additional information to provide, please contact our team.
        </p>
      </div>
    ),
  };
  return <>{messages[status]}</>;
}

function StatusProgress({ status }: { status: ApplicationStatus }) {
  const currentStep = statusFlow.indexOf(status);
  return (
    <div>
      <div className="flex items-center justify-between">
        {statusFlow.map((step, i) => {
          const Icon = statusIcons[step];
          const isComplete = i <= currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  isComplete
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-neutral-200 bg-white text-neutral-400'
                } ${isCurrent ? 'ring-2 ring-primary-200 ring-offset-2' : ''}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`mt-1.5 text-[10px] font-medium ${
                  isComplete ? 'text-primary-700' : 'text-neutral-400'
                }`}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-500"
          style={{
            width: `${currentStep >= 0 ? (currentStep / (statusFlow.length - 1)) * 100 : 0}%`,
          }}
        />
      </div>
    </div>
  );
}

function ApplicationCard({
  application,
  history,
  messages,
  onOpen,
}: {
  application: Application;
  history: StatusHistoryEntry[];
  messages: ApplicationMessage[];
  onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDeclined = application.status === 'declined';
  const adminMessages = messages.filter((m) => m.author_role === 'admin');
  const unreadAdmin = adminMessages.filter((m) => !m.read_by_applicant).length;
  const category = ASSISTANCE_CATEGORIES.find((c) => c.value === application.assistance_type);

  return (
    <div className="card overflow-hidden">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-neutral-900">
                {category?.shortLabel ?? application.assistance_type}
              </h3>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Ref: <span className="font-mono font-semibold text-neutral-700">{application.reference_number ?? application.id.slice(0, 12)}</span>
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Submitted on {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-neutral-500">Amount Requested</p>
            <p className="text-xl font-bold text-primary-700">
              ${application.amount_requested.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {unreadAdmin > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-3 text-sm text-primary-700">
            <Bell className="h-4 w-4 shrink-0" />
            <span>{unreadAdmin} new message{unreadAdmin > 1 ? 's' : ''} from the foundation</span>
          </div>
        )}

        {/* Progress bar */}
        {!isDeclined ? (
          <div className="mt-6">
            <StatusProgress status={application.status} />
          </div>
        ) : (
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-700">
            <XCircle className="h-5 w-5" />
            Unfortunately, this application was declined at this time. Please contact us if you have questions.
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {expanded ? 'Hide details' : 'View details'}
          </button>
          <button
            onClick={onOpen}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View messages ({messages.length})
          </button>
        </div>

        {expanded && (
          <div className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
            <DetailRow icon={User} label="Applicant" value={application.applicant_name} />
            <DetailRow icon={Mail} label="Email" value={application.email} />
            {application.phone && <DetailRow icon={Phone} label="Phone" value={application.phone} />}
            {application.address && <DetailRow icon={MapPin} label="Street Address" value={application.address} />}
            {application.city && <DetailRow icon={MapPin} label="City" value={application.city} />}
            {application.region && <DetailRow icon={MapPin} label="State/Province/Region" value={application.region} />}
            {application.postal_code && <DetailRow icon={MapPin} label="Postal/ZIP Code" value={application.postal_code} />}
            {application.country && <DetailRow icon={MapPin} label="Country" value={application.country} />}
            <DetailRow icon={DollarSign} label="Amount" value={`${application.amount_requested.toLocaleString()}`} />
            <DetailRow icon={Calendar} label="Submitted" value={new Date(application.created_at).toLocaleString()} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</p>
              <p className="mt-1 text-sm text-neutral-700">{application.description}</p>
            </div>
            {application.why_needed && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Why Assistance Is Needed</p>
                <p className="mt-1 text-sm text-neutral-700">{application.why_needed}</p>
              </div>
            )}
            {application.how_helps && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">How Assistance Will Help</p>
                <p className="mt-1 text-sm text-neutral-700">{application.how_helps}</p>
              </div>
            )}
            {history.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Status Updates</p>
                <div className="mt-2 space-y-2">
                  {history.map((h) => (
                    <div key={h.id} className="flex items-start gap-3 text-sm">
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                      <div>
                        <span className="font-medium text-neutral-900">{STATUS_LABELS[h.status]}</span>
                        <span className="text-neutral-500"> — {new Date(h.created_at).toLocaleString()}</span>
                        {h.note && <p className="text-neutral-600">{h.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-neutral-400" />
      <span className="font-medium text-neutral-500">{label}:</span>
      <span className="text-neutral-700">{value}</span>
    </div>
  );
}

function ApplicationDetailModal({
  application,
  messages,
  onClose,
  onMessageSent,
}: {
  application: Application;
  messages: ApplicationMessage[];
  onClose: () => void;
  onMessageSent: () => void;
}) {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [localMessages, setLocalMessages] = useState<ApplicationMessage[]>(messages);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    const { data, error } = await supabase
      .from('application_messages')
      .insert({
        application_id: application.id,
        author_role: 'applicant',
        message: newMessage.trim(),
      })
      .select('*')
      .single();

    setSending(false);
    if (!error && data) {
      setLocalMessages([...localMessages, data as ApplicationMessage]);
      setNewMessage('');
      onMessageSent();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Application Messages</h2>
            <p className="text-xs text-neutral-500 font-mono">{application.reference_number ?? application.id.slice(0, 12)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {localMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-12 w-12 text-neutral-300" />
              <p className="mt-4 text-sm text-neutral-500">No messages yet. Send a message to the foundation team below.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {localMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.author_role === 'applicant' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.author_role === 'applicant'
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}>
                    <p className="text-xs font-semibold opacity-75 mb-1">
                      {msg.author_role === 'applicant' ? 'You' : 'Hope Foundation'}
                    </p>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.author_role === 'applicant' ? 'text-primary-200' : 'text-neutral-400'}`}>
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compose */}
        <div className="border-t border-neutral-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="input-field"
              placeholder="Type a message to the foundation..."
              disabled={sending}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {sending ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            Messages are typically responded to within 1-2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}
