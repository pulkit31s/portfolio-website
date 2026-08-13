'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Education {
  _id?: string;
  degree: string;
  branch: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number | '';
  current: boolean;
  cgpa: number | '';
  percentage: number | '';
  coursework: string[];
  order: number;
}

const empty: Education = {
  degree: '', branch: '', institution: '', location: '',
  startYear: new Date().getFullYear(), endYear: '', current: true,
  cgpa: '', percentage: '', coursework: [], order: 0,
};

const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20';
const btnSm    = 'px-3 py-2.5 text-sm font-mono text-[#00d4ff] rounded-xl border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">{label}</label>
      {children}
    </div>
  );
}

export default function AdminEducation() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [list, setList]           = useState<Education[]>([]);
  const [form, setForm]           = useState<Education>(empty);
  const [editing, setEditing]     = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState('');
  const [courseInput, setCourseInput] = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/education').then(r => r.json()).then(setList).catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/education/${editing}` : '/api/education';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setMsg(editing ? 'Education updated!' : 'Education created!');
    setForm(empty); setEditing(null); setCourseInput('');
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    await fetch(`/api/education/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (e: Education) => { setForm({ ...e }); setEditing(e._id!); };

  const addCourse = () => {
    if (courseInput.trim()) {
      setForm(f => ({ ...f, coursework: [...f.coursework, courseInput.trim()] }));
      setCourseInput('');
    }
  };

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Education <span style={{ color: '#00d4ff' }}>CRUD</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#00d4ff] mb-6">
            {editing ? 'Edit Entry' : 'New Entry'}
          </h2>

          <div className="flex flex-col gap-4">
            <Field label="Degree">
              <input className={inputCls} value={form.degree} onChange={e => setForm(f => ({ ...f, degree: e.target.value }))} placeholder="e.g. B.Tech, 12th (CBSE), Diploma" />
            </Field>

            <Field label="Branch / Stream">
              <input className={inputCls} value={form.branch} onChange={e => setForm(f => ({ ...f, branch: e.target.value }))} placeholder="e.g. Computer Science & Engineering" />
            </Field>

            <Field label="Institution">
              <input className={inputCls} value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. VIT Chennai" />
            </Field>

            <Field label="Location">
              <input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="e.g. Chennai, India" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Year">
                <input type="number" className={inputCls} value={form.startYear} onChange={e => setForm(f => ({ ...f, startYear: +e.target.value }))} />
              </Field>
              <Field label="End Year">
                <input type="number" className={inputCls} value={form.endYear} onChange={e => setForm(f => ({ ...f, endYear: e.target.value === '' ? '' : +e.target.value }))} disabled={form.current} placeholder="Leave blank if current" />
              </Field>
            </div>

            <Field label="Currently Studying">
              <div className="flex items-center gap-2 h-[38px]">
                <input type="checkbox" checked={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.checked, endYear: e.target.checked ? '' : f.endYear }))} className="w-4 h-4 accent-cyan-400" />
                <span className="text-xs font-mono text-white/40">Mark as ongoing</span>
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="CGPA (out of 10)">
                <input type="number" step="0.01" min="0" max="10" className={inputCls} value={form.cgpa} onChange={e => setForm(f => ({ ...f, cgpa: e.target.value === '' ? '' : +e.target.value }))} placeholder="e.g. 9.02" />
              </Field>
              <Field label="Percentage (%)">
                <input type="number" step="0.1" min="0" max="100" className={inputCls} value={form.percentage} onChange={e => setForm(f => ({ ...f, percentage: e.target.value === '' ? '' : +e.target.value }))} placeholder="e.g. 95.2" />
              </Field>
            </div>

            <Field label="Relevant Coursework">
              <div className="flex gap-2">
                <input className={`${inputCls} flex-1`} value={courseInput} onChange={e => setCourseInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCourse())} placeholder="Add subject and press Enter or +" />
                <button onClick={addCourse} className={btnSm}>+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.coursework.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 px-2 py-0.5 text-xs font-mono rounded" style={{ background: 'rgba(0,212,255,0.08)', color: 'rgba(0,212,255,0.7)', border: '1px solid rgba(0,212,255,0.15)' }}>
                    {c}
                    <button onClick={() => setForm(f => ({ ...f, coursework: f.coursework.filter((_, j) => j !== i) }))} className="text-white/30 hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </Field>

            <Field label="Order">
              <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: +e.target.value }))} />
            </Field>

            <div className="flex gap-3 mt-2">
              <button onClick={save} disabled={loading || !form.degree || !form.institution} className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all hover:scale-[1.02]" style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}>
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
            <div className="text-white/20 text-xs font-mono text-center py-10">No education entries yet. Add one!</div>
          )}
          {list.map(edu => (
            <div key={edu._id} className="rounded-xl p-5 transition-all" style={{ background: 'rgba(13,13,26,0.6)', border: '1px solid rgba(0,212,255,0.08)' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white font-mono">{edu.degree} — {edu.branch}</p>
                  <p className="text-xs text-white/40 font-mono mt-0.5">{edu.institution}</p>
                  <p className="text-xs text-white/25 font-mono mt-0.5">{edu.startYear} — {edu.current ? 'Present' : edu.endYear}</p>
                  {edu.cgpa && <p className="text-xs text-[#00d4ff]/60 font-mono mt-0.5">CGPA: {edu.cgpa}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(edu)} className="px-3 py-1.5 text-xs font-mono text-[#00d4ff] rounded-lg border border-[#00d4ff]/20 hover:bg-[#00d4ff]/10 transition-all">Edit</button>
                  <button onClick={() => del(edu._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-all">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
