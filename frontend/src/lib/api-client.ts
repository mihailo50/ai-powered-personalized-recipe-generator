type RecipeRequestPayload = {
  ingredients: string[];
  diet_preferences?: string[];
  exclude_ingredients?: string[];
  cuisine?: string;
  servings?: number;
  notes?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

export function generateRecipe(payload: RecipeRequestPayload, token: string) {
  return request<{ recipe: unknown; saved_recipe_id?: string }>(
    "/suggestions/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function fetchRecipes(params: URLSearchParams, token: string) {
  return request<{ recipes: unknown[] }>(`/recipes/?${params.toString()}`, { method: "GET" }, token);
}

export function fetchHistory(token: string) {
  return request<{ history: unknown[] }>("/history/", { method: "GET" }, token);
}

export function toggleFavorite(recipeId: string, action: "add" | "remove", token: string) {
  return request<{ status: string }>(
    "/favorites/",
    {
      method: "POST",
      body: JSON.stringify({ recipe_id: recipeId, action }),
    },
    token,
  );
}

export function registerUser(payload: { email: string; password: string; confirm_password: string }) {
  return request<{ message: string }>("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

