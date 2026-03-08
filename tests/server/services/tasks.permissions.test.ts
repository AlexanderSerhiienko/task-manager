import { WorkspaceRole } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
vi.mock("@/server/access-control", () => ({
  hasAnyRole: (role: WorkspaceRole, allowedRoles: WorkspaceRole[]) => allowedRoles.includes(role),
  getWorkspaceMembershipAccess: vi.fn(),
  getProjectInWorkspace: vi.fn(),
  isWorkspaceMember: vi.fn(),
}));
import { memberCannotAssign, memberCannotReassignTask } from "@/server/services/tasks/permissions";
import { memberAccess, ownerAccess } from "@/tests/helpers/access-context";

describe("tasks permissions", () => {
  describe("memberCannotAssign", () => {
    it("allows owner to assign anyone", () => {
      const access = ownerAccess();
      expect(memberCannotAssign(access, "user-any")).toBe(false);
    });

    it("allows member to assign to self", () => {
      const access = memberAccess({ userId: "member-1" });
      expect(memberCannotAssign(access, "member-1")).toBe(false);
    });

    it("blocks member from assigning other user", () => {
      const access = memberAccess({ userId: "member-1" });
      expect(memberCannotAssign(access, "member-2")).toBe(true);
    });
  });

  describe("memberCannotReassignTask", () => {
    it("allows owner to reassign freely", () => {
      const access = ownerAccess({ role: WorkspaceRole.OWNER });
      expect(memberCannotReassignTask(access, "member-1", "member-2")).toBe(false);
    });

    it("allows member to assign task to self", () => {
      const access = memberAccess({ userId: "member-1" });
      expect(memberCannotReassignTask(access, null, "member-1")).toBe(false);
    });

    it("allows member to remove self-assignment", () => {
      const access = memberAccess({ userId: "member-1" });
      expect(memberCannotReassignTask(access, "member-1", null)).toBe(false);
    });

    it("blocks member from assigning someone else", () => {
      const access = memberAccess({ userId: "member-1" });
      expect(memberCannotReassignTask(access, null, "member-2")).toBe(true);
    });

    it("blocks member from unassigning when task belongs to another assignee", () => {
      const access = memberAccess({ userId: "member-1" });
      expect(memberCannotReassignTask(access, "member-2", null)).toBe(true);
    });
  });
});
