import { WorkspaceRole } from "@prisma/client";

type WorkspaceFactoryInput = {
  id?: string;
  slug?: string;
  name?: string;
  createdById?: string;
};

type WorkspaceMembershipFactoryInput = {
  workspaceId?: string;
  userId?: string;
  role?: WorkspaceRole;
};

export function makeWorkspace(input: WorkspaceFactoryInput = {}) {
  return {
    id: input.id ?? "workspace-1",
    slug: input.slug ?? "workspace-1",
    name: input.name ?? "Workspace 1",
    createdById: input.createdById ?? "user-owner",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

export function makeWorkspaceMembership(input: WorkspaceMembershipFactoryInput = {}) {
  return {
    id: `${input.workspaceId ?? "workspace-1"}:${input.userId ?? "user-owner"}`,
    workspaceId: input.workspaceId ?? "workspace-1",
    userId: input.userId ?? "user-owner",
    role: input.role ?? WorkspaceRole.OWNER,
    joinedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}
