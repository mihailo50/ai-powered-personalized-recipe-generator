"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, TextField, Typography, Alert, IconButton, InputAdornment, Stack, Divider } from "@mui/material";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useTranslation } from "react-i18next";

type LoginFormProps = {
  showSignUpLink?: boolean;
};

// Floating label TextField component
function FloatingLabelTextField({
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
  ...props
}: {
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
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasValue = value.length > 0;
  const isFloating = focused || hasValue;

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        {...props}
        inputRef={inputRef}
        type={showPasswordToggle && !showPassword ? "password" : type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        disabled={disabled}
        fullWidth
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
            paddingBottom: isFloating ? "8px" : "16px",
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
      />
    </Box>
  );
}

export function LoginForm({ showSignUpLink = true }: LoginFormProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFailedLogin, setHasFailedLogin] = useState(false);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTo = `${siteUrl}/dashboard`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setHasFailedLogin(true);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setHasFailedLogin(true);
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsGoogleLoading(false);
      }
      // If successful, user will be redirected by Supabase
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <FloatingLabelTextField
          label={t("login.email")}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("login.emailPlaceholder")}
          disabled={isLoading || isGoogleLoading}
        />

        <FloatingLabelTextField
          label={t("login.password")}
          type="text"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("login.passwordPlaceholder")}
          disabled={isLoading || isGoogleLoading}
          showPasswordToggle
          onTogglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
        />

        {hasFailedLogin && (
          <Box sx={{ textAlign: "right" }}>
            <Link
              href="/forgot-password"
              style={{
                color: "#7C3AED",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {t("common.forgotPassword")}
            </Link>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading || isGoogleLoading}
          aria-label={isLoading ? t("login.signingIn") : t("common.signIn")}
          sx={{
            borderRadius: "12px",
            py: 1.5,
            fontSize: "16px",
            fontWeight: 600,
            backgroundColor: "#6B46C1",
            "&:hover": {
              backgroundColor: "#7C3AED",
            },
            maxWidth: { xs: "100%", sm: "400px" },
            mx: { xs: 0, sm: "auto" },
            display: "block",
          }}
        >
          {isLoading ? t("login.signingIn") : t("common.signIn")}
        </Button>

        <Divider
          sx={{
            my: 1,
            "&::before, &::after": {
              borderColor: "#E5E7EB",
            },
            ".dark &::before, .dark &::after": {
              borderColor: "#4B5563",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#9CA3AF",
              px: 2,
              ".dark &": {
                color: "#6B7280",
              },
            }}
          >
            or
          </Typography>
        </Divider>

        <Button
          type="button"
          variant="outlined"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
          aria-label={t("login.continueWithGoogle")}
          startIcon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20454Z"
                fill="#4285F4"
              />
              <path
                d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65454 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
                fill="#34A853"
              />
              <path
                d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65454 3.57955 9 3.57955Z"
                fill="#EA4335"
              />
            </svg>
          }
          sx={{
            borderRadius: "12px",
            py: 1.5,
            fontSize: "16px",
            fontWeight: 600,
            borderColor: "#E5E7EB",
            color: "#374151",
            "&:hover": {
              borderColor: "#8B5CF6",
              backgroundColor: "rgba(139, 92, 246, 0.04)",
            },
            ".dark &": {
              borderColor: "#4B5563",
              color: "#F9FAFB",
              "&:hover": {
                borderColor: "#8B5CF6",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              },
            },
            maxWidth: { xs: "100%", sm: "400px" },
            mx: { xs: 0, sm: "auto" },
            display: "block",
          }}
        >
          {isGoogleLoading ? t("login.connecting") : t("login.continueWithGoogle")}
        </Button>

        {showSignUpLink && (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#6B7280",
              fontSize: "14px",
              ".dark &": {
                color: "#9CA3AF",
              },
            }}
          >
            {t("common.needAccount")}{" "}
            <Link
              href="/register"
              style={{
                color: "#7C3AED",
                textDecoration: "none",
                fontWeight: 500,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {t("common.createAccount")}
            </Link>
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
