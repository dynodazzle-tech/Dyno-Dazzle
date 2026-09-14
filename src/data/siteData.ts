import { ServiceItem, WhyDynoDazzleItem, ProcessStep } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "technical-support",
    title: "Technical Support",
    category: "Operations & Reliability",
    iconName: "LifeBuoy",
    shortDescription: "Reliable technical assistance and troubleshooting for businesses and users.",
    fullDescription:
      "Rapid resolution of critical system issues, application troubleshooting, end-user guidance, and proactive infrastructure monitoring to ensure zero downtime.",
    features: [
      "24/7 responsive ticketing & incident management",
      "System diagnosis, bug triage & root cause analysis",
      "Network, email, and workspace setup assistance",
      "Preventive system health & security audits",
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    category: "Growth & Acquisition",
    iconName: "TrendingUp",
    shortDescription: "Social media, online campaigns, lead generation and digital growth strategies.",
    fullDescription:
      "Data-driven search engine optimization, targeted performance ads, and high-conversion content funnels designed to deliver genuine, qualified business inquiries.",
    features: [
      "Precision search engine optimization (SEO & Local SEO)",
      "High-ROI social media campaigns (Meta, LinkedIn, Google)",
      "B2B lead generation & inbound sales funnels",
      "Brand messaging & digital visibility acceleration",
    ],
  },
  {
    id: "website-development",
    title: "Website Development",
    category: "Digital Presence",
    iconName: "Globe",
    shortDescription: "Modern, responsive and high-performance websites for businesses and organizations.",
    fullDescription:
      "Lightning-fast, mobile-first websites built with modern frameworks, optimized Core Web Vitals, accessible UX, and conversion-focused architectures.",
    features: [
      "Ultra-fast loading speed (<1s target)",
      "100% responsive for every mobile screen & tablet",
      "SEO-ready semantic structure & schema markup",
      "Clean content management & easy maintenance",
    ],
  },
  {
    id: "app-development",
    title: "App Development",
    category: "Mobile & Platforms",
    iconName: "Smartphone",
    shortDescription: "Mobile and web applications designed around real-world business requirements.",
    fullDescription:
      "Native and cross-platform mobile apps for iOS and Android tailored to deliver fluid touch experiences, offline capability, and secure API connectivity.",
    features: [
      "Cross-platform iOS & Android engineering",
      "Offline-first architecture & instant data syncing",
      "Intuitive touch-friendly mobile interface design",
      "App Store & Google Play Store release management",
    ],
  },
  {
    id: "ai-solutions",
    title: "AI Solutions",
    category: "Intelligent Systems",
    iconName: "Sparkles",
    shortDescription: "AI-powered workflows, automation and intelligent digital solutions.",
    fullDescription:
      "Practical deployment of state-of-the-art language models, document parsers, automated customer assistants, and predictive intelligence into existing business operations.",
    features: [
      "Custom business AI assistants & knowledge retrieval",
      "Intelligent document understanding & data extraction",
      "Predictive analytics & smart automated suggestions",
      "Safe and cost-effective AI model integration",
    ],
  },
  {
    id: "business-automation",
    title: "Business Automation",
    category: "Efficiency & Speed",
    iconName: "Cpu",
    shortDescription: "Automate repetitive tasks, lead management and business workflows.",
    fullDescription:
      "Eliminate manual administrative bottlenecks. Connect your forms, CRM, messaging, invoices, and databases into automated trigger-action workflows.",
    features: [
      "CRM & lead routing automation",
      "Instant WhatsApp & email trigger pipelines",
      "Automated invoice, receipt & document generation",
      "Cross-platform API & webhook integrations",
    ],
  },
  {
    id: "web-applications",
    title: "Web Applications",
    category: "Software & Portals",
    iconName: "LayoutGrid",
    shortDescription: "Custom dashboards, portals and browser-based business applications.",
    fullDescription:
      "Secure cloud web apps, interactive administrative portals, inventory systems, and multi-tenant platforms built with robust backend architectures.",
    features: [
      "Role-based access control & permission security",
      "Interactive data dashboards & real-time charts",
      "Scalable REST / GraphQL backend APIs",
      "Reliable cloud deployment & database backup",
    ],
  },
  {
    id: "it-consulting",
    title: "IT & Technology Consulting",
    category: "Strategy & Advisory",
    iconName: "Compass",
    shortDescription: "Practical technology guidance to help businesses choose and implement the right solutions.",
    fullDescription:
      "Unbiased technology advisory to help entrepreneurs and organizations choose the right software stack, avoid expensive vendor lock-ins, and modernize workflows.",
    features: [
      "Technology stack evaluation & architecture audits",
      "Cloud migration & infrastructure cost optimization",
      "Cybersecurity best practices & data safety policies",
      "Digital transformation roadmap for small & mid enterprises",
    ],
  },
];

export const WHY_DYNODAZZLE: WhyDynoDazzleItem[] = [
  {
    title: "Practical Technology",
    description: "We focus on technology that solves real business problems rather than chasing unnecessary buzzwords.",
    iconName: "Target",
  },
  {
    title: "Scalable Solutions",
    description: "Build clean, modular systems today with the technical elasticity to scale seamlessly tomorrow.",
    iconName: "Layers",
  },
  {
    title: "Modern Digital Experience",
    description: "Fast, responsive and user-friendly digital products engineered for high performance on any device.",
    iconName: "Zap",
  },
  {
    title: "One Technology Partner",
    description: "Marketing, websites, applications, automation and technical support integrated in one unified ecosystem.",
    iconName: "ShieldCheck",
  },
  {
    title: "Affordable Innovation",
    description: "High-standard engineering delivered with transparent value and practical solutions without bloated overheads.",
    iconName: "PiggyBank",
  },
  {
    title: "Long-Term Thinking",
    description: "We build systems designed to evolve, maintain, and expand smoothly as your enterprise advances.",
    iconName: "Clock",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    number: "01",
    title: "Discover",
    description: "We thoroughly evaluate your business model, customer pain points, current tech stack, and clear objectives.",
    deliverables: ["Requirement audit", "Scope definition", "Feasibility analysis"],
  },
  {
    step: "02",
    number: "02",
    title: "Plan",
    description: "We architect the optimal technical solution, interface blueprints, milestone schedules, and resource requirements.",
    deliverables: ["Architecture roadmap", "UI/UX wireframes", "Technology selection"],
  },
  {
    step: "03",
    number: "03",
    title: "Build",
    description: "Our engineers craft responsive frontends, secure backend APIs, and integrated automations following clean code standards.",
    deliverables: ["Modern codebase", "Interactive staging preview", "Weekly progress updates"],
  },
  {
    step: "04",
    number: "04",
    title: "Launch",
    description: "Comprehensive functional testing, security review, performance optimization, domain setup, and production release.",
    deliverables: ["Speed optimization", "SEO & metadata audit", "Production deployment"],
  },
  {
    step: "05",
    number: "05",
    title: "Support",
    description: "Continuous proactive monitoring, performance upgrades, security patches, and ongoing technology assistance.",
    deliverables: ["Incident management", "Feature updates", "Reliability warranty"],
  },
];

export const TECH_CATEGORIES = [
  {
    name: "AI Solutions",
    tagline: "Intelligence & Automations",
    iconName: "Bot",
    stack: ["Large Language Models", "Document AI", "Intelligent Agents", "Workflow Automation"],
  },
  {
    name: "Web Platforms",
    tagline: "High-Speed Frontends",
    iconName: "Code2",
    stack: ["React & Next.js", "TypeScript", "Tailwind CSS", "Modern Web Vitals"],
  },
  {
    name: "Mobile Ecosystem",
    tagline: "Cross-Platform Engineering",
    iconName: "Smartphone",
    stack: ["iOS & Android Apps", "Progressive Web Apps", "Offline Caching", "Biometrics & Push"],
  },
  {
    name: "Cloud & APIs",
    tagline: "Scalable Infrastructure",
    iconName: "Cloud",
    stack: ["Node.js & Express", "Serverless Functions", "PostgreSQL / NoSQL", "Docker & Microservices"],
  },
  {
    name: "Automation",
    tagline: "Workflow Synchronization",
    iconName: "Workflow",
    stack: ["Webhook Pipelines", "WhatsApp Business APIs", "CRM Connectors", "Event-Driven Queues"],
  },
  {
    name: "Analytics & Growth",
    tagline: "Measurable Impact",
    iconName: "BarChart3",
    stack: ["Conversion Tracking", "Search Engine Rank", "Performance Telemetry", "User Behavior Insights"],
  },
  {
    name: "Digital Marketing",
    tagline: "Customer Funnels",
    iconName: "Megaphone",
    stack: ["Meta & Google Ads", "Local Business SEO", "Content Marketing", "Lead Capture Engines"],
  },
  {
    name: "Technical Support",
    tagline: "Reliability Engineering",
    iconName: "Headphones",
    stack: ["24/7 Ticketing", "DNS & Domain Routing", "Security Hardening", "Data Backups"],
  },
];

export const ECOSYSTEM_NODES = [
  { id: "ai", label: "AI Solutions", icon: "Sparkles", angle: 0 },
  { id: "web", label: "Web Apps", icon: "Globe", angle: 45 },
  { id: "mobile", label: "Mobile Apps", icon: "Smartphone", angle: 90 },
  { id: "marketing", label: "Marketing", icon: "TrendingUp", angle: 135 },
  { id: "automation", label: "Automation", icon: "Cpu", angle: 180 },
  { id: "support", label: "Tech Support", icon: "LifeBuoy", angle: 225 },
  { id: "cloud", label: "Cloud Systems", icon: "Cloud", angle: 270 },
  { id: "software", label: "Custom Software", icon: "Code2", angle: 315 },
];
