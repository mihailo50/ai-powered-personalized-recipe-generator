from dataclasses import asdict

from django.conf import settings
from rest_framework import exceptions, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import SupabaseJWTAuthentication
from .serializers import (
    FavoriteToggleSerializer,
    ProfileUpdateSerializer,
    RecipeListQuerySerializer,
    RecipeSuggestionRequestSerializer,
    RegistrationSerializer,
)
from .services import (
    RecipeGenerator,
    SupabaseConfigurationError,
    SupabaseRepository,
    get_supabase_client,
)


class HealthCheckView(APIView):
    """
    Lightweight health endpoint to verify service availability.
    """

    authentication_classes: list = []
    permission_classes: list = []

    def get(self, request):
        health = {"status": "ok", "supabase": "unconfigured"}

        if settings.SUPABASE_URL:
            try:
                get_supabase_client()
                health["supabase"] = "connected"
            except SupabaseConfigurationError:
                health["supabase"] = "misconfigured"
            except Exception as exc:  # pragma: no cover - diagnostic only
                health["supabase"] = f"error: {exc}"

        return Response(health, status=status.HTTP_200_OK)


class RecipeSuggestionView(APIView):
    """
    Generate personalized recipes via LangChain/OpenAI and persist the output to Supabase.
    """

    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes: list = []

    def post(self, request):
        serializer = RecipeSuggestionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        generator = RecipeGenerator()
        recipe = generator.generate(payload)
        recipe_dict = asdict(recipe)

        supabase_status = "unconfigured"
        saved_recipe_id = None
        history_entry_id = None

        repo = self._get_repository_optional()
        if repo:
            supabase_status = "connected"
            user_id = getattr(getattr(request, "user", None), "id", None)
            saved_recipe_id = repo.insert_recipe(
                {
                    "title": recipe.title,
                    "description": recipe.description,
                    "servings": recipe.servings,
                    "prep_time_minutes": recipe.prep_time_minutes,
                    "cook_time_minutes": recipe.cook_time_minutes,
                    "ingredients": recipe.ingredients,
                    "instructions": recipe.instructions,
                    "nutrition": recipe.nutrition,
                    "image_url": recipe.image_url,
                    "source": recipe.source,
                    "model_version": recipe.model_version,
                    "shopping_list": recipe.shopping_list,
                },
                user_id=user_id,
            )
            history_entry_id = repo.log_search_history(user_id, payload, saved_recipe_id)
        elif settings.SUPABASE_URL:
            supabase_status = "misconfigured"

        response_payload = {
            "recipe": recipe_dict,
            "supabase": supabase_status,
            "saved_recipe_id": saved_recipe_id,
            "history_entry_id": history_entry_id,
        }

        return Response(response_payload, status=status.HTTP_201_CREATED)

    def _get_repository_optional(self) -> SupabaseRepository | None:
        if not settings.SUPABASE_URL:
            return None

        try:
            return SupabaseRepository()
        except SupabaseConfigurationError:
            return None


class SupabaseProtectedAPIView(APIView):
    authentication_classes = [SupabaseJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def permission_denied(self, request, message=None, code=None):
        if self.request.successful_authenticator is None:
            raise exceptions.NotAuthenticated(detail=message)
        raise exceptions.PermissionDenied(detail=message)


class RecipeListView(SupabaseProtectedAPIView):

    def get(self, request):
        query_serializer = RecipeListQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)
        params = query_serializer.validated_data

        try:
            repo = SupabaseRepository()
        except SupabaseConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        records = repo.list_recipes(
            user_id=request.user.id,
            scope=params["scope"],
            limit=params["limit"],
        )
        return Response({"recipes": records}, status=status.HTTP_200_OK)


class SearchHistoryView(SupabaseProtectedAPIView):

    def get(self, request):
        limit = int(request.query_params.get("limit", 20))
        try:
            repo = SupabaseRepository()
        except SupabaseConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        history = repo.list_history(request.user.id, limit=limit)
        return Response({"history": history}, status=status.HTTP_200_OK)


class FavoriteToggleView(SupabaseProtectedAPIView):

    def post(self, request):
        serializer = FavoriteToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        recipe_id = str(serializer.validated_data["recipe_id"])
        add = serializer.validated_data["action"] == "add"

        try:
            repo = SupabaseRepository()
        except SupabaseConfigurationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        repo.set_favorite(request.user.id, recipe_id, add=add)
        return Response(
            {"status": "added" if add else "removed"},
            status=status.HTTP_200_OK,
        )


class ProfileView(SupabaseProtectedAPIView):

    def get(self, request):
        try:
            repo = SupabaseRepository()
        except SupabaseConfigurationError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        profile = repo.get_profile(request.user.id)
        return Response({"profile": profile}, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = ProfileUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            repo = SupabaseRepository()
        except SupabaseConfigurationError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        profile = repo.upsert_profile(request.user.id, serializer.validated_data)
        return Response({"profile": profile}, status=status.HTTP_200_OK)


class RegistrationView(APIView):
    permission_classes: list = []
    authentication_classes: list = []

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]

        domain = email.split("@")[-1]
        if settings.ALLOWED_EMAIL_DOMAINS and domain not in settings.ALLOWED_EMAIL_DOMAINS:
            return Response(
                {"detail": "Email domain is not allowed. Please use a trusted provider."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            supabase = get_supabase_client()
        except SupabaseConfigurationError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        try:
            # Create the user as unconfirmed so they must verify email,
            # then send a confirmation invite email via Supabase.
            supabase.auth.admin.create_user(
                {
                    "email": email,
                    "password": password,
                    "email_confirm": False,
                }
            )
            # Ensure the confirmation email is actually sent
            supabase.auth.admin.invite_user_by_email(email)
        except Exception as exc:  # pragma: no cover - supabase admin raises generic errors
            return Response(
                {"detail": f"Unable to create account: {exc}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Account created. Please check your inbox to confirm email."},
            status=status.HTTP_201_CREATED,
        )


class RecommendationView(SupabaseProtectedAPIView):
    """
    Very lightweight recommender based on frequency of ingredients
    in a user's search history. It returns a list of suggested tags/ingredients.
    """

    def get(self, request):
        try:
            repo = SupabaseRepository()
        except SupabaseConfigurationError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        history = repo.list_history(request.user.id, limit=100)
        counts: dict[str, int] = {}
        for item in history:
            for ing in (item.get("ingredients") or []):
                if not isinstance(ing, str):
                    continue
                key = ing.strip().lower()
                if not key:
                    continue
                counts[key] = counts.get(key, 0) + 1
        # top-N ingredients
        suggestions = sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:10]
        return Response({"suggestions": [name for name, _ in suggestions]}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Stateless logout endpoint. Frontend should clear Supabase session.
    Provided for symmetry and future auditing if needed.
    """

    authentication_classes: list = []
    permission_classes: list = []

    def post(self, _request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
