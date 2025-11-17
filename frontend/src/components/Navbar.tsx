"use client";

import Link from "next/link";
import { Box, Container } from "@mui/material";
import { UserMenu } from "@/components/UserMenu";

export function Navbar() {
  return (
    <Box
      component="nav"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "var(--color-nav-bg)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        animation: "fadeIn 0.3s ease-out both",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Link
          href="/"
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--color-primary)",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-primary-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-primary)";
          }}
          aria-label="AI Recipe Studio Home"
        >
          AI Recipe Studio
        </Link>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <UserMenu isMobile={false} />
        </Box>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <UserMenu isMobile={true} />
        </Box>
      </Container>
    </Box>
  );
}
