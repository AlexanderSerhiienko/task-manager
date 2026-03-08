type ListSkeletonProps = {
  count?: number;
};

function SkeletonLine({ className }: { className: string }) {
  return <div className={`skeleton-line ${className}`} />;
}

export function WorkspaceShellSkeleton() {
  return (
    <main className="mx-auto flex w-full flex-col gap-4 py-2 sm:gap-5 sm:py-4">
      <header className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="w-full max-w-sm space-y-2">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-9 w-2/3" />
            <SkeletonLine className="h-4 w-1/2" />
          </div>
          <SkeletonLine className="h-8 w-32" />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-2">
        <SkeletonLine className="h-8 w-20" />
        <SkeletonLine className="h-8 w-20" />
        <SkeletonLine className="h-8 w-20" />
        <SkeletonLine className="h-8 w-20" />
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/75 p-4 shadow-xl sm:p-5">
        <div className="space-y-3">
          <SkeletonLine className="h-4 w-44" />
          <SkeletonLine className="h-3 w-64" />
          <SkeletonLine className="h-3 w-56" />
        </div>
      </section>
    </main>
  );
}

export function WorkspaceListSkeleton({ count = 4 }: ListSkeletonProps) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <li key={`workspace-skeleton-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-xs space-y-2">
              <SkeletonLine className="h-4 w-2/3" />
              <SkeletonLine className="h-3 w-1/2" />
            </div>
            <SkeletonLine className="h-8 w-28" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProjectListSkeleton({ count = 4 }: ListSkeletonProps) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <li key={`project-skeleton-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-md space-y-2">
              <SkeletonLine className="h-4 w-1/2" />
              <SkeletonLine className="h-3 w-2/3" />
            </div>
            <div className="flex gap-2">
              <SkeletonLine className="h-8 w-24" />
              <SkeletonLine className="h-8 w-16" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function MemberListSkeleton({ count = 4 }: ListSkeletonProps) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <li key={`member-skeleton-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full max-w-sm space-y-2">
              <SkeletonLine className="h-4 w-2/3" />
              <SkeletonLine className="h-3 w-1/2" />
              <SkeletonLine className="h-3 w-20" />
            </div>
            <SkeletonLine className="h-8 w-20" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function TaskBoardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, sectionIndex) => (
          <div key={`task-section-skeleton-${sectionIndex}`} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 sm:p-4">
            <SkeletonLine className="mb-3 h-4 w-32" />
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((__, cardIndex) => (
                <div key={`task-card-skeleton-${sectionIndex}-${cardIndex}`} className="rounded-xl border border-zinc-700/80 bg-zinc-950/70 p-3 sm:p-4">
                  <div className="space-y-2">
                    <SkeletonLine className="h-4 w-1/3" />
                    <SkeletonLine className="h-3 w-2/3" />
                    <SkeletonLine className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceOverviewSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <SkeletonLine className="h-8 w-40" />
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
        <div className="space-y-2">
          <SkeletonLine className="h-3 w-28" />
          <SkeletonLine className="h-7 w-1/2" />
          <SkeletonLine className="h-3 w-24" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`overview-card-skeleton-${index}`} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
            <div className="space-y-2">
              <SkeletonLine className="h-3 w-20" />
              <SkeletonLine className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceSettingsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SkeletonLine className="h-8 w-36" />
        <SkeletonLine className="h-3 w-56" />
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
        <div className="space-y-3">
          <SkeletonLine className="h-5 w-48" />
          <SkeletonLine className="h-3 w-12" />
          <SkeletonLine className="h-10 w-full" />
          <SkeletonLine className="h-9 w-32" />
        </div>
      </div>
    </div>
  );
}

export function WorkspaceProjectSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <SkeletonLine className="h-8 w-1/3" />
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:p-4">
        <div className="space-y-2">
          <SkeletonLine className="h-4 w-2/3" />
          <SkeletonLine className="h-4 w-1/2" />
        </div>
      </div>
      <TaskBoardSkeleton />
    </div>
  );
}
