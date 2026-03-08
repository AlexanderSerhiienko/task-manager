import { ButtonLink } from "@/components/ui/button/button-link";
import { WorkspaceMembershipApiItem } from "@/shared/contracts/workspaces";

type Props = {
  workspace: WorkspaceMembershipApiItem;
};

export function WorkspaceRow({ workspace }: Props) {
  return (
    <li>
      <div className="surface-hover flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm">
        <div>
          <p className="font-medium text-zinc-100">{workspace.workspace.name}</p>
          <p className="text-zinc-400">
            {workspace.workspace.slug} · {workspace.role}
          </p>
        </div>
        <ButtonLink href={`/workspaces/${workspace.workspace.slug}`} size="sm">
          Open workspace
        </ButtonLink>
      </div>
    </li>
  );
}
