"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Clears Supabase session and redirects to login page.
 * This should be called when the backend returns a 401 with auth_required code.
 */
export async function handleAuthRedirect(loginUrl: string = "/login"): Promise<never> {
  try {
    // Clear Supabase session to avoid redirect loops
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
  } catch (error) {
    // Even if signOut fails, we should still redirect
    console.error("Failed to clear Supabase session:", error);
  }

  // Use window.location for redirect (works in all contexts, including non-React)
  if (typeof window !== "undefined") {
    window.location.href = loginUrl;
  }

  // Return a rejected promise to halt further processing
  return Promise.reject(new Error("Redirecting to login"));
}

