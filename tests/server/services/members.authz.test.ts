import { WorkspaceRole } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getWorkspaceMembershipAccessMock, workspaceMemberFindFirstMock, workspaceMemberDeleteMock } = vi.hoisted(
  () => ({
    getWorkspaceMembershipAccessMock: vi.fn(),
    workspaceMemberFindFirstMock: vi.fn(),
    workspaceMemberDeleteMock: vi.fn(),
  }),
);

vi.mock("@/server/access-control", () => {
  return {
    getWorkspaceMembershipAccess: getWorkspaceMembershipAccessMock,
    hasAnyRole: (role: WorkspaceRole, allowedRoles: WorkspaceRole[]) => allowedRoles.includes(role),
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    workspaceMember: {
      findFirst: workspaceMemberFindFirstMock,
      delete: workspaceMemberDeleteMock,
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { removeWorkspaceMemberBySlugForUser } from "@/server/services/members";

describe("members authz", () => {
  beforeEach(() => {
    getWorkspaceMembershipAccessMock.mockReset();
    workspaceMemberFindFirstMock.mockReset();
    workspaceMemberDeleteMock.mockReset();
  });

  it("returns not_found when requester is not workspace member", async () => {
    getWorkspaceMembershipAccessMock.mockResolvedValue(null);

    const result = await removeWorkspaceMemberBySlugForUser("user-1", "workspace-1", "member-1");

    expect(result).toEqual({ status: "not_found" });
    expect(workspaceMemberFindFirstMock).not.toHaveBeenCalled();
  });

  it("returns forbidden when requester is not owner", async () => {
    getWorkspaceMembershipAccessMock.mockResolvedValue({
      workspaceId: "workspace-1",
      role: WorkspaceRole.MEMBER,
    });

    const result = await removeWorkspaceMemberBySlugForUser("user-1", "workspace-1", "member-1");

    expect(result).toEqual({ status: "forbidden" });
    expect(workspaceMemberFindFirstMock).not.toHaveBeenCalled();
  });

  it("returns cannot_remove_owner when target member is owner", async () => {
    getWorkspaceMembershipAccessMock.mockResolvedValue({
      workspaceId: "workspace-1",
      role: WorkspaceRole.OWNER,
    });
    workspaceMemberFindFirstMock.mockResolvedValue({
      id: "member-row-1",
      role: WorkspaceRole.OWNER,
    });

    const result = await removeWorkspaceMemberBySlugForUser("user-1", "workspace-1", "member-1");

    expect(result).toEqual({ status: "cannot_remove_owner" });
    expect(workspaceMemberDeleteMock).not.toHaveBeenCalled();
  });

  it("deletes member when requester is owner and target is member", async () => {
    getWorkspaceMembershipAccessMock.mockResolvedValue({
      workspaceId: "workspace-1",
      role: WorkspaceRole.OWNER,
    });
    workspaceMemberFindFirstMock.mockResolvedValue({
      id: "member-row-1",
      role: WorkspaceRole.MEMBER,
    });
    workspaceMemberDeleteMock.mockResolvedValue({});

    const result = await removeWorkspaceMemberBySlugForUser("user-1", "workspace-1", "member-1");

    expect(workspaceMemberDeleteMock).toHaveBeenCalledWith({
      where: { id: "member-row-1" },
    });
    expect(result).toEqual({ status: "ok" });
  });
});
