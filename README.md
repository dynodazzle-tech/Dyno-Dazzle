# DynoDazzle — Technology & Digital Services Website

Modern, high-performance, responsive business website for **DynoDazzle**, an advanced technology and digital services company operating at **[dynodazzle.in](https://dynodazzle.in)**.

---

## 1. Project Overview & Architecture

* **Parent Domain:** `https://dynodazzle.in`
* **Official Email:** `dynodazzle@gmail.com`
* **Direct WhatsApp:** `+91 7770032149`
* **Ecosystem Subdomain:** `https://techclass.dynodazzle.in` (Education & Exam Preparation Platform)

### Architecture Highlights:
* **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS with responsive mobile-first typography and interactive technology canvas visuals.
* **Backend:** Express Node.js API with `/api/contact` handling validation, anti-spam honeypot filtering, enquiry persistence, and transactional email routing.
* **Email Architecture:** Pluggable Nodemailer service with SMTP credentials support (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`) and automatic fallback recording to `data/enquiries.json`.
* **Ecosystem Engine:** Centralized platform configuration (`src/config/ecosystem.ts`) enabling frictionless additions of future subdomains (`apps.dynodazzle.in`, `labs.dynodazzle.in`, `academy.dynodazzle.in`).

---

## 2. Important Subdomain Structure: TechClass

DynoDazzle operates a modular multi-subdomain ecosystem:
* **TechClass (`techclass.dynodazzle.in`)**: An independent education platform providing students with:
  * Test papers & previous-year papers
  * PDF study material & notes
  * Full-length mock tests & practice sets
  * Digital study resources

The main website highlights TechClass in the dedicated **DynoDazzle Ecosystem** section while keeping the codebase decoupled. The URL is configured in `src/config/site.ts`:

```typescript
export const SITE_CONFIG = {
  companyName: "DynoDazzle",
  domain: "https://dynodazzle.in",
  email: "dynodazzle@gmail.com",
  whatsappNumber: "917770032149",
  whatsappFormatted: "+91 7770032149",
  techClassUrl: "https://techclass.dynodazzle.in"
};
```

---

## 3. Project File Tree

```
├── .env.example                     # Environment variables template
├── index.html                       # Entry point with SEO tags, canonical URL & favicon
├── metadata.json                    # Application metadata
├── package.json                     # Full-stack scripts & dependencies
├── server.ts                        # Express backend + Vite dev middleware + static fallback
├── data/                            # Persistent JSON enquiry store
│   └── enquiries.json
├── public/
│   ├── robots.txt                   # Crawler indexing instructions
│   └── sitemap.xml                  # Dynamic sitemap with canonical URLs
├── server/
│   ├── routes/
│   │   └── contact.ts               # POST /api/contact endpoint with validation & spam honeypot
│   └── services/
│       ├── emailService.ts          # Transactional notification & confirmation emailer
│       └── storageService.ts        # File & database persistence service
└── src/
    ├── App.tsx                      # Root composition of website sections
    ├── main.tsx                     # React 19 bootstrap
    ├── index.css                    # Tailwind CSS v4 & custom glassmorphic styling
    ├── types.ts                     # TypeScript interfaces
    ├── config/
    │   ├── site.ts                  # Brand & contact configuration
    │   └── ecosystem.ts             # DynoDazzle ecosystem subdomains & platforms
    ├── data/
    │   └── siteData.ts              # Services, features, process steps & tech categorization
    └── components/
        ├── Header.tsx               # Glass sticky header with responsive mobile drawer
        ├── Hero.tsx                 # High-impact hero with futuristic visual & WhatsApp CTA
        ├── HeroAnimation.tsx        # 60fps lightweight network particles (reduced-motion safe)
        ├── ServicesSection.tsx      # 8 full-cycle service cards with category filters
        ├── ServicesVisualization.tsx# Interactive orbital tech nexus
        ├── WhyDynoDazzle.tsx        # 6 core value pillars
        ├── ProcessSection.tsx       # 5-stage timeline from Discover to Support
        ├── EcosystemSection.tsx     # Featured TechClass platform & upcoming platforms
        ├── TechnologySection.tsx    # Categorized technology stack
        ├── AboutSection.tsx         # Mission, principles & execution scope
        ├── ContactSection.tsx       # Live backend contact form with feedback & WhatsApp
        ├── WhatsAppFloatingButton.tsx # Fixed interactive WhatsApp floating beacon
        ├── Footer.tsx               # 4-column comprehensive footer
        ├── LegalModal.tsx           # Privacy Policy & Terms modal
        └── Icon.tsx                 # Dynamic Lucide icon resolver
```

---

## 4. Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

#### Supabase Setup (Database for Enquiries)
1. Log in to [Supabase](https://supabase.com) and create or select your project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the schema provided in `supabase_schema.sql` (or see below):
```sql
CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  email_sent BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.enquiries
  FOR ALL TO service_role USING (true) WITH CHECK (true);
```
4. In Supabase, go to **Project Settings > API**:
   - Copy **Project URL** into `SUPABASE_URL`
   - Copy **service_role (secret)** into `SUPABASE_SERVICE_ROLE_KEY` (or **anon (public)** into `SUPABASE_ANON_KEY`)

#### Gmail Setup (Confirmation & Alert Emails)
To send confirmation emails from `dynodazzle@gmail.com`:
1. Log in to your Google Account for `dynodazzle@gmail.com`.
2. Go to **[Google Account Security](https://myaccount.google.com/security)** and ensure **2-Step Verification** is turned ON.
3. Go to **[App Passwords](https://myaccount.google.com/apppasswords)**.
4. Select "Mail" and generate a new 16-character App Password.
5. In your `.env`:
```env
GMAIL_USER="dynodazzle@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
NOTIFICATION_EMAIL="dynodazzle@gmail.com"
```
*(Note: If Gmail credentials are left blank, enquiries will still be saved to Supabase and locally to `data/enquiries.json`, with mock email dispatch logs output to the console).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the Contact API Endpoint
Submit via frontend or execute:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "phone": "+91 9876543210",
    "company": "NextGen Ltd",
    "service": "Website Development",
    "budget": "₹25,000 – ₹50,000",
    "message": "We require a new high-speed website for our startup.",
    "consent": true
  }'
```

---

## 5. Production Build & Deployment

### Build Command
```bash
npm run build
```
This runs Vite to compile client assets into `dist/` and uses `esbuild` to bundle `server.ts` into a self-contained CommonJS server at `dist/server.cjs`.

### Start Command
```bash
npm start
```
Starts the production server binding on port `3000` and host `0.0.0.0`.

---

## 6. Domain & DNS Deployment Instructions

### Connecting `dynodazzle.in` (Apex Domain)
1. Log in to your domain registrar / DNS provider (e.g. Cloudflare, GoDaddy, Namecheap, Hostinger).
2. Go to **DNS Management** for `dynodazzle.in`.
3. Add the following records:
   * **A Record (Apex)**:
     * Host/Name: `@`
     * Value/IP: `<YOUR_SERVER_OR_CLOUD_RUN_INGRESS_IP>`
     * TTL: `Auto` or `3600`
   * **CNAME Record (www subdomain)**:
     * Host/Name: `www`
     * Value: `dynodazzle.in`
     * TTL: `Auto` or `3600`
4. **SSL / HTTPS Configuration**:
   * Enable automated SSL provisioning via Let's Encrypt, Cloudflare (Full/Strict), or Cloud Run Custom Domain certificates.
   * Force HTTPS redirection for all HTTP traffic.

---

### Connecting `techclass.dynodazzle.in` (Ecosystem Subdomain)
1. In the same DNS Management console for `dynodazzle.in`:
2. Add a new record:
   * **Type:** `CNAME` (or `A` if pointing directly to a dedicated IP)
   * **Host/Name:** `techclass`
   * **Value:** `<YOUR_TECHCLASS_HOSTING_ENDPOINT>` (e.g. `techclass-app.run.app` or server IP)
   * **TTL:** `Auto` or `3600`
3. Provision an SSL certificate for `techclass.dynodazzle.in` (or use a wildcard certificate `*.dynodazzle.in`).
4. In `src/config/site.ts`, verify that `techClassUrl` points to `https://techclass.dynodazzle.in`.
