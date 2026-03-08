import { TaskStatus, WorkspaceRole } from "@prisma/client";

type TaskFactoryInput = {
  id?: string;
  projectId?: string;
  assigneeId?: string | null;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
};

export function makeTask(input: TaskFactoryInput = {}) {
  return {
    id: input.id ?? "task-1",
    projectId: input.projectId ?? "project-1",
    createdById: "user-owner",
    assigneeId: input.assigneeId ?? null,
    title: input.title ?? "Task title",
    description: input.description ?? null,
    status: input.status ?? TaskStatus.TODO,
    dueDate: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

export function makeTaskMember(input: { userId?: string; role?: WorkspaceRole } = {}) {
  return {
    id: `${input.userId ?? "user-member"}:workspace-member`,
    workspaceId: "workspace-1",
    userId: input.userId ?? "user-member",
    role: input.role ?? WorkspaceRole.MEMBER,
    joinedAt: new Date("2026-01-01T00:00:00.000Z"),
    user: {
      id: input.userId ?? "user-member",
      email: `${input.userId ?? "user-member"}@example.com`,
      name: input.userId ?? "User Member",
      image: null,
    },
  };
}
