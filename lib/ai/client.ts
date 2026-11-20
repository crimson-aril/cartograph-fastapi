import OpenAI from "openai";
import { wrapOpenAI } from "langsmith/wrappers/openai";

// The one place the AI client is constructed. A client built anywhere else
// would work and silently go untraced, so nothing else imports "openai".

// Versioned model IDs are part of the cache keys; changing one invalidates
// only the answers produced by that task and provider.
const PROVIDER_MODELS = {
  openai: {
    explain: "gpt-5.5-2026-04-23",
    classify: "gpt-5.4-mini-2026-03-17",
  },
  gemini: {
    explain: "gemini-3.8-flash",
    classify: "gemini-3.5-flash-lite",
  },
} as const;

export type AIProvider = keyof typeof PROVIDER_MODELS;
export type ModelTask = keyof (typeof PROVIDER_MODELS)["openai"];

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

export type TracingStatus = { on: true; project: string } | { on: false; reason: string };

// An absent key looks exactly like a working setup with no traffic, so the
// state is reported with every answer instead of being inferred.
export function tracingStatus(): TracingStatus {
  if (process.env.LANGSMITH_TRACING?.trim() !== "true") return { on: false, reason: "LANGSMITH_TRACING isn't \"true\"" };
  if (!process.env.LANGSMITH_API_KEY?.trim()) return { on: false, reason: "LANGSMITH_API_KEY isn't set" };
  return { on: true, project: process.env.LANGSMITH_PROJECT?.trim() || "default" };
}

let openAiClient: OpenAI | null = null;
let geminiClient: OpenAI | null = null;
let localClient: OpenAI | null = null;

export type CompletionResult = {
  response: OpenAI.Chat.Completions.ChatCompletion;
  model: string;
};

export type ChatRequest = Omit<
  OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming,
  "model"
>;

/** Choose Gemini when its key is present unless a provider is selected explicitly. */
export function aiProvider(): AIProvider {
  const configured = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (configured && configured !== "auto") {
    if (configured === "openai" || configured === "gemini") return configured;
    throw new Error('AI_PROVIDER must be "auto", "openai", or "gemini"');
  }
  return process.env.GEMINI_API_KEY?.trim() ? "gemini" : "openai";
}

export function modelForTask(task: ModelTask): string {
  const provider = aiProvider();
  if (provider === "gemini") {
    return process.env.GEMINI_MODEL?.trim() || PROVIDER_MODELS.gemini[task];
  }
  return PROVIDER_MODELS.openai[task];
}

function providerKey(provider: AIProvider): string | undefined {
  const key = provider === "gemini" ? process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY;
  return key?.trim() || undefined;
}

// Built on first use, so missing credentials fail the AI call that needs them
// instead of preventing the web application from starting.
function providerAi(provider: AIProvider): OpenAI {
  const key = providerKey(provider);
  if (!key) throw new Error(`${provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} isn't set in .env.local`);

  if (provider === "gemini") {
    if (geminiClient) return geminiClient;
    geminiClient = wrapOpenAI(
      new OpenAI({ apiKey: key, baseURL: GEMINI_BASE_URL, maxRetries: 0 }),
      { tracingEnabled: tracingStatus().on },
    );
    return geminiClient;
  }

  if (openAiClient) return openAiClient;
  openAiClient = wrapOpenAI(new OpenAI({ apiKey: key, maxRetries: 0 }), {
    tracingEnabled: tracingStatus().on,
  });
  return openAiClient;
}

function localSettings(): { baseURL: string; model: string; apiKey: string } | null {
  const baseURL = process.env.LOCAL_LLM_BASE_URL?.trim();
  const model = process.env.LOCAL_LLM_MODEL?.trim();
  if (!baseURL && !model) return null;
  if (!baseURL || !model) {
    throw new Error("Set both LOCAL_LLM_BASE_URL and LOCAL_LLM_MODEL to enable the local LLM");
  }
  try {
    const url = new URL(baseURL);
    if (!url.pathname.replace(/\/+$/, "").endsWith("/v1")) {
      throw new Error("missing /v1 path");
    }
  } catch {
    throw new Error("LOCAL_LLM_BASE_URL must be a valid URL, including /v1 for llama.cpp");
  }
  return { baseURL: baseURL.replace(/\/+$/, ""), model, apiKey: process.env.LOCAL_LLM_API_KEY?.trim() || "llama.cpp" };
}

function localAi(): OpenAI {
  if (localClient) return localClient;
  const settings = localSettings();
  if (!settings) throw new Error("Local LLM fallback is not configured");
  localClient = wrapOpenAI(
    new OpenAI({ apiKey: settings.apiKey, baseURL: settings.baseURL, maxRetries: 0 }),
    { tracingEnabled: tracingStatus().on },
  );
  return localClient;
}

/** Model names used to look up cached answers, in provider priority order. */
export function cacheModelCandidates(model: string): string[] {
  const local = localSettings();
  const provider = aiProvider();
  const candidates = providerKey(provider) ? [model] : [];
  if (local) candidates.push(local.model);
  if (candidates.length === 0) candidates.push(model);
  return [...new Set(candidates)];
}

/** Use the configured cloud provider, falling back to a local model on HTTP 429. */
export async function completeChat(model: string, request: ChatRequest): Promise<CompletionResult> {
  const provider = aiProvider();
  const apiKey = providerKey(provider);
  const local = localSettings();

  if (apiKey) {
    try {
      return {
        response: await providerAi(provider).chat.completions.create({
          ...providerRequest(provider, request),
          model,
        }),
        model,
      };
    } catch (error) {
      if (!local || !isQuotaError(error)) throw error;
      console.warn(`${provider} quota/rate limit reached; retrying with local model ${local.model}.`);
    }
  } else if (!local) {
    const requiredKey = provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY";
    throw new Error(`Set ${requiredKey} or configure LOCAL_LLM_BASE_URL and LOCAL_LLM_MODEL`);
  }

  const { verbosity: _verbosity, ...localRequest } = request;
  return {
    response: await localAi().chat.completions.create({ ...localRequest, model: local!.model }),
    model: local!.model,
  };
}

function providerRequest(provider: AIProvider, request: ChatRequest): ChatRequest {
  if (provider === "openai") return request;
  const { verbosity: _verbosity, ...geminiRequest } = request;
  return geminiRequest;
}

function isQuotaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const value = error as { status?: unknown; code?: unknown; type?: unknown; error?: { code?: unknown } };
  return value.status === 429
    || value.code === "insufficient_quota"
    || value.error?.code === "insufficient_quota"
    || value.type === "insufficient_quota";
}

/**
 * How every traced step is recorded. Whatever runs inside it, the cache read
 * included, is one run, so a cache hit shows up as a run with no model call
 * under it. With tracing off the function runs exactly the same, untraced.
 */
export function traceConfig(name: string) {
  return { name, run_type: "chain", tracingEnabled: tracingStatus().on } as const;
}
