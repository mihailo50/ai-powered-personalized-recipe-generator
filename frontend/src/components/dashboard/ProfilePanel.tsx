"use client";

import { Alert, Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { getProfile, updateProfile } from "@/lib/api-client";

type Profile = {
  id?: string;
  display_name?: string;
  avatar_url?: string;
  diet_preferences?: string[];
  allergens?: string[];
  calorie_target?: number | null;
};

export function ProfilePanel() {
  const { session } = useSupabase();
  const [profile, setProfile] = useState<Profile>({});
  const [dietInput, setDietInput] = useState("");
  const [allergenInput, setAllergenInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!session?.access_token) return;
      try {
        const res = await getProfile(session.access_token);
        if (active) {
          setProfile((res.profile as Profile) || {});
        }
      } catch (err) {
        // ignore if profile doesn't exist yet
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [session?.access_token]);

  const dietPreferences = useMemo(() => profile.diet_preferences ?? [], [profile.diet_preferences]);
  const allergens = useMemo(() => profile.allergens ?? [], [profile.allergens]);

  if (!session?.access_token) return null;

  async function handleSave() {
    if (!session?.access_token) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await updateProfile(
        {
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
          diet_preferences: dietPreferences,
          allergens,
          calorie_target: profile.calorie_target ?? null,
        },
        session.access_token,
      );
      setProfile((res.profile as Profile) || {});
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box component="section">
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Profile
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {saved && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Saved.
        </Alert>
      )}
      <Stack spacing={2} maxWidth={560}>
        <TextField
          label="Display name"
          value={profile.display_name ?? ""}
          onChange={(e) => setProfile((p) => ({ ...p, display_name: e.target.value }))}
        />
        <TextField
          label="Avatar URL"
          value={profile.avatar_url ?? ""}
          onChange={(e) => setProfile((p) => ({ ...p, avatar_url: e.target.value }))}
        />
        <TextField
          label="Calorie target"
          type="number"
          value={profile.calorie_target ?? ""}
          onChange={(e) => setProfile((p) => ({ ...p, calorie_target: Number(e.target.value) || null }))}
        />
        <TextField
          label="Add diet preference"
          placeholder="e.g. vegan"
          value={dietInput}
          onChange={(e) => setDietInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && dietInput.trim()) {
              setProfile((p) => ({ ...p, diet_preferences: [...dietPreferences, dietInput.trim()] }));
              setDietInput("");
            }
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {dietPreferences.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              onDelete={() =>
                setProfile((p) => ({ ...p, diet_preferences: dietPreferences.filter((x) => x !== chip) }))
              }
            />
          ))}
        </Stack>
        <TextField
          label="Add allergen"
          placeholder="e.g. peanuts"
          value={allergenInput}
          onChange={(e) => setAllergenInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && allergenInput.trim()) {
              setProfile((p) => ({ ...p, allergens: [...allergens, allergenInput.trim()] }));
              setAllergenInput("");
            }
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {allergens.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              onDelete={() => setProfile((p) => ({ ...p, allergens: allergens.filter((x) => x !== chip) }))}
            />
          ))}
        </Stack>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Stack>
    </Box>
  );
}


