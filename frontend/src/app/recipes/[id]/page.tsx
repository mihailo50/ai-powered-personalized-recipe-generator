"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder, ArrowBack } from "@mui/icons-material";
import Link from "next/link";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { fetchRecipeById, toggleFavorite } from "@/lib/api-client";
import { useTranslation } from "react-i18next";

type Recipe = {
  id: string;
  title: string;
  description: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  ingredients: { name: string; quantity?: string }[];
  instructions: { step: number; description: string }[];
  nutrition?: Record<string, number>;
  shopping_list?: string[];
  is_favorite?: boolean;
};

export default function RecipeDetailPage() {
  const { session } = useSupabase();
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const recipeId = params.id as string;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipe() {
      if (!session?.access_token || !recipeId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchRecipeById(recipeId, session.access_token);
        if (isMounted) {
          const recipeData = response.recipe as Recipe;
          setRecipe(recipeData);
          setIsFavorite(recipeData.is_favorite || false);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            // Handle specific error types
            if (err.message.includes("404")) {
              setError("Recipe not found");
            } else if (err.message.includes("503")) {
              setError("Service temporarily unavailable. Please try again later.");
            } else if (err.message.includes("401")) {
              // Auth redirect is handled by API client
              setError("Authentication required");
            } else {
              setError(err.message || "Failed to load recipe");
            }
          } else {
            setError("Failed to load recipe");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (session?.access_token && recipeId) {
      loadRecipe();
    }
    return () => {
      isMounted = false;
    };
  }, [recipeId, session?.access_token, router]);

  async function handleToggleFavorite() {
    if (!session?.access_token || !recipe) return;
    setIsTogglingFavorite(true);
    try {
      await toggleFavorite(recipe.id, isFavorite ? "remove" : "add", session.access_token);
      setIsFavorite(!isFavorite);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.unableToUpdateFavorite"));
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !recipe) {
    const isNotFound = error?.includes("not found") || error?.includes("404");
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Stack spacing={2}>
          <Alert severity={isNotFound ? "warning" : "error"} sx={{ mb: 2 }}>
            {error || "Recipe not found"}
          </Alert>
          <Stack direction="row" spacing={2}>
            <Button component={Link} href="/saved-recipes" startIcon={<ArrowBack />}>
              Back to Saved Recipes
            </Button>
            {!isNotFound && (
              <Button
                variant="outlined"
                onClick={() => {
                  setError(null);
                  if (session?.access_token && recipeId) {
                    // Retry loading the recipe
                    window.location.reload();
                  }
                }}
              >
                Retry
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
      <Stack spacing={3}>
        {/* Back Button */}
        <Button
          component={Link}
          href="/saved-recipes"
          startIcon={<ArrowBack />}
          sx={{
            alignSelf: "flex-start",
            color: "var(--color-text-secondary)",
            "&:hover": {
              backgroundColor: "rgba(139, 92, 246, 0.08)",
            },
            ".dark &": {
              color: "#9CA3AF",
              "&:hover": {
                backgroundColor: "rgba(139, 92, 246, 0.15)",
              },
            },
          }}
        >
          {t("common.back")}
        </Button>

        {/* Recipe Header */}
        <Box className="section-card" sx={{ p: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            spacing={2}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  mb: 2,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  fontSize: { xs: "28px", sm: "36px" },
                }}
              >
                {recipe.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 2,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  fontSize: "18px",
                }}
              >
                {recipe.description}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                {recipe.servings && (
                  <Chip
                    label={`${recipe.servings} ${recipe.servings > 1 ? t("dashboard.servingsPlural") : t("dashboard.serving")}`}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {recipe.prep_time_minutes && (
                  <Chip
                    label={`${t("dashboard.prep")}: ${recipe.prep_time_minutes} ${t("dashboard.min")}`}
                    variant="outlined"
                  />
                )}
                {recipe.cook_time_minutes && (
                  <Chip
                    label={`${t("dashboard.cook")}: ${recipe.cook_time_minutes} ${t("dashboard.min")}`}
                    variant="outlined"
                  />
                )}
              </Stack>
            </Box>
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              color={isFavorite ? "secondary" : "primary"}
              startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              sx={{
                borderRadius: "8px",
                fontWeight: 500,
                minWidth: { xs: "100%", sm: "160px" },
                flexShrink: 0,
                ".dark &": {
                  borderColor: isFavorite ? undefined : "#8B5CF6",
                  color: isFavorite ? undefined : "#8B5CF6",
                  "&:hover": {
                    backgroundColor: isFavorite ? undefined : "rgba(139, 92, 246, 0.1)",
                    borderColor: isFavorite ? undefined : "#7C3AED",
                  },
                },
              }}
            >
              {isTogglingFavorite
                ? t("common.loading")
                : isFavorite
                  ? t("dashboard.favorited")
                  : t("dashboard.saveToFavorites")}
            </Button>
          </Stack>
        </Box>

        {/* Recipe Content */}
        <Box className="section-card" sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                {t("dashboard.ingredientsLabel")}
              </Typography>
              <ul className="purple-accent">
                {recipe.ingredients?.map((item, index) => (
                  <li key={index}>
                    {item.quantity ? `${item.quantity} ` : ""}
                    {item.name}
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                {t("dashboard.instructions")}
              </Typography>
              <ol>
                {recipe.instructions?.map((step) => (
                  <li key={step.step} style={{ marginBottom: "8px" }}>
                    {step.description}
                  </li>
                ))}
              </ol>
            </Grid>
            <Grid item xs={12} md={4}>
              {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
                <>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    {t("dashboard.nutrition")}
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(recipe.nutrition).map(([key, value]) => (
                      <Typography key={key}>
                        {key}: <strong>{value}</strong>
                      </Typography>
                    ))}
                  </Stack>
                </>
              )}
              {recipe.shopping_list && recipe.shopping_list.length > 0 && (
                <>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, mt: 3 }}>
                    {t("dashboard.shoppingList")}
                  </Typography>
                  <ul>
                    {recipe.shopping_list.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}

