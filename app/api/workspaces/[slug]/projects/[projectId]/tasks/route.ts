import { handleApiError, jsonError } from "@/server/api/errors";
import {
  parseIsoDateOrNull,
  parseJsonBody,
  parseRouteParams,
  requireApiUser,
} from "@/server/api/validation";
import { createTaskByProjectForUser, listTasksByProjectForUser } from "@/server/services/tasks";
import { taskStatusSchema } from "@/shared/contracts/tasks";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  params: Promise<{
    slug: string;
    projectId: string;
  }>;
};

const paramsSchema = z.object({
  slug: z.string().trim().min(2),
  projectId: z.string().trim().min(1),
});

const createTaskBodySchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
  dueDate: z.string().nullable().optional(),
  assigneeId: z.string().trim().min(1).nullable().optional(),
  status: taskStatusSchema.optional(),
});

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId } = await parseRouteParams(params, paramsSchema);
    const result = await listTasksByProjectForUser(user.id, slug, projectId);

    if (!result) {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, createTaskBodySchema);

    const result = await createTaskByProjectForUser(user.id, slug, projectId, {
      title: body.title,
      description: body.description?.trim() ?? null,
      dueDate: parseIsoDateOrNull(body.dueDate, "dueDate") ?? null,
      assigneeId: body.assigneeId ?? null,
      status: body.status,
    });

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    if (result.status === "forbidden_assignee") {
      return jsonError(403, "FORBIDDEN", "Member can assign task only to self");
    }

    if (result.status === "assignee_not_member") {
      return jsonError(400, "BAD_REQUEST", "Assignee must be a workspace member");
    }

    return NextResponse.json(result.task, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
