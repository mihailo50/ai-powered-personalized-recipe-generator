"use client";

import { Alert, Box, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { fetchHistory } from "@/lib/api-client";
import { useTranslation } from "react-i18next";

type HistoryItem = {
  id: string;
  query: string;
  created_at: string;
  ingredients?: string[];
};

export function HistoryPanel() {
  const { session } = useSupabase();
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      if (!session?.access_token) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchHistory(session.access_token);
        if (isMounted) {
          setHistory(response.history as HistoryItem[]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load history");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  if (!session?.access_token) {
    return <Alert severity="info">Sign in to sync your searches.</Alert>;
  }

  return (
    <Box component="section" className="section-card">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }} component="h2">
        {t("dashboard.recentSearches")}
      </Typography>
      {isLoading && <CircularProgress size={24} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {history.length > 0 && (
        <ul className="purple-accent" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {history.map((item) => (
            <li key={item.id} style={{ marginBottom: "12px", padding: "12px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "8px" }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>{item.query || "Saved search"}</div>
              <div style={{ fontSize: "14px", color: "var(--color-muted)" }}>{new Date(item.created_at).toLocaleString()}</div>
              {item.ingredients && (
                <div style={{ fontSize: "14px", marginTop: "4px" }}>Ingredients: {item.ingredients.join(", ")}</div>
              )}
            </li>
          ))}
        </ul>
      )}
      {!isLoading && history.length === 0 && (
        <div style={{ padding: "16px", background: "var(--color-info-bg)", borderRadius: "8px", textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--color-muted)" }}>No searches yet. Generate a recipe to get started.</p>
        </div>
      )}
    </Box>
  );
}

