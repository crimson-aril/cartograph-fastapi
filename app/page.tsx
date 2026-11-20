import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { DependencyIllustration } from "@/components/landing/dependency-illustration";
import { RepositoryForm } from "@/components/landing/repository-form";
import { ThemeControl } from "@/components/theme-control";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Cartograph — map a codebase's dependencies",
  description: "Explore the resolved dependencies in a public TypeScript or JavaScript repository.",
};

const frameworkConventions = ["React", "Next.js", "Docusaurus", "Express", "NestJS"];

export default async function LandingPage() {
  const theme = parseTheme((await cookies()).get(THEME_COOKIE)?.value);

  return (
    <main className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-20 border-b border-line bg-canvas">
        <div className="mx-auto flex h-14 max-w-[1140px] items-center gap-2 px-6 sm:gap-5 md:px-8">
          <Link href="/" className="font-mono text-xs font-semibold tracking-tight text-fg">
            cartograph
          </Link>
          <span className="hidden text-line sm:inline" aria-hidden="true">/</span>
          <nav aria-label="Page sections" className="hidden items-center gap-4 text-[0.6875rem] text-fg-muted sm:flex">
            <a href="#method" className="hover:text-fg">Method</a>
            <a href="#scope" className="hover:text-fg">Scope</a>
            <a href="#limits" className="hover:text-fg">Limits</a>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <ThemeControl initial={theme} />
            <Link
              href="/workspace"
              className="flex h-7 items-center gap-1 rounded-sm border border-line px-1.5 text-[0.6875rem] text-fg hover:bg-raised sm:gap-2 sm:px-2.5"
            >
              <span className="sm:hidden">App</span>
              <span className="hidden sm:inline">Open workspace</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1140px] px-6 md:px-8">
        <section className="grid min-h-[calc(100svh-3.5rem)] items-center gap-12 py-16 md:grid-cols-[0.92fr_1.08fr] md:gap-16 md:py-20">
          <div className="max-w-[34rem]">
            <p className="mb-6 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-muted">
              A map of what the source connects
            </p>
            <h1 className="text-[clamp(2.6rem,5.2vw,4.55rem)] font-medium leading-[1.03] tracking-[-0.055em]">
              See how a codebase is connected.
            </h1>
            <p className="mt-6 max-w-[46ch] text-sm leading-6 text-fg-muted md:text-[0.9375rem]">
              Cartograph turns a public GitHub repository into a map of its resolved file dependencies. Follow what a file imports, what depends on it, and how the pieces fit together.
            </p>
            <div className="mt-9">
              <RepositoryForm />
            </div>
            <p className="mt-7 flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-fg-muted">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              TypeScript and JavaScript · source resolved, never guessed
            </p>
          </div>

          <figure className="min-w-0">
            <div className="flex items-center justify-between border-y border-line py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-fg-muted">
              <span>Source files</span>
              <span>Resolved relationships</span>
            </div>
            <div className="h-[21rem] sm:h-[25rem] md:h-[29rem]">
              <DependencyIllustration />
            </div>
            <figcaption className="flex items-start justify-between gap-6 border-t border-line pt-2.5 text-[0.6875rem] leading-5 text-fg-muted">
              <span id="hero-illustration-caption">A conceptual view of source relationships becoming a dependency map.</span>
              <span className="shrink-0 font-mono">FIG. 01</span>
            </figcaption>
          </figure>
        </section>

        <div className="border-y border-line py-4">
          <p className="max-w-[78ch] text-xs leading-5 text-fg-muted md:text-[0.8125rem]">
            Every line on the map begins with a relationship the parser found in source code and resolved to a file.
          </p>
        </div>

        <section id="what-it-does" className="grid gap-12 border-b border-line py-24 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:py-32">
          <div className="max-w-[32rem]">
            <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-muted">01 — What it does</p>
            <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] md:text-[2.65rem]">
              Structure, visible down to the file.
            </h2>
            <p className="mt-5 max-w-[46ch] text-sm leading-6 text-fg-muted">
              An unfamiliar codebase is hard to hold in your head one import at a time. Cartograph groups files into folders, draws the relationships it can resolve, and lets you open the map to explore individual files.
            </p>
            <p className="mt-4 max-w-[46ch] text-sm leading-6 text-fg-muted">
              Select a file to see its direct dependencies and dependants, then follow the graph outward to understand where a change can travel.
            </p>
          </div>
          <figure className="self-center">
            <svg
              role="img"
              aria-labelledby="structure-title structure-desc"
              className="h-auto w-full"
              viewBox="0 0 640 300"
              fill="none"
            >
              <title id="structure-title">Folders open into files connected by dependencies</title>
              <desc id="structure-desc">An abstract diagram of grouped source files and the resolved relationships between them. It does not depict a particular repository.</desc>
              <g stroke="var(--line)" strokeWidth="1">
                <rect x="18" y="32" width="196" height="236" />
                <rect x="430" y="32" width="192" height="236" />
                <path d="M214 86h76l48 48h92M214 150h112l37-28h67M214 218h68l49-50h99" />
                <path d="M214 86h99l15 66h103M214 218h83l45 26h89" />
                <rect x="446" y="71" width="30" height="20" />
                <rect x="514" y="112" width="30" height="20" />
                <rect x="446" y="142" width="30" height="20" />
                <rect x="564" y="158" width="30" height="20" />
                <rect x="492" y="218" width="30" height="20" />
              </g>
              <g fill="var(--raised)" stroke="var(--line)" strokeWidth="1">
                <rect x="18" y="32" width="196" height="236" />
                <rect x="430" y="32" width="192" height="236" />
                <rect x="446" y="71" width="30" height="20" />
                <rect x="514" y="112" width="30" height="20" />
                <rect x="446" y="142" width="30" height="20" />
                <rect x="564" y="158" width="30" height="20" />
                <rect x="492" y="218" width="30" height="20" />
              </g>
              <g stroke="var(--fg-muted)" strokeWidth="2">
                <path d="M40 65h70M40 77h132M40 105h96M40 117h120M40 145h118M40 157h76M40 185h142M40 197h93M40 225h91M40 237h123" />
              </g>
              <circle cx="338" cy="151" r="5" fill="var(--accent)" />
              <circle cx="362" cy="194" r="4" fill="var(--accent)" />
            </svg>
            <figcaption className="mt-3 flex justify-between gap-4 text-[0.6875rem] text-fg-muted">
              <span>Folders collect the structure; file links come from parsed source.</span>
              <span className="shrink-0 font-mono">conceptual</span>
            </figcaption>
          </figure>
        </section>

        <section id="method" className="border-b border-line py-24 md:py-32">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
            <div>
              <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-muted">02 — Method</p>
              <h2 className="max-w-[15ch] text-3xl font-medium leading-tight tracking-[-0.04em] md:text-[2.65rem]">
                From repository to map, in four steps.
              </h2>
            </div>
            <p className="max-w-[58ch] self-end text-sm leading-6 text-fg-muted">
              The map follows the code that was read. Framework conventions add context where they are recognized; unresolved relationships remain visible as gaps in coverage.
            </p>
          </div>

          <ol className="mt-12 grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Provide a repository", "Start with a public GitHub URL."],
              ["02", "Read supported source", "Parse TypeScript and JavaScript files."],
              ["03", "Resolve relationships", "Keep imports that resolve to files in the repository."],
              ["04", "Explore the map", "Open folders, select files, and follow dependencies."],
            ].map(([number, title, description], index) => (
              <li
                key={number}
                className={`min-w-0 py-5 ${index === 2 ? "border-t border-line sm:border-t" : ""} ${index === 1 ? "sm:border-l sm:pl-5" : ""} ${index === 3 ? "border-t border-line sm:border-t-0 sm:border-l sm:pl-5" : ""} ${index > 0 ? "lg:border-t-0 lg:border-l lg:pl-5" : ""}`}
              >
                <p className="font-mono text-[0.625rem] text-accent">{number}</p>
                <h3 className="mt-4 text-sm font-medium">{title}</h3>
                <p className="mt-2 max-w-[28ch] text-xs leading-5 text-fg-muted">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="scope" className="grid gap-12 border-b border-line py-24 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:py-32">
          <div>
            <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-muted">03 — What it understands</p>
            <h2 className="max-w-[14ch] text-3xl font-medium leading-tight tracking-[-0.04em] md:text-[2.65rem]">
              A clear scope, by design.
            </h2>
            <p className="mt-5 max-w-[46ch] text-sm leading-6 text-fg-muted">
              Cartograph parses TypeScript and JavaScript. It looks for import declarations, re-exports, dynamic imports, and <code className="font-mono text-xs text-fg">require()</code> calls, then resolves the relationships it can prove from the repository.
            </p>
          </div>

          <div className="self-center">
            <div className="grid grid-cols-[8rem_1fr] gap-4 border-y border-line py-4 text-xs sm:grid-cols-[10rem_1fr]">
              <p className="font-mono text-[0.6875rem] text-fg-muted">SOURCE</p>
              <p>TypeScript <span className="px-2 text-line">/</span> JavaScript</p>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-4 text-xs sm:grid-cols-[10rem_1fr]">
              <p className="font-mono text-[0.6875rem] text-fg-muted">RELATIONSHIPS</p>
              <p className="leading-6">Imports <span className="px-1 text-line">·</span> re-exports <span className="px-1 text-line">·</span> dynamic imports <span className="px-1 text-line">·</span> <code className="font-mono">require()</code></p>
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line py-4 text-xs sm:grid-cols-[10rem_1fr]">
              <p className="font-mono text-[0.6875rem] text-fg-muted">CONVENTIONS</p>
              <ul className="flex flex-wrap gap-x-2 gap-y-1.5" aria-label="Recognized framework conventions">
                {frameworkConventions.map((framework) => (
                  <li key={framework} className="after:ml-2 after:text-line after:content-['/'] last:after:hidden">
                    {framework}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-[0.6875rem] leading-5 text-fg-muted">
              Framework conventions label files the parser can identify. Other projects still go through the baseline source parser.
            </p>
          </div>
        </section>

        <section id="limits" className="grid gap-12 py-24 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:py-32">
          <div>
            <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-fg-muted">04 — Boundaries</p>
            <h2 className="max-w-[13ch] text-3xl font-medium leading-tight tracking-[-0.04em] md:text-[2.65rem]">
              If the source cannot prove it, the map leaves it out.
            </h2>
            <p className="mt-5 max-w-[46ch] text-sm leading-6 text-fg-muted">
              Unresolved imports are reported with a reason, not drawn as dependencies. Files the parser skips are counted. The map says what it could read and where it stopped.
            </p>
          </div>

          <div className="self-center">
            <figure>
              <svg
                role="img"
                aria-labelledby="boundary-title boundary-desc"
                className="h-auto w-full"
                viewBox="0 0 620 196"
                fill="none"
              >
                <title id="boundary-title">Resolved imports become edges; unresolved imports stop short</title>
                <desc id="boundary-desc">A solid line reaches a file node. A dotted line ends before a separate node, showing that an unresolved relationship is not inferred.</desc>
                <path d="M28 56H430" stroke="var(--accent)" strokeWidth="1.5" />
                <rect x="430" y="43" width="26" height="26" fill="var(--raised)" stroke="var(--line)" />
                <path d="M28 140H326" stroke="var(--line)" strokeWidth="1.5" strokeDasharray="3 6" />
                <path d="M328 140h52" stroke="var(--line)" strokeWidth="1" />
                <rect x="430" y="127" width="26" height="26" stroke="var(--line)" strokeDasharray="2 3" />
                <path d="M380 134v12" stroke="var(--fg-muted)" strokeWidth="1" />
                <circle cx="28" cy="56" r="3" fill="var(--accent)" />
                <circle cx="28" cy="140" r="3" fill="var(--fg-muted)" />
                <text x="28" y="27" fill="var(--fg-muted)" fontFamily="var(--font-geist-mono)" fontSize="10" letterSpacing="1.2">RESOLVED</text>
                <text x="28" y="111" fill="var(--fg-muted)" fontFamily="var(--font-geist-mono)" fontSize="10" letterSpacing="1.2">UNRESOLVED</text>
              </svg>
              <figcaption className="mt-3 text-[0.6875rem] leading-5 text-fg-muted">
                A gap in the source stays a gap on the map.
              </figcaption>
            </figure>

            <ul className="mt-8 grid gap-3 border-t border-line pt-5 text-xs sm:grid-cols-2 sm:gap-x-8">
              <li className="flex gap-2"><span className="font-mono text-accent">—</span><span>No guessed dependency edges.</span></li>
              <li className="flex gap-2"><span className="font-mono text-accent">—</span><span>No claims of complete coverage.</span></li>
              <li className="flex gap-2"><span className="font-mono text-accent">—</span><span>No code-quality scores or reviews.</span></li>
              <li className="flex gap-2"><span className="font-mono text-accent">—</span><span>No invented structure for unreadable source.</span></li>
            </ul>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-line py-6 text-[0.6875rem] text-fg-muted sm:flex-row sm:items-center">
          <Link href="/" className="font-mono font-semibold tracking-tight text-fg">cartograph</Link>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2 sm:ml-3">
            <a href="#method" className="hover:text-fg">Method</a>
            <a href="#scope" className="hover:text-fg">Supported source</a>
            <a href="#limits" className="hover:text-fg">Boundaries</a>
          </nav>
          <Link href="/workspace" className="sm:ml-auto hover:text-fg">Open workspace <span aria-hidden="true">↗</span></Link>
        </footer>
      </div>
    </main>
  );
}
