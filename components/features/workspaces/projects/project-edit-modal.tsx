import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";
import { InlineError } from "@/components/ui/states/inline-error";

export type ProjectEditModalModel = {
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
    updating: boolean;
    updateError: string | null;
  };
  actions: {
    close: () => void;
    onSubmit: () => void;
  };
};

type Props = {
  model: ProjectEditModalModel;
};

export function ProjectEditModal({ model }: Props) {
  const { isOpen, values, setters, meta, actions } = model;

  return (
    <Modal title="Edit project" isOpen={isOpen} onClose={actions.close}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void actions.onSubmit();
        }}
        className="grid gap-4"
      >
        <div className="grid gap-1">
          <label htmlFor="edit-project-name" className="text-sm text-white">
            Name
          </label>
          <input
            id="edit-project-name"
            value={values.name}
            onChange={(event) => setters.setName(event.target.value)}
            aria-invalid={meta.updateError !== null}
            required
            minLength={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="edit-project-description" className="text-sm text-white">
            Description
          </label>
          <textarea
            id="edit-project-description"
            value={values.description}
            onChange={(event) => setters.setDescription(event.target.value)}
            aria-invalid={meta.updateError !== null}
            rows={3}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        {meta.updateError ? <InlineError message={meta.updateError} /> : null}
        <Button type="submit" disabled={meta.updating} variant="default" className="w-fit">
          {meta.updating ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Modal>
  );
}
