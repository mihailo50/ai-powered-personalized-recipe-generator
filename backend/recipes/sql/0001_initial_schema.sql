-- Enable UUID generation extension (already available in Supabase but kept idempotent)
create extension if not exists "pgcrypto";

-- Recipes table stores AI generated results and manually curated entries.
create table if not exists public.recipes (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    servings integer,
    prep_time_minutes integer,
    cook_time_minutes integer,
    ingredients jsonb default '[]'::jsonb,
    instructions jsonb default '[]'::jsonb,
    nutrition jsonb default '{}'::jsonb,
    image_url text,
    source text,
    model_version text,
    shopping_list jsonb default '[]'::jsonb,
    created_by uuid references auth.users (id) on delete set null,
    created_at timestamptz default timezone('utc', now()) not null
);

alter table public.recipes
    add column if not exists shopping_list jsonb default '[]'::jsonb;

alter table public.recipes
    enable row level security;

drop policy if exists "Allow read access to recipes" on public.recipes;
create policy "Allow read access to recipes"
    on public.recipes
    for select
    using (true);

drop policy if exists "Creators can manage their recipes" on public.recipes;
create policy "Creators can manage their recipes"
    on public.recipes
    for all
    using (auth.uid() = created_by)
    with check (auth.uid() = created_by);

-- Favorites join table associates users with saved recipes.
create table if not exists public.favorites (
    user_id uuid references auth.users (id) on delete cascade,
    recipe_id uuid references public.recipes (id) on delete cascade,
    created_at timestamptz default timezone('utc', now()) not null,
    primary key (user_id, recipe_id)
);

alter table public.favorites
    enable row level security;

drop policy if exists "Users manage their favorites" on public.favorites;
create policy "Users manage their favorites"
    on public.favorites
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Search history logs prompts and context for personalization.
create table if not exists public.search_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users (id) on delete cascade,
    query text not null,
    ingredients jsonb default '[]'::jsonb,
    diet_preferences jsonb default '[]'::jsonb,
    generated_recipe_id uuid references public.recipes (id),
    created_at timestamptz default timezone('utc', now()) not null
);

alter table public.search_history
    enable row level security;

drop policy if exists "Users can manage their search history" on public.search_history;
create policy "Users can manage their search history"
    on public.search_history
    for all
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

