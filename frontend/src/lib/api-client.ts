import { handleAuthRedirect } from "./auth-redirect";

type RecipeRequestPayload = {
  ingredients: string[];
  diet_preferences?: string[];
  exclude_ingredients?: string[];
  cuisine?: string;
  servings?: number;
  notes?: string;
  language?: string;
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

  // Handle 401 Unauthorized responses with auth_required code
  if (response.status === 401) {
    try {
      const payload = await response.json();
      if (payload?.code === "auth_required") {
        // Clear Supabase tokens and redirect to login
        const loginUrl = payload.login_url ?? "/login";
        return handleAuthRedirect(loginUrl);
      }
      // If it's a 401 but not auth_required, include the payload in the error
      throw new Error(`API error (401): ${JSON.stringify(payload)}`);
    } catch (error) {
      // If JSON parsing fails or it's not auth_required, handle as normal error
      if (error instanceof Error && error.message.includes("API error")) {
        throw error;
      }
      // Fall through to normal error handling below
    }
  }

  if (!response.ok) {
    // Try to get error body as text (body may already be consumed if we parsed JSON above)
    let errorBody = "";
    try {
      errorBody = await response.text();
    } catch {
      errorBody = `Error ${response.status}: ${response.statusText}`;
    }
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

export function getProfile(token: string) {
  return request<{ profile: unknown }>("/profile/", { method: "GET" }, token);
}

export function updateProfile(
  payload: { display_name?: string; avatar_url?: string; diet_preferences?: string[]; allergens?: string[]; calorie_target?: number | null },
  token: string,
) {
  return request<{ profile: unknown }>("/profile/", { method: "PUT", body: JSON.stringify(payload) }, token);
}

export function getRecommendations(token: string) {
  return request<{ suggestions: string[] }>("/recommendations/", { method: "GET" }, token);
}

export function backendLogout() {
  // optional call - backend is stateless; this exists for future auditing
  return request<{ status: string }>("/auth/logout/", { method: "POST" });
}

export function checkAuthStatus(token?: string) {
  return request<{ isLoggedIn: boolean }>("/auth/status/", { method: "GET" }, token);
}

