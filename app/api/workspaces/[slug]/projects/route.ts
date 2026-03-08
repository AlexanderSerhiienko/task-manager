import { handleApiError, jsonError } from "@/server/api/errors";
import { parseJsonBody, parseRouteParams, requireApiUser } from "@/server/api/validation";
import {
  createProjectByWorkspaceSlugForUser,
  listProjectsByWorkspaceSlugForUser,
} from "@/server/services/projects";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

const paramsSchema = z.object({
  slug: z.string().trim().min(2),
});

const createProjectBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
});

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug } = await parseRouteParams(params, paramsSchema);
    const result = await listProjectsByWorkspaceSlugForUser(user.id, slug);

    if (!result) {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, createProjectBodySchema);

    const result = await createProjectByWorkspaceSlugForUser(user.id, slug, {
      name: body.name,
      description: body.description?.trim() ?? null,
    });

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    if (result.status === "forbidden") {
      return jsonError(403, "FORBIDDEN", "Only owner can manage projects");
    }

    return NextResponse.json(result.project, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
