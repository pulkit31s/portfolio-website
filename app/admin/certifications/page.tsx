'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  category: string;
  description: string;
  order: number;
}

const empty: Certification = {
  title: '', issuer: '', date: '', credentialUrl: '', category: 'cloud', description: '', order: 0,
};

const categories = ['cloud', 'programming', 'ml-ai', 'web', 'database', 'other'];

const categoryColors: Record<string, string> = {
  cloud: '#00d4ff', programming: '#7c3aed', 'ml-ai': '#f59e0b',
  web: '#ec4899', database: '#10b981', other: '#6b7280',
};

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#10b981]/40 focus:outline-none transition-colors placeholder:text-white/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function AdminCertifications() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList]       = useState<Certification[]>([]);
  const [form, setForm]       = useState<Certification>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/certifications').then(r => r.json()).then(setList).catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/certifications/${editing}` : '/api/certifications';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Certification updated!' : 'Certification created!');
    setForm(empty); setEditing(null);
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (c: Certification) => { setForm({ ...c }); setEditing(c._id!); };

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#10b981] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Certifications <span style={{ color: '#10b981' }}>CRUD</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(16,185,129,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#10b981] mb-6">
            {editing ? 'Edit Certification' : 'New Certification'}
          </h2>

          <div className="flex flex-col gap-4">
            <Field label="Certification Title">
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. AWS Certified Solutions Architect" />
            </Field>

            <Field label="Issuing Organisation">
              <input className={inputCls} value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} placeholder="e.g. Amazon Web Services" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date Issued">
                <input className={inputCls} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="e.g. Jul 2025" />
              </Field>
              <Field label="Category">
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-[#0d0d1a] capitalize">{c}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Credential URL">
              <input className={inputCls} value={form.credentialUrl} onChange={e => setForm(f => ({ ...f, credentialUrl: e.target.value }))} placeholder="https://credentials.aws.amazon.com/..." />
            </Field>

            <Field label="Description (optional)">
              <textarea className={`${inputCls} h-20 resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description of what this certification covers..." />
            </Field>

            <Field label="Order">
              <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
            </Field>

            <div className="flex gap-3 mt-2">
              <button onClick={save} disabled={loading || !form.title || !form.issuer} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#10b981,#00d4ff)' }}>
                {loading ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
              {editing && (
                <button onClick={() => { setForm(empty); setEditing(null); }} className="px-4 py-3 text-sm font-mono text-white/40 rounded-xl border border-white/10 hover:border-red-500/30 hover:text-red-400 transition-all">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {list.length === 0 && (
            <div className="text-white/20 text-xs font-mono text-center py-10">No certifications yet. Add one!</div>
          )}
          {list.map(cert => {
            const color = categoryColors[cert.category] || '#6b7280';
            return (
              <div key={cert._id} className="rounded-xl p-5 transition-all" style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-black text-white font-mono">{cert.title}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded font-mono capitalize" style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}>{cert.category}</span>
                    </div>
                    <p className="text-xs text-white/40 font-mono">{cert.issuer} · {cert.date}</p>
                    {cert.credentialUrl && <p className="text-xs text-[#10b981]/50 font-mono mt-0.5 truncate">🔗 Credential linked</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(cert)} className="px-3 py-1.5 text-xs font-mono text-[#10b981] rounded-lg border border-[#10b981]/20 hover:bg-[#10b981]/10 transition-all">Edit</button>
                    <button onClick={() => del(cert._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
