"use client";

import { WorkspaceNameForm } from "@/components/workspace-name-form";
import { InlineError } from "@/components/ui/states/inline-error";
import { WorkspaceSettingsSkeleton } from "@/components/ui/states/skeleton-presets";
import { useWorkspaceShellQuery } from "@/hooks/queries/use-workspace";
import { ApiClientError } from "@/shared/api-client";

type Props = {
  slug: string;
};

export function WorkspaceSettingsClient({ slug }: Props) {
  const workspaceQuery = useWorkspaceShellQuery(slug);
  const workspace = workspaceQuery.data?.workspace ?? null;
  const role = workspaceQuery.data?.role ?? null;
  const loading = workspaceQuery.isLoading;
  const errorMessage =
    workspaceQuery.error instanceof ApiClientError
      ? workspaceQuery.error.message
      : workspaceQuery.error
        ? "Failed to load workspace settings"
        : null;

  if (loading) {
    return <WorkspaceSettingsSkeleton />;
  }

  if (errorMessage || !workspace) {
    return <InlineError message={errorMessage ?? "Workspace unavailable"} />;
  }

  return (
    <div className="animate-page-enter space-y-3 sm:space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Settings</h2>
        <p className="text-sm text-zinc-400">Manage workspace configuration.</p>
      </div>
      <WorkspaceNameForm
        slug={workspace.slug}
        initialName={workspace.name}
        canEdit={role === "OWNER"}
      />
    </div>
  );
}
