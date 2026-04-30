'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email, password, redirect: false,
    });

    if (res?.ok) {
      router.push('/admin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#050508' }}>
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className="relative w-full max-w-sm rounded-2xl p-8"
        style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(0,212,255,0.12)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="text-3xl font-black text-white mb-1"
            style={{ fontFamily: "'Courier New', monospace", textShadow: '0 0 20px rgba(0,212,255,0.5)' }}
          >
            P<span style={{ color: '#00d4ff' }}>.</span>
          </div>
          <p className="text-white/30 text-xs font-mono tracking-widest uppercase">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-mono text-white/40 mb-2 tracking-widest uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/40 mb-2 tracking-widest uppercase">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm font-mono text-white bg-white/5 border border-white/10 focus:border-[#00d4ff]/40 focus:outline-none transition-colors placeholder:text-white/20"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="px-3 py-2 rounded-lg text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
          >
            {loading ? 'Authenticating...' : 'Enter →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs font-mono text-white/20 hover:text-[#00d4ff] transition-colors tracking-widest uppercase">
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
