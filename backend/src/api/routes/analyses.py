"""API routes for submitting repository analyses."""

from __future__ import annotations

import logging
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from src.auth import CurrentUser
from src.config import ConfigurationError
from src.services.analysis_submission import (
    InvalidRepository,
    run_typescript_pipeline,
    submit_repository,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analyses", tags=["analyses"])


class SubmitAnalysisRequest(BaseModel):
    """Request body for creating a repository analysis."""

    repository_url: Annotated[str, Field(min_length=1, max_length=2048)]


class SubmitAnalysisResponse(BaseModel):
    """Response returned after accepting an analysis request."""

    analysis_id: UUID
    created: bool


@router.post("", response_model=SubmitAnalysisResponse, status_code=202)
def submit_analysis(
    request: SubmitAnalysisRequest,
    background_tasks: BackgroundTasks,
    current_user: CurrentUser,
) -> SubmitAnalysisResponse:
    """Persist an analysis request and schedule its pipeline if it is new."""
    repository_url = request.repository_url.strip()
    try:
        analysis_id, created = submit_repository(
            current_user.organization_id,
            repository_url,
        )
    except InvalidRepository as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except ConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except Exception:
        logger.exception("Could not submit repository analysis")
        raise HTTPException(
            status_code=502,
            detail="Could not submit the repository analysis",
        ) from None

    if created:
        background_tasks.add_task(
            run_typescript_pipeline,
            repository_url,
            current_user.organization_id,
            analysis_id,
        )

    return SubmitAnalysisResponse(analysis_id=UUID(analysis_id), created=created)
