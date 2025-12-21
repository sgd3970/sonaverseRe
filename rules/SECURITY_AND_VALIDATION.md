# Sonaverse 홈페이지 보안 및 검증 시스템 가이드

> **소나버스 공식 홈페이지 리뉴얼 프로젝트 전용 보안 및 검증 규칙**  
> **핵심 원칙**: 일반 사용자 로그인 없음, 관리자 전용 인증, 입력 검증 필수, 데이터 격리

---

## 📋 목차

1. [인증 및 권한 관리](#1-인증-및-권한-관리)
2. [데이터 격리 및 접근 제어](#3-데이터-격리-및-접근-제어)
3. [Rate Limiting 및 보안 강화](#4-rate-limiting-및-보안-강화)
4. [입력 및 파일 검증](#2-입력-검증-및-데이터-검증)

---

## 1. 인증 및 권한 관리

### 1.1 일반 사용자 로그인 없음 (필수 원칙)

> **⚠️ 중요**: 소나버스 홈페이지는 일반 사용자에게 로그인 기능을 제공하지 않습니다.

#### 1-1-1. 공개 페이지 보안 규칙

- **로그인 UI 완전 제거**
  - 헤더, 푸터, 네비게이션에서 로그인 관련 UI 제거
  - 공개 API에서 로그인 엔드포인트 제공하지 않음
  
- **접근 제어**
  - `/admin/login` 경로만 관리자 접근 가능
  - 일반 사용자가 `/admin/**` 경로 접근 시도 시 404 또는 리다이렉트

### 1.2 관리자 인증 시스템

#### 1-2-1. 관리자 인증 요구사항

- **JWT 토큰 기반 인증**
  - 액세스 토큰: 15분 만료
  - 리프레시 토큰: 7일 만료
  - 세션 정보는 `AdminSession` 테이블에 저장 (DATABASE_SCHEMA.md 참조)
  
- **비밀번호 보안**
  - bcrypt 해싱 (라운드 12 이상)
  - 비밀번호 정책: 최소 8자, 영문+숫자+특수문자 조합
  - 계정 잠금: 5회 실패 시 30분 잠금

#### 1-2-2. 관리자 세션 관리

```typescript
// AdminSession 테이블 구조 (DATABASE_SCHEMA.md 참조)
interface AdminSession {
  _id: ObjectId;
  user_id: ObjectId;                 // 참조: AdminUser
  token: string;                     // JWT 토큰 (인덱스)
  refresh_token: string;             // 리프레시 토큰 (인덱스)
  ip_address: string;                // IP 주소
  user_agent: string;                // User Agent
  expires_at: Date;                  // 만료 시간
  created_at: Date;
  last_used_at: Date;                // 마지막 사용 시간
}
```

#### 1-2-3. 관리자 미들웨어 구현

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getAdminSession } from '@/lib/db/adminSession';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 관리자 경로 접근 제어
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      // 토큰 검증
      const decoded = verifyToken(token.value);
      if (!decoded) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // 세션 확인
      const session = await getAdminSession(token.value);
      if (!session || session.expires_at < new Date()) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // 세션 갱신
      await updateAdminSessionLastUsed(session._id);
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

---

### 1.2 channel 검증 시스템

#### 유효한 채널 목록

```javascript
const VALID_CHANNELS = [
  'homepage',    // 메인 홈페이지
  'cafe24',      // Cafe24 쇼핑몰
  'admin',       // 관리자 콘솔
  'widget',      // Widget 전용
  'sonaverse',   // 소나버스 채널
  'kakao',       // 카카오톡 연동 (예정)
  'naver',       // 네이버 톡톡 (예정)
];
```

#### 검증 로직

```javascript
function getRequestChannel(req) {
  const channel = req.query.channel || req.headers['x-channel'];
  
  if (!channel) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ channel 없음 - 개발 환경 fallback');
      return 'homepage';
    }
    throw new Error('channel은 필수입니다');
  }
  
  // 채널 유효성 검증
  if (!VALID_CHANNELS.includes(channel)) {
    throw new Error(`유효하지 않은 채널: ${channel}`);
  }
  
  return channel;
}
```

#### Joi 스키마 검증

```javascript
// apps/api/src/schemas/validationSchemas.js
export const commonSchemas = {
  channel: Joi.string()
    .valid('homepage', 'cafe24', 'admin', 'widget', 'sonaverse')
    .required(),
};

// 사용
const { error, value } = commonSchemas.channel.validate(req.query.channel);
if (error) {
  return res.status(400).json({ error: error.message });
}
```

---

## 3. 데이터 격리 및 접근 제어

> **참고**: 소나버스 홈페이지는 단일 테넌트 구조이므로 멀티테넌트 격리는 필요하지 않습니다.  
> 대신 관리자 역할 기반 접근 제어와 공개/비공개 데이터 구분에 집중합니다.

### 3.1 관리자 데이터 접근 제어

#### 3-1-1. 역할 기반 접근 제어

```typescript
// 관리자 역할
type AdminRole = 'super_admin' | 'admin' | 'editor';

// 역할별 권한
const ROLE_PERMISSIONS = {
  super_admin: {
    canManageUsers: true,
    canDeleteContent: true,
    canManageSettings: true,
    canViewAnalytics: true,
  },
  admin: {
    canManageUsers: false,
    canDeleteContent: true,
    canManageSettings: false,
    canViewAnalytics: true,
  },
  editor: {
    canManageUsers: false,
    canDeleteContent: false,
    canManageSettings: false,
    canViewAnalytics: false,
  },
};
```

#### 3-1-2. 데이터 접근 필터링

```typescript
// 관리자 데이터 조회 시 역할 기반 필터링
export async function getPressReleases(adminUser: AdminUser) {
  const query: any = {};
  
  // editor는 자신이 생성한 데이터만 조회
  if (adminUser.role === 'editor') {
    query.created_by = adminUser._id;
  }
  
  // super_admin, admin은 전체 데이터 조회
  return await PressRelease.find(query);
}
```

### 3.2 공개 데이터 접근 제어

#### 3-2-1. 발행 상태 필터링

```typescript
// 공개 API는 발행된 데이터만 반환
export async function getPublicPressReleases() {
  return await PressRelease.find({
    is_published: true,
    published_date: { $lte: new Date() },
  }).sort({ published_date: -1 });
}
```

#### 3-2-2. 민감 정보 제거

```typescript
// 관리자 정보는 공개 API에서 제외
export function sanitizePressRelease(press: PressRelease) {
  const { created_by, updated_by, ...sanitized } = press.toObject();
  return sanitized;
}
```

---

### 3.3 데이터베이스 쿼리 보안

#### 3-3-1. SQL Injection 방지

```typescript
// ❌ 위험한 코드 (SQL Injection 취약)
const query = `SELECT * FROM press_releases WHERE slug = '${slug}'`;

// ✅ 안전한 코드 (Parameterized Query)
const query = `SELECT * FROM press_releases WHERE slug = $1`;
const result = await db.query(query, [slug]);
```

#### 3-3-2. MongoDB Injection 방지

```typescript
// ❌ 위험한 코드
const query = { slug: userInput }; // userInput에 $gt, $ne 등이 포함될 수 있음

// ✅ 안전한 코드 (Mongoose 사용)
const press = await PressRelease.findOne({ slug: userInput }).lean();
```

#### 3-3-3. NoSQL Injection 방지

```typescript
// 사용자 입력 검증 및 이스케이프
import { z } from 'zod';

const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9-]+$/);
const validatedSlug = slugSchema.parse(userInput);
```

---

## 4. Rate Limiting 및 보안 강화

### 4.1 Rate Limiting

#### 4-1-1. API Rate Limiting

```typescript
// 문의 API Rate Limiting
export const inquiryRateLimit = {
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5회
  message: '너무 많은 문의 요청이 있습니다. 잠시 후 다시 시도해주세요.',
};

// 관리자 로그인 Rate Limiting
export const adminLoginRateLimit = {
  windowMs: 15 * 60 * 1000, // 15분
  max: 5, // 최대 5회
  message: '로그인 시도 횟수를 초과했습니다. 15분 후 다시 시도해주세요.',
  skipSuccessfulRequests: true,
};
```

#### 4-1-2. IP 기반 차단

```typescript
// 실패한 로그인 시도 추적
interface FailedLoginAttempt {
  ip_address: string;
  email: string;
  attempts: number;
  locked_until?: Date;
}

// 5회 실패 시 30분 잠금
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000; // 30분
```

### 4.2 XSS 및 CSRF 방지

#### 4-2-1. XSS 방지

```typescript
// 사용자 입력 이스케이프
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href'],
  });
}
```

#### 4-2-2. CSRF 보호

```typescript
// 관리자 API CSRF 토큰 검증
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('X-CSRF-Token');
  const sessionToken = request.cookies.get('csrf_token');
  
  return token === sessionToken?.value;
}
```

---

### 3.2 권한 시스템

#### 역할 (Roles)

```typescript
const USER_ROLE = {
  SUPER_ADMIN: 'super_admin',    // 모든 권한
  ADMIN: 'admin',                // 테넌트 관리
  AGENT: 'agent',                // 채팅 상담
  USER: 'user',                  // 일반 사용자
  GUEST: 'guest',                // 게스트
};
```

#### 권한 (Permissions)

```typescript
const PERMISSION = {
  CHAT_CREATE: 'chat:create',
  CHAT_READ: 'chat:read',
  CHAT_UPDATE: 'chat:update',
  CHAT_DELETE: 'chat:delete',
  CHAT_HANDOVER: 'chat:handover',
  MESSAGE_CREATE: 'message:create',
  MESSAGE_READ: 'message:read',
  MESSAGE_UPDATE: 'message:update',
  MESSAGE_DELETE: 'message:delete',
  STATS_READ: 'stats:read',
  CURATION_MANAGE: 'curation:manage',
};
```

#### 권한 체크 미들웨어

```javascript
// apps/api/src/auth/rbac.js
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: '인증이 필요합니다' 
      });
    }
    
    const hasPermission = req.user.permissions?.includes(permission);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: `권한이 없습니다: ${permission}` 
      });
    }
    
    next();
  };
};

// 사용
app.get('/v1/chats', 
  authenticateToken,                // 1. 인증 확인
  requirePermission('chat:read'),   // 2. 권한 확인
  chatController.getChats           // 3. 처리
);
```

#### 역할 체크 미들웨어

```javascript
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: '인증이 필요합니다' });
    }
    
    const hasRole = roles.includes(req.user.role);
    
    if (!hasRole) {
      return res.status(403).json({ 
        error: `필요한 역할: ${roles.join(', ')}` 
      });
    }
    
    next();
  };
};

// 사용
app.post('/v1/channels',
  authenticateToken,
  requireRole(['super_admin', 'admin']),  // super_admin 또는 admin만
  channelController.createChannel
);
```

---

## 4. Rate Limiting

### 4.1 채널별 Rate Limit

#### 설정값

```javascript
const RATE_LIMIT = {
  WIDGET: {
    WINDOW_MS: 60000,       // 1분
    MAX_REQUESTS: 200,      // 200 req/min
  },
  ADMIN: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 500,      // 500 req/min
  },
  CAFE24: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 150,
  },
  HOMEPAGE: {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 100,
  },
};
```

#### 적용 방법

```javascript
// apps/api/src/middleware/rateLimit.js
export function createChannelRateLimit(channel) {
  const config = RATE_LIMIT_CONFIG.channels[channel];
  
  return rateLimit({
    windowMs: config.WINDOW_MS,
    max: config.MAX_REQUESTS,
    
    // Key: IP + channel
    keyGenerator: (req) => {
      const ip = req.ip;
      return `${ip}:${channel}`;
    },
    
    // 한도 초과 시
    handler: (req, res) => {
      console.warn('Rate limit exceeded:', {
        channel,
        ip: req.ip,
      });
      
      res.status(429).json({
        error: 'Too Many Requests',
        message: `${channel} 채널의 요청 한도 초과`,
        retryAfter: Math.ceil(config.WINDOW_MS / 1000)
      });
    }
  });
}

// 적용
const widgetRateLimit = createChannelRateLimit('widget');
app.use('/v1/widget', widgetRateLimit);
```

---

### 4.2 엔드포인트별 Rate Limit

#### 민감한 엔드포인트 보호

```javascript
const ENDPOINT_RATE_LIMIT = {
  '/v1/auth/login': {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 5,          // 로그인: 5회/분
  },
  '/v1/chats/:id/messages': {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 50,         // 메시지: 50회/분
  },
  '/v1/ai/translate': {
    WINDOW_MS: 60000,
    MAX_REQUESTS: 20,         // AI: 20회/분
  },
};

// 적용
app.post('/v1/auth/login', 
  createEndpointRateLimit('/v1/auth/login'),
  authController.login
);
```

#### 개발 환경 예외

```javascript
export function createDynamicRateLimit(options = {}) {
  // 개발 환경: Rate Limit 비활성화
  if (process.env.NODE_ENV === 'development') {
    return (req, res, next) => next();  // 통과
  }
  
  // 프로덕션: Rate Limit 적용
  return rateLimit({...options});
}
```

---

## 5. Circuit Breaker

### 5.1 개념

**Circuit Breaker**: 외부 서비스 장애 시 시스템 보호

**상태**:
- `CLOSED`: 정상 (요청 허용)
- `OPEN`: 장애 (요청 차단)
- `HALF_OPEN`: 복구 시도

**동작**:

```text
정상 → 실패 5회 → OPEN (30초 차단)
       ↓
   30초 후 → HALF_OPEN (복구 시도)
       ↓
   성공 2회 → CLOSED (정상)
   실패 1회 → OPEN (다시 차단)
```

---

### 5.2 적용 예시

#### Cafe24 API Circuit Breaker

```javascript
// apps/api/src/middleware/circuitBreaker.js
const cafe24CircuitBreaker = new CircuitBreaker({
  name: 'cafe24-api',
  failureThreshold: 5,      // 5회 실패 시 OPEN
  successThreshold: 2,      // 2회 성공 시 CLOSED
  timeout: 3000,            // 3초 타임아웃
  resetTimeout: 30000,      // 30초 후 복구 시도
});

export const cafe24ApiCircuitBreaker = (req, res, next) => {
  if (cafe24CircuitBreaker.state === 'OPEN') {
    return res.status(503).json({
      error: 'Cafe24 서비스 일시적으로 사용 불가',
      message: 'Circuit Breaker가 OPEN 상태입니다',
      retryAfter: cafe24CircuitBreaker.getRetryAfter()
    });
  }
  
  next();
};

// 사용
app.get('/v1/cafe24/callback', 
  cafe24ApiCircuitBreaker,  // Circuit Breaker 확인
  cafe24OAuthController.handleCallback
);
```

#### 실패/성공 기록

```javascript
// Controller 내부
try {
  const result = await fetch('https://cafe24-api.com/...');
  
  if (!result.ok) {
    cafe24CircuitBreaker.recordFailure();  // 실패 기록
    throw new Error('API 호출 실패');
  }
  
  cafe24CircuitBreaker.recordSuccess();  // 성공 기록
  return result.data;
} catch (error) {
  cafe24CircuitBreaker.recordFailure();
  throw error;
}
```

---

## 6. 입력 검증

### 6.1 Joi 스키마 검증

#### 예시: 문의 생성 스키마

```javascript
// apps/api/src/schemas/validationSchemas.js
export const inquirySchemas = {
  createInquiry: Joi.object({
    inquiry_type: Joi.string().valid(
      'service_introduction',
      'product_inquiry',
      'partnership_proposal',
      'channel_partnership',
      'investment_ir',
      'press_pr',
      'recruitment',
      'complaint',
      'other'
    ).required(),
    name: Joi.string().min(1).max(50).required(),
    position: Joi.string().max(50).optional(),
    company_name: Joi.string().max(100).optional(),
    phone_number: Joi.string().pattern(/^[0-9-+()\s]+$/).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(5000).required(),
    privacy_consented: Joi.boolean().valid(true).required(),
  })
};
```

#### 미들웨어 적용

```javascript
// 미들웨어 생성
export function createValidationMiddleware(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,      // 모든 에러 수집
      stripUnknown: true,     // 알 수 없는 필드 제거
      convert: true           // 타입 변환
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: '입력값 검증 실패',
        details: errorDetails
      });
    }

    req.body = value;  // 검증된 값으로 대체
    next();
  };
}

// 사용
const validateCreateChat = createValidationMiddleware(chatSchemas.createChat);

app.post('/v1/chats',
  authenticateToken,
  validateCreateChat,      // ⚠️ 검증 미들웨어
  chatController.createChat
);
```

---

### 6.2 SQL Injection 방지

#### ❌ 위험한 코드

```javascript
// 절대 하지 말 것!
const query = `SELECT * FROM press_releases WHERE slug = '${slug}'`;
await pool.query(query);
```

**문제**: SQL Injection 공격 가능

#### ✅ 안전한 코드

```javascript
// Parameterized Query 사용
const query = `SELECT * FROM press_releases WHERE slug = $1`;
await pool.query(query, [slug]);
```

**장점**:
- SQL Injection 완전 방지
- PostgreSQL이 자동으로 이스케이프
- 쿼리 플랜 캐싱으로 성능 향상

#### 모든 쿼리에 적용

```javascript
// apps/api/src/constants/apiConstants.js
export const SQL = {
  SELECT_GREETING: `
    SELECT * FROM greeting_messages 
    WHERE slug = $1
  `,
  // ✅ 모든 변수는 $1, $2, ... 플레이스홀더 사용
};

// 사용
const result = await pool.query(SQL.SELECT_GREETING, [slug]);
```

---

### 6.3 XSS 방지

#### 사용자 입력 검증

```javascript
// 메시지 내용 검증
export const sanitizeInput = (input) => {
  return input
    .trim()                          // 공백 제거
    .replace(/[<>]/g, '')            // HTML 태그 제거
    .replace(/javascript:/gi, '')     // javascript: 제거
    .slice(0, 5000);                 // 최대 길이 제한
};

// 사용
const content = sanitizeInput(req.body.content);
```

#### HTML 이스케이프

```javascript
// React는 자동으로 XSS 방지하지만, 
// dangerouslySetInnerHTML 사용 시 주의

// ❌ 위험
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 안전
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

---

## 7. 환경별 보안 설정

### 7.1 개발 환경

```javascript
if (process.env.NODE_ENV === 'development') {
  // 1. Rate Limit 비활성화
  app.use((req, res, next) => next());
  
  // 2. CORS 모든 origin 허용
  app.use(cors({ origin: '*' }));
  
  // 3. 상세한 에러 스택 반환
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: err.message,
      stack: err.stack  // ⚠️ 개발만
    });
  });
  
  // 4. 디버그 로그
  console.log('[DEV] request:', req.method, req.path);
}
```

---

### 7.2 프로덕션 환경

```javascript
if (process.env.NODE_ENV === 'production') {
  // 1. Rate Limit 활성화
  app.use('/v1/', createDynamicRateLimit({
    maxRequests: 100,
    windowMs: 60000
  }));
  
  // 2. CORS 특정 origin만 허용
  app.use(cors({
    origin: ['https://company.com'],
    credentials: true
  }));
  
  // 3. 간단한 에러 메시지만
  app.use((err, req, res, next) => {
    res.status(500).json({
      error: '서버 내부 오류가 발생했습니다'
      // stack 노출 금지!
    });
  });
  
  // 4. 필수 파라미터 엄격 검증 (예: slug, id 등)
}
```

---

## 8. 실전 보안 체크리스트

### 배포 전 필수 확인

- `NODE_ENV=production` 설정
- Rate Limit 활성화
- CORS origin 설정
- JWT SECRET_KEY 변경
- DB 연결 정보 환경변수
- Helmet 미들웨어 활성화
- HTTPS 사용
- 에러 스택 노출 금지

### 런타임 모니터링

```javascript
// 보안 이벤트 로깅
logger.security('인증 실패', {
  ip: req.ip,
  endpoint: req.path,
  reason: 'Invalid token'
});

// Rate Limit 초과
logger.warn('Rate limit exceeded', {
  ip: req.ip,
  limit: config.maxRequests
});
```

---

**작성일**: 2025-10-14
**버전**: 2.0
**상태**: Production Ready

