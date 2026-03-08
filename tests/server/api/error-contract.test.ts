import { ApiRouteError } from "@/server/api/errors";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireApiUserMock, parseRouteParamsMock, parseJsonBodyMock } = vi.hoisted(() => ({
  requireApiUserMock: vi.fn(),
  parseRouteParamsMock: vi.fn(),
  parseJsonBodyMock: vi.fn(),
}));

const { getWorkspaceBySlugForUserIdMock, updateWorkspaceNameBySlugForUserIdMock, assignTaskByProjectForUserMock } =
  vi.hoisted(() => ({
    getWorkspaceBySlugForUserIdMock: vi.fn(),
    updateWorkspaceNameBySlugForUserIdMock: vi.fn(),
    assignTaskByProjectForUserMock: vi.fn(),
  }));

vi.mock("@/server/api/validation", () => ({
  requireApiUser: requireApiUserMock,
  parseRouteParams: parseRouteParamsMock,
  parseJsonBody: parseJsonBodyMock,
  parseIsoDateOrNull: vi.fn(),
}));

vi.mock("@/server/services/workspaces", () => ({
  getWorkspaceBySlugForUserId: getWorkspaceBySlugForUserIdMock,
  updateWorkspaceNameBySlugForUserId: updateWorkspaceNameBySlugForUserIdMock,
}));

vi.mock("@/server/services/tasks", () => ({
  assignTaskByProjectForUser: assignTaskByProjectForUserMock,
}));

import { PATCH as patchWorkspace } from "@/app/api/workspaces/[slug]/route";
import { PATCH as patchTaskAssignee } from "@/app/api/workspaces/[slug]/projects/[projectId]/tasks/[taskId]/assignee/route";

describe("API error contract", () => {
  beforeEach(() => {
    requireApiUserMock.mockReset();
    parseRouteParamsMock.mockReset();
    parseJsonBodyMock.mockReset();
    getWorkspaceBySlugForUserIdMock.mockReset();
    updateWorkspaceNameBySlugForUserIdMock.mockReset();
    assignTaskByProjectForUserMock.mockReset();

    requireApiUserMock.mockResolvedValue({ id: "user-1" });
    parseRouteParamsMock.mockResolvedValue({
      slug: "workspace-1",
      projectId: "project-1",
      taskId: "task-1",
    });
    parseJsonBodyMock.mockResolvedValue({
      name: "New name",
      assigneeId: "user-2",
    });
  });

  it("returns object error payload for workspace forbidden", async () => {
    updateWorkspaceNameBySlugForUserIdMock.mockResolvedValue({ status: "forbidden" });

    const response = await patchWorkspace(new Request("http://localhost/api/workspaces/workspace-1"), {
      params: Promise.resolve({ slug: "workspace-1" }),
    });
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json).toEqual({
      error: {
        code: "FORBIDDEN",
        message: "Only owner can update workspace settings",
        details: null,
      },
    });
  });

  it("returns object error payload for workspace not found", async () => {
    updateWorkspaceNameBySlugForUserIdMock.mockResolvedValue({ status: "not_found" });

    const response = await patchWorkspace(new Request("http://localhost/api/workspaces/workspace-1"), {
      params: Promise.resolve({ slug: "workspace-1" }),
    });
    const json = await response.json();

    expect(response.status).toBe(404);
    expect(json.error.code).toBe("NOT_FOUND");
    expect(json.error.message).toBe("Workspace not found");
    expect(json.error.details).toBeNull();
  });

  it("maps thrown ApiRouteError into stable contract", async () => {
    parseJsonBodyMock.mockRejectedValue(
      new ApiRouteError(400, "VALIDATION_ERROR", "Invalid request body", { fieldErrors: { name: ["Required"] } }),
    );

    const response = await patchWorkspace(new Request("http://localhost/api/workspaces/workspace-1"), {
      params: Promise.resolve({ slug: "workspace-1" }),
    });
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: { fieldErrors: { name: ["Required"] } },
      },
    });
  });

  it("returns object error payload for forbidden assignee", async () => {
    assignTaskByProjectForUserMock.mockResolvedValue({ status: "forbidden_assignee" });

    const response = await patchTaskAssignee(
      new Request("http://localhost/api/workspaces/workspace-1/projects/project-1/tasks/task-1/assignee"),
      {
        params: Promise.resolve({ slug: "workspace-1", projectId: "project-1", taskId: "task-1" }),
      },
    );
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.error.code).toBe("FORBIDDEN");
    expect(json.error.message).toContain("Member can assign task only to self");
    expect(json.error.details).toBeNull();
  });

  it("returns object error payload for assignee_not_member", async () => {
    assignTaskByProjectForUserMock.mockResolvedValue({ status: "assignee_not_member" });

    const response = await patchTaskAssignee(
      new Request("http://localhost/api/workspaces/workspace-1/projects/project-1/tasks/task-1/assignee"),
      {
        params: Promise.resolve({ slug: "workspace-1", projectId: "project-1", taskId: "task-1" }),
      },
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.code).toBe("BAD_REQUEST");
    expect(json.error.message).toBe("Assignee must be a workspace member");
    expect(json.error.details).toBeNull();
  });
});
