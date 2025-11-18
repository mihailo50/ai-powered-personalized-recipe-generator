"use client";

import {
  Alert,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { registerUser } from "@/lib/api-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);

  function extractBackendDetail(err: unknown): string | null {
    if (!(err instanceof Error)) return null;
    const match = err.message.match(/\{.*\}/);
    if (!match) return null;
    try {
      const parsed = JSON.parse(match[0]);
      return typeof parsed?.detail === "string" ? parsed.detail : null;
    } catch {
      return null;
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);
    setIsDuplicateEmail(false);
    try {
      const response = await registerUser(form);
      setMessage(response.message);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      const detail = extractBackendDetail(err);
      const duplicateMessage = "An account with this email already exists. Please sign in instead.";
      if (detail === duplicateMessage) {
        setIsDuplicateEmail(true);
        setError(detail);
      } else if (detail) {
        setError(detail);
      } else {
        setError(err instanceof Error ? err.message : "Unable to create account.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={4} component="form" onSubmit={handleSubmit}>
        <div>
          <Typography variant="overline" color="primary">
            Join AI Recipe Studio
          </Typography>
          <Typography variant="h2" sx={{ mt: 1 }}>
            Create your account
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Use a trusted email domain (e.g., gmail.com, outlook.com) so we can send confirmation links.
          </Typography>
        </div>
        <TextField
          label="Email"
          type="email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChange={(event) => handleChange("email", event.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          required
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(event) => handleChange("password", event.target.value)}
        />
        <TextField
          label="Confirm password"
          type="password"
          required
          placeholder="Re-enter password"
          value={form.confirm_password}
          onChange={(event) => handleChange("confirm_password", event.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}
        {message && <Alert severity="success">{message}</Alert>}
        {isDuplicateEmail && (
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            color="secondary"
            sx={{ borderRadius: "12px" }}
          >
            Go to login
          </Button>
        )}

        <Button type="submit" variant="contained" size="large" disabled={isLoading}>
          {isLoading ? "Creating account…" : "Create account"}
        </Button>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6c63ff" }}>
            Sign in
          </Link>
        </Typography>
      </Stack>
    </Container>
  );
}

