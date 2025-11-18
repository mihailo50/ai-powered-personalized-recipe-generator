from django.urls import path

from .views import (
    FavoriteToggleView,
    HealthCheckView,
    RecipeListView,
    RecipeSuggestionView,
    SearchHistoryView,
    RegistrationView,
    RecommendationView,
    LogoutView,
    LoginView,
    AuthStatusView
)


app_name = "recipes"

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
    path("suggestions/", RecipeSuggestionView.as_view(), name="recipe-suggestion"),
    path("recipes/", RecipeListView.as_view(), name="recipes-list"),
    path("history/", SearchHistoryView.as_view(), name="search-history"),
    path("favorites/", FavoriteToggleView.as_view(), name="favorite-toggle"),
    path("recommendations/", RecommendationView.as_view(), name="recommendations"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/status/", AuthStatusView.as_view(), name="auth-status"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/register/", RegistrationView.as_view(), name="auth-register"),
]


