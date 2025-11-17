"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Home,
  Person,
  Language,
  Logout,
  Menu as MenuIcon,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

import { useSupabase } from "@/components/providers/SupabaseProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { languages, languageNames, type Lang } from "@/i18n/i18n";

type UserMenuProps = {
  isMobile?: boolean;
};

export function UserMenu({ isMobile = false }: UserMenuProps) {
  const { session, supabase } = useSupabase();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const langMenuOpen = Boolean(langMenuAnchor);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    handleClose();
    router.push("/login");
  }

  function handleLanguageClick(event: MouseEvent<HTMLElement>) {
    setLangMenuAnchor(event.currentTarget);
  }

  function handleLanguageClose() {
    setLangMenuAnchor(null);
  }

  function changeLanguage(lang: Lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    handleLanguageClose();
    handleClose();
  }

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.user_metadata?.display_name || userEmail.split("@")[0] || "Chef";

  const { mode, toggleMode } = useTheme();

  if (!session) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={toggleMode}
          sx={{
            color: "#6B7280",
            "&:hover": { backgroundColor: "rgba(139, 92, 246, 0.1)" },
          }}
          aria-label="Toggle dark mode"
        >
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
        <Link href="/login" style={{ textDecoration: "none" }}>
          <IconButton
            sx={{
              color: "#6B7280",
              "&:hover": { backgroundColor: "rgba(139, 92, 246, 0.1)" },
            }}
            aria-label="Sign in"
          >
            <AccountCircle />
          </IconButton>
        </Link>
      </Box>
    );
  }

  return (
    <>
      <IconButton
        id="user-menu-button"
        onClick={handleClick}
        sx={{
          color: "#6B7280",
          "&:hover": { backgroundColor: "rgba(139, 92, 246, 0.1)" },
        }}
        aria-label={t("common.profile")}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {isMobile ? (
          <MenuIcon />
        ) : (
          <Avatar sx={{ width: 32, height: 32, bgcolor: "#6B46C1", fontSize: "14px", fontWeight: 600 }}>
            {userName[0].toUpperCase()}
          </Avatar>
        )}
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        aria-labelledby="user-menu-button"
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            ".dark &": {
              backgroundColor: "#1F2937",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {userName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {userEmail}
          </Typography>
        </Box>
        <MenuItem component={Link} href="/dashboard" aria-label={t("common.home")}>
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.home")}</ListItemText>
        </MenuItem>
        <MenuItem component={Link} href="/profile" aria-label={t("common.profile")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.profile")}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLanguageClick}
          id="language-button"
          aria-label={t("common.language")}
          aria-haspopup="true"
          aria-expanded={langMenuOpen}
          aria-controls={langMenuOpen ? "language-menu" : undefined}
        >
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.language")}</ListItemText>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, textTransform: "uppercase" }}>
            {i18n.language}
          </Typography>
        </MenuItem>
        <Menu
          anchorEl={langMenuAnchor}
          open={langMenuOpen}
          onClose={handleLanguageClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          id="language-menu"
          aria-labelledby="language-button"
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang}
              onClick={() => changeLanguage(lang)}
              selected={i18n.language === lang}
              aria-label={`Switch to ${languageNames[lang]}`}
            >
              <ListItemText>{languageNames[lang]}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
        <MenuItem onClick={toggleMode} aria-label={mode === "dark" ? t("common.lightMode") : t("common.darkMode")}>
          <ListItemIcon>
            {mode === "dark" ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{mode === "dark" ? t("common.lightMode") : t("common.darkMode")}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} aria-label={t("common.logout")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t("common.logout")}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

