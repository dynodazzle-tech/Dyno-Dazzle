import { EcosystemProduct } from '../types';
import { SITE_CONFIG } from './site';

export const ECOSYSTEM_PRODUCTS: EcosystemProduct[] = [
  {
    id: "techclass",
    name: "TechClass",
    type: "Education Platform",
    subdomain: "techclass.dynodazzle.in",
    url: SITE_CONFIG.techClassUrl,
    status: "live",
    badge: "Active Platform",
    description:
      "TechClass is an education platform under the DynoDazzle ecosystem, designed to help students prepare through test papers, PDFs, mock tests, practice material and digital learning resources.",
    highlights: [
      "Test papers & previous-year papers",
      "Curated PDF study material & notes",
      "Full-length mock tests & timed practice",
      "Accessible digital study resources",
    ],
  },
  {
    id: "labs",
    name: "DynoDazzle Labs",
    type: "R&D & Innovation",
    subdomain: "labs.dynodazzle.in",
    url: "https://labs.dynodazzle.in",
    status: "coming-soon",
    badge: "Coming Soon",
    description:
      "Experimental digital projects, open-source utilities, and emerging technology prototypes developed in the DynoDazzle sandbox.",
    highlights: [
      "AI & machine learning experiments",
      "Next-generation UI frameworks",
      "Open-source developer toolkits",
    ],
  },
  {
    id: "apps",
    name: "DynoDazzle Apps",
    type: "Digital Applications & Tools",
    subdomain: "apps.dynodazzle.in",
    url: "https://apps.dynodazzle.in",
    status: "coming-soon",
    badge: "Coming Soon",
    description:
      "Cloud-native micro-applications and productivity tools crafted to streamline everyday operational bottlenecks for fast-moving businesses.",
    highlights: [
      "SME productivity apps",
      "Customer workflow portals",
      "Instant business utility software",
    ],
  },
  {
    id: "academy",
    name: "DynoDazzle Academy",
    type: "Learning & Professional Development",
    subdomain: "academy.dynodazzle.in",
    url: "https://academy.dynodazzle.in",
    status: "coming-soon",
    badge: "Coming Soon",
    description:
      "Practical vocational technology training, digital skill mastery, and industry-oriented tech development programs.",
    highlights: [
      "Real-world project training",
      "Full-stack web & app skills",
      "Modern digital marketing masterclasses",
    ],
  },
];
