// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import type { SubmitEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProjectCreateModal } from "@/components/features/workspaces/projects/project-create-modal";

describe("project create modal smoke", () => {
  it("renders submit error and submits form", () => {
    const onSubmit = vi.fn((event: SubmitEvent<HTMLFormElement>) => event.preventDefault());
    const close = vi.fn();

    render(
      <ProjectCreateModal
        model={{
          isOpen: true,
          values: {
            name: "Project A",
            description: "Description A",
          },
          setters: {
            setName: vi.fn(),
            setDescription: vi.fn(),
          },
          meta: {
            submitting: false,
            submitError: "Project name already exists",
          },
          actions: {
            close,
            onSubmit: onSubmit as (event: SubmitEvent<HTMLFormElement>) => void,
          },
        }}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Project name already exists")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(close).toHaveBeenCalledTimes(1);

    fireEvent.submit(screen.getByRole("button", { name: "Create project" }).closest("form")!);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
