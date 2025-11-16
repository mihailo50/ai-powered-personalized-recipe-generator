"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { RecipePlanner } from "@/components/dashboard/RecipePlanner";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { SavedRecipesPanel } from "@/components/dashboard/SavedRecipesPanel";

export default function DashboardPage() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="section-card" style={{ textAlign: "center", padding: "20px" }}>
        <h1 style={{ marginBottom: "8px" }}>Welcome back, chef</h1>
        <p className="muted" style={{ margin: 0 }}>
          Generate a new recipe, revisit saved ideas, or refine your preferences.
        </p>
        <div className="progress-line" style={{ marginTop: "16px" }}></div>
      </div>
      <RecipePlanner />
      <HistoryPanel />
      <SavedRecipesPanel />
    </div>
  );
}

