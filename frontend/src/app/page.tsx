import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";

const features = [
  "AI-crafted recipes tailored to your pantry and dietary goals",
  "Nutrition breakdowns powered by trusted data sources",
  "Smart shopping lists to streamline grocery runs",
  "Favorites, history, and recommendations that learn with you",
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f5f3ff 50%, #f9f8ff 100%)",
      }}
    >
      <Box
        component="header"
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Stack spacing={3} maxWidth="640px">
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: 2 }}>
              AI Recipe Studio
            </Typography>
            <Typography component="h1" variant="h1" sx={{ lineHeight: 1.1 }}>
              Cook smarter with personalized recipes in seconds.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Input your ingredients, dietary preferences, or wellness goals and let our AI chef craft delicious dishes
              complete with nutrition insights, shopping lists, and tailored visuals.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Link href="/login">
                <Button variant="contained" size="large">
                  Start planning meals
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outlined" size="large">
                  Go to dashboard
                </Button>
              </Link>
            </Stack>
            <Box
              sx={{
                width: "100%",
                maxWidth: 220,
                height: 4,
                borderRadius: 999,
                backgroundColor: "rgba(108, 99, 255, 0.2)",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "45%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #6c63ff, #b39bff)",
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flex: 1,
          py: { xs: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h2">What’s coming next</Typography>
          <Stack spacing={1.5} component="ul" sx={{ pl: 2, listStyle: "disc", maxWidth: 720 }}>
            {features.map((item) => (
              <Box component="li" key={item}>
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
        <Divider />
      </Container>

    </Box>
  );
}
