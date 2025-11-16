"use client";

import { Container, Stack, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/SupabaseProvider";
import { ProfilePanel } from "@/components/dashboard/ProfilePanel";

export default function ProfilePage() {
  const { session } = useSupabase();
  const router = useRouter();
  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session, router]);
  if (!session) return null;

  return (
    <Container component="main" maxWidth="md" sx={{ py: 8 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={700}>
          Your profile
        </Typography>
        <Button component={Link} href="/dashboard" variant="text">
          Back to dashboard
        </Button>
      </Stack>
      <ProfilePanel />
    </Container>
  );
}


