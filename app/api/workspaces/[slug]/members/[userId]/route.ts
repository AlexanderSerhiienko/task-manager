import { handleApiError, jsonError } from "@/server/api/errors";
import { parseRouteParams, requireApiUser } from "@/server/api/validation";
import { removeWorkspaceMemberBySlugForUser } from "@/server/services/members";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = {
  params: Promise<{
    slug: string;
    userId: string;
  }>;
};

const paramsSchema = z.object({
  slug: z.string().trim().min(2),
  userId: z.string().trim().min(1),
});

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug, userId } = await parseRouteParams(params, paramsSchema);
    const result = await removeWorkspaceMemberBySlugForUser(user.id, slug, userId);

    if (result.status === "not_found") {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    if (result.status === "forbidden") {
      return jsonError(403, "FORBIDDEN", "Only owner can manage members");
    }

    if (result.status === "member_not_found") {
      return jsonError(404, "NOT_FOUND", "Member not found");
    }

    if (result.status === "cannot_remove_owner") {
      return jsonError(400, "BAD_REQUEST", "Owner cannot be removed");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
