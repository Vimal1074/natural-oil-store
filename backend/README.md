# Backend API

FastAPI service for the Natural Oil store concept.

## Run locally

From the repository root in PowerShell:

```powershell
py -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
```

Open `backend\.env` and set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` from a Supabase project you control. The API reads this file when it starts. Then start the API:

```powershell
uvicorn app.main:app --app-dir backend --reload
```

The API listens on `http://127.0.0.1:8000`. Open `/health` for its status or `/docs` for the API reference.

## Routes in this step

- `GET /api/catalog/categories`
- `GET /api/catalog/products?category=slug&search=term`
- `GET /api/employee/me`
- `GET /api/employee/attendance`
- `GET /api/employee/payroll`

Employee routes require `Authorization: Bearer <Supabase access token>`. The API forwards that user token and the publishable key to Supabase so database row-level security controls access. The server does not use a service-role or secret key. These routes return real records only after you apply the migration, configure Supabase, and create authorized data.

No credentials are included in this repository. Never put a Supabase secret/service-role key in the frontend, `.env.example`, or source control.
