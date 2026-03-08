import { beforeEach, describe, expect, it, vi } from "vitest";

type WorkspaceRecord = {
  id: string;
  slug: string;
  name: string;
  createdById: string;
};

type ProjectRecord = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  createdById: string;
};

type TaskRecord = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId: string | null;
  createdById: string;
  dueDate: Date | null;
};

const db = vi.hoisted(() => ({
  workspaces: [] as WorkspaceRecord[],
  projects: [] as ProjectRecord[],
  tasks: [] as TaskRecord[],
}));

vi.mock("@/server/api/validation", () => ({
  requireApiUser: vi.fn(async () => ({ id: "user-owner" })),
  parseRouteParams: vi.fn(async (params: Promise<unknown>) => params),
  parseJsonBody: vi.fn(async (request: Request) => request.json()),
  parseIsoDateOrNull: vi.fn((value: string | null | undefined) => {
    if (value === undefined) {
      return undefined;
    }
    if (value === null || value.length === 0) {
      return null;
    }
    return new Date(value);
  }),
}));

vi.mock("@/server/services/workspaces", () => ({
  listWorkspacesByUserId: vi.fn(async (userId: string) =>
    db.workspaces.filter((workspace) => workspace.createdById === userId),
  ),
  createWorkspaceByUserId: vi.fn(async (userId: string, data: { name: string; slug: string }) => {
    const workspace: WorkspaceRecord = {
      id: `workspace-${db.workspaces.length + 1}`,
      name: data.name,
      slug: data.slug,
      createdById: userId,
    };
    db.workspaces.push(workspace);
    return workspace;
  }),
}));

vi.mock("@/server/services/projects", () => ({
  listProjectsByWorkspaceSlugForUser: vi.fn(async (_userId: string, slug: string) => {
    const workspace = db.workspaces.find((item) => item.slug === slug);
    if (!workspace) {
      return null;
    }
    return {
      role: "OWNER",
      projects: db.projects.filter((project) => project.workspaceId === workspace.id),
    };
  }),
  createProjectByWorkspaceSlugForUser: vi.fn(
    async (_userId: string, slug: string, data: { name: string; description: string | null }) => {
      const workspace = db.workspaces.find((item) => item.slug === slug);
      if (!workspace) {
        return { status: "not_found" as const };
      }
      const project: ProjectRecord = {
        id: `project-${db.projects.length + 1}`,
        workspaceId: workspace.id,
        createdById: "user-owner",
        name: data.name,
        description: data.description ?? null,
      };
      db.projects.push(project);
      return { status: "ok" as const, project };
    },
  ),
}));

vi.mock("@/server/services/tasks", () => ({
  listTasksByProjectForUser: vi.fn(async (_userId: string, _slug: string, projectId: string) => {
    const project = db.projects.find((item) => item.id === projectId);
    if (!project) {
      return null;
    }
    return {
      role: "OWNER",
      currentUserId: "user-owner",
      tasks: db.tasks.filter((task) => task.projectId === projectId),
      members: [],
    };
  }),
  createTaskByProjectForUser: vi.fn(
    async (
      _userId: string,
      _slug: string,
      projectId: string,
      data: {
        title: string;
        description: string | null;
        dueDate: Date | null;
        assigneeId: string | null;
        status?: "TODO" | "IN_PROGRESS" | "DONE";
      },
    ) => {
      const project = db.projects.find((item) => item.id === projectId);
      if (!project) {
        return { status: "not_found" as const };
      }
      const task: TaskRecord = {
        id: `task-${db.tasks.length + 1}`,
        projectId,
        createdById: "user-owner",
        title: data.title,
        description: data.description ?? null,
        dueDate: data.dueDate ?? null,
        assigneeId: data.assigneeId ?? null,
        status: data.status ?? "TODO",
      };
      db.tasks.push(task);
      return { status: "ok" as const, task };
    },
  ),
  updateTaskStatusByProjectForUser: vi.fn(
    async (_userId: string, _slug: string, projectId: string, taskId: string, status: TaskRecord["status"]) => {
      const task = db.tasks.find((item) => item.projectId === projectId && item.id === taskId);
      if (!task) {
        return { status: "task_not_found" as const };
      }
      task.status = status;
      return { status: "ok" as const, task };
    },
  ),
  assignTaskByProjectForUser: vi.fn(
    async (_userId: string, _slug: string, projectId: string, taskId: string, assigneeId: string | null) => {
      const task = db.tasks.find((item) => item.projectId === projectId && item.id === taskId);
      if (!task) {
        return { status: "task_not_found" as const };
      }
      task.assigneeId = assigneeId;
      return { status: "ok" as const, task };
    },
  ),
}));

import { POST as postWorkspace } from "@/app/api/workspaces/route";
import { POST as postProject } from "@/app/api/workspaces/[slug]/projects/route";
import { POST as postTask } from "@/app/api/workspaces/[slug]/projects/[projectId]/tasks/route";
import { PATCH as patchTaskStatus } from "@/app/api/workspaces/[slug]/projects/[projectId]/tasks/[taskId]/status/route";
import { PATCH as patchTaskAssignee } from "@/app/api/workspaces/[slug]/projects/[projectId]/tasks/[taskId]/assignee/route";

describe("API workflow integration", () => {
  beforeEach(() => {
    db.workspaces.length = 0;
    db.projects.length = 0;
    db.tasks.length = 0;
  });

  it("creates workspace -> project -> task and updates status/assignee", async () => {
    const workspaceResponse = await postWorkspace(
      new Request("http://localhost/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Workspace A",
          slug: "workspace-a",
        }),
      }),
    );
    const workspace = await workspaceResponse.json();
    expect(workspaceResponse.status).toBe(201);
    expect(workspace.slug).toBe("workspace-a");

    const projectResponse = await postProject(
      new Request("http://localhost/api/workspaces/workspace-a/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Project A",
          description: "Main project",
        }),
      }),
      { params: Promise.resolve({ slug: "workspace-a" }) },
    );
    const project = await projectResponse.json();
    expect(projectResponse.status).toBe(201);
    expect(project.name).toBe("Project A");

    const taskResponse = await postTask(
      new Request(`http://localhost/api/workspaces/workspace-a/projects/${project.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Task A",
          description: "Task details",
          status: "TODO",
          assigneeId: null,
          dueDate: null,
        }),
      }),
      { params: Promise.resolve({ slug: "workspace-a", projectId: project.id }) },
    );
    const task = await taskResponse.json();
    expect(taskResponse.status).toBe(201);
    expect(task.title).toBe("Task A");
    expect(task.status).toBe("TODO");

    const statusResponse = await patchTaskStatus(
      new Request(`http://localhost/api/workspaces/workspace-a/projects/${project.id}/tasks/${task.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      }),
      { params: Promise.resolve({ slug: "workspace-a", projectId: project.id, taskId: task.id }) },
    );
    const statusUpdatedTask = await statusResponse.json();
    expect(statusResponse.status).toBe(200);
    expect(statusUpdatedTask.status).toBe("IN_PROGRESS");

    const assigneeResponse = await patchTaskAssignee(
      new Request(`http://localhost/api/workspaces/workspace-a/projects/${project.id}/tasks/${task.id}/assignee`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigneeId: "user-member" }),
      }),
      { params: Promise.resolve({ slug: "workspace-a", projectId: project.id, taskId: task.id }) },
    );
    const assigneeUpdatedTask = await assigneeResponse.json();
    expect(assigneeResponse.status).toBe(200);
    expect(assigneeUpdatedTask.assigneeId).toBe("user-member");

    expect(db.workspaces).toHaveLength(1);
    expect(db.projects).toHaveLength(1);
    expect(db.tasks).toHaveLength(1);
    expect(db.tasks[0]).toMatchObject({
      title: "Task A",
      status: "IN_PROGRESS",
      assigneeId: "user-member",
    });
  });
});
