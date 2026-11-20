"""Clerk session authentication helpers for FastAPI routes."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Annotated, Any

from clerk_backend_api import AuthenticateRequestOptions, authenticate_request
from fastapi import Depends, HTTPException, Request

from src.config import get_settings


logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class AuthenticatedUser:
    """Verified user identity and active organization from a Clerk session."""

    user_id: str
    organization_id: str


def require_user(request: Request) -> AuthenticatedUser:
    """Authenticate a Clerk session and require an active organization."""
    settings = get_settings()
    if not settings.clerk_secret_key:
        raise HTTPException(status_code=503, detail="Authentication is not configured")
    authorization = request.headers.get("authorization", "")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Send a Clerk session token as a bearer token")

    try:
        state = authenticate_request(
            request,
            AuthenticateRequestOptions(
                secret_key=settings.clerk_secret_key,
                jwt_key=settings.clerk_jwt_key,
                authorized_parties=settings.clerk_authorized_parties,
                accepts_token=["session_token"],
            ),
        )
    except Exception:
        logger.exception("Clerk token verification failed")
        raise HTTPException(status_code=401, detail="Invalid or expired session") from None

    payload: dict[str, Any] = state.payload or {}
    if not state.is_signed_in:
        raise HTTPException(status_code=401, detail="Sign in to continue")

    user_id = payload.get("sub")
    organization = payload.get("o")
    organization_id = organization.get("id") if isinstance(organization, dict) else None
    organization_id = organization_id or payload.get("org_id")

    if not isinstance(user_id, str) or not user_id:
        raise HTTPException(status_code=401, detail="Session has no user identity")
    if not isinstance(organization_id, str) or not organization_id:
        raise HTTPException(status_code=403, detail="Select an organization to continue")

    return AuthenticatedUser(user_id=user_id, organization_id=organization_id)


CurrentUser = Annotated[AuthenticatedUser, Depends(require_user)]
