import { handleApiError } from "@/server/api/errors";
import { parseJsonBody, requireApiUser } from "@/server/api/validation";
import {
  createWorkspaceByUserId,
  listWorkspacesByUserId,
} from "@/server/services/workspaces";
import { NextResponse } from "next/server";
import { z } from "zod";

const createWorkspaceBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers and hyphens"),
});

export async function GET() {
  try {
    const user = await requireApiUser();
    const workspaces = await listWorkspacesByUserId(user.id);
    return NextResponse.json(workspaces);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser();
    const body = await parseJsonBody(request, createWorkspaceBodySchema);

    const workspace = await createWorkspaceByUserId(user.id, {
      name: body.name,
      slug: body.slug,
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
