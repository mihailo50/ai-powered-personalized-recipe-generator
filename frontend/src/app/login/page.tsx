"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

import { AuthForm } from "@/components/auth/AuthForm";
import { useSupabase } from "@/components/providers/SupabaseProvider";

export default function LoginPage() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={6} alignItems="center">
        <Box sx={{ flex: 1 }}>
          <Typography variant="overline" color="primary">
            AI Recipe Studio
          </Typography>
          <Typography variant="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
            Sign in to personalize your kitchen.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Save your preferences, generate recipes on demand, and build smarter shopping lists—powered by AI and your
            pantry.
          </Typography>
        </Box>
        <AuthForm />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Need an account?{" "}
          <Link href="/register" style={{ color: "#6c63ff" }}>
            Create one
          </Link>
        </Typography>
      </Stack>
    </Container>
  );
}

