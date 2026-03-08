import { ConfirmModal } from "@/components/ui/modal/confirm-modal";

export type TaskDeleteConfirmModel = {
  isOpen: boolean;
  taskId: string | null;
  isConfirming: boolean;
  actions: {
    onCancel: () => void;
    onConfirm: () => void;
  };
};

type Props = {
  model: TaskDeleteConfirmModel;
};

export function TaskDeleteConfirm({ model }: Props) {
  return (
    <ConfirmModal
      title="Delete task"
      description="This action will permanently remove the task."
      isOpen={model.isOpen}
      confirmLabel="Delete task"
      isConfirming={model.isConfirming}
      onCancel={model.actions.onCancel}
      onConfirm={model.actions.onConfirm}
    />
  );
}
