#!/usr/bin/env bash
set -euo pipefail

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export UV_PROJECT_ENVIRONMENT="${UV_PROJECT_ENVIRONMENT:-${BACKEND_DIR}/.venv-wsl}"

exec uv --directory "$BACKEND_DIR" run fastapi dev
