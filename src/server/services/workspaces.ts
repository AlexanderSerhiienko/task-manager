import { prisma } from "@/lib/prisma";
import { WorkspaceRole } from "@prisma/client";

export function listWorkspacesByUserId(userId: string) {
  return prisma.workspaceMember.findMany({
    where: {
      userId,
    },
    include: {
      workspace: true,
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
}

export function getWorkspaceBySlugForUserId(userId: string, slug: string) {
  return prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: {
        slug,
      },
    },
    include: {
      workspace: true,
    },
  });
}

export async function createWorkspaceByUserId(
  userId: string,
  data: { name: string; slug: string },
) {
  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        createdById: userId,
      },
    });

    await tx.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: WorkspaceRole.OWNER,
      },
    });

    return workspace;
  });
}

export async function updateWorkspaceNameBySlugForUserId(
  userId: string,
  slug: string,
  name: string,
) {
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: {
        slug,
      },
    },
    select: {
      role: true,
      workspaceId: true,
    },
  });

  if (!membership) {
    return { status: "not_found" as const };
  }

  if (membership.role !== WorkspaceRole.OWNER) {
    return { status: "forbidden" as const };
  }

  const workspace = await prisma.workspace.update({
    where: {
      id: membership.workspaceId,
    },
    data: {
      name,
    },
  });

  return {
    status: "updated" as const,
    workspace,
  };
}

export async function getWorkspaceOverviewBySlugForUserId(userId: string, slug: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: {
        slug,
      },
    },
    select: {
      role: true,
      workspace: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          projects: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  if (!membership) {
    return null;
  }

  const [totalTasks, inProgressTasks, doneTasks] = await prisma.$transaction([
    prisma.task.count({
      where: {
        project: {
          workspaceId: membership.workspace.id,
        },
      },
    }),
    prisma.task.count({
      where: {
        project: {
          workspaceId: membership.workspace.id,
        },
        status: "IN_PROGRESS",
      },
    }),
    prisma.task.count({
      where: {
        project: {
          workspaceId: membership.workspace.id,
        },
        status: "DONE",
      },
    }),
  ]);

  return {
    role: membership.role,
    workspace: membership.workspace,
    totals: {
      projects: membership.workspace.projects.length,
      tasks: totalTasks,
      inProgressTasks,
      doneTasks,
    },
  };
}
