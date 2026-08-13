'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { if (status === 'unauthenticated') router.push('/admin/login'); }, [status, router]);

  const load = () =>
    fetch('/api/messages')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
          if (data.length > 0 && !selected) setSelected(data[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  const toggleRead = async (msg: Message) => {
    const newRead = !msg.read;
    await fetch(`/api/messages/${msg._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: newRead }),
    });
    setMessages(prev => prev.map(m => (m._id === msg._id ? { ...m, read: newRead } : m)));
    if (selected?._id === msg._id) setSelected(s => s ? { ...s, read: newRead } : null);
  };

  const del = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  if (status === 'loading' || !session) return null;

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-white/30 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase">← Back</Link>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Courier New', monospace" }}>
            Messages <span style={{ color: '#00d4ff' }}>Inbox</span>
          </h1>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30">
            {unreadCount} Unread
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="flex flex-col gap-3">
          {messages.length === 0 && !loading && (
            <div className="rounded-2xl p-8 text-center border border-white/10 bg-white/5 text-white/30 text-xs font-mono">
              📬 No contact messages yet.
            </div>
          )}

          {messages.map(m => {
            const isSelected = selected?._id === m._id;
            return (
              <button
                key={m._id}
                onClick={() => {
                  setSelected(m);
                  if (!m.read) toggleRead(m);
                }}
                className="w-full text-left p-4 rounded-2xl transition-all duration-300 relative border select-none"
                style={{
                  background: isSelected ? 'rgba(0,212,255,0.08)' : 'rgba(13,13,26,0.6)',
                  borderColor: isSelected ? 'rgba(0,212,255,0.4)' : m.read ? 'rgba(255,255,255,0.06)' : 'rgba(16,185,129,0.3)',
                }}
              >
                {!m.read && (
                  <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                )}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white truncate">{m.name}</span>
                  <span className="text-[10px] font-mono text-white/30">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-[#00d4ff] font-mono truncate mb-1">{m.subject || 'General Inquiry'}</div>
                <div className="text-xs text-white/40 line-clamp-1">{m.message}</div>
              </button>
            );
          })}
        </div>

        {/* Message Reader Pane */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-3xl p-8 relative flex flex-col justify-between min-h-[400px]" style={{ background: 'rgba(13,13,26,0.85)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono text-[#00d4ff] uppercase tracking-widest">
                      {selected.subject || 'General Inquiry'}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1" style={{ fontFamily: "'Courier New', monospace" }}>
                      {selected.name}
                    </h2>
                    <a href={`mailto:${selected.email}`} className="text-xs font-mono text-white/50 hover:text-[#00d4ff]">
                      📧 {selected.email}
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRead(selected)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono transition-all border"
                      style={{
                        background: selected.read ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.15)',
                        color: selected.read ? 'rgba(255,255,255,0.5)' : '#10b981',
                        borderColor: selected.read ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.3)',
                      }}
                    >
                      {selected.read ? 'Mark Unread' : '✓ Read'}
                    </button>
                    <button
                      onClick={() => del(selected._id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="text-xs font-mono text-white/30 mb-4">
                  Received on: {new Date(selected.createdAt).toLocaleString()}
                </div>

                <div className="text-sm font-sans text-white/80 leading-relaxed whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5">
                  {selected.message}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Portfolio Message')}`}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase text-black bg-[#00d4ff] hover:bg-[#00d4ff]/80 transition-all shadow-lg"
                >
                  ✉️ Reply via Email →
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl p-12 text-center text-white/20 text-xs font-mono border border-white/10 bg-white/5 flex items-center justify-center min-h-[300px]">
              Select a message from the left to read.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
