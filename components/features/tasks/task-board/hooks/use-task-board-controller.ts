"use client";

import {
  useAssignTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from "@/hooks/queries/use-tasks";
import { ApiClientError } from "@/shared/api-client";
import {
  TASK_STATUSES,
  TaskApiItem,
  TaskMemberApiItem,
  TaskStatus,
} from "@/shared/contracts/tasks";
import { useCallback, useMemo, useState } from "react";

type Props = {
  slug: string;
  projectId: string;
};

export function useTaskBoardController({ slug, projectId }: Props) {
  const tasksQuery = useTasksQuery(slug, projectId);
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const updateTaskStatusMutation = useUpdateTaskStatusMutation();
  const assignTaskMutation = useAssignTaskMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createStatus, setCreateStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");
  const [ownerAssigneeId, setOwnerAssigneeId] = useState("");
  const [assignToMeOnCreate, setAssignToMeOnCreate] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<string | null>(null);
  const [updatingStatusTaskId, setUpdatingStatusTaskId] = useState<string | null>(null);
  const [updatingAssigneeTaskId, setUpdatingAssigneeTaskId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const tasks = useMemo(() => tasksQuery.data?.tasks ?? [], [tasksQuery.data?.tasks]);
  const members = useMemo(
    () => (tasksQuery.data?.members ?? []) as TaskMemberApiItem[],
    [tasksQuery.data?.members],
  );
  const role = tasksQuery.data?.role ?? null;
  const currentUserId = tasksQuery.data?.currentUserId ?? null;

  const loading = tasksQuery.isLoading;
  const loadingError =
    tasksQuery.error instanceof ApiClientError
      ? tasksQuery.error.message
      : tasksQuery.error
        ? "Failed to load tasks"
        : null;

  const statusOrder = useMemo(() => [...TASK_STATUSES] as TaskStatus[], []);
  const groupedTasks = useMemo(() => {
    const groups: Record<TaskStatus, TaskApiItem[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };

    for (const task of tasks) {
      groups[task.status].push(task);
    }

    return groups;
  }, [tasks]);

  const isOwner = role === "OWNER";
  const submitting = createTaskMutation.isPending;
  const isDeleteConfirming = deleteTaskMutation.isPending;

  const resetCreateModal = useCallback(() => {
    setTitle("");
    setDescription("");
    setCreateStatus("TODO");
    setDueDate("");
    setOwnerAssigneeId("");
    setAssignToMeOnCreate(false);
  }, []);

  const onCreateTask = useCallback(async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      const assigneeId = isOwner
        ? ownerAssigneeId || null
        : assignToMeOnCreate && currentUserId
          ? currentUserId
          : null;

      await createTaskMutation.mutateAsync({
        slug,
        projectId,
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
        assigneeId,
        status: createStatus,
      });
      resetCreateModal();
      setIsCreateModalOpen(false);
    } catch (error) {
      if (error instanceof ApiClientError) {
        setSubmitError(error.message);
        return;
      }
      setSubmitError("Failed to create task");
    }
  }, [
    assignToMeOnCreate,
    createTaskMutation,
    createStatus,
    currentUserId,
    description,
    dueDate,
    isOwner,
    ownerAssigneeId,
    projectId,
    resetCreateModal,
    slug,
    title,
  ]);

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

  const onStartEdit = useCallback((task: TaskApiItem) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingDescription(task.description ?? "");
    setEditingDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
    setEditError(null);
  }, []);

  const onSaveTask = useCallback(async () => {
    if (!editingTaskId) {
      return;
    }

    setUpdatingTaskId(editingTaskId);
    setEditError(null);
    try {
      await updateTaskMutation.mutateAsync({
        slug,
        projectId,
        taskId: editingTaskId,
        title: editingTitle.trim(),
        description: editingDescription.trim() || null,
        dueDate: editingDueDate || null,
      });
      setEditingTaskId(null);
      setEditingTitle("");
      setEditingDescription("");
      setEditingDueDate("");
    } catch (error) {
      if (error instanceof ApiClientError) {
        setEditError(error.message);
        return;
      }
      setEditError("Failed to update task");
    } finally {
      setUpdatingTaskId(null);
    }
  }, [
    editingDescription,
    editingDueDate,
    editingTaskId,
    editingTitle,
    projectId,
    slug,
    updateTaskMutation,
  ]);

  const closeEditModal = useCallback(() => {
    if (updatingTaskId !== null) {
      return;
    }
    setEditingTaskId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingDueDate("");
    setEditError(null);
  }, [updatingTaskId]);

  const onDeleteTask = useCallback(async (taskId: string) => {
    setDeletingTaskId(taskId);
    setActionError(null);
    try {
      await deleteTaskMutation.mutateAsync({
        slug,
        projectId,
        taskId,
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setActionError(error.message);
      } else {
        setActionError("Failed to delete task");
      }
    } finally {
      setDeletingTaskId(null);
      setConfirmDeleteTaskId(null);
    }
  }, [deleteTaskMutation, projectId, slug]);

  const onChangeTaskStatus = useCallback(async (taskId: string, status: TaskStatus) => {
    setUpdatingStatusTaskId(taskId);
    setActionError(null);
    try {
      await updateTaskStatusMutation.mutateAsync({
        slug,
        projectId,
        taskId,
        status,
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setActionError(error.message);
      } else {
        setActionError("Failed to update status");
      }
    } finally {
      setUpdatingStatusTaskId(null);
    }
  }, [projectId, slug, updateTaskStatusMutation]);

  const onAssignTask = useCallback(async (taskId: string, assigneeId: string | null) => {
    setUpdatingAssigneeTaskId(taskId);
    setActionError(null);
    try {
      await assignTaskMutation.mutateAsync({
        slug,
        projectId,
        taskId,
        assigneeId,
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        setActionError(error.message);
      } else {
        setActionError("Failed to assign task");
      }
    } finally {
      setUpdatingAssigneeTaskId(null);
    }
  }, [assignTaskMutation, projectId, slug]);

  const onAskDeleteTask = useCallback((taskId: string) => {
    setConfirmDeleteTaskId(taskId);
  }, []);

  const onCancelDeleteTask = useCallback(() => {
    if (isDeleteConfirming) {
      return;
    }
    setConfirmDeleteTaskId(null);
  }, [isDeleteConfirming]);

  const onConfirmDeleteTask = useCallback(() => {
    if (!confirmDeleteTaskId) {
      return;
    }
    void onDeleteTask(confirmDeleteTaskId);
  }, [confirmDeleteTaskId, onDeleteTask]);

  const board = useMemo(() => ({
    loading,
    loadingError,
    actionError,
    statusOrder,
    groupedTasks,
  }), [actionError, groupedTasks, loading, loadingError, statusOrder]);

  const taskStatus = useMemo(() => ({
    statusOrder,
    isOwner,
    members,
    currentUserId,
    deletingTaskId,
    updatingStatusTaskId,
    updatingAssigneeTaskId,
    actions: {
      onStartEdit,
      onAskDelete: onAskDeleteTask,
      onChangeStatus: onChangeTaskStatus,
      onAssign: onAssignTask,
    },
  }), [
    currentUserId,
    deletingTaskId,
    isOwner,
    members,
    statusOrder,
    onAskDeleteTask,
    onAssignTask,
    onChangeTaskStatus,
    onStartEdit,
    updatingAssigneeTaskId,
    updatingStatusTaskId,
  ]);

  const createModal = useMemo(() => ({
    isOpen: isCreateModalOpen,
    values: {
      title,
      description,
      status: createStatus,
      dueDate,
      ownerAssigneeId,
      assignToMeOnCreate,
    },
    setters: {
      setTitle,
      setDescription,
      setStatus: setCreateStatus,
      setDueDate,
      setOwnerAssigneeId,
      setAssignToMeOnCreate,
    },
    meta: {
      isOwner,
      members,
      submitting,
      submitError,
    },
    actions: {
      open: openCreateModal,
      close: closeCreateModal,
      onSubmit: onCreateTask,
    },
  }), [
    assignToMeOnCreate,
    closeCreateModal,
    description,
    createStatus,
    dueDate,
    isCreateModalOpen,
    isOwner,
    members,
    onCreateTask,
    openCreateModal,
    ownerAssigneeId,
    submitError,
    submitting,
    title,
  ]);

  const taskEdit = useMemo(() => ({
    isOpen: editingTaskId !== null,
    values: {
      title: editingTitle,
      description: editingDescription,
      dueDate: editingDueDate,
    },
    setters: {
      setTitle: setEditingTitle,
      setDescription: setEditingDescription,
      setDueDate: setEditingDueDate,
    },
    meta: {
      updatingTaskId,
      editError,
    },
    actions: {
      close: closeEditModal,
      onSubmit: onSaveTask,
    },
  }), [
    closeEditModal,
    editError,
    editingDescription,
    editingDueDate,
    editingTaskId,
    editingTitle,
    onSaveTask,
    updatingTaskId,
  ]);

  const deleteConfirm = useMemo(() => ({
    isOpen: confirmDeleteTaskId !== null,
    taskId: confirmDeleteTaskId,
    isConfirming: isDeleteConfirming,
    actions: {
      onCancel: onCancelDeleteTask,
      onConfirm: onConfirmDeleteTask,
    },
  }), [
    confirmDeleteTaskId,
    isDeleteConfirming,
    onCancelDeleteTask,
    onConfirmDeleteTask,
  ]);

  return {
    board,
    taskStatus,
    createModal,
    taskEdit,
    deleteConfirm,
  };
}
