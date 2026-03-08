import { WorkspaceRole } from "@prisma/client";
import { ProjectAccess } from "@/server/services/tasks/types";

type AccessInput = {
  role?: WorkspaceRole;
  userId?: string;
  workspaceId?: string;
  projectId?: string;
};

function makeProjectAccess(input: AccessInput = {}): ProjectAccess {
  return {
    workspaceId: input.workspaceId ?? "workspace-1",
    projectId: input.projectId ?? "project-1",
    userId: input.userId ?? "user-owner",
    role: input.role ?? WorkspaceRole.OWNER,
  };
}

export function ownerAccess(input: AccessInput = {}) {
  return makeProjectAccess({
    ...input,
    role: WorkspaceRole.OWNER,
    userId: input.userId ?? "user-owner",
  });
}

export function memberAccess(input: AccessInput = {}) {
  return makeProjectAccess({
    ...input,
    role: WorkspaceRole.MEMBER,
    userId: input.userId ?? "user-member",
  });
}

export function noMembershipAccess() {
  return null;
}
