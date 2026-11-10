# Public demo hosting

This project uses a Vite storefront, a FastAPI catalog API, and Supabase. `render.yaml` defines a Render Blueprint with separate static-site and API services. Render's Blueprint connects both services to the same Git repository.

## Before publishing

- Keep the GitHub repository private unless you intentionally want the source code public.
- Never commit `backend/.env`. `.gitignore` excludes it. Enter `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in Render's Blueprint setup when prompted; copy them from the local `backend/.env` file without sharing them in chat.
- The non-Coconut prices are random demo values. Payment, checkout, and the employee portal are prototypes, not ready for real customers or staff data.

## Render setup

1. Push this project to a private GitHub repository. Include `render.yaml` and the latest `supabase/seed_demo_catalog.sql`.
2. In Render, choose **New → Blueprint**, connect the repository, and use the Blueprint values. Enter the two Supabase variables from `backend/.env` when prompted.
3. Wait for both services to deploy. The storefront URL is the static site URL; the API URL is available from the API service's `/health` and `/docs` paths.
4. In the API service's **Environment** settings, add `CORS_ORIGINS` with the exact storefront origin, for example `https://natural-oil-store.onrender.com` (no path or trailing slash). Save and redeploy the API. This allows the hosted storefront to request the API while keeping CORS restricted to that storefront.
5. Open the storefront URL and confirm catalog loading. Direct navigation to `/employee` is handled by the static-site rewrite.

The Blueprint uses Render's free web-service plan. Free web services spin down after 15 minutes without traffic, so the first API request after idle time can take longer to respond. Choose a paid plan if the demo needs consistent response times.

## Update the catalog

Run the latest `supabase/seed_demo_catalog.sql` in Supabase SQL Editor before presenting the demo. It refreshes the sample catalog and example pack prices. The API service reads Supabase settings from Render environment variables; it does not read the local `.env` file after deployment.
