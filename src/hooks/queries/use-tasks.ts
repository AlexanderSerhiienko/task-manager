"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api-client";
import { queryKeys } from "@/shared/query-keys";
import { TaskApiItem, TaskStatus, TasksResponse } from "@/shared/contracts/tasks";

type TasksScope = {
  slug: string;
  projectId: string;
};

type CreateTaskInput = TasksScope & {
  title: string;
  description: string | null;
  dueDate: string | null;
  assigneeId: string | null;
  status: TaskStatus;
};

type UpdateTaskInput = TasksScope & {
  taskId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
};

type DeleteTaskInput = TasksScope & {
  taskId: string;
};

type UpdateTaskStatusInput = TasksScope & {
  taskId: string;
  status: TaskStatus;
};

type AssignTaskInput = TasksScope & {
  taskId: string;
  assigneeId: string | null;
};

export function useTasksQuery(slug: string, projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.tasks(slug, projectId),
    queryFn: () => apiRequest<TasksResponse>(`/api/workspaces/${slug}/projects/${projectId}/tasks`),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId, title, description, dueDate, assigneeId, status }: CreateTaskInput) =>
      apiRequest<TaskApiItem>(`/api/workspaces/${slug}/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          assigneeId,
          status,
        }),
      }),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.tasks(variables.slug, variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId, taskId, title, description, dueDate }: UpdateTaskInput) =>
      apiRequest<TaskApiItem>(
        `/api/workspaces/${slug}/projects/${projectId}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            dueDate,
          }),
        },
      ),
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.projects.tasks(variables.slug, variables.projectId),
      });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId, taskId }: DeleteTaskInput) =>
      apiRequest<null>(`/api/workspaces/${slug}/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.tasks(variables.slug, variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId, taskId, status }: UpdateTaskStatusInput) =>
      apiRequest<TaskApiItem>(
        `/api/workspaces/${slug}/projects/${projectId}/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        },
      ),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.tasks(variables.slug, variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}

export function useAssignTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId, taskId, assigneeId }: AssignTaskInput) =>
      apiRequest<TaskApiItem>(
        `/api/workspaces/${slug}/projects/${projectId}/tasks/${taskId}/assignee`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assigneeId,
          }),
        },
      ),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.tasks(variables.slug, variables.projectId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}
