import jwt
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from unittest import mock


class HealthCheckViewTests(APITestCase):
    def test_health_endpoint_returns_ok(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("supabase", data)


@override_settings(SUPABASE_URL=None)
class RecipeSuggestionViewTests(APITestCase):
    def test_recipe_generation_returns_recipe_payload(self):
        payload = {
            "ingredients": ["tofu", "broccoli"],
            "diet_preferences": ["vegan"],
            "servings": 2,
        }
        response = self.client.post("/api/suggestions/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertIn("recipe", data)
        self.assertEqual(data["recipe"]["servings"], 2)
        self.assertEqual(data["supabase"], "unconfigured")

    def test_recipe_generation_validates_payload(self):
        payload = {"ingredients": []}
        response = self.client.post("/api/suggestions/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AuthenticatedAPITestMixin:
    secret = "test-secret"

    def get_token(self, user_id: str = "user-123") -> str:
        return jwt.encode({"sub": user_id, "email": "user@example.com"}, self.secret, algorithm="HS256")

    def auth_headers(self, user_id: str = "user-123") -> dict:
        return {"HTTP_AUTHORIZATION": f"Bearer {self.get_token(user_id)}"}


@override_settings(SUPABASE_JWT_SECRET="test-secret", SUPABASE_URL="https://example.supabase.co")
class RecipeListViewTests(AuthenticatedAPITestMixin, APITestCase):
    @mock.patch("recipes.views.SupabaseRepository")
    def test_requires_authentication(self, mock_repo):
        mock_repo.return_value.list_recipes.return_value = [{"title": "Test"}]
        response = self.client.get("/api/recipes/", **self.auth_headers())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data["recipes"]), 1)

    def test_missing_auth_returns_403_without_token(self):
        response = self.client.get("/api/recipes/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


@override_settings(SUPABASE_JWT_SECRET="test-secret", SUPABASE_URL="https://example.supabase.co")
class SearchHistoryViewTests(AuthenticatedAPITestMixin, APITestCase):
    @mock.patch("recipes.views.SupabaseRepository")
    def test_returns_history(self, mock_repo):
        mock_repo.return_value.list_history.return_value = [{"query": "tofu"}]
        response = self.client.get("/api/history/", **self.auth_headers())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["history"][0]["query"], "tofu")


@override_settings(SUPABASE_JWT_SECRET="test-secret", SUPABASE_URL="https://example.supabase.co")
class FavoriteToggleViewTests(AuthenticatedAPITestMixin, APITestCase):
    @mock.patch("recipes.views.SupabaseRepository")
    def test_toggle_favorite(self, mock_repo):
        payload = {"recipe_id": "11111111-1111-1111-1111-111111111111", "action": "add"}
        response = self.client.post("/api/favorites/", payload, format="json", **self.auth_headers())
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "added")
        mock_repo.return_value.set_favorite.assert_called_once()


@override_settings(
    SUPABASE_SERVICE_ROLE_KEY="test-secret",
    SUPABASE_URL="https://example.supabase.co",
    ALLOWED_EMAIL_DOMAINS=["gmail.com"],
)
class RegistrationViewTests(APITestCase):
    @mock.patch("recipes.views.get_supabase_client")
    def test_rejects_invalid_domain(self, mock_client):
        payload = {"email": "user@tempmail.com", "password": "password123", "confirm_password": "password123"}
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_client.assert_not_called()

    @mock.patch("recipes.views.get_supabase_client")
    def test_creates_user(self, mock_client):
        mock_client.return_value.auth.admin.create_user.return_value = True
        payload = {"email": "user@gmail.com", "password": "password123", "confirm_password": "password123"}
        response = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_client.return_value.auth.admin.create_user.assert_called_once()
