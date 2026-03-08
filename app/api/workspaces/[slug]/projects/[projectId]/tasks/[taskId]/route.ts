import { handleApiError, jsonError } from "@/server/api/errors";
import {
  parseIsoDateOrNull,
  parseJsonBody,
  parseRouteParams,
  requireApiUser,
} from "@/server/api/validation";
import {
  deleteTaskByProjectForUser,
  updateTaskByProjectForUser,
} from "@/server/services/tasks";
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

const updateTaskBodySchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  dueDate: z.string().nullable().optional(),
});

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId, taskId } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, updateTaskBodySchema);

    const result = await updateTaskByProjectForUser(user.id, slug, projectId, taskId, {
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.dueDate !== undefined
        ? { dueDate: parseIsoDateOrNull(body.dueDate, "dueDate") }
        : {}),
    });

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

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId, taskId } = await parseRouteParams(params, paramsSchema);
    const result = await deleteTaskByProjectForUser(user.id, slug, projectId, taskId);

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    if (result.status === "task_not_found") {
      return jsonError(404, "NOT_FOUND", "Task not found");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
