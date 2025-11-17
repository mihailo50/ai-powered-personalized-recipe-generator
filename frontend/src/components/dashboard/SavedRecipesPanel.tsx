"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { fetchRecipes, toggleFavorite } from "@/lib/api-client";
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

export function SavedRecipesPanel() {
  const { session } = useSupabase();
  const { t } = useTranslation();
  const [scope, setScope] = useState<Scope>("mine");
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadRecipes() {
      if (!session?.access_token) return;
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ scope, limit: "12" });
        const response = await fetchRecipes(params, session.access_token);
        if (isMounted) {
          const list = (response.recipes as RecipeSummary[]) || [];
          setRecipes(list);
          const favs = new Set<string>();
          list.forEach((recipe) => {
            if (recipe.is_favorite) {
              favs.add(recipe.id);
            }
          });
          if (scope === "favorites") {
            setFavoriteIds(new Set(list.map((recipe) => recipe.id)));
          } else if (favs.size) {
            setFavoriteIds(favs);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load recipes");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRecipes();
    return () => {
      isMounted = false;
    };
  }, [scope, session?.access_token]);

  if (!session?.access_token) {
    return null;
  }

  async function handleToggleFavorite(recipeId: string, isFavorite: boolean) {
    if (!session?.access_token) return;
    try {
      await toggleFavorite(recipeId, isFavorite ? "remove" : "add", session.access_token);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) {
          next.delete(recipeId);
        } else {
          next.add(recipeId);
        }
        return next;
      });
      if (scope === "favorites") {
        const params = new URLSearchParams({ scope, limit: "12" });
        const response = await fetchRecipes(params, session.access_token);
        setRecipes((response.recipes as RecipeSummary[]) || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update favorite");
    }
  }

  return (
    <Box component="section" className="section-card">
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600} component="h2">
          {t("dashboard.savedRecipes")}
        </Typography>
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
            "& .MuiToggleButton-root": {
              borderRadius: "9999px",
              px: 2,
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
            },
            "& .Mui-selected": {
              bgcolor: "var(--color-primary)",
              color: "#fff",
              "&:hover": { bgcolor: "var(--color-primary-600)" },
            },
          }}
        >
          <ToggleButton value="mine">My recipes</ToggleButton>
          <ToggleButton value="favorites">Favorites</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      {isLoading && <CircularProgress size={24} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2}>
        {recipes.map((recipe) => {
          const isFavorite = favoriteIds.has(recipe.id);
          return (
            <Card key={recipe.id} variant="outlined">
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <div>
                    <Typography variant="h6" fontWeight={600}>
                      {recipe.title}
                    </Typography>
                    {recipe.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {recipe.description}
                      </Typography>
                    )}
                  </div>
                  {recipe.servings && (
                    <Chip
                      size="small"
                      label={`${recipe.servings} serving${recipe.servings > 1 ? "s" : ""}`}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <Stack direction="row" spacing={2} mt={1} flexWrap="wrap">
                  {recipe.prep_time_minutes && (
                    <Typography variant="body2" color="text.secondary">
                      Prep: {recipe.prep_time_minutes} min
                    </Typography>
                  )}
                  {recipe.cook_time_minutes && (
                    <Typography variant="body2" color="text.secondary">
                      Cook: {recipe.cook_time_minutes} min
                    </Typography>
                  )}
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant={isFavorite ? "contained" : "outlined"}
                  color={isFavorite ? "secondary" : "primary"}
                  onClick={() => handleToggleFavorite(recipe.id, isFavorite)}
                >
                  {isFavorite ? "Favorited" : "Save to favorites"}
                </Button>
              </CardActions>
            </Card>
          );
        })}
        {!isLoading && recipes.length === 0 && (
          <div style={{ padding: "16px", background: "var(--color-info-bg)", borderRadius: "8px", textAlign: "center" }}>
            <p style={{ margin: 0, color: "var(--color-muted)" }}>
              {scope === "favorites"
                ? "No favorites yet. Save a recipe to see it here."
                : "You haven't saved any recipes yet. Generate one to get started."}
            </p>
          </div>
        )}
      </Stack>
    </Box>
  );
}


