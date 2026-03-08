"use client";

import { Button } from "@/components/ui/button/button";
import { InlineError } from "@/components/ui/states/inline-error";

type Props = {
  error: Error;
  reset: () => void;
};

export default function WorkspaceError({ error, reset }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-6 py-8">
      <InlineError message={error.message || "Failed to load workspace"} />
      <Button type="button" size="sm" onClick={reset} className="w-fit">
        Try again
      </Button>
    </main>
  );
}
