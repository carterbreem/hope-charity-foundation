import {
  Heart,
  HandHeart,
  Users,
  GraduationCap,
  Home as HomeIcon,
  Stethoscope,
  Zap,
  Wallet,
  ArrowRight,
  Quote,
  Star,
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  ClipboardCheck,
  Search,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Eye,
  UserCheck,
  Mail,
  MapPin,
} from 'lucide-react';
import { useNavigate } from '../router';
import { SectionHeader } from '../components/ui';
import { ASSISTANCE_CATEGORIES } from '../lib/supabase';

const categoryIcons = {
  medical_bills: Stethoscope,
  education: GraduationCap,
  housing: HomeIcon,
  emergency_relief: Zap,
  financial_hardship: Wallet,
  other_community: Heart,
};

const impactStats = [
  { icon: Users, value: '12,500+', label: 'Families Helped' },
  { icon: HandHeart, value: '$4.2M', label: 'Aid Distributed' },
  { icon: GraduationCap, value: '3,200', label: 'Scholarships Awarded' },
  { icon: Heart, value: '98%', label: 'Funds to Programs' },
];

const howItWorks = [
  {
    step: 1,
    icon: UserCheck,
    title: 'Create an Account',
    description: 'Sign up with your email and create a secure account to get started with your application.',
  },
  {
    step: 2,
    icon: FileText,
    title: 'Submit Your Application',
    description: 'Fill out the application form with your information and details about the assistance you need.',
  },
  {
    step: 3,
    icon: Search,
    title: 'Our Team Reviews',
    description: 'Our dedicated team carefully reviews each application and may reach out for additional information.',
  },
  {
    step: 4,
    icon: CheckCircle2,
    title: 'Receive Assistance',
    description: 'Once approved, we work with you to deliver the assistance you need as quickly as possible.',
  },
];

const eligibilityItems = [
  'You must be 18 years of age or older to apply',
  'You may apply from any country — applications are reviewed regardless of nationality or location',
  'You must demonstrate genuine financial need',
  'You must provide accurate and complete information',
  'You must have a valid email address for communication',
  'Applications are reviewed on a case-by-case basis',
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Medical Assistance Recipient',
    quote:
      'When my daughter needed emergency surgery, Hope Charity Foundation stepped in and covered what insurance could not. They gave us our lives back.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'James Rodriguez',
    role: 'Scholarship Awardee',
    quote:
      'Thanks to the education scholarship, I am now the first in my family to attend college. The foundation believed in me when I needed it most.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    name: 'Emily Thompson',
    role: 'Housing Aid Recipient',
    quote:
      'After losing my job, I was facing eviction. The housing assistance program kept a roof over my children\'s heads and gave me time to get back on my feet.',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-accent-200/20 blur-3xl" />
        </div>
        <div className="container-max relative px-4 py-20 sm:px-6 lg:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-1.5 text-xs font-semibold text-primary-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Compassion in Action Since 2008
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl text-balance">
                Together, we can build a{' '}
                <span className="text-primary-600">future full of hope</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600 text-balance">
                Hope Charity Foundation provides critical assistance to
                individuals and families facing hardship. From medical bills to
                education, housing, and emergency relief — we are here when it
                matters most.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => navigate('apply')} className="btn-primary">
                  <HandHeart className="h-4 w-4" />
                  Apply for Assistance
                </button>
                <button onClick={() => navigate('donate')} className="btn-accent">
                  <Heart className="h-4 w-4" />
                  Donate Now
                </button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://images.pexels.com/photos/${[1239291, 220453, 774909, 415829][i - 1]}/pexels-photo-${[1239291, 220453, 774909, 415829][i - 1]}.jpeg?auto=compress&cs=tinysrgb&w=40`}
                        alt=""
                        className="h-8 w-8 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="font-medium text-neutral-700">12,500+</span> families helped
                </div>
                <div className="hidden items-center gap-1 sm:flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-accent-400 text-accent-400" />
                  ))}
                  <span className="ml-1 font-medium text-neutral-700">4.9</span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-up [animation-delay:200ms]">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Volunteers helping community"
                  className="h-[480px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-5 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                    <TrendingUp className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-900">$4.2M</p>
                    <p className="text-xs text-neutral-500">Aid distributed</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 rounded-2xl bg-accent-500 px-5 py-3 text-white shadow-xl">
                <p className="text-xs font-medium opacity-90">98% to programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-primary-700 py-16">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                <Target className="h-7 w-7 text-primary-600" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-neutral-900">Our Mission</h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">
                To provide critical assistance and compassionate support to
                individuals and families in need, ensuring access to
                healthcare, education, housing, and financial stability —
                while treating every person with dignity and respect.
              </p>
            </div>
            <div className="card p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100">
                <Eye className="h-7 w-7 text-accent-600" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-neutral-900">Our Vision</h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-600">
                A world where no one faces hardship alone — where every
                individual has access to the resources they need to live with
                dignity, purpose, and hope for the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Assistance Categories */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <SectionHeader
            eyebrow="Our Programs"
            title="Six ways we help our community"
            subtitle="Our multi-purpose assistance program is designed to meet the most pressing needs of individuals and families across six categories of support."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ASSISTANCE_CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.value];
              return (
                <div key={cat.value} className="card group p-6 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 transition-colors group-hover:bg-primary-600">
                    <Icon className="h-7 w-7 text-primary-600 transition-colors group-hover:text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-neutral-900">{cat.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Assistance Works */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionHeader
            eyebrow="How It Works"
            title="How our assistance process works"
            subtitle="We have designed a straightforward, transparent process to ensure help reaches those who need it as quickly and efficiently as possible."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative card p-6">
                <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white shadow-md">
                  {step.step}
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
                  <step.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="mt-5 text-base font-bold text-neutral-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => navigate('apply')} className="btn-primary">
              <HandHeart className="h-4 w-4" />
              Start Your Application
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Eligibility Information */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Eligibility"
                title="Who is eligible for assistance?"
                center={false}
              />
              <p className="mt-6 text-sm leading-relaxed text-neutral-600">
                We strive to help as many individuals and families as possible,
                wherever they may be. Please review the following eligibility
                criteria before submitting your application. Applicants from
                any country are welcome to apply, subject to our review process.
              </p>
              <div className="mt-8 space-y-4">
                {eligibilityItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success-600" />
                    </div>
                    <p className="text-sm text-neutral-700">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-xl bg-accent-50 p-4">
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold text-accent-700">Please note:</span>{' '}
                  Meeting eligibility criteria does not guarantee assistance.
                  All applications are reviewed individually, and funding is
                  subject to availability.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="Community support"
                className="rounded-3xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-white p-5 shadow-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                    <ClipboardCheck className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-neutral-900">Case-by-Case</p>
                    <p className="text-xs text-neutral-500">Individual review</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionHeader
            eyebrow="Stories of Hope"
            title="Real lives, real impact"
            subtitle="Every number represents a person, a family, a story. Hear from some of the individuals whose lives have been changed by your generosity."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card flex flex-col p-6">
                <Quote className="h-8 w-8 text-primary-200" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-4">
                  <img src={t.image} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                    <p className="text-xs text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max max-w-4xl">
          <SectionHeader
            eyebrow="Your Privacy"
            title="How we protect your information"
            subtitle="We take your privacy seriously. Your personal information is handled with the utmost care and used only for evaluating your application."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <Lock className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900">Secure Storage</h3>
              <p className="mt-2 text-sm text-neutral-600">
                All application data is encrypted and stored securely using
                industry-standard security practices.
              </p>
            </div>
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <ShieldCheck className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900">Confidential Review</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Only authorized foundation staff review your application. Your
                information is never shared with third parties.
              </p>
            </div>
            <div className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <Eye className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-base font-bold text-neutral-900">You Are in Control</h3>
              <p className="mt-2 text-sm text-neutral-600">
                You can access, update, or request deletion of your information
                at any time by contacting our office.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-sm leading-relaxed text-neutral-600">
              <span className="font-semibold text-neutral-900">Privacy Commitment:</span>{' '}
              Hope Charity Foundation is committed to protecting your privacy.
              The information you provide in your application is used solely for
              the purpose of evaluating your request for assistance and
              communicating with you about your application. We do not sell,
              trade, or share your personal information with outside parties.
              All data is transmitted over encrypted connections and stored in
              compliance with applicable data protection regulations.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionHeader
            eyebrow="Contact Us"
            title="We are here to help"
            subtitle="Have questions about our programs or the application process? Reach out to us through any of these channels."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                <Mail className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="mt-5 text-base font-bold text-neutral-900">Email Us</h3>
              <p className="mt-2 text-sm text-neutral-600">hello@hopecharityfoundation.net</p>
              <p className="text-xs text-neutral-500">Replies within 24 hours</p>
            </div>
            <div className="card p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                <MapPin className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="mt-5 text-base font-bold text-neutral-900">Visit Us</h3>
              <p className="mt-2 text-sm text-neutral-600">United States</p>
            </div>
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => navigate('contact')} className="btn-outline">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary-700 py-20">
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary-600/50 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        </div>
        <div className="container-max relative px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl text-balance">
            Your support can change a life today
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100 text-balance">
            Whether you need assistance or want to help provide it, there is a
            place for you in our community of hope.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate('apply')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <HandHeart className="h-4 w-4" />
              Apply for Assistance
            </button>
            <button
              onClick={() => navigate('donate')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-accent-600 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Heart className="h-4 w-4" />
              Donate Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
