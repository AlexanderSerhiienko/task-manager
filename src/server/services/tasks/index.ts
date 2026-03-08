import {
  assigneeIsWorkspaceMember,
  getProjectAccessBySlugForUser,
  memberCannotAssign,
  memberCannotReassignTask,
} from "@/server/services/tasks/permissions";
import { deleteTask, updateTask, updateTaskAssignee, updateTaskStatus } from "@/server/services/tasks/mutations";
import { createTask } from "@/server/services/tasks/mutations";
import { findTaskInProject, listTasksAndMembers } from "@/server/services/tasks/queries";
import { TaskStatus } from "@prisma/client";
import { CreateTaskInput, UpdateTaskInput } from "@/server/services/tasks/types";

export async function listTasksByProjectForUser(userId: string, slug: string, projectId: string) {
  const access = await getProjectAccessBySlugForUser(userId, slug, projectId);

  if (!access) {
    return null;
  }

  const [tasks, members] = await listTasksAndMembers(access.projectId, access.workspaceId);

  return {
    role: access.role,
    currentUserId: access.userId,
    tasks,
    members,
  };
}

export async function createTaskByProjectForUser(
  userId: string,
  slug: string,
  projectId: string,
  data: CreateTaskInput,
) {
  const access = await getProjectAccessBySlugForUser(userId, slug, projectId);

  if (!access) {
    return { status: "not_found" as const };
  }

  if (data.assigneeId) {
    if (memberCannotAssign(access, data.assigneeId)) {
      return { status: "forbidden_assignee" as const };
    }

    const assigneeMember = await assigneeIsWorkspaceMember(access.workspaceId, data.assigneeId);

    if (!assigneeMember) {
      return { status: "assignee_not_member" as const };
    }
  }

  const task = await createTask(access.projectId, access.userId, data);

  return {
    status: "ok" as const,
    task,
  };
}

export async function updateTaskByProjectForUser(
  userId: string,
  slug: string,
  projectId: string,
  taskId: string,
  data: UpdateTaskInput,
) {
  const access = await getProjectAccessBySlugForUser(userId, slug, projectId);

  if (!access) {
    return { status: "not_found" as const };
  }

  const task = await findTaskInProject(taskId, access.projectId);

  if (!task) {
    return { status: "task_not_found" as const };
  }

  const updatedTask = await updateTask(task.id, data);

  return {
    status: "ok" as const,
    task: updatedTask,
  };
}

export async function deleteTaskByProjectForUser(
  userId: string,
  slug: string,
  projectId: string,
  taskId: string,
) {
  const access = await getProjectAccessBySlugForUser(userId, slug, projectId);

  if (!access) {
    return { status: "not_found" as const };
  }

  const task = await findTaskInProject(taskId, access.projectId);

  if (!task) {
    return { status: "task_not_found" as const };
  }

  await deleteTask(task.id);

  return { status: "ok" as const };
}

export async function updateTaskStatusByProjectForUser(
  userId: string,
  slug: string,
  projectId: string,
  taskId: string,
  status: TaskStatus,
) {
  const access = await getProjectAccessBySlugForUser(userId, slug, projectId);

  if (!access) {
    return { status: "not_found" as const };
  }

  const task = await findTaskInProject(taskId, access.projectId);

  if (!task) {
    return { status: "task_not_found" as const };
  }

  const updatedTask = await updateTaskStatus(task.id, status);

  return {
    status: "ok" as const,
    task: updatedTask,
  };
}

export async function assignTaskByProjectForUser(
  userId: string,
  slug: string,
  projectId: string,
  taskId: string,
  assigneeId: string | null,
) {
  const access = await getProjectAccessBySlugForUser(userId, slug, projectId);

  if (!access) {
    return { status: "not_found" as const };
  }

  const task = await findTaskInProject(taskId, access.projectId);

  if (!task) {
    return { status: "task_not_found" as const };
  }

  if (memberCannotReassignTask(access, task.assigneeId, assigneeId)) {
    return { status: "forbidden_assignee" as const };
  }

  if (assigneeId) {
    const assigneeMember = await assigneeIsWorkspaceMember(access.workspaceId, assigneeId);

    if (!assigneeMember) {
      return { status: "assignee_not_member" as const };
    }
  }

  const updatedTask = await updateTaskAssignee(task.id, assigneeId);

  return {
    status: "ok" as const,
    task: updatedTask,
  };
}
