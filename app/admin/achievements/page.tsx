'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Achievement {
  _id?: string;
  title: string;
  event: string;
  year: number;
  description: string;
  rank: string;
  international: boolean;
  order: number;
}

const empty: Achievement = {
  title: '', event: '', year: new Date().getFullYear(), description: '',
  rank: '', international: false, order: 0,
};

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#f59e0b]/40 focus:outline-none transition-colors placeholder:text-white/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function AdminAchievements() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [form, setForm]                 = useState<Achievement>(empty);
  const [editing, setEditing]           = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [msg, setMsg]                   = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/achievements').then(r => r.json()).then(setAchievements).catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/achievements/${editing}` : '/api/achievements';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Achievement updated!' : 'Achievement created!');
    setForm(empty); setEditing(null);
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this achievement?')) return;
    await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (a: Achievement) => { setForm({ ...a, rank: a.rank || '' }); setEditing(a._id!); };

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#f59e0b] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Achievements <span style={{ color: '#f59e0b' }}>CRUD</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#f59e0b] mb-6">
            {editing ? 'Edit Achievement' : 'New Achievement'}
          </h2>

          <div className="flex flex-col gap-4">
            <Field label="Title">
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 3rd Place, Spectrum'25 Hackathon" />
            </Field>

            <Field label="Event Name">
              <input className={inputCls} value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value }))} placeholder="e.g. Spectrum'25" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Year">
                <input type="number" className={inputCls} value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} min={2000} max={2100} />
              </Field>
              <Field label="Rank / Position">
                <input className={inputCls} value={form.rank} onChange={e => setForm(f => ({ ...f, rank: e.target.value }))} placeholder="e.g. 3rd Place" />
              </Field>
            </div>

            <Field label="Description">
              <textarea className={`${inputCls} h-24 resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what you built or achieved..." />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="International Event">
                <div className="flex items-center gap-2 h-[42px]">
                  <input type="checkbox" checked={form.international} onChange={e => setForm(f => ({ ...f, international: e.target.checked }))} className="w-4 h-4 accent-amber-400" />
                  <span className="text-xs font-mono text-white/40">🌐 International</span>
                </div>
              </Field>
              <Field label="Order">
                <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
              </Field>
            </div>

            <div className="flex gap-3 mt-2">
              <button onClick={save} disabled={loading || !form.title || !form.event} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#f59e0b,#ec4899)' }}>
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
          {achievements.length === 0 && (
            <div className="text-white/20 text-xs font-mono text-center py-10">No achievements yet. Add one!</div>
          )}
          {achievements.map((a, i) => (
            <div key={a._id} className="rounded-xl p-5 transition-all" style={{ background: 'rgba(13,13,26,0.6)', border: `1px solid ${a.international ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.06)'}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>{a.title}</span>
                    {a.international && <span className="text-xs px-1.5 py-0.5 rounded font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20">🌐 Intl</span>}
                  </div>
                  <p className="text-xs text-white/40 font-mono">{a.event} · {a.year}</p>
                  {a.rank && <p className="text-xs text-[#f59e0b]/60 font-mono mt-0.5">{a.rank}</p>}
                  <p className="text-xs text-white/30 mt-1 line-clamp-2">{a.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(a)} className="px-3 py-1.5 text-xs font-mono text-[#f59e0b] rounded-lg border border-[#f59e0b]/20 hover:bg-[#f59e0b]/10 transition-all">Edit</button>
                  <button onClick={() => del(a._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
