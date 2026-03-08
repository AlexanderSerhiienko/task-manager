import { getCurrentUserFromSession } from "@/server/access-control";
import { ApiRouteError } from "@/server/api/errors";
import { z } from "zod";

export async function requireApiUser() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    throw new ApiRouteError(401, "UNAUTHORIZED", "Unauthorized");
  }

  return user;
}

export async function parseJsonBody<TSchema extends z.ZodTypeAny>(
  request: Request,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  let rawJson: unknown;

  try {
    rawJson = await request.json();
  } catch {
    throw new ApiRouteError(400, "INVALID_JSON", "Invalid JSON body");
  }

  const parsed = schema.safeParse(rawJson);

  if (!parsed.success) {
    throw new ApiRouteError(400, "VALIDATION_ERROR", "Invalid request body", parsed.error.flatten());
  }

  return parsed.data;
}

export async function parseRouteParams<TSchema extends z.ZodTypeAny>(
  params: Promise<unknown>,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  const rawParams = await params;
  const parsed = schema.safeParse(rawParams);

  if (!parsed.success) {
    throw new ApiRouteError(400, "INVALID_PARAMS", "Invalid route params", parsed.error.flatten());
  }

  return parsed.data;
}

export function parseIsoDateOrNull(value: string | null | undefined, fieldName: string) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value.length === 0) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new ApiRouteError(400, "INVALID_DATE", `${fieldName} must be a valid ISO date string`);
  }

  return parsed;
}
