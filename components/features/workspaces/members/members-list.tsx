import { MemberRow } from "@/components/features/workspaces/members/member-row";
import { EmptyState } from "@/components/ui/states/empty-state";
import { InlineError } from "@/components/ui/states/inline-error";
import { MemberListSkeleton } from "@/components/ui/states/skeleton-presets";
import { WorkspaceMemberApiItem } from "@/shared/contracts/workspaces";

export type MembersListModel = {
  members: WorkspaceMemberApiItem[];
  currentUserId: string | null;
  isOwner: boolean;
  deletingUserId: string | null;
  actions: {
    onAskRemove: (userId: string) => void;
  };
};

type Props = {
  model: MembersListModel;
  loading: boolean;
  loadingError: string | null;
  removeError: string | null;
};

export function MembersList({
  model,
  loading,
  loadingError,
  removeError,
}: Props) {
  const { members, currentUserId, isOwner, deletingUserId, actions } = model;

  return (
    <div className="space-y-3">
      {loading ? <MemberListSkeleton /> : null}
      {loadingError ? <InlineError message={loadingError} /> : null}
      {removeError ? <InlineError message={removeError} /> : null}
      {!loading && !loadingError && members.length === 0 ? (
        <EmptyState title="No members" description="Add members by email." />
      ) : null}
      {!loading && !loadingError && members.length > 0 ? (
        <ul className="animate-stagger space-y-3">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              currentUserId={currentUserId}
              isOwner={isOwner}
              deletingUserId={deletingUserId}
              onAskRemove={actions.onAskRemove}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
