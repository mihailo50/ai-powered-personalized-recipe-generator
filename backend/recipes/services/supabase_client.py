from functools import lru_cache
from typing import Optional

from django.conf import settings
from supabase import Client, create_client


class SupabaseConfigurationError(RuntimeError):
    """Raised when required Supabase settings are missing."""


@lru_cache(maxsize=1)
def get_supabase_client(service_role: bool = True) -> Client:
    """
    Create a Supabase client using configuration from Django settings.

    Args:
        service_role: If True, use the service role key; otherwise, use the anon key.

    Returns:
        Supabase Client instance.
    """

    url: Optional[str] = getattr(settings, "SUPABASE_URL", None)
    key: Optional[str]

    if service_role:
        key = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", None)
    else:
        key = getattr(settings, "SUPABASE_ANON_KEY", None)

    if not url or not key:
        raise SupabaseConfigurationError(
            "Supabase URL or API key is not configured. "
            "Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/ANON_KEY are set."
        )

    return create_client(url, key)


