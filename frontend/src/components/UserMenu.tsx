"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { Home, Language, Logout, Menu as MenuIcon, DarkMode, LightMode } from "@mui/icons-material";

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
    event.stopPropagation();
    if (langMenuAnchor) {
      setLangMenuAnchor(null);
    } else {
      setLangMenuAnchor(event.currentTarget);
    }
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
      <IconButton
        onClick={toggleMode}
        sx={{
          color: "#6B7280",
          "&:hover": { backgroundColor: "rgba(139, 92, 246, 0.1)" },
          ".dark &": {
            color: "#9CA3AF",
            "&:hover": {
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              color: "#8B5CF6",
            },
          },
        }}
        aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {mode === "dark" ? <LightMode /> : <DarkMode />}
      </IconButton>
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
          ".dark &": {
            color: "#9CA3AF",
            "&:hover": {
              backgroundColor: "rgba(139, 92, 246, 0.2)",
              color: "#8B5CF6",
            },
          },
        }}
        aria-label="Open user menu"
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => {
          // Don't close if clicking on language menu item or its submenu
          const target = e.target as HTMLElement;
          if (target.closest("#language-button") || target.closest("#language-menu")) {
            return;
          }
          handleClose();
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        aria-labelledby="user-menu-button"
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#FFFFFF",
            ".dark &": {
              backgroundColor: "#1F2937",
            },
            "& .MuiMenuItem-root": {
              color: "#111827",
              ".dark &": {
                color: "#F9FAFB",
              },
              "&:hover": {
                backgroundColor: "rgba(139, 92, 246, 0.08)",
                ".dark &": {
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                },
              },
            },
            "& .MuiListItemText-primary": {
              color: "#111827",
              ".dark &": {
                color: "#F9FAFB",
              },
            },
            "& .MuiListItemText-secondary": {
              color: "#6B7280",
              ".dark &": {
                color: "#9CA3AF",
              },
            },
            "& .MuiListItemIcon-root": {
              color: "#6B7280",
              ".dark &": {
                color: "#9CA3AF",
              },
            },
            "& .MuiDivider-root": {
              borderColor: "#E5E7EB",
              ".dark &": {
                borderColor: "#374151",
              },
            },
            animation: "fadeInDown 0.2s ease-out",
            "@keyframes fadeInDown": {
              from: {
                opacity: 0,
                transform: "translateY(-8px)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0)",
              },
            },
          },
        }}
      >
        {/* User Info Section */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "#E5E7EB",
            ".dark &": {
              borderColor: "#374151",
            },
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{
              color: "#111827",
              whiteSpace: "normal",
              wordBreak: "break-word",
              ".dark &": {
                color: "#F9FAFB",
              },
            }}
          >
            {userName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "#6B7280",
              whiteSpace: "normal",
              wordBreak: "break-word",
              ".dark &": {
                color: "#9CA3AF",
              },
            }}
          >
            {userEmail}
          </Typography>
        </Box>

        {/* Navigation Section */}
        <MenuItem
          component={Link}
          href="/dashboard"
          onClick={handleClose}
          aria-label={t("common.home")}
        >
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("common.home")} />
        </MenuItem>
        <Divider />

        {/* Settings Section */}
        <MenuItem
          onClick={handleLanguageClick}
          id="language-button"
          aria-label={t("common.language")}
          aria-haspopup="true"
          aria-expanded={langMenuOpen}
          aria-controls={langMenuOpen ? "language-menu" : undefined}
          onMouseEnter={(e) => {
            // Keep parent menu open when hovering over language item
            e.stopPropagation();
          }}
        >
          <ListItemIcon>
            <Language fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("common.language")} />
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              textTransform: "uppercase",
              color: "#6B7280",
              ".dark &": {
                color: "#9CA3AF",
              },
            }}
          >
            {i18n.language}
          </Typography>
        </MenuItem>
        <Menu
          anchorEl={langMenuAnchor}
          open={langMenuOpen}
          onClose={handleLanguageClose}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          id="language-menu"
          aria-labelledby="language-button"
          disableAutoFocusItem
          MenuListProps={{
            onMouseLeave: (e) => {
              // Don't close on mouse leave - allow time for selection
              e.stopPropagation();
            },
            onMouseEnter: (e) => {
              // Keep menu open when mouse enters
              e.stopPropagation();
            },
          }}
          PaperProps={{
            sx: {
              minWidth: 160,
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#FFFFFF",
              ".dark &": {
                backgroundColor: "#1F2937",
              },
              "& .MuiMenuItem-root": {
                color: "#111827",
                ".dark &": {
                  color: "#F9FAFB",
                },
                "&:hover": {
                  backgroundColor: "rgba(139, 92, 246, 0.08)",
                  ".dark &": {
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                  },
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(139, 92, 246, 0.12)",
                  color: "#6B46C1",
                  ".dark &": {
                    backgroundColor: "rgba(139, 92, 246, 0.2)",
                    color: "#8B5CF6",
                  },
                },
              },
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang}
              onClick={() => changeLanguage(lang)}
              selected={i18n.language === lang}
              aria-label={`Switch to ${languageNames[lang]}`}
            >
              <ListItemText primary={languageNames[lang]} />
            </MenuItem>
          ))}
        </Menu>
        <MenuItem
          onClick={toggleMode}
          aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <ListItemIcon>
            {mode === "dark" ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={mode === "dark" ? t("common.lightMode") : t("common.darkMode")} />
        </MenuItem>

        <Divider />

        {/* Logout Section */}
        <MenuItem onClick={handleLogout} aria-label={t("common.logout")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t("common.logout")} />
        </MenuItem>
      </Menu>
    </>
  );
}

