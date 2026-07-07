# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and a hosted MySQL database, for the Reno Platforms Web Development Assignment.

Live app:https://notice-board-snowy.vercel.app/
Repository: https://github.com/alokkitchloo/Notice-board

## Features

- List all notices as responsive cards (phone and desktop).
- Create and edit notices through a single shared form.
- Delete with a confirmation step.
- Urgent notices are always sorted above Normal notices, with a red "Urgent" badge — ordering is done in the Prisma query (`orderBy`), not in the browser.
- All writes (create/update/delete) go through API routes under `pages/api/notices`, with server-side validation.
- Optional image field (bonus) — see "Decisions on unspecified requirements" below.

## Tech stack

- **Framework:** Next.js 14, Pages Router
- **Database access:** Prisma
- **Database:** Any free hosted MySQL-compatible DB (TiDB Cloud recommended) — Postgres via Neon/Supabase also works with a one-line schema change
- **Hosting:** Vercel (free/Hobby tier)
- **Styling:** Tailwind CSS

## Running locally

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up a free hosted database**
   - Easiest option: [TiDB Cloud](https://tidbcloud.com) → create a free Serverless cluster → copy the connection string.
   - Alternative: [Neon](https://neon.tech) or [Supabase](https://supabase.com) (Postgres) — if you use one of these, change `provider = "mysql"` to `provider = "postgresql"` in `prisma/schema.prisma`.

3. **Configure environment variables**
   ```
   cp .env.example .env
   ```
   Paste your connection string into `.env` as `DATABASE_URL`.

4. **Push the schema to your database**
   ```
   npx prisma db push
   ```

5. **Run the dev server**
   ```
   npm run dev
   ```
   Open http://localhost:3000

## Deploying to Vercel

1. Push this repo to a **public** GitHub repository.
2. Import the repo into [Vercel](https://vercel.com) (free Hobby tier).
3. Add the `DATABASE_URL` environment variable in the Vercel project settings (same value as your local `.env`).
4. Deploy. Vercel runs `prisma generate` automatically via the `postinstall` script, and `next build` runs `prisma generate` again via the `build` script as a safety net.
5. Confirm the deployment is public (opens without logging in) before submitting.

## Decisions on unspecified requirements

The assignment intentionally leaves some things unspecified. The calls made here:

- **Image field (bonus):** implemented as a plain image URL input rather than a file upload. A real upload would need separate storage (e.g. S3) purely to satisfy a bonus item, which felt like disproportionate infrastructure for the time available. A URL field still lets a notice display an image and keeps the app deployable on Vercel's free tier with no extra services.
- **Order of Normal notices:** ordered by `publishDate` descending (most recent first) within each priority group, since the brief left this open and "most recent first" is the most common default for a notice feed.
- **Delete confirmation:** implemented as an in-app modal (rather than the native `window.confirm`) so it matches the rest of the UI and works consistently across mobile browsers.

## One thing I'd improve with more time

Add optimistic UI updates and toast notifications for create/update/delete, instead of full-page redirects and a blocking `alert()` on delete failure. I'd also add pagination or infinite scroll once the notice count grows, since `findMany()` currently fetches the whole table on every page load.

## Where and how AI was used

I used Claude (Anthropic) throughout this project as a pair-programmer:
- Scaffolding the Next.js Pages Router structure, Prisma schema, and API routes.
- Writing the server-side validation logic in `lib/validateNotice.js`.
- Working through the Urgent-first Prisma `orderBy` approach (ordering by the enum's string value rather than sorting in JavaScript).
- Styling the components with Tailwind.
- Drafting this README.

All code was reviewed, run, and tested locally against a real hosted database before deployment; nothing was copied in without understanding it.
