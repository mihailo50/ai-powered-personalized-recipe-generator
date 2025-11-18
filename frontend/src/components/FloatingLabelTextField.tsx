"use client";

import { useState } from "react";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FloatingLabelTextFieldProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  [key: string]: any;
};

export function FloatingLabelTextField({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
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
  inputProps,
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
        onBlur={(e) => {
          setFocused(false);
          if (onBlur) {
            onBlur(e);
          }
        }}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        placeholder={isFloating ? placeholder : ""}
        inputProps={inputProps}
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
              ? "translate(14px, -6px) scale(0.75)"
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
                  left: "-2px",
                  right: "-2px",
                  top: "50%",
                  height: "2px",
                  backgroundColor: "#FFFFFF",
                  zIndex: -1,
                  ".dark &": {
                    backgroundColor: "#374151",
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
            paddingTop: isFloating ? "20px" : "16px",
            paddingBottom: isFloating ? (multiline ? "16px" : "8px") : "16px",
            color: "#111827",
            backgroundColor: "transparent",
            outline: "none",
            "&::placeholder": {
              color: "#6B7280",
              opacity: isFloating ? 0 : 1,
              transition: "opacity 0.2s ease",
            },
            "&:focus": {
              outline: "none",
            },
            ".dark &": {
              color: "#F9FAFB !important",
              backgroundColor: "transparent !important",
              outline: "none !important",
              "&::placeholder": {
                color: "#9CA3AF",
              },
              "&:focus": {
                outline: "none !important",
              },
            },
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            outline: "none",
            "&:hover fieldset": {
              borderColor: "#8B5CF6",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8B5CF6",
              borderWidth: "2px",
              outline: "none",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(139, 92, 246, 0.02)",
              outline: "none",
            },
            "& fieldset": {
              outline: "none",
              borderStyle: "solid",
              borderWidth: "1px",
              borderRadius: "12px",
            },
            ".dark &": {
              backgroundColor: "#374151 !important",
              outline: "none !important",
              "& fieldset": {
                borderColor: "#4B5563 !important",
                outline: "none !important",
                borderStyle: "solid",
                boxShadow: "none !important",
                borderWidth: "1px",
                borderRadius: "12px",
              },
              "&:hover": {
                backgroundColor: "#374151 !important",
                outline: "none",
                "& fieldset": {
                  borderColor: "#8B5CF6",
                  outline: "none",
                  boxShadow: "none",
                },
              },
              "&.Mui-focused": {
                backgroundColor: "#374151 !important",
                outline: "none !important",
                boxShadow: "none !important",
                "& fieldset": {
                  borderColor: "#8B5CF6 !important",
                  borderWidth: "2px !important",
                  outline: "none !important",
                  boxShadow: "none !important",
                  borderStyle: "solid",
                  borderRadius: "12px",
                  margin: "-1px",
                },
              },
              "&.Mui-focused:hover": {
                backgroundColor: "#374151 !important",
                outline: "none",
                boxShadow: "none",
                "& fieldset": {
                  outline: "none",
                  boxShadow: "none",
                },
              },
            },
          },
        }}
        label={label}
        helperText={helperText}
        aria-label={label}
        FormHelperTextProps={{
          sx: {
            marginLeft: "14px",
            marginTop: "4px",
            fontSize: "12px",
            color: "#6B7280",
            ".dark &": {
              color: "#9CA3AF",
            },
          },
        }}
      />
    </Box>
  );
}

