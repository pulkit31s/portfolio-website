'use client';
import { useEffect, useState } from 'react';

interface Profile {
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  contactBio: string;
  footerText: string;
}

const defaultProfile: Profile = {
  email: 'hello@example.com',
  phone: '+1 (000) 000-0000',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  contactBio: "Currently open to internships, research collaborations, and full-stack opportunities. Let's connect!",
  footerText: 'PULKIT · VIT CHENNAI · B.TECH CSE 2027',
};

const inputCls =
  'w-full px-4 py-3 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20 resize-none';

export default function Contact() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  // Contact form state
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [formMsg, setFormMsg] = useState('');
  const [formOk, setFormOk]   = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { if (data && data.email) setProfile(data); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFormMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setFormOk(true);
        setFormMsg('Message sent! I\'ll get back to you shortly.');
        setName(''); setEmail(''); setMessage('');
      } else {
        setFormOk(false);
        setFormMsg('Failed to send. Please try emailing directly.');
      }
    } catch {
      setFormOk(false);
      setFormMsg('Network error. Please try emailing directly.');
    }
    setSending(false);
    setTimeout(() => setFormMsg(''), 6000);
  };

  const links = [
    { label: 'Email',    href: `mailto:${profile.email}`,   value: profile.email,                                   icon: '✉' },
    { label: 'LinkedIn', href: profile.linkedinUrl,          value: profile.linkedinUrl.replace('https://', ''),     icon: '◈' },
    { label: 'GitHub',   href: profile.githubUrl,            value: profile.githubUrl.replace('https://', ''),       icon: '◎' },
    { label: 'Phone',    href: `tel:${profile.phone.replace(/\s+/g, '')}`, value: profile.phone,                    icon: '◉' },
  ];

  return (
    <section id="contact" className="py-32 px-6 max-w-5xl mx-auto">
      <div className="mb-16 text-center">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">07 — Contact</p>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Courier New', monospace" }}>
          Let's Build
          <br />
          <span style={{ WebkitTextStroke: '1px rgba(0,212,255,0.5)', color: 'transparent' }}>
            Something.
          </span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed">
          {profile.contactBio}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div
          className="rounded-2xl p-8"
          style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(10px)' }}
        >
          <h3 className="text-sm font-mono tracking-widest uppercase text-[#00d4ff] mb-6">Send a Message</h3>

          {formMsg && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-xs font-mono"
              style={{
                color:      formOk ? '#10b981' : '#f87171',
                background: formOk ? 'rgba(16,185,129,0.08)' : 'rgba(248,113,113,0.08)',
                border:     `1px solid ${formOk ? 'rgba(16,185,129,0.2)' : 'rgba(248,113,113,0.2)'}`,
              }}
            >
              {formMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Name</label>
              <input
                className={inputCls}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Email</label>
              <input
                type="email"
                className={inputCls}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Message</label>
              <textarea
                className={`${inputCls} h-32`}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                required
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3.5 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}
            >
              {sending ? 'Sending…' : 'Send Message →'}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-sm font-mono tracking-widest uppercase text-white/30 mb-5">Or reach out directly</h3>
            <div className="flex flex-col gap-3">
              {links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-x-1"
                  style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)')}
                >
                  <span className="text-lg text-[#00d4ff] w-7 text-center flex-shrink-0">{l.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-white/30 mb-0.5">{l.label}</div>
                    <div className="text-xs text-white/60 group-hover:text-[#00d4ff] transition-colors font-mono truncate">{l.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick email CTA */}
          <a
            href={`mailto:${profile.email}`}
            className="block text-center py-3 text-xs font-mono tracking-widest uppercase text-white/20 hover:text-[#00d4ff] transition-colors border border-white/5 hover:border-[#00d4ff]/20 rounded-xl"
          >
            Or just say hello at {profile.email}
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-white/5 text-center">
        <p className="text-white/20 text-xs font-mono tracking-widest">{profile.footerText}</p>
        <p className="text-white/10 text-xs font-mono mt-2">Built with Next.js · Three.js · MongoDB</p>
      </div>
    </section>
  );
}
