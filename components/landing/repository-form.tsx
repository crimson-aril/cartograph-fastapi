"use client";

import { useActionState } from "react";
import { submitAnalysis, type FormState } from "@/app/(workspace)/actions";

const INITIAL: FormState = { error: null };

export function RepositoryForm() {
  const [state, action, pending] = useActionState(submitAnalysis, INITIAL);

  return (
    <div className="w-full max-w-xl">
      <form action={action} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="repository-url" className="sr-only">
          Public GitHub repository URL
        </label>
        <input
          id="repository-url"
          name="url"
          type="text"
          inputMode="url"
          required
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="github.com/owner/repository"
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "repository-hint repository-error" : "repository-hint"}
          className="h-11 min-w-0 flex-1 rounded-sm border border-line bg-surface px-3 font-mono text-xs text-fg outline-none placeholder:text-fg-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 shrink-0 items-center justify-center gap-3 rounded-sm bg-accent px-4 text-xs font-medium text-accent-fg disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Starting analysis…" : "Map repository"}
          <span aria-hidden="true">↗</span>
        </button>
      </form>
      <p id="repository-hint" className="mt-2 text-[0.6875rem] text-fg-muted">
        Public repositories only. Paste a URL or owner/repository.
      </p>
      {state.error && (
        <p id="repository-error" role="alert" className="mt-2 text-xs text-fg">
          {state.error}
        </p>
      )}
    </div>
  );
}
