"use client";

import {
  useAddMemberMutation,
  useMembersQuery,
  useRemoveMemberMutation,
} from "@/hooks/queries/use-members";
import { ApiClientError } from "@/shared/api-client";
import { useCallback, useMemo, useState } from "react";

type Props = {
  slug: string;
};

export function useMembersController({ slug }: Props) {
  const membersQuery = useMembersQuery(slug);
  const addMemberMutation = useAddMemberMutation();
  const removeMemberMutation = useRemoveMemberMutation();

  const [email, setEmail] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [confirmRemoveUserId, setConfirmRemoveUserId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const loading = membersQuery.isLoading;
  const members = useMemo(
    () => membersQuery.data?.members ?? [],
    [membersQuery.data?.members],
  );
  const role = membersQuery.data?.role ?? null;
  const currentUserId = membersQuery.data?.currentUserId ?? null;
  const loadingError =
    membersQuery.error instanceof ApiClientError
      ? membersQuery.error.message
      : membersQuery.error
        ? "Failed to load members"
        : null;
  const submitting = addMemberMutation.isPending;
  const isOwner = role === "OWNER";
  const isRemoveConfirming = removeMemberMutation.isPending;

  const resetAddModal = useCallback(() => {
    setEmail("");
  }, []);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    if (submitting) {
      return;
    }
    setIsAddModalOpen(false);
    setSubmitError(null);
  }, [submitting]);

  const onAddMember = useCallback(async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await addMemberMutation.mutateAsync({
        slug,
        email: email.trim().toLowerCase(),
      });
      resetAddModal();
      setIsAddModalOpen(false);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError("Failed to add member");
    }
  }, [addMemberMutation, email, resetAddModal, slug]);

  const onRemoveMember = useCallback(async (userId: string) => {
    setDeletingUserId(userId);
    setRemoveError(null);
    try {
      await removeMemberMutation.mutateAsync({
        slug,
        userId,
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setRemoveError(error.message);
      } else {
        setRemoveError("Failed to remove member");
      }
    } finally {
      setDeletingUserId(null);
      setConfirmRemoveUserId(null);
    }
  }, [removeMemberMutation, slug]);

  const onAskRemoveMember = useCallback((userId: string) => {
    setConfirmRemoveUserId(userId);
  }, []);

  const onCancelRemoveMember = useCallback(() => {
    if (isRemoveConfirming) {
      return;
    }
    setConfirmRemoveUserId(null);
  }, [isRemoveConfirming]);

  const onConfirmRemoveMember = useCallback(() => {
    if (!confirmRemoveUserId) {
      return;
    }
    void onRemoveMember(confirmRemoveUserId);
  }, [confirmRemoveUserId, onRemoveMember]);

  const board = useMemo(() => ({
    loading,
    loadingError,
    removeError,
    isOwner,
  }), [isOwner, loading, loadingError, removeError]);

  const membersList = useMemo(() => ({
    members,
    currentUserId,
    isOwner,
    deletingUserId,
    actions: {
      onAskRemove: onAskRemoveMember,
    },
  }), [currentUserId, deletingUserId, isOwner, members, onAskRemoveMember]);

  const addModal = useMemo(() => ({
    isOpen: isAddModalOpen,
    values: {
      email,
    },
    setters: {
      setEmail,
    },
    meta: {
      submitting,
      submitError,
    },
    actions: {
      open: openAddModal,
      close: closeAddModal,
      onSubmit: onAddMember,
    },
  }), [
    closeAddModal,
    email,
    isAddModalOpen,
    onAddMember,
    openAddModal,
    submitError,
    submitting,
  ]);

  const removeConfirm = useMemo(() => ({
    isOpen: confirmRemoveUserId !== null,
    userId: confirmRemoveUserId,
    isConfirming: isRemoveConfirming,
    actions: {
      onCancel: onCancelRemoveMember,
      onConfirm: onConfirmRemoveMember,
    },
  }), [
    confirmRemoveUserId,
    isRemoveConfirming,
    onCancelRemoveMember,
    onConfirmRemoveMember,
  ]);

  return {
    board,
    membersList,
    addModal,
    removeConfirm,
  };
}
