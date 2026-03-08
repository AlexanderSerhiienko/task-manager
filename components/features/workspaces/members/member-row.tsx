import { Button } from "@/components/ui/button/button";
import { WorkspaceMemberApiItem } from "@/shared/contracts/workspaces";

type Props = {
  member: WorkspaceMemberApiItem;
  currentUserId: string | null;
  isOwner: boolean;
  deletingUserId: string | null;
  onAskRemove: (userId: string) => void;
};

export function MemberRow({
  member,
  currentUserId,
  isOwner,
  deletingUserId,
  onAskRemove,
}: Props) {
  const isCurrentUser = currentUserId === member.userId;
  const canRemove = isOwner && member.role !== "OWNER";

  return (
    <li className="surface-hover flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
      <div className="min-w-0">
        <p className="truncate font-medium text-zinc-100">{member.user.name ?? member.user.email}</p>
        <p className="truncate text-sm text-zinc-400">{member.user.email}</p>
        <p className="text-xs text-zinc-400">
          {member.role}
          {isCurrentUser ? " · You" : ""}
        </p>
      </div>
      {canRemove ? (
        <Button
          type="button"
          onClick={() => onAskRemove(member.userId)}
          disabled={deletingUserId === member.userId}
          variant="danger"
          size="sm"
          className="w-full sm:w-auto"
        >
          {deletingUserId === member.userId ? "Removing..." : "Remove"}
        </Button>
      ) : null}
    </li>
  );
}
