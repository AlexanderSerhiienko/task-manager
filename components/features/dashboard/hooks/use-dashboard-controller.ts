"use client";

import {
  useCreateWorkspaceMutation,
  useWorkspacesQuery,
} from "@/hooks/queries/use-workspaces";
import { ApiClientError } from "@/shared/api-client";
import { WorkspaceMembershipApiItem } from "@/shared/contracts/workspaces";
import { useCallback, useMemo, useState } from "react";

export function useDashboardController() {
  const workspacesQuery = useWorkspacesQuery();
  const createWorkspaceMutation = useCreateWorkspaceMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const submitting = createWorkspaceMutation.isPending;

  const resetCreateModal = useCallback(() => {
    setName("");
    setSlug("");
  }, []);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    if (submitting) {
      return;
    }
    setIsCreateModalOpen(false);
    setSubmitError(null);
  }, [submitting]);

  const onCreateWorkspace = useCallback(async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await createWorkspaceMutation.mutateAsync({
        name: name.trim(),
        slug: slug.trim(),
      });
      resetCreateModal();
      setIsCreateModalOpen(false);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError("Failed to create workspace");
    }
  }, [createWorkspaceMutation, name, resetCreateModal, slug]);

  const workspaces = useMemo(
    () => (workspacesQuery.data ?? []) as WorkspaceMembershipApiItem[],
    [workspacesQuery.data],
  );
  const loading = workspacesQuery.isLoading;
  const errorMessage =
    workspacesQuery.error instanceof ApiClientError
      ? workspacesQuery.error.message
      : workspacesQuery.error
        ? "Failed to load workspaces"
        : null;

  const board = useMemo(
    () => ({
      loading,
      errorMessage,
    }),
    [errorMessage, loading],
  );

  const workspacesList = useMemo(
    () => ({
      workspaces,
    }),
    [workspaces],
  );

  const createModal = useMemo(
    () => ({
      isOpen: isCreateModalOpen,
      values: {
        name,
        slug,
      },
      setters: {
        setName,
        setSlug,
      },
      meta: {
        submitting,
        submitError,
      },
      actions: {
        open: openCreateModal,
        close: closeCreateModal,
        onSubmit: onCreateWorkspace,
      },
    }),
    [
      closeCreateModal,
      isCreateModalOpen,
      name,
      onCreateWorkspace,
      openCreateModal,
      slug,
      submitError,
      submitting,
    ],
  );

  return {
    board,
    workspacesList,
    createModal,
  };
}
