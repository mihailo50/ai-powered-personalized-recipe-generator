"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { checkAuthStatus } from "@/lib/api-client";
import { createClient } from "@/lib/supabase/browser";

export function Navbar() {
  const { session } = useSupabase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const token = session?.access_token;
        const response = await checkAuthStatus(token);
        setIsLoggedIn(response.isLoggedIn);
      } catch {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkStatus();
  }, [session?.access_token]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          AI Recipe Studio
        </Link>
        <div className="navbar-actions">
          <Link href="/dashboard" className="navbar-btn">
            Home
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/profile" className="navbar-btn">
                Profile
              </Link>
              <button onClick={handleLogout} className="navbar-btn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="navbar-btn">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

