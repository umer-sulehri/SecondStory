# Connecting the database (Supabase)

The message **"Connect Supabase to enable authentication"** appears because no
Supabase credentials are configured yet. The app is built to run without a
backend (browsing, wishlist, and try-on demo all work locally), and it switches
on auth + persistence the moment you add your keys.

## 1. Create a Supabase project

1. Go to <https://supabase.com> and create a free project.
2. Wait for it to finish provisioning.

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) and run it.
   This creates all tables (profiles, products, categories, wishlists, try-on
   history, subscribers, reviews, analytics), the new-user trigger, and Row
   Level Security policies.

## 3. Add your keys

Open `.env.local` and fill in the values from
**Supabase Dashboard → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...   # keep secret, server-only
```

For Google sign-in, also enable the Google provider under
**Authentication → Providers** in Supabase.

## 4. (Optional) Enable AI Try-On

Add a Gemini API key from <https://aistudio.google.com/app/apikey>:

```
GEMINI_API_KEY=AIza...
```

Without it, try-on still works in demo mode and returns the product image.

## 5. Restart & verify

```bash
npm run dev
```

Then check the connection status:

```bash
curl http://localhost:3000/api/health
```

A healthy response looks like:

```json
{
  "supabase": { "configured": true, "connected": true },
  "gemini": { "configured": true }
}
```

You can also open `http://localhost:3000/api/health` in the browser.
Once `connected` is `true`, sign up at `/register` and the account will be
created in your Supabase project.

## Making yourself an admin

After signing up, set your role to `admin` in the SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```
