---
name: Agent Instructions
---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## React Three Fiber & Drei

- Cartograph uses **React Three Fiber (R3F)** and **Drei** to integrate and work with Three.js. Do not default to standalone Three.js implementations when the visualization belongs inside React.
- Before using R3F or Drei APIs, verify them against the installed package version and its documentation/source when their behavior, API, or compatibility is uncertain.
- Check the installed package versions before assuming examples or API behavior from other releases.
- Prefer R3F's declarative scene model and React lifecycle over manually managing Three.js objects.
- Use Drei helpers only after verifying their exact APIs and suitability for the installed version.
- Do not introduce unnecessary wrappers, abstractions, or custom rendering infrastructure.

## Three.js, WebGPU & TSL

- Never rely on training data for `three/tsl` or `three/webgpu` imports.
- Before writing TSL shaders or `WebGPURenderer` code, inspect `node_modules/three/src/nodes/TSL.js` and `node_modules/three/examples/webgpu_*.html` to verify exact function names and signatures for the installed Three.js version.
- Verify renderer initialization, shader/material compatibility, supported features, and relevant limitations against the installed Three.js source and examples.
- Do not assume WebGPU support or successful initialization merely because the browser reports that WebGPU is available.
- WebGPU is the primary backend; WebGL2 is the fallback. Never silently fall back to WebGL1.
- Ensure renderer fallback does not require duplicating scene logic or visualization behavior.

## Implementation Verification

- Inspect the existing code and relevant installed source before modifying behavior.
- Follow the current phase specification and the project's `CLAUDE.md`.
- Verify unfamiliar, deprecated, or version-sensitive APIs using installed documentation or source rather than training knowledge.
- Prefer the smallest correct implementation over unnecessary abstractions.
- Do not add dependencies without explicit user approval.
- Preserve strict TypeScript typing. Never introduce `any` or hide type errors with unsafe casts.
- Do not bypass, weaken, or remove existing checks to make an implementation pass.
- If an API, feature, renderer, or check cannot be verified or is unavailable, report it clearly rather than silently substituting another implementation.
