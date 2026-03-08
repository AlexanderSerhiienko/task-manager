import { ConfirmModal } from "@/components/ui/modal/confirm-modal";

export type MemberRemoveConfirmModel = {
  isOpen: boolean;
  userId: string | null;
  isConfirming: boolean;
  actions: {
    onCancel: () => void;
    onConfirm: () => void;
  };
};

type Props = {
  model: MemberRemoveConfirmModel;
};

export function MemberRemoveConfirm({ model }: Props) {
  return (
    <ConfirmModal
      title="Remove member"
      description="This action will remove the member from the workspace."
      isOpen={model.isOpen}
      confirmLabel="Remove member"
      isConfirming={model.isConfirming}
      onCancel={model.actions.onCancel}
      onConfirm={model.actions.onConfirm}
    />
  );
}
