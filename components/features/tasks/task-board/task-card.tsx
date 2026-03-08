import { Button } from "@/components/ui/button/button";
import { getTaskStatusLabel, TaskApiItem, TaskStatus } from "@/shared/contracts/tasks";
import { TaskStatusSectionModel } from "@/components/features/tasks/task-board/task-status-section";

type Props = {
  task: TaskApiItem;
  model: TaskStatusSectionModel;
};

function formatDueDate(value: string | null) {
  if (!value) {
    return "No due date";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
}

export function TaskCard({
  task,
  model,
}: Props) {
  const {
    statusOrder,
    isOwner,
    members,
    currentUserId,
    deletingTaskId,
    updatingStatusTaskId,
    updatingAssigneeTaskId,
    actions,
  } = model;

  return (
    <li className="surface-hover rounded-xl border border-zinc-700/80 bg-zinc-950/70 p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-zinc-100">{task.title}</p>
            <p className="text-sm text-zinc-300">{task.description ?? "No description"}</p>
            <p className="text-xs text-zinc-400">Due date: {formatDueDate(task.dueDate)}</p>
            <p className="text-xs text-zinc-400">
              Assignee: {task.assignee?.name ?? task.assignee?.email ?? "Unassigned"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => actions.onStartEdit(task)} variant="secondary" size="sm">
              Edit
            </Button>
            <Button
              type="button"
              onClick={() => actions.onAskDelete(task.id)}
              disabled={deletingTaskId === task.id}
              variant="danger"
              size="sm"
            >
              {deletingTaskId === task.id ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <div className="grid gap-1">
            <label className="text-xs text-zinc-400">Status</label>
            <select
              value={task.status}
              disabled={updatingStatusTaskId === task.id}
              onChange={(event) => actions.onChangeStatus(task.id, event.target.value as TaskStatus)}
              className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-sm outline-none"
            >
              {statusOrder.map((taskStatus) => (
                <option key={taskStatus} value={taskStatus}>
                  {getTaskStatusLabel(taskStatus)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-xs text-zinc-400">Assignee</label>
            {isOwner ? (
              <select
                value={task.assigneeId ?? ""}
                disabled={updatingAssigneeTaskId === task.id}
                onChange={(event) => actions.onAssign(task.id, event.target.value || null)}
                className="rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-1.5 text-sm outline-none"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {(member.user.name ?? member.user.email) + ` (${member.role})`}
                  </option>
                ))}
              </select>
            ) : (
              <Button
                type="button"
                disabled={updatingAssigneeTaskId === task.id || currentUserId === null}
                onClick={() => {
                  if (!currentUserId) {
                    return;
                  }
                  const nextAssigneeId = task.assigneeId === currentUserId ? null : currentUserId;
                  actions.onAssign(task.id, nextAssigneeId);
                }}
                variant="secondary"
                size="sm"
                className="w-fit"
              >
                {task.assigneeId === currentUserId ? "Remove my assignment" : "Assign to me"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
