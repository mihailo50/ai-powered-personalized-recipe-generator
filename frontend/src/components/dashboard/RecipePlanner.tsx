"use client";

import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { FormEvent, useMemo, useState, useEffect } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { generateRecipe, toggleFavorite } from "@/lib/api-client";
import { FloatingLabelTextField } from "@/components/FloatingLabelTextField";
import { useTranslation } from "react-i18next";

type GeneratedRecipe = {
  title: string;
  description: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  ingredients: { name: string; quantity?: string }[];
  instructions: { step: number; description: string }[];
  nutrition?: Record<string, number>;
  shopping_list?: string[];
};

export function RecipePlanner() {
  const { session } = useSupabase();
  const { t, i18n } = useTranslation();
  const [ingredients, setIngredients] = useState("");
  const [dietSelections, setDietSelections] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [servings, setServings] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedRecipe | null>(null);
  const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  const token = session?.access_token;

  // Animate loading dots
  useEffect(() => {
    if (!isLoading) {
      setLoadingDots("");
      return;
    }
    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const banned = ["fuck", "shit", "porn", "violence", "weapon", "drug"]; // simple prompt guard
  function containsBanned(text: string) {
    const lower = text.toLowerCase();
    return banned.some((w) => lower.includes(w));
  }

  const dietPreferenceChips = useMemo(
    () => dietSelections.map((item) => item.trim()).filter(Boolean),
    [dietSelections],
  );

  const dietSuggestions = [
    "Vegan",
    "Vegetarian",
    "Gluten-free",
    "Keto",
    "Pescatarian",
    "Mediterranean",
    "Low-carb",
    "High-protein",
    "Dairy-free",
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      setError("You must be signed in to generate recipes.");
      return;
    }
    if (containsBanned(ingredients) || containsBanned(notes)) {
      setError("Please keep prompts food-related and respectful.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ingredients: ingredients.split(",").map((item) => item.trim()).filter(Boolean),
        diet_preferences: dietPreferenceChips,
        notes,
        servings,
        language: i18n.language || "en",
      };
      const response = await generateRecipe(payload, token);
      setResult(response.recipe as GeneratedRecipe);
      if (response.saved_recipe_id) {
        setSavedRecipeId(response.saved_recipe_id);
      }
      setIsFavorite(false); // Reset favorite state for new recipe
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleFavorite() {
    if (!savedRecipeId || !token) return;
    setIsTogglingFavorite(true);
    try {
      const action = isFavorite ? "remove" : "add";
      await toggleFavorite(savedRecipeId, action, token);
      setIsFavorite(!isFavorite);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.unableToUpdateFavorite"));
    } finally {
      setIsTogglingFavorite(false);
    }
  }

  return (
    <Box component="section" className="section-card" sx={{ position: "relative", minWidth: { xs: "80%", sm: "auto" } }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ alignItems: "center" }}>
        <Box sx={{ textAlign: "center", maxWidth: "800px", width: "100%" }}>
          <Typography
            variant="h3"
            fontWeight={600}
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {t("dashboard.planMeal")}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              mt: 1,
            }}
          >
            {t("dashboard.planMealSubtitle")}
          </Typography>
        </Box>

        <Box
                  sx={{
            width: "100%",
            opacity: isLoading ? 0.5 : 1,
            pointerEvents: isLoading ? "none" : "auto",
            transition: "opacity 0.3s ease",
          }}
        >
          <Stack spacing={3}>
            <FloatingLabelTextField
              label={t("dashboard.ingredients")}
                  value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder={t("dashboard.ingredientsPlaceholder")}
              helperText={t("dashboard.ingredientsHelper")}
                />

                <Autocomplete
                  multiple
                  freeSolo
                  options={dietSuggestions}
                  value={dietSelections}
                  onChange={(_event, newValue) => setDietSelections(newValue)}
                  renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    sx={{ borderRadius: "8px" }}
                  />
                    ))
                  }
              componentsProps={{
                paper: {
                  sx: {
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                    ".dark &": {
                      backgroundColor: "#1F2937",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                    },
                  },
                },
              }}
              ListboxProps={{
                sx: {
                  "& .MuiAutocomplete-option": {
                    color: "#111827",
                    ".dark &": {
                      color: "#F9FAFB",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(139, 92, 246, 0.08)",
                      ".dark &": {
                        backgroundColor: "rgba(139, 92, 246, 0.15)",
                      },
                    },
                    "&.Mui-focused": {
                      backgroundColor: "rgba(139, 92, 246, 0.12)",
                      ".dark &": {
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                      },
                    },
                  },
                },
              }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          "& fieldset": { borderColor: "var(--color-border)" },
                      "&:hover fieldset": { borderColor: "#8B5CF6" },
                      "&.Mui-focused fieldset": { borderColor: "#8B5CF6", borderWidth: "2px" },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(139, 92, 246, 0.02)",
                      },
                      "& .MuiInputBase-input": {
                        color: "#111827",
                        ".dark &": {
                          color: "#F9FAFB",
                        },
                      },
                    },
                    ".dark & .MuiOutlinedInput-root": {
                      backgroundColor: "#374151",
                      "& fieldset": { borderColor: "#4B5563" },
                      "&:hover fieldset": { borderColor: "#8B5CF6" },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#8B5CF6",
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "#374151",
                      ".dark &": {
                        color: "#9CA3AF",
                      },
                      "&.Mui-focused": {
                        color: "#8B5CF6",
                      },
                    },
                    "& .MuiFormHelperText-root": {
                      color: "#6B7280",
                      ".dark &": {
                        color: "#9CA3AF",
                      },
                        },
                      }}
                  label={t("dashboard.dietPreferences")}
                  placeholder={t("dashboard.dietPlaceholder")}
                  helperText={t("dashboard.dietHelper")}
                    />
                  )}
                />

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <FloatingLabelTextField
                label={t("dashboard.servings")}
                type="number"
                value={servings.toString()}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow empty string for deletion
                  if (val === "") {
                    setServings(0);
                  } else {
                    const num = Number(val);
                    if (!isNaN(num) && num > 0) {
                      setServings(num);
                    }
                  }
                }}
                onBlur={(e) => {
                  // Default to 2 if empty on blur
                  const val = Number(e.target.value);
                  if (!val || val < 1) {
                    setServings(2);
                  }
                }}
                placeholder={t("dashboard.servingsPlaceholder")}
                inputProps={{
                  min: 1,
                  step: 1,
                }}
                  sx={{
                  "& .MuiInputBase-input[type='number']": {
                    MozAppearance: "textfield",
                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                      WebkitAppearance: "auto",
                      margin: 0,
                      display: "block",
                    },
                    },
                  }}
              />
            </Box>

            <FloatingLabelTextField
              label={t("dashboard.notes")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("dashboard.notesPlaceholder")}
                  multiline
              rows={3}
              helperText={t("dashboard.notesHelper")}
                />
          </Stack>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "800px" }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            {dietPreferenceChips.map((chip) => (
              <Chip key={chip} label={chip} color="primary" variant="outlined" />
            ))}
          </Stack>
        </Box>

        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "800px" }}>
            <Alert severity="error" sx={{ width: "100%" }}>{error}</Alert>
          </Box>
        )}

        <Box sx={{ width: "100%", mt: 2 }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ maxWidth: "100%" }}
          >
            {isLoading ? t("dashboard.thinking") : t("dashboard.generateRecipe")}
          </button>
        </Box>
      </Stack>

      <Fade in={isLoading} unmountOnExit>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: 4,
            background: "linear-gradient(135deg, rgba(249, 248, 255, 0.95) 0%, rgba(245, 243, 255, 0.95) 100%)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            zIndex: 10,
            ".dark &": {
              background: "linear-gradient(135deg, rgba(31, 41, 55, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)",
            },
          }}
        >
          <CircularProgress
            size={48}
            sx={{
              color: "#8B5CF6",
              ".dark &": {
                color: "#C4B5FD",
              },
            }}
          />
          <Typography
            variant="body1"
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#6B7280",
              textAlign: "center",
              ".dark &": {
                color: "#E5E7EB",
              },
            }}
          >
            {t("dashboard.crafting")}
            {loadingDots}
          </Typography>
        </Box>
      </Fade>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-start" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  mb: 1,
                }}
              >
            {result.title}
          </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                }}
              >
            {result.description}
          </Typography>
            </Box>
            {savedRecipeId && (
              <Button
                variant={isFavorite ? "contained" : "outlined"}
                color={isFavorite ? "secondary" : "primary"}
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 500,
                  minWidth: { xs: "100%", sm: "120px" },
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
            )}
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={600}>
                Ingredients
              </Typography>
              <ul className="purple-accent">
                {result.ingredients?.map((item) => (
                  <li key={item.name}>
                    {item.quantity ? `${item.quantity} ` : ""}
                    {item.name}
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={600}>
                Instructions
              </Typography>
              <ol>
                {result.instructions?.map((step) => (
                  <li key={step.step}>{step.description}</li>
                ))}
              </ol>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={600}>
                Nutrition Snapshot
              </Typography>
              <Stack spacing={1}>
                {Object.entries(result.nutrition || {}).map(([key, value]) => (
                  <Typography key={key}>
                    {key}: <strong>{value}</strong>
                  </Typography>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

