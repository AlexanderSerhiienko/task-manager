import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WorkspaceRole } from "@prisma/client";

export type WorkspaceMembershipAccess = {
  workspaceId: string;
  role: WorkspaceRole;
};

type SessionIdentity = {
  email: string;
  name: string | null;
  image: string | null;
};

export async function getSessionIdentity(): Promise<SessionIdentity | null> {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  return {
    email: session.user.email,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  };
}

export async function ensureUserFromIdentity(identity: SessionIdentity) {
  return prisma.user.upsert({
    where: {
      email: identity.email,
    },
    update: {
      name: identity.name ?? undefined,
      image: identity.image ?? undefined,
    },
    create: {
      email: identity.email,
      name: identity.name ?? null,
      image: identity.image ?? null,
    },
  });
}

export async function getCurrentUserFromSession() {
  const identity = await getSessionIdentity();

  if (!identity) {
    return null;
  }

  return ensureUserFromIdentity(identity);
}

export async function getWorkspaceMembershipAccess(userId: string, slug: string) {
  return prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: {
        slug,
      },
    },
    select: {
      workspaceId: true,
      role: true,
    },
  });
}

export function hasAnyRole(role: WorkspaceRole, allowedRoles: WorkspaceRole[]) {
  return allowedRoles.includes(role);
}

export async function getProjectInWorkspace(workspaceId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
    select: {
      id: true,
    },
  });
}

export async function isWorkspaceMember(workspaceId: string, userId: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(membership);
}
