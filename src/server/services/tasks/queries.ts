import { prisma } from "@/lib/prisma";
import {
  taskIncludeAssignee,
  workspaceMemberForTasksSelect,
} from "@/server/services/tasks/mappers";

export async function listTasksAndMembers(projectId: string, workspaceId: string) {
  return Promise.all([
    prisma.task.findMany({
      where: {
        projectId,
      },
      include: taskIncludeAssignee,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      select: workspaceMemberForTasksSelect,
      orderBy: {
        joinedAt: "asc",
      },
    }),
  ]);
}

export async function findTaskInProject(taskId: string, projectId: string) {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
    },
    select: {
      id: true,
      assigneeId: true,
    },
  });
}
