'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Sections {
  education: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  achievements: boolean;
  certifications: boolean;
}

interface Profile {
  name: string;
  surname: string;
  statusBadge: string;
  openToWork: boolean;
  roles: string[];
  tagline: string;
  githubUrl: string;
  githubUsername: string;
  leetcodeUsername: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  contactBio: string;
  footerText: string;
  resumeUrl: string;
  avatarUrl?: string;
  showCodingStats?: boolean;
  showLeetcodeStats?: boolean;
  showGithubStats?: boolean;
  showAtsResume?: boolean;
  sections?: Sections;
}

const defaultSections: Sections = {
  education: true,
  skills: true,
  experience: true,
  projects: true,
  achievements: true,
  certifications: false,
};

const defaultProfile: Profile = {
  name: 'PULKIT',
  surname: 'SINGHROHA',
  statusBadge: 'Open to Opportunities',
  openToWork: true,
  roles: [
    'Full Stack Developer',
    'ML Engineer',
    'Graph Neural Networks Researcher',
    'Web Dev Lead @ NSCC VIT',
    'Hackathon Finalist',
  ],
  tagline: 'B.Tech CSE @ VIT Chennai · CGPA 9.02 · Building the future one commit at a time.',
  githubUrl: 'https://github.com/pulkit31s',
  githubUsername: 'pulkit31s',
  leetcodeUsername: 'pulkit31s',
  linkedinUrl: 'https://linkedin.com',
  email: 'hello@example.com',
  phone: '+1 (000) 000-0000',
  contactBio: "Currently open to internships, research collaborations, and full-stack opportunities. Let's connect!",
  footerText: 'PULKIT · VIT CHENNAI · B.TECH CSE 2027',
  resumeUrl: '',
  avatarUrl: 'https://github.com/pulkit31s.png',
  showCodingStats: true,
  showLeetcodeStats: true,
  showGithubStats: true,
  showAtsResume: true,
  sections: defaultSections,
};

const inputCls =
  'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#10b981]/40 focus:outline-none transition-colors placeholder:text-white/20';
const btnSm =
  'px-3 py-2.5 text-sm font-mono text-[#10b981] rounded-xl border border-[#10b981]/20 hover:bg-[#10b981]/10 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm]         = useState<Profile>(defaultProfile);
  const [roleInput, setRoleInput] = useState('');
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [msgType, setMsgType]   = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data && data.name) setForm(data);
      })
      .catch(() => {});
  }, [status]);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setMsgType('success');
        setMsg('Profile saved successfully!');
      } else {
        setMsgType('error');
        setMsg('Failed to save profile.');
      }
    } catch {
      setMsgType('error');
      setMsg('Network error — could not save.');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 4000);
  };

  const addRole = () => {
    if (roleInput.trim()) {
      setForm(f => ({ ...f, roles: [...f.roles, roleInput.trim()] }));
      setRoleInput('');
    }
  };

  const removeRole = (i: number) =>
    setForm(f => ({ ...f, roles: f.roles.filter((_, j) => j !== i) }));

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/admin"
          className="text-white/30 hover:text-[#10b981] transition-colors font-mono text-xs tracking-widest uppercase"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Profile <span style={{ color: '#10b981' }}>Editor</span>
        </h1>
      </div>

      {msg && (
        <div
          className="mb-6 px-4 py-3 rounded-xl text-xs font-mono"
          style={{
            color: msgType === 'success' ? '#10b981' : '#f87171',
            background: msgType === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(248,113,113,0.08)',
            border: `1px solid ${msgType === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(248,113,113,0.2)'}`,
          }}
        >
          {msg}
        </div>
      )}

      <div className="flex flex-col gap-6">

        {/* ── HERO SECTION ── */}
        <div
          className="rounded-2xl p-7"
          style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(16,185,129,0.12)' }}
        >
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#10b981] mb-6">
            Hero Section
          </h2>

          <div className="flex flex-col gap-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name">
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. PULKIT"
                />
              </Field>
              <Field label="Surname">
                <input
                  className={inputCls}
                  value={form.surname}
                  onChange={e => setForm(f => ({ ...f, surname: e.target.value }))}
                  placeholder="e.g. SINGHROHA"
                />
              </Field>
            </div>

            <Field label="Profile Photograph / Avatar Image URL">
              <input
                className={inputCls}
                value={form.avatarUrl || ''}
                onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                placeholder="e.g. https://github.com/pulkit31s.png or image URL..."
              />
              {form.avatarUrl && (
                <div className="mt-3 flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <img
                    src={form.avatarUrl}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-2xl object-cover border border-[#10b981]/50 shadow-lg"
                    onError={e => ((e.currentTarget as HTMLElement).style.display = 'none')}
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-[#10b981]">Photograph Preview</div>
                    <div className="text-[10px] font-mono text-white/40">Displayed in Hero Section & ATS Resume Page</div>
                  </div>
                </div>
              )}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Status Badge Text">
                <input
                  className={inputCls}
                  value={form.statusBadge}
                  onChange={e => setForm(f => ({ ...f, statusBadge: e.target.value }))}
                  placeholder="e.g. Open to Opportunities"
                />
              </Field>
              <Field label="Open to Work Indicator">
                <label className="flex items-center gap-3 h-[42px] px-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.openToWork ?? true}
                    onChange={e => setForm(f => ({ ...f, openToWork: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-xs font-mono text-white/80">
                    {form.openToWork ? '🟢 Active (Green Pulse)' : '⚪ Inactive (Grey Pulse)'}
                  </span>
                </label>
              </Field>
            </div>

            <Field label="Typing Roles (shown one by one in Hero)">
              <div className="flex gap-2">
                <input
                  className={`${inputCls} flex-1`}
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRole())}
                  placeholder="Add a role and press Enter or +"
                />
                <button onClick={addRole} className={btnSm}>+</button>
              </div>
              <ul className="mt-2 space-y-1.5">
                {form.roles.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="text-[#10b981] flex-shrink-0">›</span>
                    <span className="flex-1 font-mono">{r}</span>
                    <button
                      onClick={() => removeRole(i)}
                      className="text-white/20 hover:text-red-400 flex-shrink-0"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </Field>

            <Field label="Tagline / Bio (below the typing animation)">
              <input
                className={inputCls}
                value={form.tagline}
                onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                placeholder="e.g. B.Tech CSE @ VIT Chennai · CGPA 9.02 · Building the future..."
              />
            </Field>
          </div>
        </div>

        {/* ── SOCIAL LINKS ── */}
        <div
          className="rounded-2xl p-7"
          style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(16,185,129,0.12)' }}
        >
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#10b981] mb-6">
            Social & Contact Links
          </h2>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="GitHub URL">
                <input
                  className={inputCls}
                  value={form.githubUrl}
                  onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                  placeholder="https://github.com/yourprofile"
                />
              </Field>
              <Field label="LinkedIn URL">
                <input
                  className={inputCls}
                  value={form.linkedinUrl}
                  onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="GitHub Username (for Live Stats Widget)">
                <input
                  className={inputCls}
                  value={form.githubUsername || ''}
                  onChange={e => setForm(f => ({ ...f, githubUsername: e.target.value }))}
                  placeholder="e.g. pulkit31s"
                />
              </Field>
              <Field label="LeetCode Username (for Coding Stats Widget)">
                <input
                  className={inputCls}
                  value={form.leetcodeUsername || ''}
                  onChange={e => setForm(f => ({ ...f, leetcodeUsername: e.target.value }))}
                  placeholder="e.g. pulkit31s"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="LeetCode Widget Visibility">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.showLeetcodeStats ?? true}
                    onChange={e => setForm(f => ({ ...f, showLeetcodeStats: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white/90 font-bold">
                    {form.showLeetcodeStats !== false ? '⚡ Show LeetCode Stats Card' : '🚫 Hide LeetCode Stats Card'}
                  </span>
                </label>
              </Field>

              <Field label="GitHub Activity Widget Visibility">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.showGithubStats ?? true}
                    onChange={e => setForm(f => ({ ...f, showGithubStats: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-white/90 font-bold">
                    {form.showGithubStats !== false ? '⌨ Show GitHub Activity Card' : '🚫 Hide GitHub Activity Card'}
                  </span>
                </label>
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Email Address">
                <input
                  className={inputCls}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label="Phone Number">
                <input
                  className={inputCls}
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* ── CONTACT SECTION ── */}
        <div
          className="rounded-2xl p-7"
          style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(16,185,129,0.12)' }}
        >
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#10b981] mb-6">
            Contact Section
          </h2>

          <div className="flex flex-col gap-4">
            <Field label="Contact Bio Paragraph">
              <textarea
                className={`${inputCls} h-24 resize-none`}
                value={form.contactBio}
                onChange={e => setForm(f => ({ ...f, contactBio: e.target.value }))}
                placeholder="Currently open to internships, research collaborations..."
              />
            </Field>

            <Field label="Footer Text (bottom of page)">
              <input
                className={inputCls}
                value={form.footerText}
                onChange={e => setForm(f => ({ ...f, footerText: e.target.value }))}
                placeholder="YOUR NAME · COLLEGE · DEGREE YEAR"
              />
            </Field>

            <Field label="Resume / CV URL & ATS Page Control">
              <input
                className={inputCls}
                value={form.resumeUrl}
                onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))}
                placeholder="https://drive.google.com/file/d/.../view"
              />
              <p className="text-xs font-mono text-white/20 mt-1.5 mb-3">
                Paste a public shareable PDF link. Visitors will see a single &quot;↓ Resume&quot; button in the Hero.
              </p>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.showAtsResume ?? true}
                  onChange={e => setForm(f => ({ ...f, showAtsResume: e.target.checked }))}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
                <span className="text-xs font-mono text-white/90 font-bold">
                  {form.showAtsResume !== false ? '📄 Enable Live ATS Printable Resume Page (/resume)' : '🚫 Hide ATS Resume Page (/resume)'}
                </span>
              </label>
            </Field>
          </div>
        </div>

        {/* ── SECTION VISIBILITY TOGGLES ── */}
        <div
          className="rounded-2xl p-7"
          style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(16,185,129,0.12)' }}
        >
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#10b981] mb-2">
            Section Visibility Toggles
          </h2>
          <p className="text-xs font-mono text-white/30 mb-6">
            Enable or disable sections on your portfolio home page & navbar. Uncheck any section to completely hide it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'education',      label: 'Education',      icon: '▦' },
              { key: 'skills',         label: 'Skills',         icon: '◎' },
              { key: 'experience',     label: 'Experience',     icon: '◉' },
              { key: 'projects',       label: 'Projects',       icon: '◈' },
              { key: 'achievements',   label: 'Achievements',   icon: '★' },
              { key: 'certifications', label: 'Certifications', icon: '◆' },
            ].map(sec => {
              const currentSections = form.sections || defaultSections;
              const isEnabled = currentSections[sec.key as keyof Sections] ?? true;
              return (
                <label
                  key={sec.key}
                  className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 select-none"
                  style={{
                    background: isEnabled ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isEnabled ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg" style={{ color: isEnabled ? '#10b981' : 'rgba(255,255,255,0.2)' }}>
                      {sec.icon}
                    </span>
                    <span className="text-sm font-mono text-white">
                      {sec.label}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={e => {
                      const checked = e.target.checked;
                      setForm(f => ({
                        ...f,
                        sections: {
                          ...(f.sections || defaultSections),
                          [sec.key]: checked,
                        },
                      }));
                    }}
                    className="w-4 h-4 accent-emerald-500 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={save}
          disabled={loading || !form.name}
          className="w-full py-4 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-2xl disabled:opacity-50 transition-all hover:scale-[1.01] hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #10b981, #00d4ff)',
            boxShadow: '0 0 40px rgba(16,185,129,0.2)',
          }}
        >
          {loading ? 'Saving…' : '✓ Save Profile'}
        </button>
      </div>
    </div>
  );
}
