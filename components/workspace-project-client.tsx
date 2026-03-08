"use client";

import { ProjectTasksClient } from "@/components/project-tasks-client";
import { InlineError } from "@/components/ui/states/inline-error";
import { WorkspaceProjectSkeleton } from "@/components/ui/states/skeleton-presets";
import { useProjectQuery } from "@/hooks/queries/use-projects";
import { ApiClientError } from "@/shared/api-client";

type Props = {
  slug: string;
  projectId: string;
};

export function WorkspaceProjectClient({ slug, projectId }: Props) {
  const projectQuery = useProjectQuery(slug, projectId);
  const project = projectQuery.data;
  const loading = projectQuery.isLoading;
  const errorMessage =
    projectQuery.error instanceof ApiClientError
      ? projectQuery.error.message
      : projectQuery.error
        ? "Failed to load project"
        : null;

  if (loading) {
    return <WorkspaceProjectSkeleton />;
  }

  if (errorMessage || !project) {
    return <InlineError message={errorMessage ?? "Project unavailable"} />;
  }

  return (
    <div className="animate-page-enter space-y-4 sm:space-y-5">
      <h2 className="break-words text-xl font-semibold text-zinc-100 sm:text-2xl">{project.name}</h2>
      <div className="surface-hover rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-200 sm:p-4">
        <p>
          <span className="font-medium">Project ID:</span> <span className="break-all">{project.id}</span>
        </p>
        <p>
          <span className="font-medium">Description:</span> {project.description ?? "No description"}
        </p>
      </div>
      <ProjectTasksClient slug={slug} projectId={project.id} />
    </div>
  );
}
