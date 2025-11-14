# AI-Powered Personalized Recipe Generator

## Vision
Create a full-stack web application that crafts personalized recipes using generative AI. Users can input their available ingredients, dietary preferences, or nutritional goals, and receive tailored recipes accompanied by nutritional breakdowns, shopping lists, and generated imagery for each dish.

## Core Features
- Ingredient- and preference-driven recipe generation powered by OpenAI models via LangChain.
- Nutrition enrichment and shopping list generation through third-party APIs such as Spoonacular.
- User accounts with persistent storage for favorites, preferences, and history (Supabase/PostgreSQL).
- AI-generated dish imagery using DALL·E or a compatible image generation API.
- Recommendation engine leveraging prior user activity to surface new recipes.

## Technical Foundations
- **Backend**: Django + Django REST Framework with LangChain orchestration and external API integrations. Django’s batteries-included auth, admin, and ORM accelerate user profile management while DRF provides robust API tooling.
- **Frontend**: Next.js (React) with Material UI for a fast, SEO-friendly SPA/SSR hybrid experience and component-driven design system.
- **Database**: Supabase-hosted PostgreSQL for auth, profile data, favorites, and logs.
- **Deployment**: Vercel (frontend) and a managed backend host (e.g., Render, Railway, or Supabase Edge Functions) with environment-specific configuration.
- **Tooling**: Poetry/pipenv (backend), pnpm/yarn (frontend), Docker Compose for local orchestration, GitHub Actions for CI.

## Initial Directory Layout
- `backend/`: Flask/Django service, LangChain pipelines, external integrations, tests.
- `frontend/`: React app with Material UI components, authentication, recipe dashboard.
- `docs/`: Architecture decisions, API contracts, UX flows, research notes.
- `infrastructure/`: Deployment scripts, IaC templates, Docker Compose, environment config.

## Next Steps Checklist
1. Finalize stack decisions (Flask vs. Django) and initialize the backend framework.
2. Scaffold the React frontend with routing, theme, and auth shell.
3. Define API schema and data models for Supabase.
4. Integrate LangChain agents with recipe/nutrition providers.
5. Prototype DALL·E image generation workflow.
6. Implement user profile persistence and favorites.
7. Build recommendation engine using historical interactions.
8. Establish CI/CD pipelines and deployment targets.


