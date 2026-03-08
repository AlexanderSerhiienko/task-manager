import { WorkspaceRow } from "@/components/features/dashboard/workspace-row";
import { EmptyState } from "@/components/ui/states/empty-state";
import { InlineError } from "@/components/ui/states/inline-error";
import { WorkspaceListSkeleton } from "@/components/ui/states/skeleton-presets";
import { WorkspaceMembershipApiItem } from "@/shared/contracts/workspaces";

export type WorkspacesListModel = {
  workspaces: WorkspaceMembershipApiItem[];
};

type Props = {
  model: WorkspacesListModel;
  loading: boolean;
  errorMessage: string | null;
};

export function WorkspacesList({ model, loading, errorMessage }: Props) {
  const { workspaces } = model;
  const hasWorkspaces = workspaces.length > 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold text-zinc-100">Workspace list</h2>
      {loading ? <WorkspaceListSkeleton /> : null}
      {errorMessage ? <InlineError message={errorMessage} /> : null}
      {!loading && !errorMessage && hasWorkspaces ? (
        <ul className="animate-stagger space-y-3">
          {workspaces.map((workspace) => (
            <WorkspaceRow key={workspace.id} workspace={workspace} />
          ))}
        </ul>
      ) : null}
      {!loading && !errorMessage && !hasWorkspaces ? (
        <EmptyState
          title="No workspaces yet"
          description="Create your first workspace to get started."
        />
      ) : null}
    </section>
  );
}
