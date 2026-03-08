"use client";

import { ButtonLink } from "@/components/ui/button/button-link";
import { InlineError } from "@/components/ui/states/inline-error";
import { WorkspaceShellSkeleton } from "@/components/ui/states/skeleton-presets";
import { useWorkspaceShellQuery } from "@/hooks/queries/use-workspace";
import { ApiClientError } from "@/shared/api-client";
import { usePathname } from "next/navigation";

type Props = {
  slug: string;
  children: React.ReactNode;
};

export function WorkspaceShellClient({ slug, children }: Props) {
  const pathname = usePathname();
  const workspaceQuery = useWorkspaceShellQuery(slug);
  const data = workspaceQuery.data;
  const loading = workspaceQuery.isLoading;
  const errorMessage =
    workspaceQuery.error instanceof ApiClientError
      ? workspaceQuery.error.message
      : workspaceQuery.error
        ? "Failed to load workspace"
        : null;

  if (loading) {
    return <WorkspaceShellSkeleton />;
  }

  if (errorMessage || !data) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4">
        <InlineError message={errorMessage ?? "Workspace unavailable"} />
      </main>
    );
  }

  const basePath = `/workspaces/${data.workspace.slug}`;

  return (
    <main className="animate-page-enter mx-auto flex w-full max-w-5xl flex-col gap-5 py-4">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Workspace</p>
            <h1 className="text-3xl font-semibold text-zinc-100">{data.workspace.name}</h1>
            <p className="text-sm text-zinc-400">Slug: {data.workspace.slug}</p>
          </div>
          <ButtonLink href="/dashboard" size="sm" variant="secondary">
            All workspaces
          </ButtonLink>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
        <ButtonLink href={basePath} size="sm" isActive={pathname === basePath}>
          Overview
        </ButtonLink>
        <ButtonLink
          href={`${basePath}/projects`}
          size="sm"
          isActive={pathname === `${basePath}/projects` || pathname.startsWith(`${basePath}/projects/`)}
        >
          Projects
        </ButtonLink>
        <ButtonLink href={`${basePath}/members`} size="sm" isActive={pathname === `${basePath}/members`}>
          Members
        </ButtonLink>
        <ButtonLink href={`${basePath}/settings`} size="sm" isActive={pathname === `${basePath}/settings`}>
          Settings
        </ButtonLink>
      </nav>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-5 shadow-xl">{children}</section>
    </main>
  );
}
