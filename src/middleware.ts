import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'sonaverse-admin-secret-key-change-in-production'
);

const COOKIE_NAME = 'admin-session';

// 보호가 필요한 경로 설정
const PROTECTED_PATHS = ['/admin'];
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin 경로 체크
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.some(path => pathname === path);

  // 보호된 경로이면서 공개 경로가 아닌 경우
  if (isProtectedPath && !isPublicAdminPath) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 토큰 검증
    try {
      await jwtVerify(token, JWT_SECRET);
      // 토큰이 유효하면 계속 진행
      return NextResponse.next();
    } catch (error) {
      // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);

      // 유효하지 않은 쿠키 삭제
      response.cookies.delete(COOKIE_NAME);

      return response;
    }
  }

  // 로그인 페이지에 이미 로그인한 사용자가 접근하면 대시보드로 리다이렉트
  if (pathname === '/admin/login') {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {
        // 토큰이 유효하지 않으면 그냥 로그인 페이지 표시
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

// Middleware가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|uploads).*)',
  ],
};
