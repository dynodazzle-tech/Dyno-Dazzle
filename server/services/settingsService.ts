import fs from 'fs';
import path from 'path';
import { getDataDir } from '../utils/dataDir';

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
  updatedAt?: string;
}

function getSettingsFile(): string {
  const dir = getDataDir();
  return path.join(dir, 'siteSettings.json');
}

const DEFAULT_SETTINGS: SiteSettings = {
  companyName: 'DynoDazzle',
  tagline: 'Technology That Makes Your Business Move',
  email: 'dynodazzle@gmail.com',
  phone: '+91 7770032149',
  whatsapp: '+91 7770032149',
  address: 'India',
  workingHours: 'Mon – Sat: 9:00 AM – 7:00 PM IST',
  announcementBanner: {
    enabled: true,
    text: '🚀 Now accepting enterprise AI workflow & web development projects for Q3/Q4. Schedule a discovery session.',
    linkUrl: '#contact',
  },
  socialLinks: {
    linkedin: 'https://linkedin.com/company/dynodazzle',
    instagram: 'https://instagram.com/dynodazzle',
    github: 'https://github.com/dynodazzle',
  },
  updatedAt: new Date().toISOString(),
};

function ensureStorage(): void {
  const settingsFile = getSettingsFile();
  if (!fs.existsSync(settingsFile)) {
    try {
      fs.writeFileSync(settingsFile, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[SettingsService] Failed to write default settings:', e);
    }
  }
}

export function getSiteSettings(): SiteSettings {
  ensureStorage();
  try {
    const raw = fs.readFileSync(getSettingsFile(), 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    console.error('[SettingsService] Error reading settings:', err);
    return DEFAULT_SETTINGS;
  }
}

export function updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
  ensureStorage();
  const current = getSiteSettings();
  const updated: SiteSettings = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(getSettingsFile(), JSON.stringify(updated, null, 2), 'utf-8');
  console.log('[SettingsService] Updated site settings');
  return updated;
}
