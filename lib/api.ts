import { NextResponse } from "next/server";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Returns a standardized success JSON response:
 * { success: true, data: T }
 */
export function ok<T>(data: T, init?: ResponseInit): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data }, init);
}

/**
 * Returns a standardized error JSON response:
 * { success: false, error: { code, message, details? } }
 */
export function fail(
  code: string,
  message: string,
  status = 400,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}
