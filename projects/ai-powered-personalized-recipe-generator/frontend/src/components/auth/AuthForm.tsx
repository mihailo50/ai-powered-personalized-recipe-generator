"use client";

import { Box, Paper, Typography } from "@mui/material";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSupabase } from "@/components/providers/SupabaseProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const redirectTo = `${siteUrl.replace(/\/$/, "")}/dashboard`;

export function AuthForm() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sign in or create an account to start generating recipes.
        </Typography>
      </Box>
      <Auth
        supabaseClient={supabase}
        view="sign_in"
        providers={[]}
        redirectTo={redirectTo}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#4f46e5",
                brandAccent: "#312e81",
              },
            },
          },
        }}
      />
    </Paper>
  );
}

