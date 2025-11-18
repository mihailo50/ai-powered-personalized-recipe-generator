from __future__ import annotations

from typing import Any, Dict, List, Optional, Set

from postgrest.exceptions import APIError
from supabase import Client

from .supabase_client import get_supabase_client, SupabaseConfigurationError


class SupabaseRepository:
    """
    Data access helper that encapsulates Supabase table interactions.
    """

    def __init__(self, client: Optional[Client] = None):
        self.client = client or get_supabase_client()

    # Recipes -----------------------------------------------------------------
    def insert_recipe(self, recipe_data: Dict[str, Any], user_id: Optional[str]) -> Optional[str]:
        payload = {
            **recipe_data,
            "created_by": user_id,
        }
        response = self.client.table("recipes").insert(payload).execute()
        data = getattr(response, "data", None)
        if not data:
            return None
        return data[0].get("id")

    def list_recipes(self, user_id: Optional[str], scope: str = "mine", limit: int = 20) -> List[Dict[str, Any]]:
        if scope == "favorites":
            if not user_id:
                return []
            response = (
                self.client.table("favorites")
                .select("recipe:recipes(*)")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            rows = getattr(response, "data", []) or []
            favorites = []
            for row in rows:
                recipe = row.get("recipe") or {}
                if recipe:
                    recipe["is_favorite"] = True
                    favorites.append(recipe)
            return favorites

        query = (
            self.client.table("recipes")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
        )
        if scope == "mine" and user_id:
            query = query.eq("created_by", user_id)
        response = query.execute()
        records = getattr(response, "data", []) or []

        if user_id:
            favorite_ids = self.get_favorite_ids(user_id)
            for record in records:
                record["is_favorite"] = record.get("id") in favorite_ids

        return records

    # Favorites ---------------------------------------------------------------
    def set_favorite(self, user_id: str, recipe_id: str, add: bool = True) -> None:
        if add:
            (
                self.client.table("favorites")
                .upsert({"user_id": user_id, "recipe_id": recipe_id})
                .execute()
            )
        else:
            (
                self.client.table("favorites")
                .delete()
                .match({"user_id": user_id, "recipe_id": recipe_id})
                .execute()
            )

    # Search history ---------------------------------------------------------
    def log_search_history(
        self,
        user_id: Optional[str],
        query_payload: Dict[str, Any],
        generated_recipe_id: Optional[str],
    ) -> Optional[str]:
        if not user_id:
            return None

        payload = {
            "user_id": user_id,
            "query": query_payload.get("notes") or ", ".join(query_payload.get("ingredients", [])),
            "ingredients": query_payload.get("ingredients"),
            "diet_preferences": query_payload.get("diet_preferences"),
            "generated_recipe_id": generated_recipe_id,
        }

        response = self.client.table("search_history").insert(payload).execute()
        data = getattr(response, "data", None)
        if not data:
            return None
        return data[0].get("id")

    def list_history(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        response = (
            self.client.table("search_history")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return getattr(response, "data", []) or []

    def get_favorite_ids(self, user_id: str) -> Set[str]:
        response = (
            self.client.table("favorites")
            .select("recipe_id")
            .eq("user_id", user_id)
            .execute()
        )
        data = getattr(response, "data", []) or []
        return {item.get("recipe_id") for item in data if item.get("recipe_id")}

__all__ = ["SupabaseRepository", "SupabaseConfigurationError"]

