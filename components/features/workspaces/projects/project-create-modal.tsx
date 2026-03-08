import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";
import { InlineError } from "@/components/ui/states/inline-error";

export type ProjectCreateModalModel = {
  isOpen: boolean;
  values: {
    name: string;
    description: string;
  };
  setters: {
    setName: (value: string) => void;
    setDescription: (value: string) => void;
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
  model: ProjectCreateModalModel;
};

export function ProjectCreateModal({ model }: Props) {
  const { isOpen, values, setters, meta, actions } = model;

  return (
    <Modal title="New project" isOpen={isOpen} onClose={actions.close}>
      <form onSubmit={actions.onSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="project-name" className="text-sm text-white">
            Name
          </label>
          <input
            id="project-name"
            name="name"
            value={values.name}
            onChange={(event) => setters.setName(event.target.value)}
            aria-invalid={meta.submitError !== null}
            required
            minLength={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="project-description" className="text-sm text-white">
            Description
          </label>
          <textarea
            id="project-description"
            name="description"
            value={values.description}
            onChange={(event) => setters.setDescription(event.target.value)}
            aria-invalid={meta.submitError !== null}
            rows={3}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        {meta.submitError ? <InlineError message={meta.submitError} /> : null}
        <Button type="submit" disabled={meta.submitting} variant="default" className="w-fit">
          {meta.submitting ? "Creating..." : "Create project"}
        </Button>
      </form>
    </Modal>
  );
}
