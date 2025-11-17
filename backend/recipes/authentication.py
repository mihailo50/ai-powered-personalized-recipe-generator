import jwt
from dataclasses import dataclass
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.conf import settings
from typing import Optional


@dataclass
class SupabaseUser:
    id: str
    email: Optional[str] = None

    @property
    def is_authenticated(self) -> bool:  # pragma: no cover - property logic is trivial
        return True

    def __str__(self) -> str:
        return f"SupabaseUser(id={self.id})"


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Authenticate requests using Supabase-issued JWT tokens.
    """

    keyword = "Bearer"

    @staticmethod
    def _login_detail(code: str, message: str) -> dict:
        return {
            "code": code,
            "detail": message,
            "login_url": getattr(settings, "FRONTEND_LOGIN_URL", "/login"),
        }

    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        try:
            scheme, token = auth_header.split()
        except ValueError as exc:  # pragma: no cover - defensive path
            raise exceptions.AuthenticationFailed(
                detail=self._login_detail("invalid_authorization_header", "Invalid Authorization header.")
            ) from exc

        if scheme.lower() != self.keyword.lower():
            return None

        secret = (
            getattr(settings, "SUPABASE_JWT_SECRET", None)
            or getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)
            or getattr(settings, "SUPABASE_ANON_KEY", None)
        )
        if not secret:
            raise exceptions.AuthenticationFailed(
                detail=self._login_detail("server_configuration_error", "Supabase JWT secret is not configured.")
            )

        try:
            payload = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                options={"verify_aud": False},
            )
        except Exception as exc:  # pragma: no cover - JWT library handles specifics
            raise exceptions.AuthenticationFailed(
                detail=self._login_detail("invalid_token", f"Invalid Supabase token: {exc}")
            ) from exc

        user_id = payload.get("sub") or payload.get("user_id")
        if not user_id:
            raise exceptions.AuthenticationFailed(
                detail=self._login_detail("invalid_token", "Supabase token missing subject.")
            )

        email = payload.get("email")
        user = SupabaseUser(id=user_id, email=email)
        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer realm="supabase"'

