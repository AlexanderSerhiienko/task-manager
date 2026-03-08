import { Button } from "@/components/ui/button/button";

type Props = {
  isOwner: boolean;
  onAdd: () => void;
};

export function MembersHeader({ isOwner, onAdd }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Members</h2>
        <p className="text-sm text-zinc-400">Workspace participants.</p>
      </div>
      {isOwner ? (
        <Button type="button" onClick={onAdd} variant="secondary" className="w-full sm:w-auto">
          New member
        </Button>
      ) : null}
    </div>
  );
}
