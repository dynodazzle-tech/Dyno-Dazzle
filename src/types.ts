export interface EcosystemProduct {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  status: 'live' | 'coming-soon' | 'beta';
  badge?: string;
  highlights?: string[];
  subdomain: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  features: string[];
}

export interface WhyDynoDazzleItem {
  title: string;
  description: string;
  iconName: string;
}

export interface ProcessStep {
  step: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  consent: boolean;
  honeypot?: string; // Anti-spam field
}

export interface ContactApiResponse {
  success: boolean;
  message: string;
  enquiryId?: string;
  emailSent?: boolean;
  errors?: Record<string, string>;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  client: string;
  summary: string;
  description: string;
  features: string[];
  techStack: string[];
  metrics?: string;
  imageUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt?: string;
}

export interface EnquiryItem {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  emailSent: boolean;
  status: 'new' | 'reviewed' | 'contacted' | 'in_progress' | 'converted' | 'closed';
  ip?: string;
  adminNotes?: string;
  lastContactedAt?: string;
  replies?: Array<{
    sentAt: string;
    sentBy: string;
    subject: string;
    body: string;
  }>;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  workingHours: string;
  announcementBanner: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    instagram?: string;
    twitter?: string;
  };
}

