import {
  getProjectInWorkspace,
  getWorkspaceMembershipAccess,
  hasAnyRole,
} from "@/server/access-control";
import { prisma } from "@/lib/prisma";
import { WorkspaceRole } from "@prisma/client";

type WorkspaceAccess = {
  workspaceId: string;
  role: WorkspaceRole;
};

async function getWorkspaceAccessBySlug(userId: string, slug: string): Promise<WorkspaceAccess | null> {
  const membership = await getWorkspaceMembershipAccess(userId, slug);

  if (!membership) {
    return null;
  }

  return {
    workspaceId: membership.workspaceId,
    role: membership.role,
  };
}

export async function listProjectsByWorkspaceSlugForUser(userId: string, slug: string) {
  const access = await getWorkspaceAccessBySlug(userId, slug);

  if (!access) {
    return null;
  }

  const projects = await prisma.project.findMany({
    where: {
      workspaceId: access.workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    role: access.role,
    projects,
  };
}

export async function createProjectByWorkspaceSlugForUser(
  userId: string,
  slug: string,
  data: { name: string; description?: string | null },
) {
  const access = await getWorkspaceAccessBySlug(userId, slug);

  if (!access) {
    return { status: "not_found" as const };
  }

  if (!hasAnyRole(access.role, [WorkspaceRole.OWNER])) {
    return { status: "forbidden" as const };
  }

  const project = await prisma.project.create({
    data: {
      workspaceId: access.workspaceId,
      createdById: userId,
      name: data.name,
      description: data.description ?? null,
    },
  });

  return {
    status: "ok" as const,
    project,
  };
}

export async function getProjectByWorkspaceSlugForUser(userId: string, slug: string, projectId: string) {
  const access = await getWorkspaceAccessBySlug(userId, slug);

  if (!access) {
    return null;
  }

  const projectInWorkspace = await getProjectInWorkspace(access.workspaceId, projectId);

  if (!projectInWorkspace) {
    return null;
  }

  return prisma.project.findUnique({
    where: {
      id: projectInWorkspace.id,
    },
  });
}

export async function updateProjectByWorkspaceSlugForUser(
  userId: string,
  slug: string,
  projectId: string,
  data: { name?: string; description?: string | null },
) {
  const access = await getWorkspaceAccessBySlug(userId, slug);

  if (!access) {
    return { status: "not_found" as const };
  }

  if (!hasAnyRole(access.role, [WorkspaceRole.OWNER])) {
    return { status: "forbidden" as const };
  }

  const existingProject = await getProjectInWorkspace(access.workspaceId, projectId);

  if (!existingProject) {
    return { status: "project_not_found" as const };
  }

  const project = await prisma.project.update({
    where: {
      id: existingProject.id,
    },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    },
  });

  return {
    status: "ok" as const,
    project,
  };
}

export async function deleteProjectByWorkspaceSlugForUser(userId: string, slug: string, projectId: string) {
  const access = await getWorkspaceAccessBySlug(userId, slug);

  if (!access) {
    return { status: "not_found" as const };
  }

  if (!hasAnyRole(access.role, [WorkspaceRole.OWNER])) {
    return { status: "forbidden" as const };
  }

  const existingProject = await getProjectInWorkspace(access.workspaceId, projectId);

  if (!existingProject) {
    return { status: "project_not_found" as const };
  }

  await prisma.project.delete({
    where: {
      id: existingProject.id,
    },
  });

  return { status: "ok" as const };
}
