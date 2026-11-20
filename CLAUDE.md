---
name: Cartograph
description:
  A local app that reads a public GitHub repo and draws it as a dependency map.

  Everything on screen comes from really parsing the code. The AI explains what the parser found, it never decides what's there.

  Why any of these rules exist is in `docs/project-doc.md`. This file is the rules themselves.
---


# Stack

Next.js 16 App Router, React 19, TypeScript strict. ts-morph for parsing. React Flow and dagre for the map. Clerk for sign-in and organizations. Supabase for Postgres, row-level security and realtime. The OpenAI SDK through one wrapped client for OpenAI or Gemini's OpenAI-compatible endpoint, traced with LangSmith. Tailwind v4. pnpm.

Graphics: React Three Fiber, Drei, and Three.js. R3F is the React integration, Drei provides reusable helpers, and Three.js is the underlying graphics engine.

Next.js 16 changed a lot. If you're not certain about an API, read the docs inside the installed package rather than going from memory.

## How we work

Spec driven. Nothing gets built without a spec.

- `docs/project-doc.md` — what this app is and every decision behind it. Read the part you need. Don't ask me to paste it.
- `docs/specs/phase-NN.md` — one per phase, written just before it starts. Behaviour and an acceptance check, never filenames.
- This file — always true, read on every prompt.

**Starting a phase.** Read this file and that phase's spec. Build what the spec asks and stop.

**Dropped into a fresh context and don't know where we are?** Look at which files exist in `docs/specs/`, then the git log. The last commit is the last phase that passed. Tell me what you've worked out before building on it.

**The acceptance check is mine to run, not yours.** It's a list of things I do by hand in a browser. Don't automate it, don't install a test runner or browser driver for it. Build so those things are true, then tell me it's ready.

**What you check before saying a phase is done:** types, lint, build. Anything verifiable from a terminal in a few seconds is yours — running a script and reading its output counts. Anything needing a browser is mine.

**When a phase comes out wrong, I reset rather than patch.** Prompting on top of wrong code three times leaves code nobody understands, including you. So if a spec is ambiguous, say so before you build.

## How to talk to me

Short. If a sentence isn't telling me something I need, cut it.

**Ask with an answer attached.** One specific question, and say which way you'd go and why. "A or B, I'd take B because it keeps the parser standalone" is answerable in two seconds. An open question isn't. Never pick a direction silently, never build both.

**When you need something only I can give you** — a key, a token, a value in `.env.local` — say exactly what and exactly where, then stop.

**No walls of text.** Don't summarise every file you touched or restate the plan back to me. When a phase is done, say what it does and what the check should show, in a few lines.

**Plain English.** If you're reaching for a bulleted breakdown of something that's one sentence, it's one sentence.

**Say when something didn't work.** A failure worked around quietly costs me an hour later.

## How the code is laid out

You pick the file structure. These are about behaviour.

- **The parsing code can't import Next, React or the database client.** Path in, data out, runnable from a plain script.
- **No framework checks inside the parser.** That knowledge lives in an adapter.
- **Graph calculations are pure functions** over a file list and an edge list.
- **Database access happens in server code**, not inside components.
- **Who may read a row is decided by a policy**, never by application code. If a query needs a `where` clause to return the right rows, the policy is wrong.
- **One place constructs the AI client.** Anywhere else silently skips tracing.

## Conventions

Strict TypeScript, no `any`. If a type is genuinely awkward, tell me rather than casting.

Comment the decisions, not the syntax.

Every AI call has a cache read inside its trace, so a cache hit shows up as a recorded run with no model call in it.

One obvious way to do something beats a configurable one.

The UI is a dense developer tool. Small type, tight spacing, monospace for file paths. Colour means something or isn't there. Nothing moves unless it was clicked.

There's a frontend design skill that activates on its own for UI work. Use it, but the paragraph above overrules it — it will reach for motion, depth and big type, and this is a tool someone stares at for an hour.

## React Three Fiber, Drei & Three.js

### Product-wide visual direction

Three.js is part of Cartograph's visual language, not a technology reserved for the landing page.

Use it throughout the website when it meaningfully improves visualization, spatial understanding, interaction, or visual communication. It is not mandatory on every page or component.

Three.js must serve the product. Never force 3D into interfaces that are better expressed with ordinary HTML, CSS, SVG, or existing components.

Use **React Three Fiber (R3F)** as the React-native integration for Three.js. Prefer declarative scene construction within React rather than manually managing Three.js objects unnecessarily.

Use **Drei** where its helpers genuinely simplify implementation. Don't introduce abstractions or helpers without a clear purpose.

### Context-specific visual language

Three.js should adapt to the purpose of each part of Cartograph while maintaining a consistent visual identity.

- **Landing page:** expressive, editorial, art-directed illustrations with restrained depth and deliberate composition. It introduces the product and can be visually distinctive.
- **Dependency map and analysis workspace:** precise, functional, information-dense visualization. Nodes, edges, layout, selection, highlighting, and navigation must prioritize understanding actual code relationships.
- **Loading and processing states:** subtle, contextual visuals that communicate genuine activity. Never fake progress or invent processing states.
- **Empty states and onboarding:** minimal, purposeful visual explanations that help users understand what to do next.
- **Supporting UI:** use 3D only where it adds genuine value. Navigation, forms, tables, settings, dialogs, buttons, and text remain conventional UI.

Different areas may have different visual treatments. The landing page is not a template for the analysis workspace, and the analysis workspace is not required to look like a marketing page.

### Professional graphics standard

Three.js work must be professionally art-directed and technically deliberate.

Prioritize:

1. Intentional composition and visual hierarchy.
2. Precise geometry and balanced spatial organization.
3. Meaningful depth and perspective.
4. Controlled lighting and carefully considered material properties.
5. Restraint with accent color and contrast.
6. Clear silhouettes and legibility.
7. Purposeful interactions.
8. Visual consistency with Cartograph's existing design system.

Avoid:

1. Generic Three.js demo aesthetics.
2. Decorative 3D objects without a clear purpose.
3. Random floating particles.
4. Excessive bloom, glow, lens effects, fog, or post-processing.
5. Neon cyberpunk aesthetics.
6. Gratuitous gradients, reflections, and metallic materials.
7. Unnecessary continuous animation.
8. Visual complexity that competes with content.
9. Effects that reduce readability or graph usability.

Professionalism comes from composition, precision, restraint, and execution—not the number of effects.

### R3F and Drei implementation rules

- Use React Three Fiber for integrating Three.js scenes into React components.
- Prefer declarative scene construction over imperative scene manipulation when practical.
- Use Drei components and utilities when they reduce complexity or improve clarity.
- Keep scenes modular, with clear separation between scene composition, interaction, and application logic.
- Keep React state updates out of high-frequency rendering paths where they would cause unnecessary re-renders.
- Use `useFrame` only when frame-by-frame updates are genuinely needed.
- Prefer demand-driven rendering for static or interaction-driven scenes.
- Don't create a component, abstraction, hook, or utility solely to make simple code appear more sophisticated.
- Keep strict TypeScript types. Never introduce `any`.
- Don't install packages without asking first.

### Rendering architecture

- WebGPU is the primary rendering backend.
- WebGL2 is the fallback backend.
- Attempt WebGPU initialization first. Fall back to WebGL2 when WebGPU is unsupported or initialization fails.
- Do not assume that feature detection alone guarantees successful renderer initialization.
- Both backends must preserve the intended visual composition and functionality.
- Never silently fall back to WebGL1.
- Rendering failure must not prevent the rest of the application from functioning.
- Provide an appropriate non-3D fallback for essential visual information.
- Reuse shared rendering infrastructure where practical instead of creating unnecessary renderer instances across the application.
- Keep scene construction, interaction logic, and visualization behavior independent of renderer-specific code wherever possible.
- Avoid duplicate scene implementations for WebGPU and WebGL2.

### Three.js technical rules

- Use the installed Three.js version. Never assume APIs from memory when the installed version may differ.
- Before writing TSL shaders or WebGPU code, inspect the installed Three.js source and examples as required by `AGENTS.md`.
- Verify exact imports, signatures, material capabilities, renderer behavior, and compatibility against the installed package.
- Don't introduce a rendering abstraction just to make simple code appear more configurable.
- Keep rendering code modular, readable, and maintainable.
- Use strict TypeScript types. Never introduce `any`.
- Don't install packages without asking first.

### Animation and interaction

- Motion must have a purpose.
- Prefer interaction-driven changes over continuous animation.
- Animate only when it meaningfully communicates state, depth, relationships, or feedback.
- Nothing should move merely to make the interface feel alive.
- Respect `prefers-reduced-motion`.
- Avoid unnecessary perpetual render loops.
- Use demand-driven rendering for static or interaction-driven scenes where appropriate.
- Interaction must be predictable, responsive, and consistent with the rest of the application.

### Performance and lifecycle

- Rendering must not compromise application responsiveness.
- Account for device pixel ratio, viewport changes, and responsive layout.
- Avoid unnecessary draw calls, expensive materials, excessive geometry, and costly post-processing.
- Dispose of geometries, materials, textures, renderers, and event listeners when no longer needed.
- Prevent rendering work when a scene is hidden, inactive, or unchanged where practical.
- Avoid unnecessary GPU resource allocation and multiple WebGL contexts.
- Consider mobile and lower-end hardware, not just desktop GPUs.

### Theme integration

- Three.js visuals must respect Cartograph's existing light and dark themes.
- Use existing color tokens and theme infrastructure. Do not invent a separate color palette for 3D.
- Theme changes must update scene colors, materials, backgrounds, lighting, and contrast where necessary.
- Maintain clear visual hierarchy in both themes.
- Avoid hardcoded colors when equivalent theme tokens already exist.

### Scope

Three.js is a product-wide capability, not a requirement to force 3D into every phase.

The current phase specification determines what should be built, where Three.js belongs, and why it is needed.

Do not build unrelated visualizations, refactor unrelated pages, implement future phases, or expand scope simply because Three.js could be used.

The professional graphics standard applies to every Three.js implementation, whether it is a landing-page illustration, a dependency map, or a supporting visualization.

## Things not to do

Breaking one of these is worse than not finishing.

- **Never decide that two files are connected.** An edge exists because the parser resolved a real import to a real file. Unresolved gets reported with a reason, never guessed.
- **Never invent something to fill a gap.** Skipped file? Say so and count it. Route not fully recoverable? Show none. Absent beats approximate.
- **Don't install a package without asking.** Name it, say what for, wait.
- **Don't build ahead of the current phase.** No scaffolding for what's coming.
- **Don't grade the code.** No scores, ratings, severity or "issues found". This explains a codebase, it doesn't review one.
- **Don't leave the build broken.** Tell me about a failure instead of working around it.
- **Don't weaken a check to make it pass.** A check that can't run has to fail loudly.
- **Don't read from the database on a loop.** Name your columns, limit list reads, subscribe instead of polling.
