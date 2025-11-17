"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";

import { LoginForm } from "@/components/auth/LoginForm";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useTranslation } from "react-i18next";

function LoginPageContent() {
  const { session } = useSupabase();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAFAFA",
        position: "relative",
        py: { xs: 4, sm: 6 },
        px: { xs: 2, sm: 3 },
        ".dark &": {
          background: "#111827",
        },
      }}
    >
      {/* Subtle grain texture overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        <Box
          sx={{
            background: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
            padding: { xs: "32px 24px", sm: "48px 40px" },
            width: "100%",
            maxWidth: "460px",
            margin: "0 auto",
            animation: "fadeInUp 0.3s ease-out",
            "@keyframes fadeInUp": {
              from: {
                opacity: 0,
                transform: "translateY(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
            ".dark &": {
              background: "#1F2937",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "28px", sm: "32px" },
                fontWeight: 700,
                lineHeight: 1.2,
                color: "#111827",
                mb: 1,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                ".dark &": {
                  color: "#F9FAFB",
                },
              }}
            >
              {t("login.title")}
            </Typography>
            {/* Brand-colored accent line */}
            <Box
              sx={{
                width: "48px",
                height: "2px",
                background: "linear-gradient(90deg, #8B5CF6, #7C3AED)",
                margin: "16px auto 0",
                borderRadius: "1px",
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#6B7280",
                mt: 3,
                lineHeight: 1.6,
                ".dark &": {
                  color: "#9CA3AF",
                },
              }}
            >
              {t("login.subtitle")}
            </Typography>
          </Box>

          <LoginForm showSignUpLink={true} />
        </Box>
      </Container>
    </Box>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
