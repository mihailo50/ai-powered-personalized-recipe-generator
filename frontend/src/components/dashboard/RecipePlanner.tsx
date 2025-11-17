"use client";

import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Fade,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useMemo, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { generateRecipe } from "@/lib/api-client";
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
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState("");
  const [dietSelections, setDietSelections] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [servings, setServings] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedRecipe | null>(null);

  const token = session?.access_token;

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
      };
      const response = await generateRecipe(payload, token);
      setResult(response.recipe as GeneratedRecipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Box component="section" className="section-card" sx={{ position: "relative" }}>
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

        <Box sx={{ width: "100%" }}>
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
                    },
                    ".dark & .MuiOutlinedInput-root": {
                      backgroundColor: "#374151",
                      "& fieldset": { borderColor: "#4B5563" },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
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
                onChange={(e) => setServings(Number(e.target.value) || 2)}
                placeholder={t("dashboard.servingsPlaceholder")}
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
            bgcolor: "rgba(249, 248, 255, 0.8)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={40} color="primary" />
          <Typography variant="body1" color="text.secondary">
            {t("dashboard.crafting")}
          </Typography>
        </Box>
      </Fade>

      {result && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h5" fontWeight={600}>
            {result.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {result.description}
          </Typography>

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

