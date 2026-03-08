import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button/button";

type Props = {
  email: string;
  onCreate: () => void;
};

export function DashboardHeader({ email, onCreate }: Props) {
  return (
    <header className="flex items-start justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Workspace dashboard</p>
        <h1 className="text-3xl font-semibold text-zinc-100">Your workspaces</h1>
        <p className="text-sm text-zinc-400">{email}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" onClick={onCreate} variant="secondary" size="sm">
          New workspace
        </Button>
        <LogoutButton />
      </div>
    </header>
  );
}
