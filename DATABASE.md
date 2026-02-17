# User database setup (Supabase)

Sign-ups are stored in a **Supabase** (Postgres) project. Follow these steps once.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**, pick an organization, name the project (e.g. `feelvie`), set a database password, and create the project.
3. In the dashboard, open **Project Settings** → **API** and copy:
   - **Project URL** → use as `SUPABASE_URL`
   - **service_role** key (under "Project API keys") → use as `SUPABASE_SERVICE_ROLE_KEY`  
   ⚠️ Keep the service_role key secret; only use it in server-side code (API routes).

## 2. Create the `users` table

In the Supabase dashboard, open **SQL Editor** and run:

```sql
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  password_hash text not null,
  created_at timestamptz default now()
);

-- Optional: allow API to insert/read (service_role bypasses RLS)
alter table public.users enable row level security;

create policy "Service role can manage users"
  on public.users
  for all
  using (true)
  with check (true);
```

## 3. Add environment variables

In the project root, create or edit `.env.local` and add:

```env
# Required for API sign-up (email/password) and for OAuth (Google, etc.)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Required for “Continue with Google” and other OAuth sign-in (browser + server auth)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Use the same project URL for both `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`. Use the **anon** (public) key for `NEXT_PUBLIC_SUPABASE_ANON_KEY` and the **service_role** key for `SUPABASE_SERVICE_ROLE_KEY`. Restart the dev server after changing env vars (`npm run dev`).

## 4. (Optional) Sign in with Google

To let users sign up and sign in with their Google account:

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create or select a project, then go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**. Choose **Web application**, add your **Authorized JavaScript origins** (e.g. `http://localhost:3000` and your production URL), and under **Authorized redirect URIs** add your **Supabase** callback URL (this is *not* your app’s `/auth/callback`). You find it in Supabase Dashboard → **Authentication** → **URL Configuration** → **Callback URL (for OAuth)**. It looks like:
   ```text
   https://gzeuqbyrekugyouxbykq.supabase.co/auth/v1/callback
   ```
   (Use the URL shown in your own Supabase project; the part before `.supabase.co` is your project ref.)
2. In the Supabase dashboard, go to **Authentication** → **Providers** → **Google**. Enable Google and paste the Client ID and Client Secret from Google. Save.
3. In **Authentication** → **URL Configuration**, add **Redirect URLs**: `http://localhost:3000/auth/callback` and `https://yourdomain.com/auth/callback` (use your real production URL).
4. Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (step 3). Then use **Sign in** or **Sign up** and click **Continue with Google**.

To add more providers (e.g. GitHub, Apple), enable them under **Authentication** → **Providers** in Supabase and add a “Continue with GitHub” (etc.) button that calls `signInWithOAuth({ provider: 'github' })` in your app (you can expose this from `AuthContext` the same way as `signInWithGoogle`).

## 5. (Optional) Sync watch list, watched, and playlists for signed-in users

When users sign in with **Google** (Supabase Auth), their watch list, watched list, and playlists are saved to the database and restored on any device.

In the Supabase **SQL Editor**, run:

```sql
create table if not exists public.user_watchlist_sync (
  user_id uuid primary key references auth.users(id) on delete cascade,
  watchlist jsonb not null default '[]',
  watched jsonb not null default '[]',
  playlists jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

alter table public.user_watchlist_sync enable row level security;

create policy "Users can read own sync"
  on public.user_watchlist_sync for select
  using (auth.uid() = user_id);

create policy "Users can insert own sync"
  on public.user_watchlist_sync for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sync"
  on public.user_watchlist_sync for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

After this, signing in with Google will load and save watch list, watched, and playlists to this table. Email/password sign-in (without Supabase Auth) still uses only local storage.

## 6. Test sign-up

Go to **Sign up**, enter name, email, and password (min 6 characters), and submit. The user is stored in the `users` table and you stay signed in on the client as before.

## Optional: email/password sign-in (real auth)

Email/password **sign-up** is stored in the `users` table and uses the API. **Sign-in** with email/password is still client-only (no password check). To add real email/password sign-in:

- Add an API route (e.g. `POST /api/auth/signin`) that accepts email + password, looks up the user in `users`, compares with `bcrypt.compare()`, and returns a session/token or sets a cookie; or
- Use **Supabase Auth** email/password and `supabase.auth.signInWithPassword()` so Supabase handles both sign-up and sign-in.
