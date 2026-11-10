import os
import logging
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


load_dotenv(Path(__file__).resolve().parents[1] / ".env")
logger = logging.getLogger("natural_oil.supabase")


app = FastAPI(
    title="Natural Oil API",
    description="Backend foundation for an independent commerce demonstration.",
    version="0.2.0",
)

default_cors_origins = "http://localhost:5173,http://127.0.0.1:5173"
cors_origins = [
    origin.strip().rstrip("/")
    for origin in os.getenv("CORS_ORIGINS", default_cors_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


def supabase_config() -> tuple[str, str]:
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    key = os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
    if not url or not key:
        raise HTTPException(
            status_code=503,
            detail="Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.",
        )
    return url, key


async def supabase_get(path: str, *, token: str | None = None, params: dict[str, str] | None = None) -> Any:
    url, key = supabase_config()
    headers = {"apikey": key}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            response = await client.get(f"{url}{path}", headers=headers, params=params)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail="Could not reach the Supabase project.") from exc
    if response.status_code in (401, 403):
        logger.warning(
            "Supabase rejected %s with HTTP %s: %s",
            path,
            response.status_code,
            response.text[:500],
        )
        raise HTTPException(status_code=401 if token else 503, detail="Supabase rejected this request.")
    if response.is_error:
        raise HTTPException(status_code=502, detail="Supabase could not complete the data request.")
    return response.json()


async def require_user_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Sign in is required.")
    return authorization[7:].strip()


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    """Return a small status response for local development and hosting checks."""
    return {"status": "ok", "service": "natural-oil-api"}


@app.get("/api/catalog/categories", tags=["catalog"])
async def list_categories() -> Any:
    """List active categories; Supabase RLS keeps inactive categories private."""
    return await supabase_get(
        "/rest/v1/categories",
        params={"select": "id,name,slug,description,sort_order", "is_active": "eq.true", "order": "sort_order.asc"},
    )


@app.get("/api/catalog/products", tags=["catalog"])
async def list_products(
    category: str | None = Query(default=None, description="Category slug"),
    search: str | None = Query(default=None, min_length=1, max_length=80),
) -> Any:
    """List active products and variants, optionally filtered by category or name."""
    params = {
        "select": "id,name,slug,description,ingredients,usage_notes,categories(name,slug),product_variants(id,sku,size_label,price_inr)",
        "is_active": "eq.true",
        "product_variants.is_active": "eq.true",
        "order": "name.asc",
    }
    if category:
        params["categories.slug"] = f"eq.{category}"
    if search:
        safe_search = search.replace("%", "\\%").replace("_", "\\_").replace(",", "\\,")
        params["name"] = f"ilike.*{safe_search}*"
    return await supabase_get("/rest/v1/products", params=params)


@app.get("/api/employee/me", tags=["employee"])
async def employee_profile(token: str = Depends(require_user_token)) -> Any:
    """Return only the employee profile visible to the signed-in user (or admin)."""
    return await supabase_get(
        "/rest/v1/employees",
        token=token,
        params={
            "select": "id,employee_code,job_title,hired_on,is_active,profiles(full_name)",
            "limit": "1",
        },
    )


@app.get("/api/employee/attendance", tags=["employee"])
async def employee_attendance(
    token: str = Depends(require_user_token),
    limit: int = Query(default=30, ge=1, le=100),
) -> Any:
    """Return attendance rows allowed by employee/admin RLS policies."""
    return await supabase_get(
        "/rest/v1/attendance_records",
        token=token,
        params={
            "select": "id,employee_id,work_date,status,check_in,check_out,note",
            "order": "work_date.desc",
            "limit": str(limit),
        },
    )


@app.get("/api/employee/payroll", tags=["employee"])
async def employee_payroll(
    token: str = Depends(require_user_token),
    limit: int = Query(default=12, ge=1, le=36),
) -> Any:
    """Return salary rows visible to the employee owner or an authorized admin."""
    return await supabase_get(
        "/rest/v1/salary_records",
        token=token,
        params={
            "select": "id,employee_id,pay_period,base_salary_inr,allowances_inr,deductions_inr,net_salary_inr,status,paid_at",
            "order": "pay_period.desc",
            "limit": str(limit),
        },
    )
