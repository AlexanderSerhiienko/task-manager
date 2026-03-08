import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button/button";

type Props = {
  email: string;
  onCreate: () => void;
};

export function DashboardHeader({ email, onCreate }: Props) {
  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-xl sm:flex-row sm:items-start sm:justify-between sm:p-5">
      <div className="min-w-0 space-y-1">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Workspace dashboard</p>
        <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Your workspaces</h1>
        <p className="truncate text-sm text-zinc-400">{email}</p>
      </div>
      <div className="mobile-action-stack sm:shrink-0">
        <Button type="button" onClick={onCreate} variant="secondary" size="sm" className="sm:w-auto">
          New workspace
        </Button>
        <LogoutButton />
      </div>
    </header>
  );
}
