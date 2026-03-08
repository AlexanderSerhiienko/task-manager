import { handleApiError, jsonError } from "@/server/api/errors";
import { parseJsonBody, parseRouteParams, requireApiUser } from "@/server/api/validation";
import {
  deleteProjectByWorkspaceSlugForUser,
  getProjectByWorkspaceSlugForUser,
  updateProjectByWorkspaceSlugForUser,
} from "@/server/services/projects";
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

const updateProjectBodySchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
});

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId } = await parseRouteParams(params, paramsSchema);
    const project = await getProjectByWorkspaceSlugForUser(user.id, slug, projectId);

    if (!project) {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    return NextResponse.json(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, updateProjectBodySchema);

    const result = await updateProjectByWorkspaceSlugForUser(user.id, slug, projectId, {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
    });

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    if (result.status === "forbidden") {
      return jsonError(403, "FORBIDDEN", "Only owner can manage projects");
    }

    if (result.status === "project_not_found") {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    return NextResponse.json(result.project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, projectId } = await parseRouteParams(params, paramsSchema);
    const result = await deleteProjectByWorkspaceSlugForUser(user.id, slug, projectId);

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    if (result.status === "forbidden") {
      return jsonError(403, "FORBIDDEN", "Only owner can manage projects");
    }

    if (result.status === "project_not_found") {
      return jsonError(404, "NOT_FOUND", "Project not found");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
