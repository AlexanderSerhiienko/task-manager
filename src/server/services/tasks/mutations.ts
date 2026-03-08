import { prisma } from "@/lib/prisma";
import { taskIncludeAssignee } from "@/server/services/tasks/mappers";
import { CreateTaskInput, UpdateTaskInput } from "@/server/services/tasks/types";
import { buildTaskUpdateData } from "@/server/services/tasks/helpers";
import { TaskStatus } from "@prisma/client";

export async function createTask(
  projectId: string,
  userId: string,
  data: CreateTaskInput,
) {
  return prisma.task.create({
    data: {
      projectId,
      createdById: userId,
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ?? null,
      assigneeId: data.assigneeId ?? null,
      status: data.status ?? TaskStatus.TODO,
    },
    include: taskIncludeAssignee,
  });
}

export async function updateTask(taskId: string, data: UpdateTaskInput) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: buildTaskUpdateData(data),
    include: taskIncludeAssignee,
  });
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      status,
    },
    include: taskIncludeAssignee,
  });
}

export async function updateTaskAssignee(taskId: string, assigneeId: string | null) {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      assigneeId,
    },
    include: taskIncludeAssignee,
  });
}

export async function deleteTask(taskId: string) {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
}
