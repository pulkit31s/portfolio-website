'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';

const IDLE_MS = 10 * 60 * 1000; // 10 min
const WARN_MS =  9 * 60 * 1000; // warn at 9 min (60s countdown)
const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const;

export default function AdminIdleGuard() {
  const { status } = useSession();
  const [remaining, setRemaining] = useState<number | null>(null);
  const idleRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const warnRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    if (idleRef.current)  clearTimeout(idleRef.current);
    if (warnRef.current)  clearTimeout(warnRef.current);
    if (countRef.current) clearInterval(countRef.current);
  }, []);

  const reset = useCallback(() => {
    clearAll();
    setRemaining(null);

    // Show warning banner at 4 minutes idle (1 minute left)
    warnRef.current = setTimeout(() => {
      let secs = 60;
      setRemaining(secs);
      countRef.current = setInterval(() => {
        secs -= 1;
        setRemaining(secs);
        if (secs <= 0) clearInterval(countRef.current!);
      }, 1000);
    }, WARN_MS);

    // Auto sign-out at 5 minutes idle
    idleRef.current = setTimeout(() => {
      clearAll();
      signOut({ callbackUrl: '/admin/login' });
    }, IDLE_MS);
  }, [clearAll]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    reset();
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));
    return () => {
      clearAll();
      EVENTS.forEach(e => window.removeEventListener(e, reset));
    };
  }, [status, reset, clearAll]);

  if (!remaining || remaining <= 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-4 px-6 py-3.5 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4"
      style={{
        background: 'rgba(13,13,26,0.97)',
        border: '1px solid rgba(239,68,68,0.45)',
        boxShadow: '0 0 40px rgba(239,68,68,0.12)',
      }}
    >
      <span className="text-red-400 text-xl">⚠</span>
      <div>
        <p className="text-sm font-mono text-white font-bold">
          Session expiring in{' '}
          <span className="text-red-400 tabular-nums">{remaining}s</span>
        </p>
        <p className="text-[11px] font-mono text-white/40">
          Move your mouse or press any key to stay logged in
        </p>
      </div>
      <button
        onClick={reset}
        className="ml-2 px-4 py-2 text-xs font-mono font-bold text-black rounded-xl transition-all hover:scale-105 shrink-0"
        style={{ background: 'linear-gradient(135deg,#10b981,#00d4ff)' }}
      >
        Stay Logged In
      </button>
    </div>
  );
}
