"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api-client";
import { queryKeys } from "@/shared/query-keys";
import { ProjectApiItem, WorkspaceProjectsResponse } from "@/shared/contracts/workspaces";

type CreateProjectInput = {
  slug: string;
  name: string;
  description: string | null;
};

type UpdateProjectInput = {
  slug: string;
  projectId: string;
  name: string;
  description: string | null;
};

type DeleteProjectInput = {
  slug: string;
  projectId: string;
};

export function useProjectsQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.projects(slug),
    queryFn: () => apiRequest<WorkspaceProjectsResponse>(`/api/workspaces/${slug}/projects`),
  });
}

export function useProjectQuery(slug: string, projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug, projectId),
    queryFn: () => apiRequest<ProjectApiItem>(`/api/workspaces/${slug}/projects/${projectId}`),
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, name, description }: CreateProjectInput) =>
      apiRequest<ProjectApiItem>(`/api/workspaces/${slug}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      }),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.projects(variables.slug),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId, name, description }: UpdateProjectInput) =>
      apiRequest<ProjectApiItem>(`/api/workspaces/${slug}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      }),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.projects(variables.slug),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.projects.detail(variables.slug, variables.projectId),
        }),
      ]);
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, projectId }: DeleteProjectInput) =>
      apiRequest<null>(`/api/workspaces/${slug}/projects/${projectId}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.projects(variables.slug),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}
