import { WorkspaceRole } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { workspaceMemberFindFirstMock, workspaceUpdateMock } = vi.hoisted(() => ({
  workspaceMemberFindFirstMock: vi.fn(),
  workspaceUpdateMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workspaceMember: {
      findFirst: workspaceMemberFindFirstMock,
    },
    workspace: {
      update: workspaceUpdateMock,
    },
  },
}));

import { updateWorkspaceNameBySlugForUserId } from "@/server/services/workspaces";

describe("workspaces authz", () => {
  beforeEach(() => {
    workspaceMemberFindFirstMock.mockReset();
    workspaceUpdateMock.mockReset();
  });

  it("returns not_found when user has no membership", async () => {
    workspaceMemberFindFirstMock.mockResolvedValue(null);

    const result = await updateWorkspaceNameBySlugForUserId("user-1", "workspace-1", "New name");

    expect(result).toEqual({ status: "not_found" });
    expect(workspaceUpdateMock).not.toHaveBeenCalled();
  });

  it("returns forbidden for non-owner member", async () => {
    workspaceMemberFindFirstMock.mockResolvedValue({
      role: WorkspaceRole.MEMBER,
      workspaceId: "workspace-1",
    });

    const result = await updateWorkspaceNameBySlugForUserId("user-1", "workspace-1", "New name");

    expect(result).toEqual({ status: "forbidden" });
    expect(workspaceUpdateMock).not.toHaveBeenCalled();
  });

  it("updates workspace name for owner", async () => {
    workspaceMemberFindFirstMock.mockResolvedValue({
      role: WorkspaceRole.OWNER,
      workspaceId: "workspace-1",
    });
    workspaceUpdateMock.mockResolvedValue({
      id: "workspace-1",
      name: "New name",
      slug: "workspace-1",
    });

    const result = await updateWorkspaceNameBySlugForUserId("user-1", "workspace-1", "New name");

    expect(workspaceUpdateMock).toHaveBeenCalledWith({
      where: { id: "workspace-1" },
      data: { name: "New name" },
    });
    expect(result).toEqual({
      status: "updated",
      workspace: {
        id: "workspace-1",
        name: "New name",
        slug: "workspace-1",
      },
    });
  });
});
