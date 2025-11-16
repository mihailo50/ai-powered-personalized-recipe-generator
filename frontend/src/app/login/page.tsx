"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

import { AuthForm } from "@/components/auth/AuthForm";
import { useSupabase } from "@/components/providers/SupabaseProvider";

export default function LoginPage() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", maxWidth: "500px", margin: "0 auto" }}>
      <div className="section-card" style={{ width: "100%" }}>
        <h1 style={{ marginBottom: "8px", textAlign: "center" }}>Sign in to personalize your kitchen</h1>
        <p className="muted" style={{ textAlign: "center", marginBottom: "24px" }}>
          Save your preferences, generate recipes on demand, and build smarter shopping lists—powered by AI and your pantry.
        </p>
        <AuthForm />
        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "var(--color-muted)" }}>
          Need an account?{" "}
          <Link href="/register" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

