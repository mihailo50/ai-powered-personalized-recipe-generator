"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { fetchRecipes } from "@/lib/api-client";
import { useTranslation } from "react-i18next";

type RecipeSummary = {
  id: string;
  title: string;
  description?: string;
  servings?: number;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  created_at?: string;
  ingredients?: Array<{ name: string; quantity?: string }>;
  is_favorite?: boolean;
};

type Scope = "mine" | "favorites";

export default function SavedRecipesPage() {
  const { session } = useSupabase();
  const router = useRouter();
  const { t } = useTranslation();
  const [scope, setScope] = useState<Scope>("mine");
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipes() {
      if (!session?.access_token) return;
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ scope, limit: "50" });
        const response = await fetchRecipes(params, session.access_token);
        if (isMounted) {
          const list = (response.recipes as RecipeSummary[]) || [];
          setRecipes(list);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : t("dashboard.failedToLoadRecipes"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session?.access_token) {
      loadRecipes();
    }
    return () => {
      isMounted = false;
    };
  }, [scope, session?.access_token, t]);

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Stack spacing={3}>
        {/* Header */}
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
            {t("dashboard.savedRecipes")}
          </Typography>
          <Box
            sx={{
              width: "64px",
              height: "2px",
              background: "linear-gradient(90deg, #8B5CF6, #7C3AED)",
              margin: "16px auto",
              borderRadius: "1px",
            }}
          />
        </Box>

        {/* Scope Toggle */}
        <Box
          className="section-card"
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ToggleButtonGroup
            size="small"
            exclusive
            value={scope}
            onChange={(_event, value: Scope | null) => {
              if (value) {
                setScope(value);
              }
            }}
            sx={{
              gap: 1,
              "& .MuiToggleButton-root": {
                borderRadius: "9999px",
                px: 2.5,
                py: 0.75,
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.08)",
                  ".dark &": {
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                  },
                },
                ".dark &": {
                  borderColor: "#8B5CF6",
                  color: "#8B5CF6",
                  backgroundColor: "transparent",
                },
              },
              "& .Mui-selected": {
                bgcolor: "var(--color-primary)",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#7C3AED",
                },
                ".dark &": {
                  bgcolor: "#8B5CF6",
                  color: "#FFFFFF",
                  "&:hover": {
                    bgcolor: "#7C3AED",
                  },
                },
              },
            }}
          >
            <ToggleButton value="mine">{t("dashboard.myRecipes")}</ToggleButton>
            <ToggleButton value="favorites">{t("dashboard.favorites")}</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Recipes List */}
        {!isLoading && !error && (
          <Stack spacing={2}>
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                component={Link}
                href={`/recipes/${recipe.id}`}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.15)",
                  },
                  ".dark &": {
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                    "&:hover": {
                      borderColor: "#8B5CF6",
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                    },
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          mb: 0.5,
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {recipe.title}
                      </Typography>
                      {recipe.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                          }}
                        >
                          {recipe.description}
                        </Typography>
                      )}
                      <Stack direction="row" spacing={2} mt={1} flexWrap="wrap" gap={1}>
                        {recipe.prep_time_minutes && (
                          <Typography variant="body2" color="text.secondary">
                            {t("dashboard.prep")}: {recipe.prep_time_minutes} {t("dashboard.min")}
                          </Typography>
                        )}
                        {recipe.cook_time_minutes && (
                          <Typography variant="body2" color="text.secondary">
                            {t("dashboard.cook")}: {recipe.cook_time_minutes} {t("dashboard.min")}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    {recipe.servings && (
                      <Chip
                        size="small"
                        label={`${recipe.servings} ${recipe.servings > 1 ? t("dashboard.servingsPlural") : t("dashboard.serving")}`}
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 2, flexShrink: 0 }}
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
            {recipes.length === 0 && (
              <Box
                sx={{
                  padding: "32px",
                  background: "var(--color-info-bg)",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" sx={{ color: "var(--color-muted)" }}>
                  {scope === "favorites" ? t("dashboard.noFavoritesYet") : t("dashboard.noRecipesYet")}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}

