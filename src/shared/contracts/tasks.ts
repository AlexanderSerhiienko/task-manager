import { z } from "zod";

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function getTaskStatusLabel(status: TaskStatus) {
  return TASK_STATUS_LABELS[status];
}

export const taskStatusSchema = z.enum(TASK_STATUSES);

export type TaskApiItem = {
  id: string;
  projectId: string;
  createdById: string;
  assigneeId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  assignee: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  } | null;
};

export type TaskMemberApiItem = {
  userId: string;
  role: "OWNER" | "MEMBER";
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
};

export type TasksResponse = {
  role: "OWNER" | "MEMBER";
  currentUserId: string;
  tasks: TaskApiItem[];
  members: TaskMemberApiItem[];
};
