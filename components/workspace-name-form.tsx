"use client";

import { Button } from "@/components/ui/button/button";
import { useUpdateWorkspaceNameMutation } from "@/hooks/queries/use-workspace";
import { ApiClientError } from "@/shared/api-client";
import { useState } from "react";

type Props = {
  slug: string;
  initialName: string;
  canEdit: boolean;
};

export function WorkspaceNameForm({ slug, initialName, canEdit }: Props) {
  const updateWorkspaceNameMutation = useUpdateWorkspaceNameMutation();
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submitting = updateWorkspaceNameMutation.isPending;
  const disabled = submitting || !canEdit;

  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) {
      return;
    }
    setMessage(null);
    setError(null);

    try {
      await updateWorkspaceNameMutation.mutateAsync({
        slug,
        name: name.trim(),
      });
      setMessage("Workspace name updated");
    } catch (mutationError) {
      if (mutationError instanceof ApiClientError) {
        setError(mutationError.message);
        return;
      }
      setError("Failed to update workspace name");
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-zinc-100">Update workspace name</h3>
      <div className="grid gap-1">
        <label htmlFor="workspace-name" className="text-sm text-white">
          Name
        </label>
        <input
          id="workspace-name"
          name="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={error !== null}
          disabled={!canEdit}
          required
          minLength={2}
          className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
        />
      </div>
      <Button
        type="submit"
        disabled={disabled}
        variant="default"
        className="w-full sm:w-fit"
      >
        {submitting ? "Saving..." : "Save changes"}
      </Button>
      {!canEdit ? <p aria-live="polite" className="text-sm text-zinc-400">Only workspace owner can change settings.</p> : null}
      {message ? <p aria-live="polite" className="text-sm text-emerald-600">{message}</p> : null}
      {error ? <p role="alert" aria-live="assertive" className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
