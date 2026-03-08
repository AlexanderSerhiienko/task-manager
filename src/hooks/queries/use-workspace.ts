"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api-client";
import { queryKeys } from "@/shared/query-keys";
import {
  WorkspaceApiItem,
  WorkspaceOverviewResponse,
  WorkspaceShellResponse,
} from "@/shared/contracts/workspaces";

type UpdateWorkspaceNameInput = {
  slug: string;
  name: string;
};

export function useWorkspaceShellQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.detail(slug),
    queryFn: () => apiRequest<WorkspaceShellResponse>(`/api/workspaces/${slug}`),
  });
}

export function useWorkspaceOverviewQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.overview(slug),
    queryFn: () => apiRequest<WorkspaceOverviewResponse>(`/api/workspaces/${slug}/overview`),
  });
}

export function useUpdateWorkspaceNameMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, name }: UpdateWorkspaceNameInput) =>
      apiRequest<WorkspaceApiItem>(`/api/workspaces/${slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      }),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.list(),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.detail(variables.slug),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.overview(variables.slug),
        }),
      ]);
    },
  });
}
