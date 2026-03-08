import { handleApiError, jsonError } from "@/server/api/errors";
import { parseJsonBody, parseRouteParams, requireApiUser } from "@/server/api/validation";
import { updateTaskStatusByProjectForUser } from "@/server/services/tasks";
import { taskStatusSchema } from "@/shared/contracts/tasks";
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

const updateStatusBodySchema = z.object({
  status: taskStatusSchema,
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId, taskId } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, updateStatusBodySchema);

    const result = await updateTaskStatusByProjectForUser(user.id, slug, projectId, taskId, body.status);

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    if (result.status === "task_not_found") {
      return jsonError(404, "NOT_FOUND", "Task not found");
    }

    return NextResponse.json(result.task);
  } catch (error) {
    return handleApiError(error);
  }
}
