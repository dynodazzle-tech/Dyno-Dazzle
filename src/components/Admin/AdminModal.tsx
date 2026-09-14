import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  LogOut,
  X,
  Plus,
  Trash2,
  Edit3,
  Check,
  RefreshCw,
  Search,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  Send,
  Sparkles,
  Sliders,
  FolderKanban,
  Inbox,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Building,
  Tag,
  ChevronDown,
  Globe,
  Server,
  Wifi,
} from 'lucide-react';
import { ProjectItem, EnquiryItem, SiteSettings } from '../../types';
import {
  apiFetch,
  getApiBaseUrl,
  setApiBaseUrl,
  CLOUD_RUN_BACKEND_URL,
  testBackendConnection,
} from '../../utils/api';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  // Auth state
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('dyno_admin_token'));
  const [authStep, setAuthStep] = useState<'login' | 'otp'>('login');
  const [emailInput, setEmailInput] = useState('dynodazzle@gmail.com');
  const [passwordInput, setPasswordInput] = useState('Vicky@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'enquiries' | 'projects' | 'settings'>('enquiries');

  // Dashboard data states
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Project Editor Modal State
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');

  // Reply Composer Modal State
  const [replyingEnquiry, setReplyingEnquiry] = useState<EnquiryItem | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyStatusMsg, setReplyStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings save state
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsStatusMsg, setSettingsStatusMsg] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Check existing token validity on open
  useEffect(() => {
    if (isOpen && authToken) {
      verifyToken(authToken);
    }
  }, [isOpen, authToken]);

  // Fetch dashboard data when authenticated
  useEffect(() => {
    if (authToken && isOpen) {
      loadDashboardData();
    }
  }, [authToken, isOpen, activeTab]);

  // Active backend configuration
  const [activeBackend, setActiveBackend] = useState<string>(() => getApiBaseUrl());
  const [testingBackend, setTestingBackend] = useState(false);
  const [backendTestStatus, setBackendTestStatus] = useState<string | null>(null);

  const handleSwitchBackend = (url: string) => {
    setApiBaseUrl(url);
    setActiveBackend(url);
    setBackendTestStatus(null);
    setAuthError(null);
  };

  const handleTestBackend = async (url?: string) => {
    setTestingBackend(true);
    setBackendTestStatus(null);
    try {
      const res = await testBackendConnection(url);
      if (res.connected) {
        setBackendTestStatus(`Connected successfully (${res.platform || 'online'})`);
      } else {
        setBackendTestStatus(res.message);
      }
    } catch {
      setBackendTestStatus('Connection failed');
    } finally {
      setTestingBackend(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const res = await apiFetch('/api/admin/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // Token expired or invalid
        localStorage.removeItem('dyno_admin_token');
        setAuthToken(null);
        setAuthStep('login');
      }
    } catch {
      localStorage.removeItem('dyno_admin_token');
      setAuthToken(null);
    }
  };

  const loadDashboardData = async () => {
    if (!authToken) return;
    setDataLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      if (activeTab === 'enquiries') {
        const res = await apiFetch('/api/admin/enquiries', { headers });
        if (res.ok && res.data?.success) setEnquiries(res.data.data || []);
      } else if (activeTab === 'projects') {
        const res = await apiFetch('/api/admin/projects', { headers });
        if (res.ok && res.data?.success) setProjects(res.data.data || []);
      } else if (activeTab === 'settings') {
        const res = await apiFetch('/api/admin/settings', { headers });
        if (res.ok && res.data?.success) setSettings(res.data.data || null);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  // STEP 1: Login with Email & Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);
    setAuthLoading(true);

    try {
      const res = await apiFetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      if (!res.ok || !res.data?.success) {
        setAuthError(res.data?.message || 'Login failed. Please verify credentials.');
        setAuthLoading(false);
        return;
      }

      // Move to OTP step
      setAuthStep('otp');
      setAuthNotice(res.data.message || 'A 6-digit OTP has been sent to your Gmail.');
      setResendCooldown(60);
      setOtpInput(['', '', '', '', '', '']);
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    } catch {
      setAuthError('Connection error. Please try again or switch to the live backend.');
    } finally {
      setAuthLoading(false);
    }
  };

  // STEP 2: Handle OTP submission helper
  const submitOtpCode = async (codeToVerify: string) => {
    const cleanCode = codeToVerify.replace(/\D/g, '').trim();
    if (cleanCode.length !== 6) {
      setAuthError('Please enter all 6 digits of the verification code.');
      return;
    }

    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await apiFetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, otp: cleanCode }),
      });

      if (!res.ok || !res.data?.success) {
        setAuthError(res.data?.message || 'Invalid or expired verification code.');
        setAuthLoading(false);
        return;
      }

      // Success! Save token
      localStorage.setItem('dyno_admin_token', res.data.token);
      setAuthToken(res.data.token);
      setAuthError(null);
      setAuthNotice(null);
    } catch {
      setAuthError('Verification failed due to a network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // STEP 2: Handle OTP input changes
  const handleOtpChange = (index: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, '');

    // Handle full paste or auto-fill through input
    if (digitsOnly.length >= 6) {
      const digits = digitsOnly.slice(0, 6).split('');
      setOtpInput(digits);
      otpRefs.current[5]?.focus();
      submitOtpCode(digitsOnly.slice(0, 6));
      return;
    }

    const digit = digitsOnly.slice(-1);
    const newOtp = [...otpInput];
    newOtp[index] = digit;
    setOtpInput(newOtp);

    // Auto-advance
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits are populated
    const fullOtp = newOtp.join('');
    if (fullOtp.length === 6 && !newOtp.includes('')) {
      submitOtpCode(fullOtp);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpInput[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const full = otpInput.join('');
      if (full.length === 6) {
        submitOtpCode(full);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const rawData = e.clipboardData.getData('text') || '';
    const digitsOnly = rawData.replace(/\D/g, '').slice(0, 6);
    if (digitsOnly.length === 6) {
      const digits = digitsOnly.split('');
      setOtpInput(digits);
      otpRefs.current[5]?.focus();
      submitOtpCode(digitsOnly);
    } else if (digitsOnly.length > 0) {
      // Partial paste
      const newOtp = [...otpInput];
      for (let i = 0; i < digitsOnly.length && i < 6; i++) {
        newOtp[i] = digitsOnly[i];
      }
      setOtpInput(newOtp);
      otpRefs.current[Math.min(5, digitsOnly.length)]?.focus();
    }
  };

  // STEP 2 SUBMISSION: Verify OTP form submit
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpInput.join('');
    await submitOtpCode(fullOtp);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setAuthError(null);
    setAuthNotice(null);
    setAuthLoading(true);

    try {
      const res = await apiFetch('/api/admin/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      });
      if (res.ok && res.data?.success) {
        setAuthNotice(res.data.message || 'A fresh 6-digit verification code has been dispatched to your Gmail.');
        setResendCooldown(60);
        setOtpInput(['', '', '', '', '', '']);
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      } else {
        setAuthError(res.data?.message || 'Failed to resend code.');
      }
    } catch {
      setAuthError('Failed to resend code due to network.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    if (authToken) {
      apiFetch('/api/admin/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('dyno_admin_token');
    setAuthToken(null);
    setAuthStep('login');
  };

  // ENQUIRIES ACTIONS
  const handleStatusChange = async (enquiryId: string, newStatus: string) => {
    if (!authToken) return;
    try {
      const res = await apiFetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus as any } : e))
        );
      }
    } catch (err) {
      console.error('Failed to update enquiry status:', err);
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (!authToken || !window.confirm('Are you sure you want to delete this enquiry record?')) return;
    try {
      const res = await apiFetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  // OPEN REPLY COMPOSER
  const openReplyModal = (enquiry: EnquiryItem) => {
    setReplyingEnquiry(enquiry);
    setReplySubject(`Regarding your enquiry with DynoDazzle (#${enquiry.id})`);
    setReplyMessage(
      `Hello ${enquiry.name},\n\nThank you for reaching out to DynoDazzle regarding your interest in "${enquiry.service}".\n\nWe have reviewed your project requirements and would be delighted to assist you. Let us schedule a brief 15-minute discovery call or discuss the milestones right here.\n\nBest regards,\nDynoDazzle Team`
    );
    setReplyStatusMsg(null);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingEnquiry || !authToken) return;

    setReplySending(true);
    setReplyStatusMsg(null);

    try {
      const res = await apiFetch(`/api/admin/enquiries/${replyingEnquiry.id}/reply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: replySubject,
          message: replyMessage,
          newStatus: 'contacted',
        }),
      });

      if (res.ok && res.data?.success) {
        setReplyStatusMsg({ type: 'success', text: `Email sent to ${replyingEnquiry.email} successfully!` });
        // Update state
        setEnquiries((prev) =>
          prev.map((e) => (e.id === replyingEnquiry.id ? { ...e, status: 'contacted' } : e))
        );
        setTimeout(() => {
          setReplyingEnquiry(null);
        }, 1500);
      } else {
        setReplyStatusMsg({ type: 'error', text: res.data?.message || 'Failed to dispatch email.' });
      }
    } catch {
      setReplyStatusMsg({ type: 'error', text: 'Error dispatching reply email.' });
    } finally {
      setReplySending(false);
    }
  };

  // PROJECT ACTIONS
  const openAddProject = () => {
    setEditingProject({
      title: '',
      category: 'AI Solutions & Automation',
      client: '',
      summary: '',
      description: '',
      features: [],
      techStack: ['TypeScript', 'React', 'Tailwind CSS'],
      metrics: '',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      liveUrl: '',
      featured: true,
      order: (projects.length || 0) + 1,
      status: 'active',
    });
    setNewTagInput('');
    setNewFeatureInput('');
    setIsProjectModalOpen(true);
  };

  const openEditProject = (p: ProjectItem) => {
    setEditingProject({ ...p });
    setNewTagInput('');
    setNewFeatureInput('');
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !authToken) return;

    setProjectSaving(true);
    try {
      const isNew = !editingProject.id;
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await apiFetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProject),
      });

      if (res.ok && res.data?.success) {
        setIsProjectModalOpen(false);
        setEditingProject(null);
        loadDashboardData();
      } else {
        alert(res.data?.message || 'Failed to save project');
      }
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Error saving project');
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!authToken || !window.confirm('Delete this project from portfolio?')) return;
    try {
      const res = await apiFetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleToggleFeatured = async (p: ProjectItem) => {
    if (!authToken) return;
    try {
      const res = await apiFetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, featured: !item.featured } : item))
        );
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  // SITE SETTINGS ACTIONS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !authToken) return;
    setSettingsSaving(true);
    setSettingsStatusMsg(null);

    try {
      const res = await apiFetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (res.ok && res.data?.success) {
        setSettingsStatusMsg('Site settings updated live successfully!');
        setTimeout(() => setSettingsStatusMsg(null), 3500);
      }
    } catch {
      setSettingsStatusMsg('Failed to update settings');
    } finally {
      setSettingsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.toLowerCase().includes(q) ||
      e.company.toLowerCase().includes(q) ||
      e.service.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-[#080d1a] border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        
        {/* =========================================================================
            HEADER BAR
           ========================================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#0c1326]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5 text-cyan-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">DynoDazzle Control Portal</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {authToken ? 'Live Access & Content Administration' : '2-Factor Security Authentication'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authToken && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>dynodazzle@gmail.com</span>
              </div>
            )}
            {authToken && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Close admin modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            IF NOT AUTHENTICATED: LOGIN & OTP SCREENS
           ========================================================================= */}
        {!authToken ? (
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center min-h-[480px]">
            <div className="w-full max-w-md">
              {authStep === 'login' ? (
                /* STEP 1: LOGIN FORM */
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center mb-3 text-cyan-400">
                      <Lock className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Administrator Login</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter credentials for verification. An OTP will be emailed to you.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{authError}</span>
                      </div>
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleSwitchBackend(CLOUD_RUN_BACKEND_URL);
                            setAuthNotice('Switched to live backend. Click Continue to submit credentials.');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold text-[11px] flex items-center gap-1.5 transition-colors"
                        >
                          <Server className="w-3 h-3" />
                          <span>⚡ Connect to Live Backend (Cloud Run)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTestBackend(activeBackend || undefined)}
                          disabled={testingBackend}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                        >
                          {testingBackend ? 'Testing...' : 'Test Connection'}
                        </button>
                      </div>
                    </div>
                  )}

                  {authNotice && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{authNotice}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="dynodazzle@gmail.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Password
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-colors font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {authLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to 2-Factor OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 text-center leading-relaxed">
                    🔒 Protected 2-Step Admin verification. Code dispatched directly via DynoDazzle Gmail to <strong className="text-white">dynodazzle@gmail.com</strong>.
                  </div>

                  {/* Backend connection pill / selector */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Wifi className={`w-3.5 h-3.5 ${activeBackend ? 'text-emerald-400' : 'text-cyan-400'}`} />
                      <span className="truncate max-w-[170px]" title={activeBackend || 'Direct / Netlify / Local'}>
                        {activeBackend ? 'Live Backend (Cloud Run)' : 'Netlify / Same-Origin API'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {activeBackend ? (
                        <button
                          type="button"
                          onClick={() => handleSwitchBackend('')}
                          className="text-slate-400 hover:text-cyan-300 transition-colors underline"
                        >
                          Use Netlify API
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSwitchBackend(CLOUD_RUN_BACKEND_URL)}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
                        >
                          Switch to Live Backend
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleTestBackend(activeBackend || undefined)}
                        disabled={testingBackend}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        {testingBackend ? '...' : 'Test'}
                      </button>
                    </div>
                  </div>

                  {backendTestStatus && (
                    <div className="text-[11px] text-center text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/20">
                      {backendTestStatus}
                    </div>
                  )}
                </form>
              ) : (
                /* STEP 2: 6-DIGIT OTP VERIFICATION */
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center mb-3 text-emerald-400">
                      <Mail className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Check Your Gmail</h3>
                    <p className="text-xs text-slate-400 mt-1.5">
                      A 6-digit verification code has been dispatched to:
                    </p>
                    <p className="text-sm font-semibold text-cyan-400 mt-0.5">{emailInput}</p>
                  </div>

                  {authNotice && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>{authNotice}</span>
                    </div>
                  )}

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* 6 Digit Inputs */}
                  <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Enter 6-Digit Verification Code
                      </label>
                      {otpInput.some((d) => d !== '') && (
                        <button
                          type="button"
                          onClick={() => {
                            setOtpInput(['', '', '', '', '', '']);
                            setAuthError(null);
                            otpRefs.current[0]?.focus();
                          }}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                        >
                          Clear Digits
                        </button>
                      )}
                    </div>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otpInput.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          placeholder="•"
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 placeholder:text-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40 outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>
                  </div>

                  {/* 60-Second Cooldown & Retry Box */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className={`w-4 h-4 shrink-0 ${resendCooldown > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                      {resendCooldown > 0 ? (
                        <span>
                          Retry available in <strong className="text-cyan-300 font-mono font-bold">{resendCooldown}s</strong>
                        </span>
                      ) : (
                        <span className="text-emerald-300 font-medium">
                          Retry available: Didn't receive or need a fresh code?
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || authLoading}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 font-semibold text-xs transition-all disabled:opacity-40 disabled:hover:bg-cyan-500/20 disabled:hover:text-cyan-300 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${authLoading ? 'animate-spin' : ''}`} />
                      <span>{resendCooldown > 0 ? `${resendCooldown}s` : 'Resend Code'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading || otpInput.join('').length !== 6}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {authLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Verify & Open Admin Dashboard</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStep('login');
                        setAuthError(null);
                        setAuthNotice(null);
                      }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      &larr; Back to login
                    </button>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || authLoading}
                      onClick={handleResendOtp}
                      className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition-colors font-medium cursor-pointer disabled:cursor-not-allowed"
                    >
                      {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
              IF AUTHENTICATED: FULL DASHBOARD
             ========================================================================= */
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* TABS NAVIGATION */}
            <div className="flex items-center gap-2 px-6 py-2.5 bg-[#0a0f21] border-b border-slate-800 text-sm overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'enquiries'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Enquiries & Leads</span>
                {enquiries.filter((e) => e.status === 'new').length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-black">
                    {enquiries.filter((e) => e.status === 'new').length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'projects'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Projects Portfolio</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300">
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === 'settings'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Site Content & Info</span>
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadDashboardData}
                  disabled={dataLoading}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-[#060913]">
              {/* =========================================================================
                  TAB 1: ENQUIRIES & LEADS MANAGEMENT
                 ========================================================================= */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  {/* Filters Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div className="relative flex-grow max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search leads by name, email, company, service..."
                        className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px] uppercase tracking-wider">Status:</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none text-xs"
                      >
                        <option value="all">All Statuses ({enquiries.length})</option>
                        <option value="new">New ({enquiries.filter((e) => e.status === 'new').length})</option>
                        <option value="contacted">Contacted</option>
                        <option value="in_progress">In Progress</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Enquiries List */}
                  {filteredEnquiries.length === 0 ? (
                    <div className="text-center py-16 px-4 bg-slate-900/30 border border-slate-800 rounded-xl">
                      <Inbox className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-300">No enquiries found</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {searchQuery || statusFilter !== 'all'
                          ? 'Try adjusting your search query or status filter.'
                          : 'New contact requests submitted on the website will display here instantly.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredEnquiries.map((enquiry) => (
                        <div
                          key={enquiry.id}
                          className={`p-4 sm:p-5 rounded-xl border transition-all bg-gradient-to-b ${
                            enquiry.status === 'new'
                              ? 'from-cyan-950/20 to-slate-900/80 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                              : 'from-slate-900/60 to-slate-950 border-slate-800'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-white">{enquiry.name}</h4>
                                {enquiry.company && (
                                  <span className="flex items-center gap-1 text-xs text-slate-400">
                                    <Building className="w-3 h-3" />
                                    {enquiry.company}
                                  </span>
                                )}
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                    enquiry.status === 'new'
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                      : enquiry.status === 'contacted'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                      : enquiry.status === 'converted'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                                  }`}
                                >
                                  {enquiry.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">
                                Ref: #{enquiry.id} &bull; Received {new Date(enquiry.timestamp).toLocaleString()}
                              </p>
                            </div>

                            {/* Status Changer Dropdown */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500">Update:</span>
                              <select
                                value={enquiry.status}
                                onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none"
                              >
                                <option value="new">New</option>
                                <option value="in_progress">In Progress</option>
                                <option value="contacted">Contacted</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 my-3 text-xs">
                            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-0.5">Email</span>
                              <a
                                href={`mailto:${enquiry.email}`}
                                className="text-cyan-300 hover:underline break-all font-medium"
                              >
                                {enquiry.email}
                              </a>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-0.5">Phone</span>
                              <a
                                href={`tel:${enquiry.phone}`}
                                className="text-slate-200 hover:text-white font-medium"
                              >
                                {enquiry.phone}
                              </a>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-0.5">Requested Service</span>
                              <span className="text-slate-200 font-medium">{enquiry.service}</span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                              <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-0.5">Estimated Budget</span>
                              <span className="text-emerald-400 font-semibold">{enquiry.budget}</span>
                            </div>
                          </div>

                          {/* Message Body */}
                          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Client Message:</span>
                            {enquiry.message}
                          </div>

                          {/* Reply History */}
                          {enquiry.replies && enquiry.replies.length > 0 && (
                            <div className="mt-3 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs">
                              <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold block mb-1">
                                Previous Replies Sent ({enquiry.replies.length}):
                              </span>
                              {enquiry.replies.map((r, rIdx) => (
                                <div key={rIdx} className="text-slate-300 border-t border-cyan-900/40 pt-1.5 mt-1.5 first:border-0 first:pt-0">
                                  <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                                    <strong className="text-white">{r.subject}</strong>
                                    <span>{new Date(r.sentAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-slate-400 line-clamp-2">{r.body}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/60 flex-wrap">
                            <div className="flex items-center gap-2">
                              {/* Reply by Email Button */}
                              <button
                                type="button"
                                onClick={() => openReplyModal(enquiry)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors shadow-sm"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Reply by Email</span>
                              </button>

                              {/* WhatsApp Chat Button */}
                              <a
                                href={`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hello ${enquiry.name}, thank you for contacting DynoDazzle regarding ${enquiry.service}. How can we assist with your project milestones today?`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Chat on WhatsApp</span>
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(enquiry.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                              title="Delete enquiry record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* =========================================================================
                  TAB 2: PROJECTS PORTFOLIO MANAGEMENT
                 ========================================================================= */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <h3 className="text-sm font-bold text-white">Showcase Portfolio Projects</h3>
                      <p className="text-xs text-slate-400">
                        Add, edit, or remove client projects that display live across DynoDazzle.in
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={openAddProject}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-colors"
                      >
                        {project.imageUrl && (
                          <div className="h-36 w-full relative overflow-hidden bg-slate-950">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                              {project.featured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/90 text-black">
                                  ★ Featured
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  project.status === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                                }`}
                              >
                                {project.status}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1">
                              {project.category} &bull; {project.client}
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{project.title}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{project.summary}</p>

                            {/* Tech Stack Chips */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.techStack?.slice(0, 4).map((tech, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.techStack && project.techStack.length > 4 && (
                                <span className="text-[10px] text-slate-500 self-center">
                                  +{project.techStack.length - 4} more
                                </span>
                              )}
                            </div>

                            {project.metrics && (
                              <div className="text-[11px] text-emerald-400 font-medium mb-3">
                                📊 {project.metrics}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(project)}
                              className={`text-xs ${
                                project.featured ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {project.featured ? '★ Featured' : '☆ Mark Featured'}
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => openEditProject(project)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                                title="Edit Project"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProject(project.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Delete Project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 3: SITE SETTINGS & CONTENT
                 ========================================================================= */}
              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {settingsStatusMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{settingsStatusMsg}</span>
                    </div>
                  )}

                  {settings && (
                    <form onSubmit={handleSaveSettings} className="space-y-5">
                      {/* Company Info Box */}
                      <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                        <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                          Company & Contact Information
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Company Name</label>
                            <input
                              type="text"
                              value={settings.companyName}
                              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Official Email</label>
                            <input
                              type="email"
                              value={settings.email}
                              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={settings.phone}
                              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">WhatsApp Number</label>
                            <input
                              type="text"
                              value={settings.whatsapp}
                              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Working Hours</label>
                            <input
                              type="text"
                              value={settings.workingHours}
                              onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Announcement Banner Editor */}
                      <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h4 className="text-sm font-bold text-white">Top Announcement Banner</h4>
                          <label className="flex items-center gap-2 cursor-pointer text-xs">
                            <input
                              type="checkbox"
                              checked={settings.announcementBanner?.enabled ?? true}
                              onChange={(e) =>
                                setSettings({
                                  ...settings,
                                  announcementBanner: {
                                    ...settings.announcementBanner,
                                    enabled: e.target.checked,
                                  },
                                })
                              }
                              className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                            />
                            <span className="text-slate-300">Enable Banner</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Banner Text</label>
                          <textarea
                            rows={2}
                            value={settings.announcementBanner?.text || ''}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                announcementBanner: {
                                  ...settings.announcementBanner,
                                  text: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={settingsSaving}
                          className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                          {settingsSaving ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              <span>Saving Settings...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Save All Site Settings</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            EMAIL REPLY MODAL
           ========================================================================= */}
        {replyingEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-[#0c1326] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">
                    Direct Email Reply to {replyingEnquiry.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingEnquiry(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {replyStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    replyStatusMsg.type === 'success'
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {replyStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{replyStatusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSendReply} className="space-y-3.5">
                <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div>
                    <span className="text-slate-500">To:</span> {replyingEnquiry.name} &lt;{replyingEnquiry.email}&gt;
                  </div>
                  <div>
                    <span className="text-slate-500">From:</span> DynoDazzle &lt;dynodazzle@gmail.com&gt;
                  </div>
                  <div>
                    <span className="text-slate-500">Enquiry Service:</span> {replyingEnquiry.service}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reply Message</label>
                  <textarea
                    required
                    rows={6}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none resize-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplyingEnquiry(null)}
                    className="px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={replySending}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    {replySending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Dispatching from Gmail...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Email to Client</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT EDIT / ADD MODAL
           ========================================================================= */}
        {isProjectModalOpen && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="w-full max-w-2xl bg-[#0c1326] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 space-y-4 my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white">
                  {editingProject.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      placeholder="e.g. Enterprise AI Workflow Engine"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                    <select
                      value={editingProject.category || 'AI Solutions & Automation'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    >
                      <option value="AI Solutions & Automation">AI Solutions & Automation</option>
                      <option value="Web Platforms & Apps">Web Platforms & Apps</option>
                      <option value="Mobile & App Development">Mobile & App Development</option>
                      <option value="Digital Marketing & Growth">Digital Marketing & Growth</option>
                      <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={editingProject.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      placeholder="e.g. SwiftTrans Logistics or Confidential"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Impact / Metrics Highlight</label>
                    <input
                      type="text"
                      value={editingProject.metrics || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                      placeholder="e.g. 35+ hrs/wk saved • 99.4% Accuracy"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Summary (Card View) *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingProject.summary || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence overview of the business problem and solution"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Live Demo / Website URL</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                  />
                </div>

                {/* Tech Stack Tags */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tech Stack Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {editingProject.techStack?.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs flex items-center gap-1.5"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setEditingProject({
                              ...editingProject,
                              techStack: editingProject.techStack?.filter((_, idx) => idx !== i),
                            })
                          }
                          className="hover:text-rose-400"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="Add tag (e.g. Next.js, Node.js)"
                      className="flex-grow px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-cyan-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTagInput.trim()) return;
                        setEditingProject({
                          ...editingProject,
                          techStack: [...(editingProject.techStack || []), newTagInput.trim()],
                        });
                        setNewTagInput('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
                    >
                      Add Tag
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured ?? true}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                    />
                    <span className="text-slate-300">Feature on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.status === 'active'}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          status: e.target.checked ? 'active' : 'draft',
                        })
                      }
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                    />
                    <span className="text-slate-300">Active (Publicly Visible)</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProjectModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={projectSaving}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {projectSaving ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Project...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Project</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
