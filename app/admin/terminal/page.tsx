'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Cmd {
  _id?: string;
  command: string;
  output: string;
  category?: string;
  order: number;
}

const empty: Cmd = { command: '', output: '', category: 'custom', order: 0 };

export default function AdminTerminal() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [commands, setCommands] = useState<Cmd[]>([]);
  const [form, setForm]         = useState<Cmd>(empty);
  const [editing, setEditing]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [msg, setMsg]           = useState('');

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/commands')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCommands(data); })
      .catch(() => {});

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const save = async () => {
    if (!form.command.trim() || !form.output.trim()) return;
    setLoading(true);
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/commands/${editing}` : '/api/commands';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, command: form.command.toLowerCase().trim() }),
    });
    setMsg(editing ? 'Command updated!' : 'Command created!');
    setForm(empty);
    setEditing(null);
    load();
    setTimeout(() => setMsg(''), 3000);
    setLoading(false);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this terminal command?')) return;
    await fetch(`/api/commands/${id}`, { method: 'DELETE' });
    load();
  };

  const startEdit = (c: Cmd) => {
    setForm(c);
    setEditing(c._id!);
  };

  if (status === 'loading' || !session) return null;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-white/30 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
        <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
          Terminal <span style={{ color: '#00d4ff' }}>Commands Manager</span>
        </h1>
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-xl text-xs font-mono text-[#00d4ff] bg-[#00d4ff]/10 border border-[#00d4ff]/20">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="rounded-2xl p-7" style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(0,212,255,0.12)' }}>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#00d4ff] mb-6">
            {editing ? 'Edit Command' : 'Add Custom Command'}
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Command Name (lowercase)</label>
              <input
                className="w-full px-3 py-2.5 rounded-xl text-sm font-mono text-cyan-400 bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none"
                value={form.command}
                onChange={e => setForm(f => ({ ...f, command: e.target.value }))}
                placeholder="e.g. hire, bio, research, stack"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Command Output Response</label>
              <textarea
                className="w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none h-32 resize-none"
                value={form.output}
                onChange={e => setForm(f => ({ ...f, output: e.target.value }))}
                placeholder="Output text printed to the terminal when visitors run this command..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Order</label>
                <input
                  type="number"
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10"
                  value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: +e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-white/30 mb-1.5 tracking-widest uppercase">Category</label>
                <input
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10"
                  value={form.category || 'custom'}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={save}
                disabled={loading || !form.command || !form.output}
                className="flex-1 py-3 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#7c3aed)' }}
              >
                {loading ? 'Saving...' : editing ? 'Update Command' : 'Save Command'}
              </button>
              {editing && (
                <button
                  onClick={() => { setForm(empty); setEditing(null); }}
                  className="px-4 py-3 text-sm font-mono text-white/40 rounded-xl border border-white/10 hover:text-red-400 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Commands List */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">
            Available Terminal Commands ({commands.length})
          </div>

          {commands.length === 0 && (
            <div className="text-white/20 text-xs font-mono text-center py-10">No custom commands added yet.</div>
          )}

          {commands.map(c => (
            <div
              key={c._id}
              className="rounded-2xl p-4 flex items-start justify-between gap-4 border border-white/10 bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold font-mono text-cyan-400">${c.command}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/40">{c.category}</span>
                </div>
                <p className="text-xs font-mono text-white/60 line-clamp-2">{c.output}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(c)} className="px-3 py-1.5 text-xs font-mono text-[#00d4ff] rounded-lg border border-[#00d4ff]/20">Edit</button>
                <button onClick={() => del(c._id!)} className="px-3 py-1.5 text-xs font-mono text-red-400 rounded-lg border border-red-500/20">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
