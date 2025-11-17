"use client";

import { useState } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FloatingLabelTextFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  [key: string]: any;
};

export function FloatingLabelTextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  fullWidth = true,
  multiline = false,
  rows = 1,
  helperText,
  ...props
}: FloatingLabelTextFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  return (
    <Box sx={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
      <TextField
        {...props}
        type={showPasswordToggle && !showPassword ? "password" : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        placeholder={isFloating ? placeholder : ""}
        InputProps={{
          ...(showPasswordToggle && {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onTogglePassword}
                  edge="end"
                  sx={{ color: "#6B7280" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }),
        }}
        sx={{
          "& .MuiInputLabel-root": {
            color: "#374151",
            fontWeight: 500,
            transform: isFloating
              ? "translate(14px, -9px) scale(0.75)"
              : "translate(14px, 16px) scale(1)",
            transformOrigin: "top left",
            transition: "transform 0.2s ease, color 0.2s ease",
            pointerEvents: "none",
            zIndex: 1,
            "&.Mui-focused": {
              color: "#8B5CF6",
            },
            "&::before": isFloating
              ? {
                  content: '""',
                  position: "absolute",
                  left: "-4px",
                  right: "-4px",
                  top: "50%",
                  height: "2px",
                  backgroundColor: "#FFFFFF",
                  zIndex: -1,
                  ".dark &": {
                    backgroundColor: "#1F2937",
                  },
                }
              : {},
            ".dark &": {
              color: "#9CA3AF",
              "&.Mui-focused": {
                color: "#8B5CF6",
              },
            },
          },
          "& .MuiInputBase-input": {
            paddingTop: isFloating ? "24px" : "16px",
            paddingBottom: isFloating ? (multiline ? "16px" : "8px") : "16px",
            color: "#111827",
            "&::placeholder": {
              color: "#6B7280",
              opacity: isFloating ? 0 : 1,
              transition: "opacity 0.2s ease",
            },
            ".dark &": {
              color: "#F9FAFB",
              "&::placeholder": {
                color: "#9CA3AF",
              },
            },
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            "&:hover fieldset": {
              borderColor: "#8B5CF6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8B5CF6",
              borderWidth: "2px",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(139, 92, 246, 0.02)",
            },
            ".dark &": {
              backgroundColor: "#374151",
              "& fieldset": {
                borderColor: "#4B5563",
              },
              "&:hover fieldset": {
                borderColor: "#8B5CF6",
              },
              "&.Mui-focused": {
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              },
            },
          },
        }}
        label={label}
        helperText={helperText}
        aria-label={label}
      />
    </Box>
  );
}

