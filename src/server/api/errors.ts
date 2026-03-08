import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type ErrorDetails = Record<string, unknown> | string[] | null;

export class ApiRouteError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: ErrorDetails = null,
  ) {
    super(message);
  }
}

export function jsonError(status: number, code: string, message: string, details: ErrorDetails = null) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        details,
      },
    },
    { status },
  );
}

function mapPrismaError(error: Prisma.PrismaClientKnownRequestError) {
  if (error.code === "P2002") {
    return jsonError(409, "CONFLICT", "Resource already exists");
  }

  if (error.code === "P2025") {
    return jsonError(404, "NOT_FOUND", "Resource not found");
  }

  return jsonError(400, "DATABASE_ERROR", "Database request failed");
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiRouteError) {
    return jsonError(error.status, error.code, error.message, error.details);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return mapPrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return jsonError(400, "DATABASE_VALIDATION_ERROR", "Database validation failed");
  }

  return jsonError(500, "INTERNAL_SERVER_ERROR", "Internal server error");
}
