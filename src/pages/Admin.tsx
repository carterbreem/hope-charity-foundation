import { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Inbox,
  Heart,
  Send,
  Trash2,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  DollarSign as DollarIcon,
  Calendar,
  Search,
  CreditCard,
} from 'lucide-react';
import { useNavigate } from '../router';
import { useAuth } from '../context/AuthContext';
import {
  supabase,
  type Application,
  type Donation,
  type ContactMessage,
  type ApplicationStatus,
  type StatusHistoryEntry,
  type ApplicationMessage,
  ASSISTANCE_CATEGORIES,
  STATUS_LABELS,
} from '../lib/supabase';
import { PageHeader, StatusBadge, Spinner, EmptyState, ErrorBanner } from '../components/ui';

type Tab = 'overview' | 'applications' | 'donations' | 'messages';

const ALL_STATUSES: ApplicationStatus[] = [
  'submitted',
  'under_review',
  'approved',
  'completed',
  'declined',
];

export default function Admin() {
  const { user, profile, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [applications, setApplications] = useState<Application[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [appMessages, setAppMessages] = useState<ApplicationMessage[]>([]);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  const [statusNote, setStatusNote] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [updating, setUpdating] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [donationStatus, setDonationStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [updatingDonation, setUpdatingDonation] = useState(false);

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.applicant_name.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      (app.reference_number ?? '').toLowerCase().includes(q) ||
      (app.country ?? '').toLowerCase().includes(q) ||
      (app.assistance_type ?? '').toLowerCase().includes(q) ||
      app.status.toLowerCase().includes(q)
    );
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [appsRes, donsRes, msgsRes] = await Promise.all([
      supabase.from('applications').select('*').order('created_at', { ascending: false }),
      supabase.from('donations').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
    ]);

    if (appsRes.error || donsRes.error || msgsRes.error) {
      setError(
        appsRes.error?.message || donsRes.error?.message || msgsRes.error?.message || 'Failed to load data',
      );
      setLoading(false);
      return;
    }

    setApplications((appsRes.data ?? []) as Application[]);
    setDonations((donsRes.data ?? []) as Donation[]);
    setMessages((msgsRes.data ?? []) as ContactMessage[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    loadData();
  }, [user, isAdmin, authLoading, loadData]);

  const openApplication = async (app: Application) => {
    setSelectedApp(app);
    setNewStatus(app.status === 'submitted' ? 'under_review' : app.status);
    setStatusNote('');
    setAdminMessage('');
    const [histRes, msgRes] = await Promise.all([
      supabase
        .from('application_status_history')
        .select('*')
        .eq('application_id', app.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('application_messages')
        .select('*')
        .eq('application_id', app.id)
        .order('created_at', { ascending: true }),
    ]);
    setHistory((histRes.data as StatusHistoryEntry[]) ?? []);
    setAppMessages((msgRes.data as ApplicationMessage[]) ?? []);
  };

  const updateStatus = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', selectedApp.id);

    if (updateError) {
      setUpdating(false);
      return;
    }

    await supabase.from('application_status_history').insert({
      application_id: selectedApp.id,
      status: newStatus,
      note: statusNote || null,
    });

    setApplications((prev) =>
      prev.map((a) => (a.id === selectedApp.id ? { ...a, status: newStatus } : a)),
    );
    setSelectedApp({ ...selectedApp, status: newStatus });
    setUpdating(false);
    setStatusNote('');
  };

  const sendAdminMessage = async () => {
    if (!selectedApp || !adminMessage.trim()) return;
    setSendingMsg(true);
    const { data, error: msgError } = await supabase
      .from('application_messages')
      .insert({
        application_id: selectedApp.id,
        author_role: 'admin',
        message: adminMessage.trim(),
      })
      .select('*')
      .single();

    setSendingMsg(false);
    if (!msgError && data) {
      setAppMessages([...appMessages, data as ApplicationMessage]);
      setAdminMessage('');
    }
  };

  const markMessageRead = async (msg: ContactMessage) => {
    await supabase.from('contact_messages').update({ status: 'read' }).eq('id', msg.id);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m)),
    );
  };

  const handleDelete = async () => {
    if (!selectedApp) return;
    setDeleting(true);
    const { error: deleteError } = await supabase
      .from('applications')
      .delete()
      .eq('id', selectedApp.id);

    setDeleting(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id));
    setSelectedApp(null);
    setShowDeleteConfirm(false);
  };

  const openDonation = (don: Donation) => {
    setSelectedDonation(don);
    setDonationStatus(don.status);
  };

  const updateDonationStatus = async () => {
    if (!selectedDonation) return;
    setUpdatingDonation(true);
    const { error: updateError } = await supabase
      .from('donations')
      .update({ status: donationStatus })
      .eq('id', selectedDonation.id);

    setUpdatingDonation(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDonations((prev) =>
      prev.map((d) => (d.id === selectedDonation.id ? { ...d, status: donationStatus } : d)),
    );
    setSelectedDonation({ ...selectedDonation, status: donationStatus });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 pt-16">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div>
        <PageHeader title="Admin Dashboard" />
        <section className="section-padding bg-white">
          <div className="container-max max-w-2xl">
            <div className="card p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-error-100">
                <XCircle className="h-8 w-8 text-error-600" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-neutral-900">
                Admin Access Required
              </h2>
              <p className="mt-3 text-sm text-neutral-600">
                You need an admin account to access this dashboard. If you
                believe you should have access, please contact the foundation
                administrator.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button onClick={() => navigate('auth')} className="btn-primary">
                  Sign In
                </button>
                <button onClick={() => navigate('home')} className="btn-ghost">
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const pendingApps = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'under_review',
  ).length;
  const totalDonated = donations
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => sum + d.amount, 0);
  const newMessages = messages.filter((m) => m.status === 'new').length;

  const tabs: { id: Tab; label: string; icon: typeof FileText; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileText, badge: pendingApps },
    { id: 'donations', label: 'Donations', icon: DollarSign },
    { id: 'messages', label: 'Messages', icon: Mail, badge: newMessages },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Welcome back, ${profile?.full_name ?? 'Admin'}. Manage applications, review applicant information, update statuses, and communicate with applicants.`}
      />

      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

          {/* Tabs */}
          <div className="mb-8 flex gap-2 overflow-x-auto border-b border-neutral-200">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.badge ? (
                  <span className="ml-1 rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          {/* Overview */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={FileText} label="Total Applications" value={applications.length} color="primary" />
                <StatCard icon={Clock} label="Pending Review" value={pendingApps} color="accent" />
                <StatCard icon={DollarSign} label="Total Donations" value={`$${totalDonated.toLocaleString()}`} color="success" />
                <StatCard icon={Mail} label="New Messages" value={newMessages} color="error" />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="card p-6">
                  <h3 className="text-base font-bold text-neutral-900">Recent Applications</h3>
                  <div className="mt-4 space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{app.applicant_name}</p>
                          <p className="text-xs text-neutral-500">
                            {ASSISTANCE_CATEGORIES.find((c) => c.value === app.assistance_type)?.shortLabel ?? app.assistance_type} · ${app.amount_requested.toLocaleString()}
                          </p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="py-4 text-center text-sm text-neutral-400">No applications yet</p>
                    )}
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-base font-bold text-neutral-900">Recent Donations</h3>
                  <div className="mt-4 space-y-3">
                    {donations.slice(0, 5).map((don) => (
                      <div key={don.id} className="flex items-center justify-between rounded-lg border border-neutral-100 p-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{don.donor_name}</p>
                          <p className="text-xs text-neutral-500">{new Date(don.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm font-bold text-primary-700">${don.amount.toLocaleString()}</p>
                      </div>
                    ))}
                    {donations.length === 0 && (
                      <p className="py-4 text-center text-sm text-neutral-400">No donations yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications */}
          {tab === 'applications' && (
            <div>
              {applications.length === 0 ? (
                <EmptyState icon={<FileText className="h-12 w-12" />} title="No applications" description="Applications submitted by applicants will appear here." />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  {/* Search bar */}
                  <div className="border-b border-neutral-100 p-4">
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-10"
                        placeholder="Search by name, email, reference, country, status..."
                      />
                    </div>
                  </div>
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Applicant</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Category</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Date</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-sm text-neutral-500">
                            No applications match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-neutral-900">{app.applicant_name}</p>
                            <p className="text-xs text-neutral-500">{app.email}</p>
                          </td>
                          <td className="hidden px-4 py-3 text-sm text-neutral-600 sm:table-cell">
                            {ASSISTANCE_CATEGORIES.find((c) => c.value === app.assistance_type)?.shortLabel ?? app.assistance_type}
                          </td>
                          <td className="hidden px-4 py-3 text-sm font-medium text-neutral-900 sm:table-cell">${app.amount_requested.toLocaleString()}</td>
                          <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                          <td className="hidden px-4 py-3 text-sm text-neutral-500 sm:table-cell">{new Date(app.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => openApplication(app)} className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Donations */}
          {tab === 'donations' && (
            <div>
              {donations.length === 0 ? (
                <EmptyState icon={<Heart className="h-12 w-12" />} title="No donations" description="Donations will appear here once donors submit them." />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Donor</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Payment Method</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Status</th>
                        <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 sm:table-cell">Date</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {donations.map((don) => (
                        <tr key={don.id} className="hover:bg-neutral-50">
                          <td className="px-4 py-3 text-sm font-medium text-neutral-900">{don.donor_name}</td>
                          <td className="hidden px-4 py-3 text-sm text-neutral-500 sm:table-cell">{don.email}</td>
                          <td className="px-4 py-3 text-sm font-bold text-primary-700">${don.amount.toLocaleString()}</td>
                          <td className="hidden px-4 py-3 text-sm text-neutral-600 sm:table-cell">
                            {don.provider ? don.provider.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'N/A'}
                          </td>
                          <td className="hidden px-4 py-3 sm:table-cell">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                              don.status === 'completed' ? 'bg-success-100 text-success-700' :
                              don.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                              'bg-error-100 text-error-700'
                            }`}>{don.status}</span>
                          </td>
                          <td className="hidden px-4 py-3 text-sm text-neutral-500 sm:table-cell">{new Date(don.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => openDonation(don)} className="rounded-lg p-1.5 text-primary-600 hover:bg-primary-50">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {tab === 'messages' && (
            <div>
              {messages.length === 0 ? (
                <EmptyState icon={<Inbox className="h-12 w-12" />} title="No messages" description="Contact form submissions will appear here." />
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-neutral-900">{msg.subject}</h3>
                            {msg.status === 'new' && (
                              <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">NEW</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">
                            From {msg.name} · {msg.email} · {new Date(msg.created_at).toLocaleString()}
                          </p>
                          <p className="mt-3 text-sm text-neutral-700">{msg.message}</p>
                        </div>
                        {msg.status === 'new' && (
                          <button
                            onClick={() => markMessageRead(msg)}
                            className="shrink-0 rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Application detail modal */}
      {selectedApp && (
        <ApplicationDetailModal
          application={selectedApp}
          history={history}
          messages={appMessages}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          statusNote={statusNote}
          setStatusNote={setStatusNote}
          adminMessage={adminMessage}
          setAdminMessage={setAdminMessage}
          updating={updating}
          sendingMsg={sendingMsg}
          onUpdateStatus={updateStatus}
          onSendMessage={sendAdminMessage}
          onClose={() => setSelectedApp(null)}
          onDelete={() => setShowDeleteConfirm(true)}
        />
      )}

      {/* Donation detail modal */}
      {selectedDonation && (
        <DonationDetailModal
          donation={selectedDonation}
          donationStatus={donationStatus}
          setDonationStatus={setDonationStatus}
          updating={updatingDonation}
          onUpdate={updateDonationStatus}
          onClose={() => setSelectedDonation(null)}
        />
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && selectedApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={() => !deleting && setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error-100">
                <AlertTriangle className="h-7 w-7 text-error-600" />
              </div>
              <h3 className="mt-5 text-center text-lg font-bold text-neutral-900">
                Delete Application?
              </h3>
              <p className="mt-3 text-center text-sm text-neutral-600">
                Are you sure you want to permanently delete this application? This action cannot be undone.
              </p>
              <p className="mt-2 text-center text-xs text-neutral-500">
                Reference: <span className="font-mono font-semibold">{selectedApp.reference_number ?? selectedApp.id.slice(0, 12)}</span>
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="btn-ghost flex-1 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-error-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <Spinner className="h-4 w-4 border-white/30 border-t-white" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof FileText;
  label: string;
  value: string | number;
  color: 'primary' | 'accent' | 'success' | 'error';
}) {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    accent: 'bg-accent-100 text-accent-600',
    success: 'bg-success-100 text-success-600',
    error: 'bg-error-100 text-error-600',
  };
  return (
    <div className="card p-5">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function ApplicationDetailModal({
  application,
  history,
  messages,
  newStatus,
  setNewStatus,
  statusNote,
  setStatusNote,
  adminMessage,
  setAdminMessage,
  updating,
  sendingMsg,
  onUpdateStatus,
  onSendMessage,
  onClose,
  onDelete,
}: {
  application: Application;
  history: StatusHistoryEntry[];
  messages: ApplicationMessage[];
  newStatus: ApplicationStatus;
  setNewStatus: (s: ApplicationStatus) => void;
  statusNote: string;
  setStatusNote: (s: string) => void;
  adminMessage: string;
  setAdminMessage: (s: string) => void;
  updating: boolean;
  sendingMsg: boolean;
  onUpdateStatus: () => void;
  onSendMessage: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const category = ASSISTANCE_CATEGORIES.find((c) => c.value === application.assistance_type);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Application Details</h2>
            <p className="text-xs text-neutral-500 font-mono">{application.reference_number ?? application.id.slice(0, 12)}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Applicant info */}
          <div className="border-b border-neutral-100 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Applicant Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem icon={User} label="Name" value={application.applicant_name} />
              <DetailItem icon={Mail} label="Email" value={application.email} />
              <DetailItem icon={Phone} label="Phone" value={application.phone ?? 'N/A'} />
              <DetailItem icon={MapPin} label="Street Address" value={application.address ?? 'N/A'} />
              <DetailItem icon={MapPin} label="City" value={application.city ?? 'N/A'} />
              <DetailItem icon={MapPin} label="State/Province/Region" value={application.region ?? 'N/A'} />
              <DetailItem icon={MapPin} label="Postal/ZIP Code" value={application.postal_code ?? 'N/A'} />
              <DetailItem icon={MapPin} label="Country" value={application.country ?? 'N/A'} />
              <DetailItem icon={Calendar} label="Submitted" value={new Date(application.created_at).toLocaleString()} />
            </div>
          </div>

          {/* Assistance details */}
          <div className="border-b border-neutral-100 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Assistance Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem icon={FileText} label="Category" value={category?.label ?? application.assistance_type} />
              <DetailItem icon={DollarIcon} label="Amount Requested" value={`$${application.amount_requested.toLocaleString()}`} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Description of Situation</p>
              <p className="mt-1 text-sm text-neutral-700">{application.description}</p>
            </div>
            {application.why_needed && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Why Assistance Is Needed</p>
                <p className="mt-1 text-sm text-neutral-700">{application.why_needed}</p>
              </div>
            )}
            {application.how_helps && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">How Assistance Will Help</p>
                <p className="mt-1 text-sm text-neutral-700">{application.how_helps}</p>
              </div>
            )}
          </div>

          {/* Status history */}
          {history.length > 0 && (
            <div className="border-b border-neutral-100 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Status History</h3>
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                    <div>
                      <span className="font-medium text-neutral-900">{STATUS_LABELS[h.status]}</span>
                      <span className="text-neutral-500"> — {new Date(h.created_at).toLocaleString()}</span>
                      {h.note && <p className="mt-0.5 text-neutral-600">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="border-b border-neutral-100 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Messages</h3>
            {messages.length === 0 ? (
              <p className="text-sm text-neutral-400">No messages yet. Send a message to the applicant below.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.author_role === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.author_role === 'admin'
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      <p className="text-xs font-semibold opacity-75 mb-1">
                        {msg.author_role === 'admin' ? 'Foundation' : 'Applicant'}
                      </p>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.author_role === 'admin' ? 'text-primary-200' : 'text-neutral-400'}`}>
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={adminMessage}
                onChange={(e) => setAdminMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                className="input-field"
                placeholder="Send a message to the applicant..."
                disabled={sendingMsg}
              />
              <button onClick={onSendMessage} disabled={sendingMsg || !adminMessage.trim()} className="btn-primary disabled:opacity-50">
                {sendingMsg ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Update status */}
          <div className="p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Update Application Status</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                    newStatus === s
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="input-field mt-3"
              placeholder="Optional note visible to applicant..."
            />
            <button
              onClick={onUpdateStatus}
              disabled={updating || newStatus === application.status}
              className="btn-primary mt-3 disabled:opacity-50"
            >
              {updating ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : 'Update Status'}
            </button>
          </div>

          {/* Delete application */}
          <div className="border-t border-neutral-100 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-error-600 mb-4">Danger Zone</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Permanently delete this application and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 rounded-lg border border-error-300 bg-error-50 px-4 py-2.5 text-sm font-semibold text-error-700 transition-colors hover:bg-error-100"
            >
              <Trash2 className="h-4 w-4" />
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonationDetailModal({
  donation,
  donationStatus,
  setDonationStatus,
  updating,
  onUpdate,
  onClose,
}: {
  donation: Donation;
  donationStatus: 'pending' | 'completed' | 'failed';
  setDonationStatus: (s: 'pending' | 'completed' | 'failed') => void;
  updating: boolean;
  onUpdate: () => void;
  onClose: () => void;
}) {
  const paymentMethodLabel = donation.provider
    ? donation.provider.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'N/A';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Donation Details</h2>
            <p className="text-xs text-neutral-500">Donor information and payment status</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Donor Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem icon={User} label="Full Name" value={donation.donor_name} />
            <DetailItem icon={Phone} label="Phone Number" value={donation.phone ?? 'N/A'} />
            <DetailItem icon={Mail} label="Email Address" value={donation.email} />
            <DetailItem icon={DollarIcon} label="Donation Amount" value={`${donation.amount.toLocaleString()}`} />
            <DetailItem icon={CreditCard} label="Payment Method" value={paymentMethodLabel} />
            <DetailItem icon={Calendar} label="Donation Date & Time" value={new Date(donation.created_at).toLocaleString()} />
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Donation Status</p>
                <span className={`mt-0.5 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                  donation.status === 'completed' ? 'bg-success-100 text-success-700' :
                  donation.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                  'bg-error-100 text-error-700'
                }`}>{donation.status}</span>
              </div>
            </div>
          </div>

          {donation.message && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">Donor Message</p>
              <p className="rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">{donation.message}</p>
            </div>
          )}

          <div className="mt-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">Payment Information to Forward to Donor</p>
            <div className="space-y-1 text-sm text-neutral-700">
              <p><span className="font-medium">Payment Method:</span> {paymentMethodLabel}</p>
              <p><span className="font-medium">Donor Email:</span> {donation.email}</p>
              <p><span className="font-medium">Amount:</span> ${donation.amount.toLocaleString()}</p>
            </div>
            <a
              href={`mailto:${donation.email}?subject=Donation Payment Instructions - Hope Charity Foundation&body=Dear ${donation.donor_name},%0D%0A%0D%0AThank you for your donation of ${donation.amount.toLocaleString()} via ${paymentMethodLabel}.%0D%0A%0D%0APlease find the payment instructions below.%0D%0A%0D%0ABest regards,%0D%0AHope Charity Foundation`}
              className="btn-primary mt-4 inline-flex"
            >
              <Mail className="h-4 w-4" />
              Email Payment Details to Donor
            </a>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Update Donation Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['pending', 'completed', 'failed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setDonationStatus(s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    donationStatus === s
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={onUpdate}
              disabled={updating || donationStatus === donation.status}
              className="btn-primary mt-3 disabled:opacity-50"
            >
              {updating ? <Spinner className="h-4 w-4 border-white/30 border-t-white" /> : 'Save Status'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  cap,
}: {
  icon: typeof User;
  label: string;
  value: string;
  cap?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-neutral-400" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{label}</p>
        <p className={`text-sm text-neutral-900 ${cap ? 'capitalize' : ''}`}>{value}</p>
      </div>
    </div>
  );
}
