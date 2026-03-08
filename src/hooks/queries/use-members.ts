"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/shared/api-client";
import { queryKeys } from "@/shared/query-keys";
import { WorkspaceMemberApiItem, WorkspaceMembersResponse } from "@/shared/contracts/workspaces";

type AddMemberInput = {
  slug: string;
  email: string;
};

type RemoveMemberInput = {
  slug: string;
  userId: string;
};

export function useMembersQuery(slug: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.members(slug),
    queryFn: () => apiRequest<WorkspaceMembersResponse>(`/api/workspaces/${slug}/members`),
  });
}

export function useAddMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, email }: AddMemberInput) =>
      apiRequest<WorkspaceMemberApiItem>(`/api/workspaces/${slug}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }),
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.members(variables.slug),
      });
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, userId }: RemoveMemberInput) =>
      apiRequest<null>(`/api/workspaces/${slug}/members/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: (_data, variables) => {
      return queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.members(variables.slug),
      });
    },
  });
}
