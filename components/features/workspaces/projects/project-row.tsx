import { Button } from "@/components/ui/button/button";
import { ButtonLink } from "@/components/ui/button/button-link";
import { ProjectApiItem } from "@/shared/contracts/workspaces";

type Props = {
  slug: string;
  project: ProjectApiItem;
  isOwner: boolean;
  deletingProjectId: string | null;
  onEdit: (project: ProjectApiItem) => void;
  onAskDelete: (projectId: string) => void;
};

export function ProjectRow({
  slug,
  project,
  isOwner,
  deletingProjectId,
  onEdit,
  onAskDelete,
}: Props) {
  return (
    <li className="surface-hover rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-100">{project.name}</p>
          <p className="break-words text-sm text-zinc-400">{project.description ?? "No description"}</p>
        </div>
        <div className="mobile-action-stack sm:shrink-0">
          <ButtonLink href={`/workspaces/${slug}/projects/${project.id}`} size="sm">
            Open project
          </ButtonLink>
          {isOwner ? (
            <>
              <Button type="button" onClick={() => onEdit(project)} variant="secondary" size="sm">
                Edit
              </Button>
              <Button
                type="button"
                onClick={() => onAskDelete(project.id)}
                disabled={deletingProjectId === project.id}
                variant="danger"
                size="sm"
              >
                {deletingProjectId === project.id ? "Deleting..." : "Delete"}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </li>
  );
}
