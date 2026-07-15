import {
  Heart,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
} from 'lucide-react';
import { useNavigate, type Route } from '../router';

const footerLinks: { label: string; route: Route }[] = [
  { label: 'Home', route: 'home' },
  { label: 'About Us', route: 'about' },
  { label: 'Apply for Assistance', route: 'apply' },
  { label: 'Application Tracker', route: 'tracker' },
  { label: 'Donate', route: 'donate' },
  { label: 'Contact Us', route: 'contact' },
];

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-max px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
                <Heart className="h-5 w-5 text-white" fill="white" />
              </div>
              <span className="font-serif text-lg font-bold text-white">
                Hope Charity Foundation
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              Providing compassionate assistance to individuals and families in
              need. Together, we can build a future full of hope.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-400 transition-all hover:bg-primary-600 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.route}>
                  <button
                    onClick={() => navigate(link.route)}
                    className="group flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-primary-400"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <span>United States</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary-500" />
                <a
                  href="mailto:hello@hopecharityfoundation.net"
                  className="transition-colors hover:text-primary-400"
                >
                  hello@hopecharityfoundation.net
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Office Hours
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>9:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-neutral-500">Emergency Only</span>
              </li>
            </ul>
            <div className="mt-6 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
              <p className="text-xs leading-relaxed text-neutral-400">
                <span className="font-semibold text-primary-400">Tax ID:</span>{' '}
                12-3456789 — Donations are tax-deductible to the fullest extent
                allowed by law.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Hope Charity Foundation. All rights
            reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300">
              Privacy Policy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300">
              Terms of Service
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-neutral-300">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
