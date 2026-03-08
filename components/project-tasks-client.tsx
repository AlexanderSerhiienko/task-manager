"use client";

import { TaskBoardHeader } from "@/components/features/tasks/task-board/task-board-header";
import { TaskCreateModal } from "@/components/features/tasks/task-board/task-create-modal";
import { TaskDeleteConfirm } from "@/components/features/tasks/task-board/task-delete-confirm";
import { TaskEditModal } from "@/components/features/tasks/task-board/task-edit-modal";
import { TaskStatusSection } from "@/components/features/tasks/task-board/task-status-section";
import { useTaskBoardController } from "@/components/features/tasks/task-board/hooks/use-task-board-controller";
import { EmptyState } from "@/components/ui/states/empty-state";
import { InlineError } from "@/components/ui/states/inline-error";
import { TaskBoardSkeleton } from "@/components/ui/states/skeleton-presets";

type Props = {
  slug: string;
  projectId: string;
};

export function ProjectTasksClient({ slug, projectId }: Props) {
  const controller = useTaskBoardController({ slug, projectId });
  const hasAnyTasks = controller.board.statusOrder.some((status) => controller.board.groupedTasks[status].length > 0);

  return (
    <div className="animate-page-enter space-y-4 sm:space-y-5">
      <TaskBoardHeader onCreate={controller.createModal.actions.open} />

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-xl sm:p-5">
        {controller.board.loading ? <TaskBoardSkeleton /> : null}
        {controller.board.loadingError ? <InlineError message={controller.board.loadingError} /> : null}
        {controller.board.actionError ? <InlineError message={controller.board.actionError} /> : null}
        {!controller.board.loading && !controller.board.loadingError && !hasAnyTasks ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task for this project."
          />
        ) : null}
        {!controller.board.loading && !controller.board.loadingError && hasAnyTasks ? (
          <div className="space-y-4 sm:space-y-5">
            {controller.board.statusOrder.map((status) => (
              <TaskStatusSection
                key={status}
                status={status}
                tasks={controller.board.groupedTasks[status]}
                model={controller.taskStatus}
              />
            ))}
          </div>
        ) : null}
      </section>

      <TaskCreateModal model={controller.createModal} />

      <TaskDeleteConfirm model={controller.deleteConfirm} />

      <TaskEditModal model={controller.taskEdit} />
    </div>
  );
}
