import { ConfirmModal } from "@/components/ui/modal/confirm-modal";

export type ProjectDeleteConfirmModel = {
  isOpen: boolean;
  projectId: string | null;
  isConfirming: boolean;
  actions: {
    onCancel: () => void;
    onConfirm: () => void;
  };
};

type Props = {
  model: ProjectDeleteConfirmModel;
};

export function ProjectDeleteConfirm({ model }: Props) {
  return (
    <ConfirmModal
      title="Delete project"
      description="This action will permanently remove the project."
      isOpen={model.isOpen}
      confirmLabel="Delete project"
      isConfirming={model.isConfirming}
      onCancel={model.actions.onCancel}
      onConfirm={model.actions.onConfirm}
    />
  );
}
