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
    <li className="surface-hover rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-zinc-100">{project.name}</p>
          <p className="text-sm text-zinc-400">{project.description ?? "No description"}</p>
        </div>
        <div className="flex shrink-0 gap-2">
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
