# Cartograph: AI-Powered Codebase Dependency Mapper

[![Project banner](public/readme/readme-hero.webp)](https://youtu.be/-AkIj8TG3Uc)

![Next.js](https://img.shields.io/badge/-Next.js_-black?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Clerk](https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Supabase](https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![LangSmith](https://img.shields.io/badge/-LangSmith-1C1C1C?style=for-the-badge&logo=langchain&logoColor=white)
![CodeRabbit](https://img.shields.io/badge/-CodeRabbit-FF6600?style=for-the-badge&logo=coderabbit&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-000000?style=for-the-badge&logo=react&logoColor=white)

> **Fork notice:** This is a substantially modified fork of the project shown
> in the JavaScript Mastery YouTube tutorial. Most of the code has changed or
> been extended. This version adds a FastAPI submission API, Gemini support, and
> optional local llama.cpp support with a quota fallback. The video does not
> teach these additions, and its code and setup may
> not match this fork. Follow this README for the current project.

## Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Quick Start](#quick-start)
5. [Known Development Warnings](#known-development-warnings)
6. [Assets](#assets)
7. [See more](#more)

## Tutorial

The video below covers the original tutorial project. This fork has since
diverged substantially, so the tutorial's code and setup instructions may not
match the current repository.

Watch it for a walkthrough of the original upstream project.

[![Watch the tutorial](https://github.com/sujatagunale/EasyRead/assets/151519281/1736fca5-a031-4854-8c09-bc110e3bc16d)](https://youtu.be/-AkIj8TG3Uc)

## Introduction

Cartograph is a developer tool that turns any public TypeScript or JavaScript
repository into an interactive dependency map. Modern engineering teams
frequently ship AI-generated code without fully reading every underlying file,
creating complex architectural webs with hidden imports and coupled modules.
Cartograph solves this by parsing raw source code into navigable nodes and
edges, allowing developers to immediately visualize dependency chains,
evaluate blast radii before making edits, and ask AI models for context-aware
explanations grounded entirely in true AST parsing.

Built around a strict core principle, Cartograph guarantees that every node and
edge on the canvas comes directly from real code analysis rather than AI
predictions. By keeping graph arithmetic pure and standalone, the AI agent is
only permitted to explain and summarize verified structure. Packed with
multi-tenant organization support via Clerk, row-level security on Supabase,
and full observability tracing through LangSmith, Cartograph provides
production-grade infrastructure for software teams navigating large codebases.

If you're getting started and need assistance or face any bugs, join our active
Discord community with over **50k+** members. It's a place where people help
each other out.

[![Join the Discord community](https://github.com/sujatagunale/EasyRead/assets/151519281/618f4872-1e10-42da-8213-1d69e486d02e)](https://discord.com/invite/n6EdbFJ)

## Tech Stack

- **[Next.js 16](https://nextjs.org/)** is a full-stack React framework that
  powers Cartograph using the App Router, Server Actions, and dynamic
  server-rendering capabilities for seamless frontend-backend integration.

- **[FastAPI](https://fastapi.tiangolo.com/)** is the primary API for repository
  submissions. The Next.js submission action remains available as a fallback
  if the API service cannot be reached.

- **[TypeScript 7](https://www.typescriptlang.org/)** is a strongly typed
  superset of JavaScript that ensures strict type safety across the entire
  application and parser pipeline.

- **[ts-morph](https://ts-morph.com/)** is a wrapper around the TypeScript
  Compiler API that parses source code files, imports, re-exports, and dynamic
  references into deterministic AST graph structures.

- **[React Flow (@xyflow/react)](https://reactflow.dev/)** is an interactive
  canvas library used alongside dagre for laying out, rendering, and
  navigating complex codebase dependency graphs.

- **[Clerk](https://jsm.dev/carto-clerk)** provides identity management and
  multi-tenant organization authorization, issuing tokens that govern user
  access throughout the platform.

- **[Supabase](https://jsm.dev/carto-supabase)** supplies the Postgres database
  layer with strict Row-Level Security (RLS) policies enforced directly via JWT
  claims.

- **[OpenAI SDK](https://platform.openai.com/)** drives AI explanations through
  one LangSmith-wrapped client. Use OpenAI or Gemini's
  [OpenAI-compatible endpoint](https://ai.google.dev/gemini-api/docs/openai);
  both answer from parsed code structures. A local OpenAI-compatible model can
  handle requests directly or serve as a quota fallback.

- **[LangSmith](https://jsm.dev/carto-langsmith)** is an observability platform
  that traces every LLM call, records dataset runs, and evaluates model
  responses against exact ground-truth code metrics.

- **[Tailwind CSS v4](https://tailwindcss.com/)** is a utility-first CSS
  framework that powers Cartograph's dense, high-information developer
  interface.

- **[CodeRabbit](https://jsm.dev/carto-coderabbit)** is an AI code reviewer
  that automatically analyzes PRs to enforce architectural rules and codebase
  consistency.

## Features

- **AST Codebase Parsing** — Converts public GitHub repositories into complete
  node-and-edge graph maps by parsing imports, re-exports, dynamic imports, and
  `require()` calls without relying on AI predictions.

- **Interactive Canvas Mapping** — Zoom, expand folders into individual files,
  select modules, and view connected incoming and outgoing dependencies
  rendered via React Flow.

- **Blast Radius Calculation** — Instant arithmetic over the graph structure to
  reveal exactly which files and downstream modules break if a specific file
  is changed.

- **Grounded Module Explanations** — Contextual summaries generated for any
  file using only its real AST connections, with every mentioned filename
  hyperlinked directly on the map.

- **Agentic Repository Chat** — An interactive agent panel that walks verified
  graph paths step by step to answer architectural questions without
  inventing nonexistent files or relationships.

- **FastAPI Submission API** — Repository submissions use FastAPI first and
  fall back to the existing Next.js action if the API is unavailable.

- **Local LLM Option** — Use a local llama.cpp server directly or as a fallback
  when the selected cloud provider reports a quota or rate limit error.

- **Multi-Tenant Organizations** — Shared codebase analyses linked to Clerk
  organizations so team members collaborate from a single unified map.

- **Row-Level Postgres Security** — Automatic data isolation across teams using
  Supabase Postgres policies evaluated directly against Clerk JWT claims.

- **LangSmith Trace & Evaluation** — Full tracing of every AI execution call,
  cache-hit verification, and benchmark evaluation against true repository
  file lists.

And many more, including code architecture and reusability.

## Quick Start

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [pnpm](https://pnpm.io/) (Package Manager)
- [Python 3.14](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/) for FastAPI dependencies

### Clone the Repository

```bash
git clone https://github.com/adrianhajdin/cartograph.git
cd cartograph
```

### Install Dependencies

Install the project dependencies using pnpm:

```bash
pnpm install
```

### Set Up Environment Variables

Create a new file named `.env.local` in the root of your project and add the
following content:

```env
# CLERK
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# FASTAPI
FASTAPI_URL=http://127.0.0.1:8000

# LANGSMITH
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=
LANGSMITH_PROJECT=cartograph
LANGSMITH_ENDPOINT=https://api.smith.langchain.com

# OPENAI
OPENAI_API_KEY=

# GEMINI (create a key in Google AI Studio)
AI_PROVIDER=gemini
GEMINI_API_KEY=

# Optional local llama.cpp fallback. Use the model ID from GET /v1/models.
LOCAL_LLM_BASE_URL=http://127.0.0.1:8080/v1
LOCAL_LLM_MODEL=your-model-id
LOCAL_LLM_API_KEY=

# Agent Service (deep-agent/, `pnpm dev` there).
AGENT_URL=http://localhost:2024
```

Replace the placeholder values with your real credentials. You can get these
by signing up at [**Clerk**](https://clerk.com/),
[**Supabase**](https://supabase.com/), [**OpenAI**](https://platform.openai.com/),
[**Google AI Studio**](https://aistudio.google.com/apikey), and
[**LangSmith**](https://smith.langchain.com/).

You can omit `CLERK_JWT_KEY` and `CLERK_AUTHORIZED_PARTIES` for local
development. The authorized-party setting defaults to
`http://localhost:3000`; the JWT key is optional and can be set to Clerk's
public PEM key to avoid fetching signing keys at runtime.

For FastAPI-specific setup and authentication details, see the
[backend guide](backend/README.md).

### Configure the AI Provider

Set `GEMINI_API_KEY` to use Gemini. `AI_PROVIDER=auto` (the default) selects
Gemini when its key is set and OpenAI otherwise. Set `AI_PROVIDER=gemini` or
`AI_PROVIDER=openai` to choose explicitly when both keys are present. Gemini
uses the official OpenAI-compatible chat endpoint, keeping calls inside the
same LangSmith-wrapped client. `GEMINI_MODEL` can override the model for both
tasks; otherwise Cartograph uses `gemini-3.8-flash` for explanations and
`gemini-3.5-flash-lite` for classification.

### Configure a Local LLM (Optional)

Set `LOCAL_LLM_BASE_URL` to the server's `/v1` endpoint and
`LOCAL_LLM_MODEL` to the exact model ID returned by `GET /v1/models`. Set
`LOCAL_LLM_API_KEY` only if your server requires a key.

If the selected cloud provider returns a quota or rate-limit error, Cartograph
switches to the local model when configured. With no cloud key, the local model
is used directly. Other provider errors do not trigger the fallback.

The URL must be reachable from the Next.js server. If Next.js runs in WSL and
llama.cpp runs on Windows, use a Windows host address reachable from WSL instead
of `127.0.0.1` if localhost connections fail.

### Run the Project

Start the FastAPI service in one terminal:

```bash
pnpm dev:api
```

Start Next.js in another terminal:

```bash
pnpm dev
```

FastAPI listens at `http://127.0.0.1:8000`. If it is not running, repository
submissions use the Next.js fallback. Open
[http://localhost:3000](http://localhost:3000) to view the app.

## Known Development Warnings

The landing illustration currently uses React Three Fiber 9 with Three.js
0.187. These two console warnings come from that integration and can be left
alone until the project upgrades to R3F 10:

- **`THREE.Clock` is deprecated.** R3F 9 creates and owns the clock used by
  its render loop. The upstream migration replaces `state.clock` with
  `state.timer` in R3F 10; an app-level timer cannot replace the renderer's
  internal one. See the [R3F issue](https://github.com/pmndrs/react-three-fiber/issues/3741).
- **`PCFSoftShadowMap` has been removed.** R3F 9's soft-shadow configuration
  still passes this legacy type to Three.js. The WebGPU renderer maps it to
  `PCFShadowMap`, which now provides the soft-shadow behavior. See the
  [Three.js r187 migration notes](https://github.com/mrdoob/three.js/wiki/Migration-Guide#186--187).

Revisit both messages when adopting R3F 10.

## Assets

Assets and snippets used in the project can be found in the
**[video kit](https://jsm.dev/carto-kit)**.

[![Video kit banner](public/readme/readme-videokit.webp)](https://jsm.dev/carto-kit)

## More

### Advance Your Skills with Our Pro Course

Enjoyed creating this project? Dive deeper into our PRO courses for a richer
learning adventure. They're packed with detailed explanations, cool features,
and exercises to boost your skills. Give it a go!

[![Pro course banner](public/readme/readme-jsmpro.webp)](https://jsm.dev/ai)
