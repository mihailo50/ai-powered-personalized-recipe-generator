"use client";

import { Container, Typography } from "@mui/material";
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
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Your profile
      </Typography>
      <ProfilePanel />
    </Container>
  );
}


