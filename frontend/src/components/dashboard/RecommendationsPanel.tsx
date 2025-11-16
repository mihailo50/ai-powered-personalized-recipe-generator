"use client";

import { Alert, Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { getRecommendations } from "@/lib/api-client";

export function RecommendationsPanel() {
  const { session } = useSupabase();
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!session?.access_token) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getRecommendations(session.access_token);
        if (active) setItems(res.suggestions || []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load recommendations");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [session?.access_token]);

  if (!session?.access_token) return null;

  return (
    <Box component="section">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Suggestions for you
      </Typography>
      {loading && <CircularProgress size={24} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {items.map((word) => (
          <Chip key={word} label={word} />
        ))}
      </Stack>
      {!loading && items.length === 0 && <Alert severity="info">No suggestions yet. Try generating a few recipes.</Alert>}
    </Box>
  );
}


