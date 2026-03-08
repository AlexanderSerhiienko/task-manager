// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspacesList } from "@/components/features/dashboard/workspaces-list";

describe("dashboard workspace list smoke", () => {
  it("renders loading skeleton state", () => {
    const { container } = render(
      <WorkspacesList
        loading
        errorMessage={null}
        model={{
          workspaces: [],
        }}
      />,
    );

    expect(screen.getByText("Workspace list")).toBeInTheDocument();
    expect(container.querySelectorAll(".skeleton-line").length).toBeGreaterThan(0);
  });

  it("renders empty state", () => {
    render(
      <WorkspacesList
        loading={false}
        errorMessage={null}
        model={{
          workspaces: [],
        }}
      />,
    );

    expect(screen.getByText("No workspaces yet")).toBeInTheDocument();
    expect(screen.getByText("Create your first workspace to get started.")).toBeInTheDocument();
  });

  it("renders workspace rows", () => {
    render(
      <WorkspacesList
        loading={false}
        errorMessage={null}
        model={{
          workspaces: [
            {
              id: "membership-1",
              workspaceId: "workspace-1",
              userId: "user-1",
              role: "OWNER",
              joinedAt: "2026-01-01T00:00:00.000Z",
              workspace: {
                id: "workspace-1",
                name: "Workspace A",
                slug: "workspace-a",
                createdAt: "2026-01-01T00:00:00.000Z",
                updatedAt: "2026-01-01T00:00:00.000Z",
              },
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("Workspace A")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workspace" })).toHaveAttribute(
      "href",
      "/workspaces/workspace-a",
    );
  });
});
