import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6c63ff",
    },
    secondary: {
      main: "#9b8eff",
    },
    background: {
      default: "#f9f8ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f1f2b",
      secondary: "#6f6f84",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-heading, 'Montserrat', 'Roboto', sans-serif)",
    h1: {
      fontWeight: 700,
      fontSize: "2.75rem",
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.25rem",
      letterSpacing: "-0.3px",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0.3,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 20px 45px rgba(108, 99, 255, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: "1.75rem",
          paddingBlock: "0.85rem",
          boxShadow: "0 10px 30px rgba(108, 99, 255, 0.25)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          ":hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 18px 40px rgba(108, 99, 255, 0.25)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
  },
});


