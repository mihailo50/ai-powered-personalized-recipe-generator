from rest_framework import serializers


class IngredientSerializer(serializers.Serializer):
    name = serializers.CharField()
    quantity = serializers.CharField(required=False, allow_blank=True, default="")


class InstructionSerializer(serializers.Serializer):
    step = serializers.IntegerField(min_value=1)
    description = serializers.CharField()


class RecipeSuggestionRequestSerializer(serializers.Serializer):
    ingredients = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
    )
    diet_preferences = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )
    exclude_ingredients = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )
    cuisine = serializers.CharField(required=False, allow_blank=True)
    servings = serializers.IntegerField(required=False, min_value=1, default=2)
    notes = serializers.CharField(required=False, allow_blank=True)


class RecipeListQuerySerializer(serializers.Serializer):
    limit = serializers.IntegerField(required=False, min_value=1, max_value=50, default=20)
    scope = serializers.ChoiceField(
        choices=("mine", "public", "favorites"),
        required=False,
        default="mine",
    )


class FavoriteToggleSerializer(serializers.Serializer):
    recipe_id = serializers.UUIDField()
    action = serializers.ChoiceField(choices=("add", "remove"))


class RegistrationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)
    confirm_password = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

