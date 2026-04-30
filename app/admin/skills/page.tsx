'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Skill {
  _id?: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  order: number;
}

const empty: Skill = { name: '', category: 'technical', proficiency: 80, icon: '', order: 0 };

const categoryColors: Record<string, string> = {
  technical: '#00d4ff', frontend: '#7c3aed', backend: '#ec4899', ml: '#f59e0b', data: '#10b981',
};

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#ec4899]/40 focus:outline-none transition-colors placeholder:text-white/20';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function AdminSkills() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [skills, setSkills]     = useState<Skill[]>([]);
  const [form, setForm]         = useState<Skill>(empty);
  const [editing, setEditing]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/skills').then(r => r.json()).then(setSkills).catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/skills/${editing}` : '/api/skills';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Skill updated!' : 'Skill created!');
    setForm(empty); setEditing(null);
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (s: Skill) => { setForm({ ...s, icon: s.icon || '' }); setEditing(s._id!); };

  const cats = ['all', ...Array.from(new Set(skills.map(s => s.category)))];
  const filtered = filterCat === 'all' ? skills : skills.filter(s => s.category === filterCat);

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#ec4899] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Skills <span style={{ color: '#ec4899' }}>CRUD</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#ec4899] bg-[#ec4899]/10 border border-[#ec4899]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(236,72,153,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#ec4899] mb-6">
            {editing ? 'Edit Skill' : 'New Skill'}
          </h2>

          <div className="flex flex-col gap-4">
            <Field label="Skill Name">
              <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. React.js" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['technical', 'frontend', 'backend', 'ml', 'data'].map(c => (
                    <option key={c} value={c} className="bg-[#0d0d1a]">{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Order">
                <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
              </Field>
            </div>

            <Field label={`Proficiency — ${form.proficiency}%`}>
              <input
                type="range" min={1} max={100}
                value={form.proficiency}
                onChange={e => setForm(f => ({ ...f, proficiency: +e.target.value }))}
                className="w-full accent-pink-400 cursor-pointer"
              />
              <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${form.proficiency}%`,
                    background: `linear-gradient(90deg, ${categoryColors[form.category]}99, ${categoryColors[form.category]})`,
                  }}
                />
              </div>
            </Field>

            <Field label="Icon (emoji or text)">
              <input className={inputCls} value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. ⚛ or optional" />
            </Field>

            <div className="flex gap-3 mt-2">
              <button onClick={save} disabled={loading || !form.name} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#ec4899,#7c3aed)' }}>
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
        <div>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {cats.map(c => {
              const color = categoryColors[c] || '#ec4899';
              return (
                <button key={c} onClick={() => setFilterCat(c)}
                  className="px-3 py-1 text-xs font-mono rounded-full transition-all capitalize"
                  style={{
                    background:  filterCat === c ? `${color}18` : 'transparent',
                    border:      `1px solid ${filterCat === c ? color : 'rgba(255,255,255,0.1)'}`,
                    color:       filterCat === c ? color : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.length === 0 && (
              <div className="text-white/20 text-xs font-mono text-center py-10">No skills yet. Create one!</div>
            )}
            {filtered.map(s => {
              const color = categoryColors[s.category] || '#ec4899';
              return (
                <div key={s._id} className="rounded-xl p-4 flex items-center gap-4 transition-all" style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {s.icon && <span className="text-lg flex-shrink-0 w-7 text-center">{s.icon}</span>}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-mono text-white">{s.name}</span>
                      <span className="text-xs font-mono" style={{ color }}>{s.proficiency}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.proficiency}%`, background: `linear-gradient(90deg,${color}80,${color})` }} />
                    </div>
                    <span className="text-xs font-mono capitalize mt-1 inline-block" style={{ color: `${color}70` }}>{s.category}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => startEdit(s)} className="px-3 py-1.5 text-xs font-mono text-[#ec4899] rounded-lg border border-[#ec4899]/20 hover:bg-[#ec4899]/10 transition-all">Edit</button>
                    <button onClick={() => del(s._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
