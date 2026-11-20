"""Persist analysis submissions and run the TypeScript analysis pipeline."""

from __future__ import annotations

import logging
import re
import subprocess
from datetime import UTC, datetime
from urllib.parse import urlsplit
from src.config import ConfigurationError, REPOSITORY_ROOT, get_settings
from postgrest.exceptions import APIError
import httpx
from supabase import Client, create_client

logger = logging.getLogger(__name__)
REPOSITORY_NAME = re.compile(r"^[A-Za-z0-9_.-]+$")


class InvalidRepository(ValueError):
    """Raised when a repository input is not a supported GitHub URL."""


def parse_repository_url(value: str) -> tuple[str, str]:
    """Normalize a GitHub URL or owner/name pair into owner and repository."""
    trimmed = value.strip()
    bare = re.fullmatch(r"([^/\s]+)/([^/\s]+)", trimmed)

    if bare and "." not in bare.group(1):
        owner, name = bare.groups()
    else:
        candidate = (
            trimmed
            if re.match(r"^[a-z]+://", trimmed, re.IGNORECASE)
            else f"https://{trimmed}"
        )
        try:
            parsed = urlsplit(candidate)
            hostname = parsed.hostname
        except ValueError as error:
            raise InvalidRepository(
                f'"{trimmed}" is not a GitHub repository URL'
            ) from error

        if hostname not in {"github.com", "www.github.com"}:
            host_label = hostname or "the supplied host"
            raise InvalidRepository(
                f"Only github.com repositories can be analyzed, not {host_label}"
            )

        parts = [part for part in parsed.path.split("/") if part]
        owner = parts[0] if len(parts) > 0 else None
        name = parts[1] if len(parts) > 1 else None

    if name:
        name = re.sub(r"\.git$", "", name)
    if (
        not owner
        or not name
        or not REPOSITORY_NAME.fullmatch(owner)
        or not REPOSITORY_NAME.fullmatch(name)
    ):
        raise InvalidRepository(
            f'"{trimmed}" does not name a repository; ' "expected github.com/owner/name"
        )

    return owner.lower(), name.lower()


def create_admin_client() -> Client:
    """Create a Supabase client with the backend service key."""
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_secret_key:
        raise ConfigurationError(
            "NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SECRET_KEY must be set"
        )
    return create_client(settings.supabase_url, settings.supabase_secret_key)


def submit_repository(organization_id: str, repository_url: str) -> tuple[str, bool]:
    """Persist the project and analysis, returning its ID and creation status."""
    owner, name = parse_repository_url(repository_url)
    db = create_admin_client()

    db.table("organizations").upsert(
        {"id": organization_id}, on_conflict="id", ignore_duplicates=True
    ).execute()
    db.table("projects").upsert(
        {
            "organization_id": organization_id,
            "repo_owner": owner,
            "repo_name": name,
        },
        on_conflict="organization_id,repo_owner,repo_name",
        ignore_duplicates=True,
    ).execute()

    project_result = (
        db.table("projects")
        .select("id")
        .eq("organization_id", organization_id)
        .eq("repo_owner", owner)
        .eq("repo_name", name)
        .single()
        .execute()
    )
    project_id = project_result.data["id"]

    inserted = (
        db.table("analyses")
        .upsert(
            {"organization_id": organization_id, "project_id": project_id},
            on_conflict="project_id",
            ignore_duplicates=True,
        )
        .select("id")
        .execute()
    )
    if inserted.data:
        return inserted.data[0]["id"], True

    existing = (
        db.table("analyses")
        .select("id")
        .eq("project_id", project_id)
        .single()
        .execute()
    )
    return existing.data["id"], False


def run_typescript_pipeline(
    repository_url: str, organization_id: str, analysis_id: str
) -> None:
    """Run the TypeScript analysis pipeline and mark startup failures."""
    settings = get_settings()
    command = [
        settings.node_executable,
        "scripts/analyze.ts",
        repository_url,
        "--org",
        organization_id,
        "--rerun",
    ]

    try:
        result = subprocess.run(
            command,
            cwd=REPOSITORY_ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
    except OSError:
        logger.exception("Could not start the analysis runner for %s", analysis_id)
        mark_queued_analysis_failed(analysis_id)
        return

    if result.stdout.strip():
        logger.info(
            "Analysis runner output for %s:\n%s", analysis_id, result.stdout.strip()
        )
    if result.returncode != 0:
        logger.error(
            "Analysis runner exited with status %s for %s:\n%s",
            result.returncode,
            analysis_id,
            result.stderr.strip(),
        )
        mark_queued_analysis_failed(analysis_id)


def mark_queued_analysis_failed(analysis_id: str) -> None:
    """Mark an analysis as failed if its runner could not start."""
    try:
        db = create_admin_client()
        now = datetime.now(UTC).isoformat()
        db.table("analyses").update(
            {
                "status": "failed",
                "stage": "fetch",
                "stage_message": "The analysis runner could not start",
                "started_at": now,
                "finished_at": now,
                "error": "The analysis runner could not start",
            }
        ).eq("id", analysis_id).eq("status", "queued").execute()
    except (ConfigurationError, APIError, httpx.HTTPError):
        logger.exception("Could not mark analysis %s as failed", analysis_id)
