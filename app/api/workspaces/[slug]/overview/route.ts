import { handleApiError, jsonError } from "@/server/api/errors";
import { parseRouteParams, requireApiUser } from "@/server/api/validation";
import { getWorkspaceOverviewBySlugForUserId } from "@/server/services/workspaces";
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

export async function GET(_request: Request, { params }: Params) {
  try {
    const user = await requireApiUser();
    const { slug } = await parseRouteParams(params, paramsSchema);
    const overview = await getWorkspaceOverviewBySlugForUserId(user.id, slug);

    if (!overview) {
      return jsonError(404, "NOT_FOUND", "Workspace not found");
    }

    return NextResponse.json(overview);
  } catch (error) {
    return handleApiError(error);
  }
}
