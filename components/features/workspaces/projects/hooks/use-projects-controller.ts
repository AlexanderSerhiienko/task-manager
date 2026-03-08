"use client";

import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useProjectsQuery,
  useUpdateProjectMutation,
} from "@/hooks/queries/use-projects";
import { ApiClientError } from "@/shared/api-client";
import { ProjectApiItem } from "@/shared/contracts/workspaces";
import { useCallback, useMemo, useState } from "react";

type Props = {
  slug: string;
};

export function useProjectsController({ slug }: Props) {
  const projectsQuery = useProjectsQuery(slug);
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loading = projectsQuery.isLoading;
  const projects = useMemo(
    () => projectsQuery.data?.projects ?? [],
    [projectsQuery.data?.projects],
  );
  const role = projectsQuery.data?.role ?? null;
  const loadingError =
    projectsQuery.error instanceof ApiClientError
      ? projectsQuery.error.message
      : projectsQuery.error
        ? "Failed to load projects"
        : null;

  const submitting = createProjectMutation.isPending;
  const updating = updateProjectMutation.isPending;
  const isOwner = role === "OWNER";
  const isDeleteConfirming = deleteProjectMutation.isPending;

  const resetCreateModal = useCallback(() => {
    setName("");
    setDescription("");
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

  const onCreateProject = useCallback(async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await createProjectMutation.mutateAsync({
        slug,
        name: name.trim(),
        description: description.trim() || null,
      });
      resetCreateModal();
      setIsCreateModalOpen(false);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError("Failed to create project");
    }
  }, [createProjectMutation, description, name, resetCreateModal, slug]);

  const onStartEdit = useCallback((project: ProjectApiItem) => {
    setEditingProjectId(project.id);
    setEditingName(project.name);
    setEditingDescription(project.description ?? "");
    setUpdateError(null);
  }, []);

  const onSaveEdit = useCallback(async () => {
    if (!editingProjectId) {
      return;
    }

    setUpdateError(null);
    try {
      await updateProjectMutation.mutateAsync({
        slug,
        projectId: editingProjectId,
        name: editingName.trim(),
        description: editingDescription.trim() || null,
      });
      setEditingProjectId(null);
      setEditingName("");
      setEditingDescription("");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setUpdateError(error.message);
        return;
      }
      setUpdateError("Failed to update project");
    }
  }, [editingDescription, editingName, editingProjectId, slug, updateProjectMutation]);

  const closeEditModal = useCallback(() => {
    if (updating) {
      return;
    }
    setEditingProjectId(null);
    setEditingName("");
    setEditingDescription("");
    setUpdateError(null);
  }, [updating]);

  const onDeleteProject = useCallback(async (projectId: string) => {
    setDeletingProjectId(projectId);
    setDeleteError(null);
    try {
      await deleteProjectMutation.mutateAsync({
        slug,
        projectId,
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setDeleteError(error.message);
      } else {
        setDeleteError("Failed to delete project");
      }
    } finally {
      setDeletingProjectId(null);
      setConfirmDeleteProjectId(null);
    }
  }, [deleteProjectMutation, slug]);

  const onAskDeleteProject = useCallback((projectId: string) => {
    setConfirmDeleteProjectId(projectId);
  }, []);

  const onCancelDeleteProject = useCallback(() => {
    if (isDeleteConfirming) {
      return;
    }
    setConfirmDeleteProjectId(null);
  }, [isDeleteConfirming]);

  const onConfirmDeleteProject = useCallback(() => {
    if (!confirmDeleteProjectId) {
      return;
    }
    void onDeleteProject(confirmDeleteProjectId);
  }, [confirmDeleteProjectId, onDeleteProject]);

  const board = useMemo(() => ({
    loading,
    loadingError,
    isOwner,
    projects,
    deleteError,
  }), [deleteError, isOwner, loading, loadingError, projects]);

  const projectsList = useMemo(() => ({
    slug,
    projects,
    isOwner,
    deletingProjectId,
    actions: {
      onEdit: onStartEdit,
      onAskDelete: onAskDeleteProject,
    },
  }), [deletingProjectId, isOwner, onAskDeleteProject, onStartEdit, projects, slug]);

  const createModal = useMemo(() => ({
    isOpen: isCreateModalOpen,
    values: {
      name,
      description,
    },
    setters: {
      setName,
      setDescription,
    },
    meta: {
      submitting,
      submitError,
    },
    actions: {
      open: openCreateModal,
      close: closeCreateModal,
      onSubmit: onCreateProject,
    },
  }), [
    closeCreateModal,
    description,
    isCreateModalOpen,
    name,
    onCreateProject,
    openCreateModal,
    submitError,
    submitting,
  ]);

  const projectEdit = useMemo(() => ({
    isOpen: editingProjectId !== null,
    values: {
      name: editingName,
      description: editingDescription,
    },
    setters: {
      setName: setEditingName,
      setDescription: setEditingDescription,
    },
    meta: {
      updating,
      updateError,
    },
    actions: {
      close: closeEditModal,
      onSubmit: onSaveEdit,
    },
  }), [
    closeEditModal,
    editingDescription,
    editingName,
    editingProjectId,
    onSaveEdit,
    updateError,
    updating,
  ]);

  const deleteConfirm = useMemo(() => ({
    isOpen: confirmDeleteProjectId !== null,
    projectId: confirmDeleteProjectId,
    isConfirming: isDeleteConfirming,
    actions: {
      onCancel: onCancelDeleteProject,
      onConfirm: onConfirmDeleteProject,
    },
  }), [
    confirmDeleteProjectId,
    isDeleteConfirming,
    onCancelDeleteProject,
    onConfirmDeleteProject,
  ]);

  return {
    board,
    projectsList,
    createModal,
    projectEdit,
    deleteConfirm,
  };
}
