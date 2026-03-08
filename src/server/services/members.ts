import { getWorkspaceMembershipAccess, hasAnyRole } from "@/server/access-control";
import { prisma } from "@/lib/prisma";
import { Prisma, WorkspaceRole } from "@prisma/client";

export async function listWorkspaceMembersBySlugForUser(userId: string, slug: string) {
  const membership = await getWorkspaceMembershipAccess(userId, slug);

  if (!membership) {
    return null;
  }

  const members = await prisma.workspaceMember.findMany({
    where: {
      workspaceId: membership.workspaceId,
    },
    select: {
      id: true,
      workspaceId: true,
      userId: true,
      role: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
  });

  return {
    role: membership.role,
    currentUserId: userId,
    members,
  };
}

export async function addWorkspaceMemberBySlugForUser(userId: string, slug: string, email: string) {
  const membership = await getWorkspaceMembershipAccess(userId, slug);

  if (!membership) {
    return { status: "not_found" as const };
  }

  if (!hasAnyRole(membership.role, [WorkspaceRole.OWNER])) {
    return { status: "forbidden" as const };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return { status: "user_not_found" as const };
  }

  const existingMembership = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: membership.workspaceId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (existingMembership) {
    return { status: "already_member" as const };
  }

  let createdMembership: {
    id: string;
    workspaceId: string;
    userId: string;
    role: WorkspaceRole;
    joinedAt: Date;
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
    };
  };

  try {
    createdMembership = await prisma.workspaceMember.create({
      data: {
        workspaceId: membership.workspaceId,
        userId: user.id,
        role: WorkspaceRole.MEMBER,
      },
      select: {
        id: true,
        workspaceId: true,
        userId: true,
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "already_member" as const };
    }

    throw error;
  }

  return {
    status: "ok" as const,
    member: createdMembership,
  };
}

export async function removeWorkspaceMemberBySlugForUser(
  userId: string,
  slug: string,
  memberUserId: string,
) {
  const membership = await getWorkspaceMembershipAccess(userId, slug);

  if (!membership) {
    return { status: "not_found" as const };
  }

  if (!hasAnyRole(membership.role, [WorkspaceRole.OWNER])) {
    return { status: "forbidden" as const };
  }

  const memberToRemove = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: membership.workspaceId,
      userId: memberUserId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!memberToRemove) {
    return { status: "member_not_found" as const };
  }

  if (memberToRemove.role === WorkspaceRole.OWNER) {
    return { status: "cannot_remove_owner" as const };
  }

  await prisma.workspaceMember.delete({
    where: {
      id: memberToRemove.id,
    },
  });

  return { status: "ok" as const };
}
