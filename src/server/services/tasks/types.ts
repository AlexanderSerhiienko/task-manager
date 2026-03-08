import { TaskStatus, WorkspaceRole } from "@prisma/client";

export type ProjectAccess = {
  workspaceId: string;
  role: WorkspaceRole;
  projectId: string;
  userId: string;
};

export type CreateTaskInput = {
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  assigneeId?: string | null;
  status?: TaskStatus;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string | null;
  dueDate?: Date | null;
};

export type CreateTaskResult =
  | { status: "not_found" }
  | { status: "forbidden_assignee" }
  | { status: "assignee_not_member" }
  | { status: "ok"; task: unknown };

export type UpdateTaskResult =
  | { status: "not_found" }
  | { status: "task_not_found" }
  | { status: "ok"; task: unknown };

export type DeleteTaskResult =
  | { status: "not_found" }
  | { status: "task_not_found" }
  | { status: "ok" };

export type UpdateStatusResult = UpdateTaskResult;
export type AssignTaskResult =
  | { status: "not_found" }
  | { status: "task_not_found" }
  | { status: "forbidden_assignee" }
  | { status: "assignee_not_member" }
  | { status: "ok"; task: unknown };

export type UpdateStatusInput = {
  status: TaskStatus;
};
