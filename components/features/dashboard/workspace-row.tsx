import { ButtonLink } from "@/components/ui/button/button-link";
import { WorkspaceMembershipApiItem } from "@/shared/contracts/workspaces";

type Props = {
  workspace: WorkspaceMembershipApiItem;
};

export function WorkspaceRow({ workspace }: Props) {
  return (
    <li>
      <div className="surface-hover flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-100">{workspace.workspace.name}</p>
          <p className="truncate text-zinc-400">
            {workspace.workspace.slug} · {workspace.role}
          </p>
        </div>
        <ButtonLink href={`/workspaces/${workspace.workspace.slug}`} size="sm" className="w-full sm:w-auto">
          Open workspace
        </ButtonLink>
      </div>
    </li>
  );
}
