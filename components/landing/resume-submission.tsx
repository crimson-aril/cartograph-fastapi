"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitAnalysis, type FormState } from "@/app/(workspace)/actions";

const INITIAL: FormState = { error: null };

export function ResumeSubmission({ repository }: { repository: string }) {
  const [state, action, pending] = useActionState(submitAnalysis, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;
    formRef.current?.requestSubmit();
  }, []);

  return (
    <div className="w-full max-w-md px-6">
      <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-fg-muted">Continuing repository submission</p>
      <p className="mt-3 break-all font-mono text-xs text-fg">{repository}</p>
      <p className="mt-2 text-xs leading-5 text-fg-muted">
        {pending ? "Starting the analysis…" : "Submitting the repository to your workspace…"}
      </p>
      <form ref={formRef} action={action} className="mt-4">
        <input type="hidden" name="url" value={repository} />
        <button type="submit" disabled={pending} className="h-7 rounded-sm border border-line px-2.5 text-xs text-fg hover:bg-raised disabled:opacity-60">
          {pending ? "Starting…" : "Try again"}
        </button>
      </form>
      {state.error && <p role="alert" className="mt-3 text-xs text-fg">{state.error}</p>}
    </div>
  );
}
