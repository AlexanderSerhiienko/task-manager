"use client";

import { Button } from "@/components/ui/button/button";
import { Modal } from "@/components/ui/modal/modal";

type Props = {
  title: string;
  description: string;
  isOpen: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  title,
  description,
  isOpen,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={isConfirming ? () => {} : onCancel}>
      <div className="space-y-4">
        <p className="text-sm text-zinc-300">{description}</p>
        <div className="mobile-action-stack">
          <Button type="button" onClick={onCancel} disabled={isConfirming} variant="secondary">
            {cancelLabel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isConfirming} variant="danger">
            {isConfirming ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
