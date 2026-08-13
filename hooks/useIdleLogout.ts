'use client';
import { useEffect, useRef, useCallback } from 'react';
import { signOut } from 'next-auth/react';

const IDLE_MS = 5 * 60 * 1000; // 5 minutes
const WARN_MS = 4 * 60 * 1000; // warn at 4 minutes

const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];

export function useIdleLogout() {
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (idleTimer.current)  clearTimeout(idleTimer.current);
    if (warnTimer.current)  clearTimeout(warnTimer.current);
  }, []);

  const reset = useCallback(() => {
    clear();

    warnTimer.current = setTimeout(() => {
      // Show a subtle console warning (no intrusive alert)
      console.warn('[Admin] Session expiring in 1 minute due to inactivity.');
    }, WARN_MS);

    idleTimer.current = setTimeout(() => {
      signOut({ callbackUrl: '/admin/login' });
    }, IDLE_MS);
  }, [clear]);

  useEffect(() => {
    // Start timer on mount
    reset();

    // Reset timer on any user activity
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));

    return () => {
      clear();
      EVENTS.forEach(e => window.removeEventListener(e, reset));
    };
  }, [reset, clear]);
}
