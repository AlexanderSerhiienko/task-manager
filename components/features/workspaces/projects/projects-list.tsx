import { ProjectRow } from "@/components/features/workspaces/projects/project-row";
import { EmptyState } from "@/components/ui/states/empty-state";
import { InlineError } from "@/components/ui/states/inline-error";
import { ProjectListSkeleton } from "@/components/ui/states/skeleton-presets";
import { ProjectApiItem } from "@/shared/contracts/workspaces";

export type ProjectsListModel = {
  slug: string;
  projects: ProjectApiItem[];
  isOwner: boolean;
  deletingProjectId: string | null;
  actions: {
    onEdit: (project: ProjectApiItem) => void;
    onAskDelete: (projectId: string) => void;
  };
};

type Props = {
  model: ProjectsListModel;
  loading: boolean;
  loadingError: string | null;
  deleteError: string | null;
};

export function ProjectsList({
  model,
  loading,
  loadingError,
  deleteError,
}: Props) {
  const { slug, projects, isOwner, deletingProjectId, actions } = model;

  return (
    <div className="space-y-3">
      {loading ? <ProjectListSkeleton /> : null}
      {loadingError ? <InlineError message={loadingError} /> : null}
      {deleteError ? <InlineError message={deleteError} /> : null}
      {!loading && !loadingError && projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project for this workspace."
        />
      ) : null}
      {!loading && !loadingError && projects.length > 0 ? (
        <ul className="animate-stagger space-y-3">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              slug={slug}
              project={project}
              isOwner={isOwner}
              deletingProjectId={deletingProjectId}
              onEdit={actions.onEdit}
              onAskDelete={actions.onAskDelete}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
