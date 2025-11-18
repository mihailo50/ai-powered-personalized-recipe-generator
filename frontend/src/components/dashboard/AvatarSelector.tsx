"use client";

import { Box, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

// Predefined avatar options - using emojis for simplicity and universal support
const AVATAR_OPTIONS = [
  "👨‍🍳", // Chef
  "👩‍🍳", // Female Chef
  "🍳", // Cooking
  "🥘", // Shallow Pan of Food
  "🍲", // Pot of Food
  "🥗", // Green Salad
  "🍕", // Pizza
  "🍝", // Spaghetti
  "🍜", // Steaming Bowl
  "🌮", // Taco
  "🌯", // Burrito
  "🥙", // Stuffed Flatbread
  "🍔", // Hamburger
  "🍟", // French Fries
  "🥐", // Croissant
  "🥖", // Baguette Bread
  "🧀", // Cheese
  "🍰", // Shortcake
  "🎂", // Birthday Cake
  "🍪", // Cookie
  "☕", // Hot Beverage
  "🍵", // Teacup
  "🥤", // Cup with Straw
  "🍷", // Wine Glass
  "🍴", // Fork and Knife
  "🥄", // Spoon
  "🔪", // Kitchen Knife
  "🌶️", // Hot Pepper
  "🥑", // Avocado
  "🍅", // Tomato
];

type AvatarSelectorProps = {
  value?: string;
  onChange: (avatar: string) => void;
  label?: string;
};

export function AvatarSelector({ value, onChange, label = "Choose avatar" }: AvatarSelectorProps) {
  const selectedIndex = useMemo(() => {
    if (!value) return -1;
    return AVATAR_OPTIONS.indexOf(value);
  }, [value]);

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: 1.5,
          fontWeight: 500,
          color: "#374151",
          ".dark &": {
            color: "#9CA3AF",
          },
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
          gap: 1.5,
          maxWidth: "560px",
        }}
      >
        {AVATAR_OPTIONS.map((emoji, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box
              key={index}
              onClick={() => onChange(emoji)}
              sx={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor: isSelected ? "#8B5CF6" : "#FFFFFF",
                border: `2px solid ${isSelected ? "#8B5CF6" : "#E5E7EB"}`,
                "&:hover": {
                  backgroundColor: isSelected ? "#7C3AED" : "rgba(139, 92, 246, 0.08)",
                  borderColor: "#8B5CF6",
                  transform: "scale(1.05)",
                },
                ".dark &": {
                  backgroundColor: isSelected ? "#8B5CF6" : "#374151",
                  borderColor: isSelected ? "#8B5CF6" : "#4B5563",
                  "&:hover": {
                    backgroundColor: isSelected ? "#7C3AED" : "rgba(139, 92, 246, 0.15)",
                    borderColor: "#8B5CF6",
                  },
                },
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange(emoji);
                }
              }}
              aria-label={`Select avatar ${emoji}`}
            >
              {emoji}
            </Box>
          );
        })}
      </Box>
      {value && (
        <Typography
          variant="caption"
          sx={{
            mt: 1,
            display: "block",
            color: "#6B7280",
            ".dark &": {
              color: "#9CA3AF",
            },
          }}
        >
          Selected: {value}
        </Typography>
      )}
    </Box>
  );
}

