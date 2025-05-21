// /hooks/useSession.ts
import { useEffect, useState } from 'react';
import { UserSession } from './../lib/session';

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setSession(data.user || null);
      setLoading(false);
    }
    loadSession();
  }, []);

  return { session, loading };
}