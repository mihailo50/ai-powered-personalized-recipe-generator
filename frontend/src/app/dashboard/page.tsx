"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
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
    <Container component="main" maxWidth="lg" sx={{ py: 8, display: "flex", flexDirection: "column", gap: 4 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <div>
          <Typography variant="overline" color="primary">
            Dashboard
          </Typography>
          <Typography variant="h3" fontWeight={600}>
            Welcome back, chef
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate a new recipe, revisit saved ideas, or refine your preferences.
          </Typography>
        </div>
        <Box>
          <Typography variant="body2" color="text.secondary">
            Need the marketing site?
          </Typography>
          <Link href="/" style={{ color: "#4f46e5" }}>
            Return home
          </Link>
        </Box>
      </Stack>
      <RecipePlanner />
      <HistoryPanel />
      <SavedRecipesPanel />
    </Container>
  );
}

