import { handleApiError, jsonError } from "@/server/api/errors";
import { parseJsonBody, parseRouteParams, requireApiUser } from "@/server/api/validation";
import {
  getWorkspaceBySlugForUserId,
  updateWorkspaceNameBySlugForUserId,
} from "@/server/services/workspaces";
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

const updateWorkspaceBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
});

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug } = await parseRouteParams(params, paramsSchema);
    const membership = await getWorkspaceBySlugForUserId(user.id, slug);

    if (!membership) {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    return NextResponse.json({
      role: membership.role,
      workspace: {
        id: membership.workspace.id,
        slug: membership.workspace.slug,
        name: membership.workspace.name,
        createdById: membership.workspace.createdById,
        createdAt: membership.workspace.createdAt,
        updatedAt: membership.workspace.updatedAt,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug } = await parseRouteParams(params, paramsSchema);
    const body = await parseJsonBody(request, updateWorkspaceBodySchema);

    const result = await updateWorkspaceNameBySlugForUserId(
      user.id,
      slug,
      body.name,
    );

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    if (result.status === "forbidden") {
      return jsonError(403, "FORBIDDEN", "Only owner can update workspace settings");
    }

    return NextResponse.json(result.workspace);
  } catch (error) {
    return handleApiError(error);
  }
}
