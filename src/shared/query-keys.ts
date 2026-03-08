export const queryKeys = {
  workspaces: {
    all: ["workspaces"] as const,
    list: () => [...queryKeys.workspaces.all, "list"] as const,
    detail: (slug: string) => [...queryKeys.workspaces.all, "detail", slug] as const,
    overview: (slug: string) => [...queryKeys.workspaces.all, "overview", slug] as const,
    projects: (slug: string) => [...queryKeys.workspaces.all, "projects", slug] as const,
    members: (slug: string) => [...queryKeys.workspaces.all, "members", slug] as const,
  },
  projects: {
    all: ["projects"] as const,
    detail: (slug: string, projectId: string) =>
      [...queryKeys.projects.all, "detail", slug, projectId] as const,
    tasks: (slug: string, projectId: string) =>
      [...queryKeys.projects.all, "tasks", slug, projectId] as const,
  },
};
