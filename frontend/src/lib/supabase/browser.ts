"use client";

import { createBrowserClient } from "@supabase/ssr";

// Lazy initialization to avoid build-time errors
let _client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  // Return cached client if already created
  if (_client) {
    return _client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build/SSR (when window is undefined), create a placeholder
  // This allows the build to complete, but the client will fail gracefully at runtime
  if (typeof window === "undefined") {
    // Return a minimal mock that satisfies TypeScript but won't work at runtime
    // This is only for build-time, actual usage will happen client-side
    return {
      auth: {
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signOut: async () => ({ error: new Error("Supabase not configured") }),
        signInWithOAuth: async () => ({ error: new Error("Supabase not configured") }),
        signInWithPassword: async () => ({ error: new Error("Supabase not configured") }),
      },
    } as any;
  }

  // Client-side: validate env vars and create real client
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  _client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

