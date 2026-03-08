import { Button } from "@/components/ui/button/button";

type Props = {
  isOwner: boolean;
  onCreate: () => void;
};

export function ProjectsHeader({ isOwner, onCreate }: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100">Projects</h2>
        <p className="text-sm text-zinc-400">Projects inside this workspace.</p>
      </div>
      {isOwner ? (
        <Button type="button" onClick={onCreate} variant="secondary">
          New project
        </Button>
      ) : null}
    </div>
  );
}
