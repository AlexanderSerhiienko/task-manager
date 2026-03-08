"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api-client";
import { queryKeys } from "@/shared/query-keys";
import { WorkspaceApiItem, WorkspaceMembershipApiItem } from "@/shared/contracts/workspaces";

type CreateWorkspaceInput = {
  name: string;
  slug: string;
};

export function useWorkspacesQuery() {
  return useQuery({
    queryKey: queryKeys.workspaces.list(),
    queryFn: () => apiRequest<WorkspaceMembershipApiItem[]>("/api/workspaces"),
  });
}

export function useCreateWorkspaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) =>
      apiRequest<WorkspaceApiItem>("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.list(),
      });
    },
  });
}
