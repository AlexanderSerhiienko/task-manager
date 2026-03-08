import {
  getProjectInWorkspace,
  getWorkspaceMembershipAccess,
  hasAnyRole,
  isWorkspaceMember,
} from "@/server/access-control";
import { ProjectAccess } from "@/server/services/tasks/types";
import { WorkspaceRole } from "@prisma/client";

export async function getProjectAccessBySlugForUser(
  userId: string,
  slug: string,
  projectId: string,
): Promise<ProjectAccess | null> {
  const membership = await getWorkspaceMembershipAccess(userId, slug);

  if (!membership) {
    return null;
  }

  const project = await getProjectInWorkspace(membership.workspaceId, projectId);

  if (!project) {
    return null;
  }

  return {
    workspaceId: membership.workspaceId,
    role: membership.role,
    projectId: project.id,
    userId,
  };
}

export function memberCannotAssign(access: ProjectAccess, assigneeId: string | null | undefined) {
  return hasAnyRole(access.role, [WorkspaceRole.MEMBER]) && assigneeId !== access.userId;
}

export function memberCannotReassignTask(
  access: ProjectAccess,
  currentAssigneeId: string | null,
  nextAssigneeId: string | null,
) {
  if (!hasAnyRole(access.role, [WorkspaceRole.MEMBER])) {
    return false;
  }

  if (nextAssigneeId === access.userId) {
    return false;
  }

  if (nextAssigneeId === null && currentAssigneeId === access.userId) {
    return false;
  }

  return true;
}

export async function assigneeIsWorkspaceMember(workspaceId: string, assigneeId: string) {
  return isWorkspaceMember(workspaceId, assigneeId);
}
