"""Create the Cartograph FastAPI application and health endpoint."""

from fastapi import FastAPI

from src.api.routes.analyses import router as analyses_router

app = FastAPI(
    title="Cartograph API",
    description="API for Cartograph's codebase analysis workflows.",
    version="0.1.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)
app.include_router(analyses_router, prefix="/api/v1")


@app.get("/api/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Report that the API process is responding."""
    return {"status": "ok"}
