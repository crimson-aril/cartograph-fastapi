type FastApiSubmission = {
  analysisId: string;
  created: boolean;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseSubmission(value: unknown): FastApiSubmission | null {
  if (typeof value !== "object" || value === null) return null;
  if (!("analysis_id" in value) || !("created" in value)) return null;

  const analysisId = value.analysis_id;
  const created = value.created;
  if (typeof analysisId !== "string" || !UUID_PATTERN.test(analysisId) || typeof created !== "boolean") return null;

  return { analysisId, created };
}

export async function submitToFastApi(repositoryUrl: string, token: string | null): Promise<FastApiSubmission | null> {
  if (!token) return null;

  const baseUrl = process.env.FASTAPI_URL?.trim() || "http://127.0.0.1:8000";
  let endpoint: URL;
  try {
    endpoint = new URL("/api/v1/analyses", baseUrl);
  } catch {
    console.error("FASTAPI_URL is invalid; using the Next.js submission fallback.");
    return null;
  }
  const isLocal = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(endpoint.hostname);
  if (endpoint.protocol !== "https:" && !isLocal) {
    console.error(
      "FASTAPI_URL must use HTTPS outside local development; using the Next.js submission fallback.",
    );
    return null;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repository_url: repositoryUrl }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;
    return parseSubmission(await response.json());
  } catch {
    console.error("FastAPI submission failed; using the Next.js submission fallback.");
    return null;
  }
}
