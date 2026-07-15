import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'completed'
  | 'declined';

export type AssistanceType =
  | 'medical_bills'
  | 'education'
  | 'housing'
  | 'emergency_relief'
  | 'financial_hardship'
  | 'other_community';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'applicant' | 'admin';
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  applicant_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  region: string | null;
  postal_code: string | null;
  country: string | null;
  assistance_type: AssistanceType;
  amount_requested: number;
  description: string;
  why_needed: string | null;
  how_helps: string | null;
  reference_number: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryEntry {
  id: string;
  application_id: string;
  status: ApplicationStatus;
  note: string | null;
  created_at: string;
}

export interface ApplicationMessage {
  id: string;
  application_id: string;
  author_role: 'admin' | 'applicant';
  author_id: string | null;
  message: string;
  read_by_applicant: boolean;
  read_by_admin: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  email: string;
  phone: string | null;
  amount: number;
  message: string | null;
  status: 'pending' | 'completed' | 'failed';
  provider: string | null;
  provider_payment_id: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export const ASSISTANCE_CATEGORIES: {
  value: AssistanceType;
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    value: 'medical_bills',
    label: 'Medical Bills Assistance',
    shortLabel: 'Medical Bills',
    description:
      'Help with medical bills, prescription costs, and essential healthcare for those without coverage.',
  },
  {
    value: 'education',
    label: 'Education Assistance',
    shortLabel: 'Education',
    description:
      'Scholarships, school supplies, and tuition assistance for students pursuing their dreams.',
  },
  {
    value: 'housing',
    label: 'Housing Assistance',
    shortLabel: 'Housing',
    description:
      'Rental assistance, emergency shelter, and housing stability programs for families in crisis.',
  },
  {
    value: 'emergency_relief',
    label: 'Emergency Relief',
    shortLabel: 'Emergency Relief',
    description:
      'Rapid response assistance for families affected by natural disasters, fires, or sudden hardship.',
  },
  {
    value: 'financial_hardship',
    label: 'Financial Hardship Assistance',
    shortLabel: 'Financial Hardship',
    description:
      'Support for individuals and families facing job loss, unexpected expenses, or financial crisis.',
  },
  {
    value: 'other_community',
    label: 'Other Community Support',
    shortLabel: 'Other Support',
    description:
      'Other forms of community support including utilities, transportation, and essential needs.',
  },
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  completed: 'Completed',
  declined: 'Declined',
};

export const COUNTRIES: string[] = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas',
  'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil',
  'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China',
  'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
  'Czechia', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea',
  'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
  'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
  'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands',
  'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco',
  'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
  'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
  'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
  'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
  'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain',
  'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];
