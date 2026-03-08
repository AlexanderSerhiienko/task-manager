import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";
import { InlineError } from "@/components/ui/states/inline-error";

export type TaskEditModalModel = {
  isOpen: boolean;
  values: {
    title: string;
    description: string;
    dueDate: string;
  };
  setters: {
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setDueDate: (value: string) => void;
  };
  meta: {
    updatingTaskId: string | null;
    editError: string | null;
  };
  actions: {
    close: () => void;
    onSubmit: () => void;
  };
};

type Props = {
  model: TaskEditModalModel;
};

export function TaskEditModal({ model }: Props) {
  const { isOpen, values, setters, meta, actions } = model;

  return (
    <Modal title="Edit task" isOpen={isOpen} onClose={actions.close}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void actions.onSubmit();
        }}
        className="grid gap-4"
      >
        <div className="grid gap-1">
          <label htmlFor="edit-task-title" className="text-sm text-white">
            Title
          </label>
          <input
            id="edit-task-title"
            value={values.title}
            onChange={(event) => setters.setTitle(event.target.value)}
            aria-invalid={meta.editError !== null}
            required
            minLength={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="edit-task-description" className="text-sm text-white">
            Description
          </label>
          <textarea
            id="edit-task-description"
            value={values.description}
            onChange={(event) => setters.setDescription(event.target.value)}
            aria-invalid={meta.editError !== null}
            rows={3}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="edit-task-due-date" className="text-sm text-white">
            Due date
          </label>
          <input
            id="edit-task-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) => setters.setDueDate(event.target.value)}
            aria-invalid={meta.editError !== null}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        {meta.editError ? <InlineError message={meta.editError} /> : null}
        <Button type="submit" disabled={meta.updatingTaskId !== null} variant="default" className="w-full sm:w-fit">
          {meta.updatingTaskId !== null ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Modal>
  );
}
