import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  ShieldCheck,
  HandHeart,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from '../router';
import { SectionHeader, PageHeader } from '../components/ui';

const values = [
  {
    icon: Heart,
    title: 'Compassion',
    description:
      'We treat every person with dignity, empathy, and respect, recognizing the humanity in everyone we serve.',
  },
  {
    icon: ShieldCheck,
    title: 'Integrity',
    description:
      'We operate with full transparency. Every dollar is tracked, every decision is accountable, and every action is ethical.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We believe lasting change happens together. We partner with local organizations and volunteers to maximize impact.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description:
      'We hold ourselves to the highest standards in service delivery, governance, and stewardship of the trust placed in us.',
  },
];

const milestones = [
  { year: '2008', title: 'Foundation Established', description: 'Hope Charity Foundation was founded by a group of community leaders committed to fighting poverty.' },
  { year: '2012', title: '10,000 Families Served', description: 'Reached our first major milestone of helping 10,000 families across the region.' },
  { year: '2016', title: 'Education Scholarship Program', description: 'Launched our scholarship initiative, sending 500 students to college in the first year.' },
  { year: '2020', title: 'Emergency Relief Expansion', description: 'Expanded emergency relief operations in response to the global crisis, doubling our impact.' },
  { year: '2024', title: '$4.2M Distributed', description: 'Surpassed $4.2 million in direct aid distributed to families in need.' },
];

const team = [
  {
    name: 'Dr. Maria Chen',
    role: 'Executive Director',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Robert Johnson',
    role: 'Director of Programs',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Aisha Patel',
    role: 'Director of Development',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Michael Torres',
    role: 'Director of Finance',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="About Hope Charity Foundation"
        subtitle="For over fifteen years, we have been dedicated to providing compassionate assistance to individuals and families facing hardship."
      />

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
                healthcare, education, housing, and food — while treating every
                person with dignity and respect.
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

      {/* Values */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <SectionHeader
            eyebrow="Our Values"
            title="What guides us every day"
            subtitle="These core values shape every decision we make and every action we take."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100">
                  <v.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <SectionHeader
            eyebrow="Our Journey"
            title="Fifteen years of compassion in action"
          />
          <div className="mx-auto mt-12 max-w-3xl">
            <div className="relative space-y-8 before:absolute before:left-4 before:h-full before:w-0.5 before:bg-primary-200 sm:before:left-1/2">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-6 sm:w-1/2 ${
                    i % 2 === 0
                      ? 'sm:ml-auto sm:flex-row-reverse sm:pl-8 sm:text-right'
                      : 'sm:pr-8'
                  }`}
                >
                  <div className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-primary-600 shadow-md sm:left-auto sm:right-0 sm:-translate-x-full sm:translate-x-1/2 [&]:left-0">
                    <span className="text-[10px] font-bold text-white">{m.year.slice(2)}</span>
                  </div>
                  <div className="ml-12 card flex-1 p-5 sm:ml-0">
                    <span className="text-xs font-bold text-primary-600">{m.year}</span>
                    <h3 className="mt-1 text-base font-bold text-neutral-900">{m.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <SectionHeader
            eyebrow="Our Team"
            title="The people behind the mission"
            subtitle="A dedicated group of professionals and volunteers committed to making a difference."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="card group overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-lg font-bold text-neutral-900">{member.name}</h3>
                  <p className="text-sm text-primary-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                eyebrow="Transparency"
                title="Where your money goes"
                center={false}
              />
              <p className="mt-6 text-base leading-relaxed text-neutral-600">
                We are committed to full financial transparency. Our
                independently audited financial statements are available to all
                donors and the public.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { label: 'Direct Programs & Aid', value: 98, color: 'bg-primary-600' },
                  { label: 'Administration', value: 1, color: 'bg-accent-400' },
                  { label: 'Fundraising', value: 1, color: 'bg-neutral-400' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-neutral-700">{item.label}</span>
                      <span className="font-bold text-neutral-900">{item.value}%</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4 rounded-xl bg-primary-50 p-4">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-primary-600" />
                <p className="text-sm text-neutral-700">
                  <span className="font-semibold">Charity Navigator 4-Star Rating</span> —
                  recognized for accountability and transparency.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: TrendingUp, value: '$4.2M', label: 'Total Aid Distributed' },
                { icon: Users, value: '12,500+', label: 'Families Helped' },
                { icon: HandHeart, value: '500+', label: 'Active Volunteers' },
                { icon: Award, value: '15+', label: 'Years of Service' },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                    <stat.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="mt-4 text-2xl font-bold text-neutral-900">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-16">
        <div className="container-max px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-balance">Join us in making a difference</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100 text-balance">
            Whether you need assistance or want to help provide it, we welcome you to our community.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate('apply')} className="btn-accent">
              Apply for Assistance
            </button>
            <button
              onClick={() => navigate('donate')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition-all hover:-translate-y-0.5"
            >
              Donate Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
