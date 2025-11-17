import json
import logging
import os
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from langchain_openai import ChatOpenAI


@dataclass
class GeneratedRecipe:
    title: str
    description: str
    servings: int
    prep_time_minutes: int
    cook_time_minutes: int
    ingredients: List[Dict[str, str]] = field(default_factory=list)
    instructions: List[Dict[str, Any]] = field(default_factory=list)
    nutrition: Dict[str, Any] = field(default_factory=dict)
    shopping_list: List[str] = field(default_factory=list)
    image_prompt: str = ""
    image_url: Optional[str] = None
    source: str = "ai"
    model_version: Optional[str] = None


logger = logging.getLogger(__name__)


class RecipeGenerator:
    """
    Generates recipe ideas using OpenAI via LangChain with a deterministic fallback.
    """

    def __init__(self, llm: Optional[ChatOpenAI] = None):
        self.llm = llm or self._build_llm()

    def _build_llm(self) -> Optional[ChatOpenAI]:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY is not configured; using fallback recipe generator.")
            return None

        return ChatOpenAI(
            temperature=0.4,
            model="gpt-4o-mini",
            max_tokens=800,
            api_key=api_key,
        )

    def generate(self, payload: Dict[str, Any]) -> GeneratedRecipe:
        if not self.llm:
            return self._fallback(payload, reason="llm-unavailable")

        prompt = self._build_prompt(payload)
        try:
            response = self.llm.invoke(prompt)
            content = getattr(response, "content", response)
            if isinstance(content, list):
                content = "".join(chunk.get("text", "") for chunk in content if isinstance(chunk, dict))
            content = self._normalize_model_output(content)
            data = json.loads(content)
            return self._from_model_payload(data)
        except Exception as exc:
            logger.exception("OpenAI recipe generation failed: %s", exc)
            return self._fallback(payload, reason=str(exc))

    def _build_prompt(self, payload: Dict[str, Any]) -> str:
        ingredients = ", ".join(payload.get("ingredients", []))
        diet = ", ".join(payload.get("diet_preferences", [])) or "no specific diet"
        exclude = ", ".join(payload.get("exclude_ingredients", [])) or "none"
        cuisine = payload.get("cuisine") or "chef's choice"
        servings = payload.get("servings", 2)
        language = payload.get("language", "en")
        
        # Map language codes to full language names for better OpenAI understanding
        language_map = {
            "en": "English",
            "sr": "Serbian",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "it": "Italian",
            "pt": "Portuguese",
            "ru": "Russian",
            "zh": "Chinese",
            "ja": "Japanese",
            "ko": "Korean",
        }
        language_name = language_map.get(language.lower(), "English")
        
        # Detect if ingredients/notes are in a non-English language
        notes = payload.get("notes", "")
        all_text = f"{ingredients} {notes}".lower()
        
        # Simple heuristic: if language is Serbian or if text contains Cyrillic/Serbian characters
        serbian_indicators = ["ć", "č", "đ", "š", "ž", "њ", "љ", "џ"]
        has_serbian_chars = any(char in all_text for char in serbian_indicators)
        
        # If Serbian is detected in text but language not set, use Serbian
        if has_serbian_chars and language == "en":
            language = "sr"
            language_name = "Serbian"

        language_instruction = (
            f"IMPORTANT: Respond entirely in {language_name} language. "
            f"All text fields (title, description, ingredient names, instructions, shopping_list) must be in {language_name}. "
            f"Only numeric values (servings, prep_time_minutes, cook_time_minutes, nutrition values) should remain as numbers. "
        ) if language != "en" else ""

        return (
            "You are an experienced private chef and nutritionist. "
            f"{language_instruction}"
            "Generate a JSON response with keys: title, description, servings, prep_time_minutes, "
            "cook_time_minutes, ingredients (list of {name, quantity}), instructions (list of {step, description}), "
            "nutrition (calories, protein_g, carbs_g, fats_g), shopping_list (list of strings) and image_prompt. "
            f"Use the following context:\n"
            f"- Ingredients available: {ingredients}\n"
            f"- Dietary preferences: {diet}\n"
            f"- Exclude ingredients: {exclude}\n"
            f"- Cuisine inspiration: {cuisine}\n"
            f"- Desired servings: {servings}\n"
            "Ensure the JSON is valid and concise. Return ONLY the JSON object with no commentary or code fences."
        )

    def _fallback(self, payload: Dict[str, Any], reason: str = "fallback-offline") -> GeneratedRecipe:
        ingredients = payload.get("ingredients", [])
        title = f"Creative {', '.join(ingredients[:2])} Bowl" if ingredients else "AI Pantry Bowl"
        instructions = [
            {"step": 1, "description": "Prep all ingredients by chopping into bite-sized pieces."},
            {"step": 2, "description": "Sauté aromatics, add remaining ingredients, and cook until tender."},
            {"step": 3, "description": "Season to taste, plate, and garnish with herbs or seeds."},
        ]
        nutrition = {
            "calories": 450,
            "protein_g": 24,
            "carbs_g": 40,
            "fats_g": 18,
        }
        shopping_list = [fresh for fresh in ingredients if fresh.lower() not in {"salt", "pepper"}]

        return GeneratedRecipe(
            title=title,
            description="A comforting dish generated offline because the AI model is unavailable.",
            servings=payload.get("servings", 2),
            prep_time_minutes=15,
            cook_time_minutes=20,
            ingredients=[{"name": item, "quantity": "as needed"} for item in ingredients],
            instructions=instructions,
            nutrition=nutrition,
            shopping_list=shopping_list,
            image_prompt=f"Studio photo of {title}, vibrant lighting",
            model_version=reason,
        )

    def _normalize_model_output(self, content: Any) -> str:
        if not isinstance(content, str):
            content = str(content or "")
        normalized = content.strip()
        if normalized.startswith("```"):
            normalized = normalized.strip("`")
            if normalized.lower().startswith("json"):
                normalized = normalized[4:].lstrip()
        return normalized

    def _from_model_payload(self, data: Dict[str, Any]) -> GeneratedRecipe:
        return GeneratedRecipe(
            title=data.get("title", "AI Crafted Dish"),
            description=data.get("description", ""),
            servings=data.get("servings", 2),
            prep_time_minutes=data.get("prep_time_minutes", 15),
            cook_time_minutes=data.get("cook_time_minutes", 20),
            ingredients=data.get("ingredients") or [],
            instructions=data.get("instructions") or [],
            nutrition=data.get("nutrition") or {},
            shopping_list=data.get("shopping_list") or [],
            image_prompt=data.get("image_prompt", ""),
            image_url=data.get("image_url"),
            model_version=data.get("model_version", "openai"),
        )


__all__ = ["RecipeGenerator", "GeneratedRecipe"]

