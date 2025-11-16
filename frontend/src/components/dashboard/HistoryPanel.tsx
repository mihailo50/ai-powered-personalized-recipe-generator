"use client";

import { Alert, Box, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { fetchHistory } from "@/lib/api-client";

type HistoryItem = {
  id: string;
  query: string;
  created_at: string;
  ingredients?: string[];
};

export function HistoryPanel() {
  const { session } = useSupabase();
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
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Recent searches
      </Typography>
      {isLoading && <CircularProgress size={24} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2}>
        {history.map((item) => (
          <Card key={item.id} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                {item.query || "Saved search"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(item.created_at).toLocaleString()}
              </Typography>
              {item.ingredients && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Ingredients: {item.ingredients.join(", ")}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
        {!isLoading && history.length === 0 && (
          <Alert severity="info" sx={{ bgcolor: "var(--color-info-bg)" }}>
            No searches yet. Generate a recipe to get started.
          </Alert>
        )}
      </Stack>
    </Box>
  );
}

