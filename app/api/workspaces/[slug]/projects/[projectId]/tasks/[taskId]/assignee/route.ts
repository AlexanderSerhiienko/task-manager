import { handleApiError, jsonError } from "@/server/api/errors";
import { parseJsonBody, parseRouteParams, requireApiUser } from "@/server/api/validation";
import { assignTaskByProjectForUser } from "@/server/services/tasks";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  params: Promise<{
    slug: string;
    projectId: string;
    taskId: string;
  }>;
};

const paramsSchema = z.object({
  slug: z.string().trim().min(2),
  projectId: z.string().trim().min(1),
  taskId: z.string().trim().min(1),
});

const updateAssigneeBodySchema = z.object({
  assigneeId: z.string().trim().min(1).nullable().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId, taskId } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, updateAssigneeBodySchema);
    const result = await assignTaskByProjectForUser(
      user.id,
      slug,
      projectId,
      taskId,
      body.assigneeId ?? null,
    );

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    if (result.status === "task_not_found") {
      return jsonError(404, "NOT_FOUND", "Task not found");
    }

    if (result.status === "forbidden_assignee") {
      return jsonError(
        403,
        "FORBIDDEN",
        "Member can assign task only to self or remove self-assignment",
      );
    }

    if (result.status === "assignee_not_member") {
      return jsonError(400, "BAD_REQUEST", "Assignee must be a workspace member");
    }

    return NextResponse.json(result.task);
  } catch (error) {
    return handleApiError(error);
  }
}
