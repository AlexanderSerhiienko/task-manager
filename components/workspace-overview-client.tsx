"use client";

import { InlineError } from "@/components/ui/states/inline-error";
import { WorkspaceOverviewSkeleton } from "@/components/ui/states/skeleton-presets";
import { useWorkspaceOverviewQuery } from "@/hooks/queries/use-workspace";
import { ApiClientError } from "@/shared/api-client";

type Props = {
  slug: string;
};

type MetricCardProps = {
  label: string;
  value: number;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="surface-hover rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-100 sm:text-3xl">{value}</p>
    </div>
  );
}

export function WorkspaceOverviewClient({ slug }: Props) {
  const overviewQuery = useWorkspaceOverviewQuery(slug);
  const overview = overviewQuery.data;
  const loading = overviewQuery.isLoading;
  const errorMessage =
    overviewQuery.error instanceof ApiClientError
      ? overviewQuery.error.message
      : overviewQuery.error
        ? "Failed to load overview"
        : null;

  if (loading) {
    return <WorkspaceOverviewSkeleton />;
  }

  if (errorMessage || !overview) {
    return <InlineError message={errorMessage ?? "Overview not available"} />;
  }

  const metrics = [
    { label: "Total projects", value: overview.totals.projects },
    { label: "Total tasks", value: overview.totals.tasks },
    { label: "In progress", value: overview.totals.inProgressTasks },
    { label: "Done tasks", value: overview.totals.doneTasks },
  ];

  return (
    <div className="animate-page-enter space-y-4 sm:space-y-5">
      <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Overview</h2>
      <div className="surface-hover rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
        <p className="text-sm text-zinc-400">Workspace name</p>
        <p className="text-xl font-semibold text-zinc-100">{overview.workspace.name}</p>
        <p className="text-sm text-zinc-400">Role: {overview.role}</p>
      </div>

      <div className="animate-stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

    </div>
  );
}
