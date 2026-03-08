import { Prisma } from "@prisma/client";
import { UpdateTaskInput } from "@/server/services/tasks/types";

export function buildTaskUpdateData(data: UpdateTaskInput): Prisma.TaskUpdateInput {
  return {
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
  };
}
