"use client";

import { MemberAddModal } from "@/components/features/workspaces/members/member-add-modal";
import { MemberRemoveConfirm } from "@/components/features/workspaces/members/member-remove-confirm";
import { MembersHeader } from "@/components/features/workspaces/members/members-header";
import { MembersList } from "@/components/features/workspaces/members/members-list";
import { useMembersController } from "@/components/features/workspaces/members/hooks/use-members-controller";

type Props = {
  slug: string;
};

export function WorkspaceMembersClient({ slug }: Props) {
  const controller = useMembersController({ slug });

  return (
    <div className="animate-page-enter space-y-4">
      <MembersHeader isOwner={controller.board.isOwner} onAdd={controller.addModal.actions.open} />

      <MembersList
        model={controller.membersList}
        loading={controller.board.loading}
        loadingError={controller.board.loadingError}
        removeError={controller.board.removeError}
      />

      <MemberAddModal model={controller.addModal} />

      <MemberRemoveConfirm model={controller.removeConfirm} />
    </div>
  );
}
