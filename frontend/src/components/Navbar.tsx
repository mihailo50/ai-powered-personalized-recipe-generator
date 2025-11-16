"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { checkAuthStatus } from "@/lib/api-client";

export function Navbar() {
  const { session, supabase } = useSupabase();
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
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  if (isLoading || !isLoggedIn) {
    return null;
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
          <Link href="/profile" className="navbar-btn">
            Profile
          </Link>
          <button onClick={handleLogout} className="navbar-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

