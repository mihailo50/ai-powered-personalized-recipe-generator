"use client";

import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <IconButton
      onClick={toggleMode}
      sx={{
        color: "#6B7280",
        position: "absolute",
        top: { xs: 16, sm: 24 },
        right: { xs: 16, sm: 24 },
        zIndex: 10,
        "&:hover": {
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          color: "#8B5CF6",
        },
        ".dark &": {
          color: "#9CA3AF",
          "&:hover": {
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            color: "#8B5CF6",
          },
        },
      }}
      aria-label="Toggle dark mode"
    >
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}

