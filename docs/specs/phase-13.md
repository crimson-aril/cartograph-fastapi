# Phase 13 — The Landing Page

## Goal

A public landing page that introduces Cartograph to someone who has never used it. It should communicate what the product does, demonstrate its core idea visually, and feel unmistakably connected to the application itself.

This is a professional developer tool, not a generic SaaS landing page. Its design should feel deliberate, editorial, technically sophisticated, and restrained.

## Build

- A public marketing page at the root, accessible without authentication.
- A sticky header containing the Cartograph name, theme control, and a clear way to enter the application.
- The hero accepts a public GitHub repository URL and submits it directly into the existing analysis flow. The input must be functional, not decorative.
- The hero should establish the product's identity immediately, without requiring the visitor to scroll to understand what it does.
- Subsequent sections explain what Cartograph does, how it works, what it understands, and what it deliberately does not do.
- Separate major sections with subtle hairline borders.
- The limitations section comes last. It should be honest, specific, and treated as an important part of the product's identity rather than an apologetic disclaimer.
- A quiet footer containing only relevant product navigation and information.

## Visual direction

The design should feel like a professionally designed creative developer tool.

Use a restrained visual language built around Cartograph's existing design tokens, typography, spacing, and component conventions.

The page should have:

- Strong typographic hierarchy.
- Deliberate whitespace and asymmetrical compositions where appropriate.
- Subtle borders and carefully controlled contrast.
- A restrained use of accent color.
- Precise alignment and consistent spacing.
- Clear visual hierarchy without unnecessary cards or containers.
- A balance between editorial design and technical visualization.

Avoid generic SaaS layouts, excessive rounded cards, gradient-heavy backgrounds, oversized decorative typography, artificial glassmorphism, unnecessary shadows, and visual clutter.

The page should look credible as the website of a serious developer tool.

## Proportions and layout

- One centered content column with a maximum width of approximately 1140px and a minimum 24px horizontal gutter.
- The hero should occupy most of the initial viewport while remaining usable at smaller heights.
- Major sections should use generous, consistent vertical spacing, approximately 7–9rem on desktop where appropriate.
- Scale spacing fluidly for smaller viewports without losing the editorial rhythm.
- Headings should scale with the viewport, use tight line-height around 1.1, and have restrained negative letter-spacing.
- Body text must use readable line lengths:
  - Approximately 46 characters per line beside illustrations.
  - Approximately 64 characters per line in full-width text sections.
- Text and illustration layouts should have substantial separation, approximately 5rem on wider screens.
- Use a consistent grid rather than arbitrary positioning.
- Layouts should collapse naturally on mobile, with text and illustrations stacked in an intentional order.
- Avoid full-width paragraphs spanning the entire content column.
- Maintain comfortable reading widths, clear section boundaries, and whitespace even on mobile.

## Three.js illustrations

### Purpose

Use Three.js to create carefully art-directed illustrations that visually explain Cartograph's core concepts, including repository structure, dependency relationships, code exploration, and the boundaries of its analysis.

These illustrations are not decorative backgrounds. Each visual must communicate an idea about the product and reinforce the section it belongs to.

### Professional art direction

Three.js visuals must be designed to the same standard as the rest of the landing page.

They should feel like custom technical illustrations created for Cartograph, not copied demo scenes, template graphics, or generic 3D effects.

Use a restrained, sophisticated visual language:

- Precise geometry and intentional composition.
- Controlled depth and perspective.
- Carefully selected material properties.
- Subtle lighting, only where it improves form and legibility.
- Clean edges and balanced visual weight.
- Negative space as part of the composition.
- Colors derived exclusively from Cartograph's existing theme tokens.
- Visual complexity appropriate to the information being communicated.

Avoid:

- Random floating objects.
- Unmotivated particle systems.
- Excessive bloom, glow, lens effects, or fog.
- Neon cyberpunk aesthetics.
- Unnecessary reflective metallic materials.
- Overly complex scenes that compete with the text.
- Stock Three.js showcase effects.
- Animation added solely to make the page appear dynamic.

### Rendering architecture

- WebGPU is the preferred rendering backend.
- WebGL2 must be supported as a fallback.
- Attempt WebGPU initialization first and use WebGL2 when WebGPU is unsupported or fails to initialize.
- Both backends must preserve the intended illustration, composition, and interaction.
- Rendering must not prevent the landing page or its content from functioning.
- If GPU initialization fails entirely, the page must remain readable and usable, with a graceful fallback for the illustration.
- Do not introduce WebGL1.
- Keep scene construction, visual logic, and interactions independent of the rendering backend wherever practical.
- Do not create separate visual designs for WebGPU and WebGL2.
- Use the installed Three.js version and verify all renderer, shader, TSL, and material APIs against the installed documentation and source.
- Follow the Three.js technical rules in `AGENTS.md`.

### Animation and interaction

- Motion must be intentional, subtle, and professionally executed.
- Prefer interaction-driven motion over continuous animation.
- Do not animate every element or keep the GPU rendering continuously without a reason.
- If a visual can communicate the same idea statically, prefer the static solution.
- Interactive illustrations may respond to pointer movement, hover, or deliberate user input only when the response has a meaningful relationship to the illustrated concept.
- Respect `prefers-reduced-motion`.
- Avoid animation that distracts from reading, increases GPU usage unnecessarily, or makes the page feel like a portfolio demo.

## Section content

### 1. Hero

Immediately communicate that Cartograph turns a public GitHub repository into a map of its actual dependencies.

- A concise headline explaining the product.
- A short supporting description, with no marketing exaggeration.
- A functional GitHub repository URL input.
- A clear submit action.
- A custom visual illustration showing the idea of a codebase becoming a dependency map.
- The illustration must complement the headline rather than compete with it.
- The hero must work without requiring a video, onboarding wall, or authentication before understanding the product.

### 2. What it does

Explain the core purpose of Cartograph in plain language.

Describe how it analyzes a repository and visualizes actual resolved relationships between files, making it easier to explore the structure of an unfamiliar codebase.

Include a purpose-built illustration rather than a screenshot.

### 3. How it works

Explain the actual process at a conceptual level:

1. A public GitHub repository is provided.
2. Cartograph reads and parses the supported source files.
3. Resolved dependencies are used to construct the graph.
4. The resulting map can be explored to understand the codebase.

Keep the explanation faithful to the existing implementation. Do not promise capabilities that have not been built.

### 4. What it understands

Explain the programming languages, frameworks, and import patterns that the current implementation genuinely supports.

- Use information verified from the codebase.
- Do not invent framework logos, compatibility claims, or support lists.
- Keep the section easy to update as parser support evolves.
- Use a refined visual representation instead of a logo wall.

### 5. What it deliberately doesn't do

This is the final major section and should be one of the most distinctive parts of the page.

Explain the boundaries of Cartograph honestly:

- It does not invent dependency relationships.
- It does not guess unresolved imports.
- It does not pretend to understand code it cannot parse.
- It does not judge, score, or review the quality of a codebase.
- It does not claim completeness when files or relationships could not be resolved.

Only include statements that accurately reflect the implemented behavior.

Present these limitations clearly and confidently. Technical honesty is a product feature.

## Illustration requirements

- Illustrations must be purpose-built for Cartograph.
- Use Three.js for illustrations where it provides genuine visual value.
- Do not use screenshots of repositories, editors, dashboards, or the actual application interface.
- Do not expose fabricated filenames, directory structures, dependency names, or unsupported capabilities in illustrations.
- Illustrations should be conceptual and non-literal where actual repository data is not being displayed.
- Visuals must use the same theme tokens as the application.
- No illustration may introduce its own independent color palette.
- All illustrations must remain visually coherent with the UI in both light and dark themes.
- Use responsive sizing and composition.
- Provide a graceful non-WebGPU/non-WebGL fallback.
- Do not let illustrations interfere with accessibility, text selection, form interaction, or page performance.

## Constraints

- Reuse the application's existing color tokens, typography, theme system, and UI components.
- Do not create a separate design system for the landing page.
- Support both light and dark themes correctly, including Three.js materials, lighting, backgrounds, and illustration contrast.
- The page must be accessible when signed out.
- The repository input must integrate with the existing authentication and analysis flow.
- No fabricated product claims.
- No testimonials, customer logos, logo walls, pricing, fake statistics, or invented social proof.
- No unnecessary dependencies.
- Do not install packages without approval.
- Do not build future phases or unrelated functionality.
- Keep the page performant, responsive, accessible, and maintainable.
- Do not introduce visual effects that compromise readability or usability.

## Acceptance check

1. Open the root page while signed out. The purpose of Cartograph is clear without a video, sign-up wall, or prior knowledge.
2. Enter a public GitHub repository URL in the hero. Submitting it correctly enters the existing authentication and analysis flow.
3. Toggle the theme. The interface and illustrations remain visually coherent in both light and dark themes.
4. Inspect the illustrations. They are custom, professionally art-directed, relevant to the product, and do not contain fabricated repository details.
5. Verify WebGPU is used when successfully available.
6. Verify WebGL2 fallback works when WebGPU is unavailable.
7. Verify the page remains usable if both rendering backends fail.
8. Shrink to phone width. Sections stack naturally, illustrations scale, typography remains readable, and nothing overflows horizontally.
9. Confirm the page respects reduced-motion preferences and does not run unnecessary continuous rendering.
10. Confirm all content and product claims accurately reflect the implemented application.
