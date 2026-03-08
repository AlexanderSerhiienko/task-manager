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
    <li className="surface-hover flex items-start justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div>
        <p className="font-medium text-zinc-100">{member.user.name ?? member.user.email}</p>
        <p className="text-sm text-zinc-400">{member.user.email}</p>
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
        >
          {deletingUserId === member.userId ? "Removing..." : "Remove"}
        </Button>
      ) : null}
    </li>
  );
}
