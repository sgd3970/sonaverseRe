import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 성공 응답 생성
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  options?: {
    message?: string;
    pagination?: ApiResponse['pagination'];
  }
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(options?.message && { message: options.message }),
      ...(options?.pagination && { pagination: options.pagination }),
    },
    { status }
  );
}

/**
 * 에러 응답 생성
 */
export function errorResponse(
  error: string | Error,
  status: number = 500,
  options?: {
    message?: string;
    details?: any;
  }
): NextResponse<ApiResponse> {
  const errorMessage = error instanceof Error ? error.message : error;

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      ...(options?.message && { message: options.message }),
      ...(options?.details && { details: options.details }),
    },
    { status }
  );
}

/**
 * 유효성 검사 실패 응답
 */
export function validationErrorResponse(
  details: any,
  message: string = 'Validation failed'
): NextResponse<ApiResponse> {
  return errorResponse('Validation failed', 400, {
    message,
    details,
  });
}

/**
 * 인증 실패 응답
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return errorResponse('Unauthorized', 401, { message });
}

/**
 * 권한 없음 응답
 */
export function forbiddenResponse(
  message: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return errorResponse('Forbidden', 403, { message });
}

/**
 * 리소스 없음 응답
 */
export function notFoundResponse(
  message: string = 'Resource not found'
): NextResponse<ApiResponse> {
  return errorResponse('Not found', 404, { message });
}

/**
 * Rate limit 초과 응답
 */
export function rateLimitResponse(
  resetTime?: Date,
  message: string = 'Too many requests'
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: 'Too many requests',
      message,
      resetTime: resetTime?.toISOString(),
    },
    {
      status: 429,
      headers: {
        'Retry-After': resetTime
          ? Math.ceil((resetTime.getTime() - Date.now()) / 1000).toString()
          : '900',
      },
    }
  );
}

