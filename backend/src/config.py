"""Backend configuration loaded from environment variables and `.env.local`."""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(REPOSITORY_ROOT / ".env.local")


class ConfigurationError(RuntimeError):
    """Raised when required service configuration is missing."""

@dataclass(frozen=True)
class Settings:
    """Typed settings shared by the backend services."""

    clerk_secret_key: str
    clerk_jwt_key: str | None
    clerk_authorized_parties: list[str]
    supabase_url: str
    supabase_secret_key: str
    node_executable: str

    @classmethod
    def from_environment(cls) -> Settings:
        """Build settings from the current process environment."""
        parties = os.getenv("CLERK_AUTHORIZED_PARTIES", "http://localhost:3000")
        return cls(
            clerk_secret_key=os.getenv("CLERK_SECRET_KEY", "").strip(),
            clerk_jwt_key=os.getenv("CLERK_JWT_KEY", "").strip() or None,
            clerk_authorized_parties=[
                party.strip() for party in parties.split(",") if party.strip()
            ],
            supabase_url=(
                os.getenv("SUPABASE_URL", "").strip()
                or os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").strip()
            ),
            supabase_secret_key=os.getenv("SUPABASE_SECRET_KEY", "").strip(),
            node_executable=os.getenv("NODE_EXECUTABLE", "node").strip() or "node",
        )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the cached backend settings."""
    return Settings.from_environment()
