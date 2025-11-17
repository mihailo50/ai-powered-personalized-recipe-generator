"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SupabaseContextValue = {
  session: Session | null;
  supabase: ReturnType<typeof createSupabaseBrowserClient>;
};

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

type SupabaseProviderProps = {
  children: ReactNode;
  initialSession: Session | null;
};

export function SupabaseProvider({ children, initialSession }: SupabaseProviderProps) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [session, setSession] = useState<Session | null>(initialSession);

  useEffect(() => {
    // Only set up auth listener if we're in the browser (client-side)
    if (typeof window === "undefined") return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <SupabaseContext.Provider value={{ session, supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within SupabaseProvider");
  }
  return context;
}

