import { getTaskStatusLabel, TaskApiItem, TaskMemberApiItem, TaskStatus } from "@/shared/contracts/tasks";
import { TaskCard } from "@/components/features/tasks/task-board/task-card";

export type TaskStatusSectionModel = {
  statusOrder: TaskStatus[];
  isOwner: boolean;
  members: TaskMemberApiItem[];
  currentUserId: string | null;
  deletingTaskId: string | null;
  updatingStatusTaskId: string | null;
  updatingAssigneeTaskId: string | null;
  actions: {
    onStartEdit: (task: TaskApiItem) => void;
    onAskDelete: (taskId: string) => void;
    onChangeStatus: (taskId: string, status: TaskStatus) => void;
    onAssign: (taskId: string, assigneeId: string | null) => void;
  };
};

type Props = {
  status: TaskStatus;
  tasks: TaskApiItem[];
  model: TaskStatusSectionModel;
};

export function TaskStatusSection({ status, tasks, model }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">
        {getTaskStatusLabel(status)} ({tasks.length})
      </h4>
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-400">No tasks in this status</p>
      ) : (
        <ul className="animate-stagger space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              model={model}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
