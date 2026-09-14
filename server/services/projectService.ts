import fs from 'fs';
import path from 'path';
import { getDataDir } from '../utils/dataDir';

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

function getProjectsFile(): string {
  const dir = getDataDir();
  return path.join(dir, 'projects.json');
}

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'dyno-ai-copilot',
    title: 'Enterprise AI Workflow Orchestrator',
    category: 'AI Solutions & Automation',
    client: 'Global Logistics Corp',
    summary: 'Automated multi-modal document intelligence and dispatch routing engine saving 35+ operator hours weekly.',
    description: 'Engineered an end-to-end AI workflow that processes shipment bills of lading, extracts structured inventory manifests, and auto-notifies customs agents with 99.4% accuracy.',
    features: [
      'Multi-modal document parsing & OCR validation',
      'Real-time automated status alerts via WhatsApp & Email',
      'Human-in-the-loop exception dashboard',
      'Sub-second query response with semantic vector search',
    ],
    techStack: ['TypeScript', 'Gemini AI', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    metrics: '35+ hrs saved/wk &bull; 99.4% Extraction Precision',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://dynodazzle.in',
    featured: true,
    order: 1,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'techclass-hub',
    title: 'TechClass & Skill Accelerator Platform',
    category: 'Web Platforms & Education',
    client: 'DynoDazzle Ecosystem',
    summary: 'High-speed interactive learning portal with curriculum tracking, live code previews, and student progress telemetry.',
    description: 'Designed and deployed an ultra-responsive training platform serving technical students across web development, AI engineering, and automation tracks with instant certificate issuance.',
    features: [
      'Interactive modules with progress persistence',
      'Integrated playground & code snippet sandboxes',
      'Automated student onboarding & payment verifications',
      'Sub-800ms page load speeds across all mobile viewports',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Cloud Run'],
    metrics: '99.8% Student Satisfaction &bull; <0.8s Load Speed',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://techclass.dynodazzle.in',
    featured: true,
    order: 2,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'omni-channel-growth',
    title: 'Omnichannel B2B Growth Engine',
    category: 'Digital Marketing & Funnels',
    client: 'Vertex FinTech Solutions',
    summary: 'High-conversion acquisition funnel and automated CRM integration generating 4.2x qualified inbound pipelines.',
    description: 'Architected high-velocity landing funnels paired with hyper-targeted social ad campaigns and dynamic CRM routing, turning cold visitors into booked consultation calls.',
    features: [
      'High-converting landing page architecture',
      'Automated instant WhatsApp lead handoff',
      'Granular UTM attribution & campaign telemetry',
      'Smart follow-up automated email drips',
    ],
    techStack: ['SEO Architecture', 'Next-gen Analytics', 'Meta Ads', 'CRM Pipelines'],
    metrics: '4.2x Inbound Leads &bull; 38% Form Completion Rate',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://dynodazzle.in',
    featured: true,
    order: 3,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cloud-fleet-mobile',
    title: 'Field Service & Fleet Mobile Suite',
    category: 'Mobile & App Development',
    client: 'SwiftTrans Logistics',
    summary: 'Cross-platform mobile application with offline task logging, GPS geofencing, and digital signatures.',
    description: 'Built a resilient Android & iOS mobile app designed for field technicians working in intermittent connectivity environments, enabling instant receipt signing and auto-sync when online.',
    features: [
      'Offline-first SQLite local caching',
      'Instant push alerts for emergency job dispatches',
      'One-tap customer calling and WhatsApp navigation',
      'Camera document scanning with instant compression',
    ],
    techStack: ['React Native / PWA', 'Node.js', 'Express', 'SQLite', 'WebSockets'],
    metrics: '100% Offline Resilience &bull; 15,000+ Completed Dispatches',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://dynodazzle.in',
    featured: true,
    order: 4,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

function ensureStorage(): void {
  const projectsFile = getProjectsFile();
  if (!fs.existsSync(projectsFile)) {
    try {
      fs.writeFileSync(projectsFile, JSON.stringify(DEFAULT_PROJECTS, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[ProjectService] Failed to write initial projects:', e);
    }
  }
}

export function getAllProjects(includeDrafts = false): ProjectItem[] {
  ensureStorage();
  try {
    const projectsFile = getProjectsFile();
    const raw = fs.readFileSync(projectsFile, 'utf-8');
    const items: ProjectItem[] = JSON.parse(raw || '[]');
    const filtered = includeDrafts ? items : items.filter((p) => p.status === 'active');
    return filtered.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error('[ProjectService] Error reading projects:', err);
    return DEFAULT_PROJECTS;
  }
}

export function getProjectById(id: string): ProjectItem | null {
  const all = getAllProjects(true);
  return all.find((p) => p.id === id) || null;
}

export function createProject(item: Omit<ProjectItem, 'id' | 'createdAt'>): ProjectItem {
  ensureStorage();
  const all = getAllProjects(true);
  const id = `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const newProject: ProjectItem = {
    ...item,
    id,
    createdAt: new Date().toISOString(),
  };

  all.push(newProject);
  fs.writeFileSync(getProjectsFile(), JSON.stringify(all, null, 2), 'utf-8');
  console.log(`[ProjectService] Created new project ${id}: "${newProject.title}"`);
  return newProject;
}

export function updateProject(id: string, updates: Partial<ProjectItem>): ProjectItem | null {
  ensureStorage();
  const all = getAllProjects(true);
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(getProjectsFile(), JSON.stringify(all, null, 2), 'utf-8');
  console.log(`[ProjectService] Updated project ${id}`);
  return all[index];
}

export function deleteProject(id: string): boolean {
  ensureStorage();
  const all = getAllProjects(true);
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) return false;

  fs.writeFileSync(getProjectsFile(), JSON.stringify(filtered, null, 2), 'utf-8');
  console.log(`[ProjectService] Deleted project ${id}`);
  return true;
}
