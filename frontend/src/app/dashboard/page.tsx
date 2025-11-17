"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Typography, Container, Stack } from "@mui/material";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { RecipePlanner } from "@/components/dashboard/RecipePlanner";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { SavedRecipesPanel } from "@/components/dashboard/SavedRecipesPanel";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { session } = useSupabase();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  const userName = session?.user?.user_metadata?.display_name || session?.user?.email?.split("@")[0] || "chef";

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Stack spacing={3}>
        {/* Greeting Card */}
        <Box
          className="section-card"
          sx={{
            textAlign: "center",
            py: 3,
            animation: "fadeInUp 0.3s ease-out both",
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "28px", sm: "32px" },
              fontWeight: 700,
              mb: 1,
              color: "var(--color-text)",
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {t("common.welcome", { name: userName })}
          </Typography>
          {/* Thin purple underline */}
          <Box
            sx={{
              width: "64px",
              height: "2px",
              background: "linear-gradient(90deg, #8B5CF6, #7C3AED)",
              margin: "16px auto",
              borderRadius: "1px",
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              mt: 2,
            }}
          >
            {t("dashboard.greeting")}
          </Typography>
        </Box>

        {/* Recipe Planner Card */}
        <RecipePlanner />

        {/* History and Saved Recipes - Stack on mobile, side by side on desktop */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          <HistoryPanel />
          <SavedRecipesPanel />
        </Box>
      </Stack>
    </Container>
  );
}
