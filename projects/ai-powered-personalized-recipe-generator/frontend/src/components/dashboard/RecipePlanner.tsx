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
import { FormEvent, useMemo, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { generateRecipe } from "@/lib/api-client";

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
    <Box component="section" sx={{ position: "relative", p: 5, borderRadius: 4, bgcolor: "background.paper" }}>
      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <div>
          <Typography variant="h3" fontWeight={600}>
            Plan tonight’s meal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560 }}>
            Feed us your pantry list and preferences. We’ll craft a complete recipe, nutrition snapshot, and shopping
            cues.
          </Typography>
        </div>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ingredients on hand"
              helperText="Comma-separated list"
              fullWidth
              placeholder="e.g. tofu, chickpeas, baby spinach"
              value={ingredients}
              onChange={(event) => setIngredients(event.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Autocomplete
              multiple
              freeSolo
              options={dietSuggestions}
              value={dietSelections}
              onChange={(_event, newValue) => setDietSelections(newValue)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Diet preferences"
                  placeholder="Tap to pick or type (e.g. vegan)"
                  helperText="Choose from suggestions or write your own"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Servings"
              type="number"
              fullWidth
              placeholder="2"
              value={servings}
              onChange={(event) => setServings(Number(event.target.value))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              helperText="Any cravings or constraints?"
              fullWidth
              multiline
              minRows={2}
              placeholder="e.g. Prefer something under 30 minutes with a citrus note"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {dietPreferenceChips.map((chip) => (
            <Chip key={chip} label={chip} color="primary" variant="outlined" />
          ))}
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" size="large" disabled={isLoading}>
          {isLoading ? "Thinking..." : "Generate Recipe"}
        </Button>
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
            Crafting your personalized recipe…
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
              <ul>
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

