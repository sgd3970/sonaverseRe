# Sonaverse 홈페이지 API 라우트 설계

> **목적**: Sonaverse 홈페이지 리뉴얼용 API 엔드포인트를 정리하여, 프론트엔드·백엔드 구현 시 기준으로 사용하기 위함  
> **전제**: Next.js App Router 기반, `/api/**` 라우트 사용 (Node/Express 또는 Next API Route 어느 쪽에도 매핑 가능)

---

## 📋 목차

1. [설계 원칙](#1-설계-원칙)
2. [인증·세션 관련 API](#2-인증세션-관련-api)
3. [공개 API (사용자용)](#3-공개-api-사용자용)
4. [관리자 API (CMS용)](#4-관리자-api-cms용)
5. [공통 응답 포맷](#5-공통-응답-포맷)
6. [에러 코드 규칙](#6-에러-코드-규칙)

---

## 1. 설계 원칙

- **일반 사용자 로그인 없음**
  - 공개 API는 모두 **비인증** 기반 읽기 전용.
  - 로그인·회원관리 관련 엔드포인트는 제공하지 않음.
- **관리자 전용 API 분리**
  - `/api/admin/**` 네임스페이스로 분리.
  - JWT + 세션(`AdminSession`) 기반 인증 필수.
- **RESTful + 리소스 기반**
  - 명사형 리소스 + HTTP 메서드 조합으로 설계.
  - 예: `GET /api/press`, `POST /api/admin/press`.
- **성능·모듈화 고려**
  - 목록 API는 페이지네이션·필터를 기본 제공.
  - 상세 API는 slug 기반 조회로 SEO와 직접 매핑.
  - 데이터 스키마는 `DATABASE_SCHEMA.md` 기준으로 사용.

---

## 2. 인증·세션 관련 API

> 일반 사용자는 로그인하지 않으므로, **관리자 전용**만 정의합니다.

### 2.1 POST `/api/admin/login`

- **설명**: 관리자 로그인
- **인증**: 없음 (이 엔드포인트 자체가 로그인)
- **요청 Body**

```json
{
  "email": "admin@sonaverse.kr",
  "password": "PlainTextPassword"
}
```

- **응답 (성공 시)** – 200 OK

```json
{
  "user": {
    "id": "admin_user_id",
    "email": "admin@sonaverse.kr",
    "name": "관리자 이름",
    "role": "admin"
  },
  "token": "access_jwt",
  "refreshToken": "refresh_jwt"
}
```

- **부가사항**
  - `Set-Cookie: admin_token=...; HttpOnly; Secure; SameSite=Lax`
  - 세션 정보는 `AdminSession` 테이블에 저장.

### 2.2 POST `/api/admin/logout`

- **설명**: 관리자 로그아웃
- **인증**: `Authorization: Bearer <token>` 또는 `admin_token` 쿠키
- **요청 Body**: 없음
- **응답**: 204 No Content
- **동작**
  - 해당 세션(`AdminSession`) 무효화.
  - 브라우저 쿠키 제거 지시.

### 2.3 POST `/api/admin/refresh`

- **설명**: 액세스 토큰 갱신
- **인증**: 리프레시 토큰 (쿠키 또는 Body)
- **요청 Body**

```json
{
  "refreshToken": "refresh_jwt"
}
```

- **응답**: 새로운 `token` + `refreshToken` (선택)

---

## 3. 공개 API (사용자용)

> 모든 공개 API는 **읽기 전용**이며, 로그인 없이 호출 가능해야 합니다.  
> 다만 Rate Limit, 기본적인 입력 검증은 필수입니다.

### 3.1 언론보도 (Press)

#### 3.1.1 GET `/api/press`

- **설명**: 언론보도 목록 조회
- **쿼리 파라미터**
  - `page`: 페이지 번호 (기본값: 1)
  - `pageSize`: 페이지 크기 (기본값: 10, 최대 50)
  - `category`: 카테고리 슬러그 (선택)
  - `tag`: 태그 슬러그 (선택)
  - `search`: 제목/요약 검색 (선택)
- **응답 예시**

```json
{
  "items": [
    {
      "slug": "sonaverse-ai-companion-launch",
      "title_ko": "소나버스, 시니어 맞춤형 AI 컴패니언 서비스 출시",
      "press_name": "한국경제",
      "thumbnail_url": "/images/press/sonaverse-ai-companion.webp",
      "excerpt_ko": "시니어 테크 스타트업 소나버스가...",
      "published_date": "2023-10-24T00:00:00.000Z",
      "is_featured": true
    }
  ],
  "page": 1,
  "pageSize": 10,
  "total": 123
}
```

#### 3.1.2 GET `/api/press/[slug]`

- **설명**: 언론보도 상세 조회
- **응답**
  - `PressRelease` + 관련 SEO 정보 (`SEO`) + 썸네일/OG 이미지 URL 등.

### 3.2 소나버스 스토리 (Stories)

#### 3.2.1 GET `/api/sonaverse-story`

- **설명**: 소나버스 스토리 목록
- **쿼리 파라미터**
  - `page`, `pageSize`
  - `category`: `product_story | usage | health_info | welfare_info`
  - `tag`: 태그 슬러그
  - `featured`: `true` (메인 스토리만)
- **응답**
  - `items`: `SonaverseStory` 목록 (썸네일·제목·요약·날짜 등)

#### 3.2.2 GET `/api/sonaverse-story/[slug]`

- **설명**: 스토리 상세 조회
- **응답**
  - 본문(리치 텍스트), YouTube URL, 태그, SEO 정보 등.

### 3.3 제품 (Products)

#### 3.3.1 GET `/api/products`

- **설명**: 제품 목록 (만보/보듬 등)
- **쿼리 파라미터**
  - `type`: `manbo | bodeum | other` (선택)
  - `activeOnly`: `true` 기본
- **응답**

```json
{
  "items": [
    {
      "slug": "manbo-walker",
      "type": "manbo",
      "name_ko": "만보 (MANBO)",
      "subtitle_ko": "하이브리드형 워크메이트",
      "hero_image_url": "/product/manbo/hero/main.webp",
      "features": ["하이브리드 주행", "경사지 제어", "비상 자동 정지"]
    }
  ]
}
```

#### 3.3.2 GET `/api/products/[slug]`

- **설명**: 제품 상세
- **응답**
  - `Product` + `ProductVariant[]` + `ProductImage[]` + SEO.

### 3.4 문의 (Inquiry)

#### 3.4.1 POST `/api/inquiry`

- **설명**: 구매/제휴 문의 접수
- **인증**: 없음 (단, Rate Limit 필수)
- **요청 Body**

```json
{
  "inquiry_type": "service_introduction",
  "name": "홍길동",
  "position": "팀장",
  "company_name": "(주)소나버스",
  "phone_number": "010-0000-0000",
  "email": "example@company.com",
  "message": "구체적인 문의 내용을 남겨주시면...",
  "privacy_consented": true,
  "attached_files": ["file_id_1", "file_id_2"]
}
```

- **응답**
  - 201 Created + 생성된 `Inquiry`의 ID 또는 간단한 상태 응답.

#### 3.4.2 POST `/api/inquiry/upload`

- **설명**: 문의 페이지 첨부파일 업로드
- **인증**: 없음 (파일 타입/크기·Rate Limit 필수)
- **요청**: `multipart/form-data`
  - `file`: 업로드 파일
- **응답**

```json
{
  "file_id": "file_object_id",
  "filename": "original.pdf",
  "url": "https://cdn.sonaverse.kr/files/...",
  "mime_type": "application/pdf",
  "size": 123456
}
```

---

## 4. 관리자 API (CMS용)

> 모든 관리자 API는 `/api/admin/**` 네임스페이스 사용, JWT + 세션 기반 인증 필수입니다.

### 4.1 언론보도 관리 (Admin Press)

#### 4.1.1 GET `/api/admin/press`

- **설명**: 언론보도 목록 (관리자용, 미발행 포함)
- **쿼리 파라미터**
  - `page`, `pageSize`, `search`, `is_published`, `is_featured`, `from`, `to`

#### 4.1.2 GET `/api/admin/press/[id]`

- **설명**: 언론보도 단일 조회 (ID 기준)

#### 4.1.3 POST `/api/admin/press`

- **설명**: 언론보도 생성
- **요청 Body**: `PressRelease` 생성에 필요한 필드 (slug, title_ko, content_ko, published_date 등)

#### 4.1.4 PUT `/api/admin/press/[id]`

- **설명**: 언론보도 수정

#### 4.1.5 DELETE `/api/admin/press/[id]`

- **설명**: 언론보도 삭제 (소프트 삭제 권장 – `is_published`/`is_active` 플래그 활용)

### 4.2 소나버스 스토리 관리 (Admin Stories)

유사 패턴으로:
- `GET /api/admin/stories`
- `GET /api/admin/stories/[id]`
- `POST /api/admin/stories`
- `PUT /api/admin/stories/[id]`
- `DELETE /api/admin/stories/[id]`
- 메인 스토리 지정용 `PATCH /api/admin/stories/[id]/main`

### 4.3 제품 관리 (Admin Products)

- `GET /api/admin/products`
- `GET /api/admin/products/[id]`
- `POST /api/admin/products`
- `PUT /api/admin/products/[id]`
- `DELETE /api/admin/products/[id]`
- 변형/옵션용:
  - `POST /api/admin/products/[id]/variants`
  - `PUT /api/admin/variants/[variantId]`
  - `DELETE /api/admin/variants/[variantId]`

### 4.4 문의 관리 (Admin Inquiries)

- `GET /api/admin/inquiries`
  - 필터: `status`, `inquiry_type`, `from`, `to`, `search`
- `GET /api/admin/inquiries/[id]`
- `PATCH /api/admin/inquiries/[id]`
  - 상태 변경: `status`, `priority`, `assigned_to`, `response`, `responded_at`

### 4.5 파일·이미지 관리 (Admin Files/Images)

- `POST /api/admin/upload/image`
  - 관리자용 이미지 업로드 (히어로, 제품, 스토리, 언론보도 등)
  - DB: `Image`, `ImageVariant`, `ImageUsage` 업데이트
- `GET /api/admin/images`
  - 카테고리별/검색 기능
- `DELETE /api/admin/images/[id]`

---

## 5. 공통 응답 포맷

### 5.1 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... } // 페이지네이션, 추가 정보 등
}
```

### 5.2 에러 응답

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값 검증 실패",
    "details": [
      { "field": "email", "message": "올바른 이메일 형식이 아닙니다" }
    ]
  }
}
```

---

## 6. 에러 코드 규칙

- `VALIDATION_ERROR`: Zod/Joi 검증 실패
- `AUTH_REQUIRED`: 인증 필요
- `FORBIDDEN`: 권한 없음
- `NOT_FOUND`: 리소스를 찾을 수 없음
- `CONFLICT`: 슬러그 중복 등 충돌
- `INTERNAL_ERROR`: 서버 내부 오류

---

**작성일**: 2025년 1월  
**목적**: Sonaverse 홈페이지 리뉴얼용 API 설계 기준 문서  
**상태**: 설계 완료 (구현 대기)


