"use client";

import { ButtonLink } from "@/components/ui/button/button-link";
import { InlineError } from "@/components/ui/states/inline-error";
import { WorkspaceShellSkeleton } from "@/components/ui/states/skeleton-presets";
import { useWorkspaceShellQuery } from "@/hooks/queries/use-workspace";
import { ApiClientError } from "@/shared/api-client";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  slug: string;
  children: React.ReactNode;
};

export function WorkspaceShellClient({ slug, children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
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
      <main className="mx-auto flex w-full flex-col gap-4 py-2 sm:gap-5 sm:py-4">
        <InlineError message={errorMessage ?? "Workspace unavailable"} />
      </main>
    );
  }

  const basePath = `/workspaces/${data.workspace.slug}`;
  const navItems = [
    { key: "overview", label: "Overview", href: basePath },
    { key: "projects", label: "Projects", href: `${basePath}/projects` },
    { key: "members", label: "Members", href: `${basePath}/members` },
    { key: "settings", label: "Settings", href: `${basePath}/settings` },
  ] as const;
  const activeNavKey =
    pathname === basePath
      ? "overview"
      : pathname === `${basePath}/members`
        ? "members"
        : pathname === `${basePath}/settings`
          ? "settings"
          : pathname === `${basePath}/projects` || pathname.startsWith(`${basePath}/projects/`)
            ? "projects"
            : "overview";

  return (
    <main className="animate-page-enter mx-auto flex w-full flex-col gap-4 py-2 sm:gap-5 sm:py-4">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-xs uppercase tracking-wide text-zinc-400">Workspace</p>
            <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">{data.workspace.name}</h1>
            <p className="truncate text-sm text-zinc-400">Slug: {data.workspace.slug}</p>
          </div>
          <ButtonLink href="/dashboard" size="sm" variant="secondary" className="w-full sm:w-auto">
            All workspaces
          </ButtonLink>
        </div>
      </header>

      <nav className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
        <div className="sm:hidden">
          <label htmlFor="workspace-nav" className="sr-only">Workspace section</label>
          <select
            id="workspace-nav"
            value={activeNavKey}
            onChange={(event) => {
              const nextItem = navItems.find((item) => item.key === event.target.value);
              if (nextItem) {
                router.push(nextItem.href);
              }
            }}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-sm outline-none"
          >
            {navItems.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden flex-wrap gap-2 sm:flex">
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
        </div>
      </nav>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4 shadow-xl sm:p-5">{children}</section>
    </main>
  );
}
