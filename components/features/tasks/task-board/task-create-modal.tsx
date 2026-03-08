import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";
import { InlineError } from "@/components/ui/states/inline-error";
import {
  getTaskStatusLabel,
  TASK_STATUSES,
  TaskMemberApiItem,
  TaskStatus,
} from "@/shared/contracts/tasks";

export type TaskCreateModalModel = {
  isOpen: boolean;
  values: {
    title: string;
    description: string;
    status: TaskStatus;
    dueDate: string;
    ownerAssigneeId: string;
    assignToMeOnCreate: boolean;
  };
  setters: {
    setTitle: (value: string) => void;
    setDescription: (value: string) => void;
    setStatus: (value: TaskStatus) => void;
    setDueDate: (value: string) => void;
    setOwnerAssigneeId: (value: string) => void;
    setAssignToMeOnCreate: (value: boolean) => void;
  };
  meta: {
    isOwner: boolean;
    members: TaskMemberApiItem[];
    submitting: boolean;
    submitError: string | null;
  };
  actions: {
    close: () => void;
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  };
};

type Props = {
  model: TaskCreateModalModel;
};

export function TaskCreateModal({ model }: Props) {
  const { isOpen, values, setters, meta, actions } = model;

  return (
    <Modal title="New task" isOpen={isOpen} onClose={actions.close}>
      <form onSubmit={actions.onSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="task-title" className="text-sm text-white">
            Title
          </label>
          <input
            id="task-title"
            value={values.title}
            onChange={(event) => setters.setTitle(event.target.value)}
            aria-invalid={meta.submitError !== null}
            required
            minLength={2}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="task-description" className="text-sm text-white">
            Description
          </label>
          <textarea
            id="task-description"
            value={values.description}
            onChange={(event) => setters.setDescription(event.target.value)}
            aria-invalid={meta.submitError !== null}
            rows={3}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="task-status" className="text-sm text-white">
            Status
          </label>
          <select
            id="task-status"
            value={values.status}
            onChange={(event) => setters.setStatus(event.target.value as TaskStatus)}
            aria-invalid={meta.submitError !== null}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getTaskStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="task-due-date" className="text-sm text-white">
            Due date
          </label>
          <input
            id="task-due-date"
            type="date"
            value={values.dueDate}
            onChange={(event) => setters.setDueDate(event.target.value)}
            aria-invalid={meta.submitError !== null}
            className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          />
        </div>
        {meta.isOwner ? (
          <div className="grid gap-1">
            <label htmlFor="task-assignee" className="text-sm text-white">
              Assignee
            </label>
            <select
              id="task-assignee"
              value={values.ownerAssigneeId}
              onChange={(event) => setters.setOwnerAssigneeId(event.target.value)}
              aria-invalid={meta.submitError !== null}
              className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
            >
              <option value="">Unassigned</option>
              {meta.members.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {(member.user.name ?? member.user.email) + ` (${member.role})`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={values.assignToMeOnCreate}
              onChange={(event) => setters.setAssignToMeOnCreate(event.target.checked)}
            />
            Assign this task to me
          </label>
        )}
        {meta.submitError ? <InlineError message={meta.submitError} /> : null}
        <Button type="submit" disabled={meta.submitting} variant="default" className="w-fit">
          {meta.submitting ? "Creating..." : "Create task"}
        </Button>
      </form>
    </Modal>
  );
}
