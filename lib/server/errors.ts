import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { fail } from "@/lib/api";

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export interface HandlerContext {
  requestId: string;
  params?: Promise<Record<string, string | string[]>>;
}

export type RouteHandler = (
  request: Request,
  context: HandlerContext
) => Promise<NextResponse | Response>;

/**
 * Wraps route handlers to provide:
 * 1. Automatic x-request-id generation and header injection
 * 2. Safe error catching (AppError, ZodError, unexpected errors)
 * 3. Sanitized error responses without leaking server/database internals
 */
export function withHandler(
  handler: RouteHandler
): (request: Request, routeProps?: { params?: Promise<Record<string, string | string[]>> }) => Promise<NextResponse | Response> {
  return async (request: Request, routeProps?: { params?: Promise<Record<string, string | string[]>> }) => {
    const requestId = crypto.randomUUID();

    try {
      const response = await handler(request, {
        requestId,
        params: routeProps?.params,
      });

      // Clone or inject x-request-id header
      response.headers.set("x-request-id", requestId);
      return response;
    } catch (err: unknown) {
      // Allow Next.js internal control flow errors (prerender bailout, redirects, not-found) to propagate
      if (
        typeof err === "object" &&
        err !== null &&
        "digest" in err &&
        typeof (err as { digest: unknown }).digest === "string" &&
        (err as { digest: string }).digest.startsWith("NEXT_")
      ) {
        throw err;
      }

      if (err instanceof AppError) {
        if (err.status >= 500) {
          console.error(`[${requestId}] Server AppError (${err.code}):`, err);
        }
        const res = fail(err.code, err.message, err.status, err.details);
        res.headers.set("x-request-id", requestId);
        return res;
      }

      if (err instanceof ZodError) {
        const res = fail(
          "VALIDATION_ERROR",
          "Invalid request payload",
          400,
          err.flatten().fieldErrors
        );
        res.headers.set("x-request-id", requestId);
        return res;
      }

      // Unexpected errors - never leak stack trace or internal error messages
      console.error(`[${requestId}] Unhandled Server Error:`, err);
      const res = fail(
        "INTERNAL_ERROR",
        "An unexpected error occurred. Please try again later.",
        500
      );
      res.headers.set("x-request-id", requestId);
      return res;
    }
  };
}
