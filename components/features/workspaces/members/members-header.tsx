import { Button } from "@/components/ui/button/button";

type Props = {
  isOwner: boolean;
  onAdd: () => void;
};

export function MembersHeader({ isOwner, onAdd }: Props) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-100">Members</h2>
        <p className="text-sm text-zinc-400">Workspace participants.</p>
      </div>
      {isOwner ? (
        <Button type="button" onClick={onAdd} variant="secondary">
          New member
        </Button>
      ) : null}
    </div>
  );
}
