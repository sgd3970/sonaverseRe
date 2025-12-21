import { RateLimiterMemory } from 'rate-limiter-flexible';

// IP 기반 Rate Limiter
// 15분에 최대 5회 요청 허용
const rateLimiter = new RateLimiterMemory({
  points: 5, // 최대 요청 수
  duration: 15 * 60, // 15분 (초 단위)
});

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining?: number; resetTime?: Date }> {
  try {
    const res = await rateLimiter.consume(ip);
    return {
      allowed: true,
      remaining: res.remainingPoints,
      resetTime: new Date(Date.now() + res.msBeforeNext),
    };
  } catch (rejRes) {
    // Rate limit 초과
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(Date.now() + rejRes.msBeforeNext),
    };
  }
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

