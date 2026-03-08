import { Button } from "@/components/ui/button/button";

type Props = {
  isOwner: boolean;
  onCreate: () => void;
};

export function ProjectsHeader({ isOwner, onCreate }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Projects</h2>
        <p className="text-sm text-zinc-400">Projects inside this workspace.</p>
      </div>
      {isOwner ? (
        <Button type="button" onClick={onCreate} variant="secondary" className="w-full sm:w-auto">
          New project
        </Button>
      ) : null}
    </div>
  );
}
