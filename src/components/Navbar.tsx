import { useState, useEffect } from 'react';
import { Heart, MoreVertical, X, LayoutDashboard, LogOut, User, Shield, MessageCircle } from 'lucide-react';
import { useRoute, useNavigate, type Route } from '../router';
import { useAuth } from '../context/AuthContext';
import { useSmartsupp } from '../hooks/useSmartsupp';

const navItems: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'About Us', route: 'about' },
  { label: 'Apply', route: 'apply' },
  { label: 'Tracker', route: 'tracker' },
  { label: 'Donate', route: 'donate' },
  { label: 'Contact', route: 'contact' },
];

export default function Navbar() {
  const route = useRoute();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();
  const { ready: chatReady, openChat } = useSmartsupp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  const handleLiveChat = () => {
    if (!chatReady) return;
    openChat();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 shadow-md backdrop-blur-sm'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="container-max flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => go('home')}
          className="flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-lg shadow-primary-600/30">
            <Heart className="h-5 w-5 text-white" fill="white" />
          </div>
          <div className="text-left">
            <span className="font-serif text-lg font-bold leading-none text-neutral-900">
              Hope
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-primary-600">
              Charity Foundation
            </span>
          </div>
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => go(item.route)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                route === item.route
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAdmin && (
            <button
              onClick={() => go('admin')}
              className="btn-ghost"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </button>
          )}
          <button
            onClick={handleLiveChat}
            disabled={!chatReady}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-white shadow-md transition-all ${
              chatReady
                ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg cursor-pointer'
                : 'bg-green-400 cursor-wait opacity-70'
            }`}
            title={chatReady ? 'Live Chat' : 'Loading chat...'}
          >
            <MessageCircle className="h-4 w-4" />
            LIVE CHAT
          </button>
          <button
            onClick={() => go('admin-login')}
            className="rounded-full border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors hover:border-primary-300 hover:text-primary-600"
            aria-label="Admin access"
            title="Admin Access"
          >
            <Shield className="h-4.5 w-4.5" />
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => go('tracker')}
                className="btn-ghost"
                title="My Applications"
              >
                <User className="h-4 w-4" />
                {profile?.full_name?.split(' ')[0] ?? 'Account'}
              </button>
              <button
                onClick={signOut}
                className="btn-ghost"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => go('auth')} className="btn-primary">
              Sign In
            </button>
          )}
          <button onClick={() => go('donate')} className="btn-accent">
            Donate Now
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={handleLiveChat}
            disabled={!chatReady}
            className={`flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-bold text-white shadow-md transition-all ${
              chatReady
                ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                : 'bg-green-400 cursor-wait opacity-70'
            }`
            title={chatReady ? 'Live Chat' : 'Loading chat...'}
          >
            <MessageCircle className="h-4 w-4" />
            LIVE CHAT
          </button>
          <button
            onClick={() => go('admin-login')}
            className="rounded-full border border-neutral-200 bg-white p-2 text-neutral-500 transition-colors hover:border-primary-300 hover:text-primary-600"
            aria-label="Admin access"
            title="Admin Access"
          >
            <Shield className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-neutral-700"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <MoreVertical className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => go(item.route)}
                className={`block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  route === item.route
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => go('admin')}
                className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Admin Dashboard
              </button>
            )}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileOpen(false);
                }}
                className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => go('auth')}
                className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-primary-700 hover:bg-primary-50"
              >
                Sign In / Sign Up
              </button>
            )}
            <button onClick={() => go('donate')} className="btn-accent w-full">
              Donate Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
