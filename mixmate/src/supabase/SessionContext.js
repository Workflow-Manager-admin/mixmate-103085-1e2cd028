import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './client';

const SessionContext = createContext(undefined);

export function SessionContextProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setSession(data?.session);
      setUser(data?.session?.user || null);
    };
    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, user }}>
      {children}
    </SessionContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useSession() {
  return useContext(SessionContext);
}
