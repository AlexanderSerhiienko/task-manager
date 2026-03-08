import { handleApiError, jsonError } from "@/server/api/errors";
import { parseJsonBody, parseRouteParams, requireApiUser } from "@/server/api/validation";
import {
  addWorkspaceMemberBySlugForUser,
  listWorkspaceMembersBySlugForUser,
} from "@/server/services/members";
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

const createMemberBodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug } = await parseRouteParams(params, paramsSchema);
    const result = await listWorkspaceMembersBySlugForUser(user.id, slug);

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
    const body = await parseJsonBody(request, createMemberBodySchema);
    const result = await addWorkspaceMemberBySlugForUser(user.id, slug, body.email);

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    if (result.status === "forbidden") {
      return jsonError(403, "FORBIDDEN", "Only owner can manage members");
    }

    if (result.status === "user_not_found") {
      return jsonError(404, "NOT_FOUND", "User not found");
    }

    if (result.status === "already_member") {
      return jsonError(409, "CONFLICT", "User is already a member");
    }

    return NextResponse.json(result.member, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
