import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";

export type WorkspaceCreateModalModel = {
  isOpen: boolean;
  values: {
    name: string;
    slug: string;
  };
  setters: {
    setName: (value: string) => void;
    setSlug: (value: string) => void;
  };
  meta: {
    submitting: boolean;
    submitError: string | null;
  };
  actions: {
    close: () => void;
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  };
};

type Props = {
  model: WorkspaceCreateModalModel;
};

export function WorkspaceCreateModal({ model }: Props) {
  const { isOpen, values, setters, meta, actions } = model;

  return (
    <Modal title="Create workspace" isOpen={isOpen} onClose={actions.close}>
      <form onSubmit={actions.onSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="workspace-name" className="text-sm text-white">
            Workspace name
          </label>
          <input
            id="workspace-name"
            name="name"
            type="text"
            value={values.name}
            onChange={(event) => setters.setName(event.target.value)}
            aria-invalid={meta.submitError !== null}
            required
            minLength={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="workspace-slug" className="text-sm text-white">
            Workspace slug
          </label>
          <input
            id="workspace-slug"
            name="slug"
            type="text"
            value={values.slug}
            onChange={(event) => setters.setSlug(event.target.value)}
            aria-invalid={meta.submitError !== null}
            required
            minLength={2}
            pattern="^[a-z0-9-]+$"
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        {meta.submitError ? (
          <p role="alert" aria-live="assertive" className="text-sm text-red-600">
            {meta.submitError}
          </p>
        ) : null}
        <Button type="submit" disabled={meta.submitting} variant="default" className="w-fit">
          {meta.submitting ? "Creating..." : "Create workspace"}
        </Button>
      </form>
    </Modal>
  );
}
