"use client";

import { ProjectCreateModal } from "@/components/features/workspaces/projects/project-create-modal";
import { ProjectDeleteConfirm } from "@/components/features/workspaces/projects/project-delete-confirm";
import { ProjectEditModal } from "@/components/features/workspaces/projects/project-edit-modal";
import { ProjectsHeader } from "@/components/features/workspaces/projects/projects-header";
import { ProjectsList } from "@/components/features/workspaces/projects/projects-list";
import { useProjectsController } from "@/components/features/workspaces/projects/hooks/use-projects-controller";

type Props = {
  slug: string;
};

export function WorkspaceProjectsClient({ slug }: Props) {
  const controller = useProjectsController({ slug });

  return (
    <div className="animate-page-enter space-y-3 sm:space-y-4">
      <ProjectsHeader
        isOwner={controller.board.isOwner}
        onCreate={controller.createModal.actions.open}
      />

      <ProjectsList
        model={controller.projectsList}
        loading={controller.board.loading}
        loadingError={controller.board.loadingError}
        deleteError={controller.board.deleteError}
      />

      <ProjectCreateModal model={controller.createModal} />

      <ProjectDeleteConfirm model={controller.deleteConfirm} />

      <ProjectEditModal model={controller.projectEdit} />
    </div>
  );
}
