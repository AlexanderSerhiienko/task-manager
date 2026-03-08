export const WORKSPACE_ROLES = ["OWNER", "MEMBER"] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export type WorkspaceApiItem = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMembershipApiItem = {
  id: string;
  role: WorkspaceRole;
  workspaceId: string;
  userId: string;
  joinedAt: string;
  workspace: WorkspaceApiItem;
};

export type WorkspaceShellResponse = {
  role: WorkspaceRole;
  workspace: {
    id: string;
    slug: string;
    name: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type WorkspaceOverviewResponse = {
  role: WorkspaceRole;
  workspace: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
  };
  totals: {
    projects: number;
    tasks: number;
    inProgressTasks: number;
    doneTasks: number;
  };
};

export type ProjectApiItem = {
  id: string;
  workspaceId: string;
  createdById: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceProjectsResponse = {
  role: WorkspaceRole;
  projects: ProjectApiItem[];
};

export type WorkspaceMemberApiItem = {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
};

export type WorkspaceMembersResponse = {
  role: WorkspaceRole;
  currentUserId: string;
  members: WorkspaceMemberApiItem[];
};
