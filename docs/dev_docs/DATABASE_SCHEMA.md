# Sonaverse Re 데이터베이스 스키마 설계서 (v2.0)

> **목적**: 확장 가능하고 세밀한 데이터베이스 구조 설계
> **원칙**: 모듈화, 정규화, 버전 관리, 다국어 지원, 성능 최적화
> **데이터베이스**: MongoDB (sonaverseRe)

---

## 📋 목차

1. [스키마 개요](#1-스키마-개요)
2. [인증 및 권한](#2-인증-및-권한)
3. [콘텐츠 관리](#3-콘텐츠-관리)
4. [제품 관리](#4-제품-관리)
5. [이미지 및 미디어 관리](#5-이미지-및-미디어-관리)
6. [문의 및 고객지원](#6-문의-및-고객지원)
7. [분석 및 로깅](#7-분석-및-로깅)
8. [시스템 설정](#8-시스템-설정)
9. [버전 관리 및 히스토리](#9-버전-관리-및-히스토리)
10. [인덱스 전략](#10-인덱스-전략)

---

## 1. 스키마 개요

### 1.1 컬렉션 그룹

| 그룹 | 컬렉션 수 | 설명 |
|------|----------|------|
| 인증 및 권한 | 3개 | 관리자 계정, 세션, 권한 관리 |
| 콘텐츠 관리 | 10개 | 언론보도, 스토리, 카테고리, 태그, 연혁, SEO, 콘텐츠 블록 |
| 제품 관리 | 5개 | 제품, 제품 카테고리, 제품 변형, 제품 이미지, 제품 리뷰 |
| 이미지 및 미디어 | 4개 | 이미지, 이미지 변형, 이미지 사용처, 비디오 |
| 문의 및 고객지원 | 3개 | 문의, 문의 첨부파일, FAQ |
| 분석 및 로깅 | 4개 | 방문자 로그, 페이지 뷰, 이벤트 로그, 분석 집계 |
| 시스템 설정 | 3개 | 시스템 설정, 파일 관리, 메뉴 관리 |
| 버전 관리 | 2개 | 콘텐츠 버전, 변경 히스토리 |

**총 34개 컬렉션**

---

## 2. 인증 및 권한

### 2.1 AdminUser (관리자 계정)

```typescript
interface AdminUser {
  _id: ObjectId;

  // 기본 정보
  email: string;                           // 이메일 (유니크, 인덱스)
  password_hash: string;                   // bcrypt 해시
  name: string;                            // 이름
  profile_image_id?: ObjectId;             // 참조: Image
  phone?: string;                          // 연락처

  // 권한 및 역할
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';  // 역할
  permissions: {
    press_releases: ('create' | 'read' | 'update' | 'delete')[];
    stories: ('create' | 'read' | 'update' | 'delete')[];
    products: ('create' | 'read' | 'update' | 'delete')[];
    inquiries: ('read' | 'update' | 'delete')[];
    analytics: ('read')[];
    settings: ('read' | 'update')[];
    users: ('create' | 'read' | 'update' | 'delete')[];
  };                                       // 세밀한 권한 관리

  // 상태 관리
  is_active: boolean;                      // 활성 상태
  is_email_verified: boolean;              // 이메일 인증 여부
  email_verified_at?: Date;                // 이메일 인증 시간

  // 보안
  two_factor_enabled: boolean;             // 2FA 활성화 여부
  two_factor_secret?: string;              // 2FA 시크릿 (암호화)
  failed_login_attempts: number;           // 실패한 로그인 시도 횟수
  locked_until?: Date;                     // 계정 잠금 해제 시간
  password_changed_at?: Date;              // 비밀번호 변경 시간

  // 활동 추적
  last_login_at?: Date;                    // 마지막 로그인 시간
  last_login_ip?: string;                  // 마지막 로그인 IP
  last_activity_at?: Date;                 // 마지막 활동 시간

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by?: ObjectId;                   // 참조: AdminUser
  updated_by?: ObjectId;                   // 참조: AdminUser
  deleted_at?: Date;                       // Soft delete
}
```

**인덱스**:
- `email` (유니크)
- `role`
- `is_active`
- `{ is_active: 1, role: 1 }` (복합)
- `deleted_at` (Sparse)

---

### 2.2 AdminSession (관리자 세션)

```typescript
interface AdminSession {
  _id: ObjectId;

  // 세션 정보
  user_id: ObjectId;                       // 참조: AdminUser
  token: string;                           // JWT 액세스 토큰 (유니크)
  refresh_token: string;                   // 리프레시 토큰 (유니크)

  // 디바이스 및 위치 정보
  ip_address: string;                      // IP 주소
  user_agent: string;                      // User Agent
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser?: string;                        // 브라우저
  os?: string;                             // 운영체제
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };

  // 만료 관리
  expires_at: Date;                        // 만료 시간
  refresh_expires_at: Date;                // 리프레시 토큰 만료 시간

  // 활동 추적
  created_at: Date;
  last_used_at: Date;                      // 마지막 사용 시간
  revoked_at?: Date;                       // 세션 취소 시간
  revoked_reason?: string;                 // 취소 사유
}
```

**인덱스**:
- `token` (유니크)
- `refresh_token` (유니크)
- `user_id`
- `{ user_id: 1, created_at: -1 }` (복합)
- `expires_at` (TTL 인덱스)

---

### 2.3 AdminRole (관리자 역할 - 선택적)

```typescript
interface AdminRole {
  _id: ObjectId;

  // 역할 정보
  name: string;                            // 역할명 (유니크)
  display_name_ko: string;                 // 표시명 (한국어)
  display_name_en?: string;                // 표시명 (영어)
  description_ko?: string;                 // 설명 (한국어)
  description_en?: string;                 // 설명 (영어)

  // 권한 설정
  permissions: {
    resource: string;                      // 리소스명
    actions: string[];                     // 허용 액션
  }[];

  // 메타데이터
  is_system_role: boolean;                 // 시스템 역할 여부 (수정 불가)
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: ObjectId;
}
```

**인덱스**:
- `name` (유니크)
- `is_active`

---

## 3. 콘텐츠 관리

### 3.1 PressRelease (언론보도)

```typescript
interface PressRelease {
  _id: ObjectId;

  // URL 및 식별자
  slug: string;                            // URL 슬러그 (유니크, 인덱스)
  press_id: string;                        // 언론보도 고유 ID (예: PR-2025-001)

  // 기본 정보
  title: {
    ko: string;                            // 제목 (한국어)
    en?: string;                           // 제목 (영어)
  };

  press_name: {
    ko: string;                            // 언론사명 (한국어)
    en?: string;                           // 언론사명 (영어)
  };

  excerpt: {
    ko?: string;                           // 요약 (한국어)
    en?: string;                           // 요약 (영어)
  };

  content: {
    ko: string;                            // 본문 (한국어, 리치 텍스트)
    en?: string;                           // 본문 (영어, 리치 텍스트)
  };

  // 미디어
  thumbnail_image_id?: ObjectId;           // 참조: Image
  featured_image_id?: ObjectId;            // 참조: Image
  gallery_image_ids: ObjectId[];           // 참조: Image[]

  // 외부 링크
  external_url?: string;                   // 외부 언론사 링크
  pdf_file_id?: ObjectId;                  // 참조: File (PDF)

  // 분류
  category_id?: ObjectId;                  // 참조: Category
  tags: ObjectId[];                        // 참조: Tag[]

  // 발행 정보
  published_date: Date;                    // 발행일
  is_published: boolean;                   // 발행 여부
  is_featured: boolean;                    // 주요 뉴스 여부
  featured_order?: number;                 // 주요 뉴스 정렬 순서
  published_at?: Date;                     // 실제 발행 시간
  unpublished_at?: Date;                   // 미발행 시간

  // 통계
  view_count: number;                      // 조회수
  like_count: number;                      // 좋아요 수
  share_count: number;                     // 공유 수

  // SEO
  seo: {
    meta_title_ko?: string;
    meta_title_en?: string;
    meta_description_ko?: string;
    meta_description_en?: string;
    keywords_ko?: string[];
    keywords_en?: string[];
    og_image_id?: ObjectId;                // 참조: Image
    canonical_url?: string;
  };

  // 버전 관리
  version: number;                         // 버전 번호
  is_latest_version: boolean;              // 최신 버전 여부

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;                    // 참조: AdminUser
  updated_by?: ObjectId;                   // 참조: AdminUser
  deleted_at?: Date;                       // Soft delete
}
```

**인덱스**:
- `slug` (유니크)
- `press_id` (유니크)
- `{ is_published: 1, published_date: -1 }` (복합)
- `{ is_featured: 1, featured_order: 1 }` (복합)
- `category_id`
- `created_at`
- `deleted_at` (Sparse)

---

### 3.2 SonaverseStory (소나버스 스토리)

```typescript
interface SonaverseStory {
  _id: ObjectId;

  // URL 및 식별자
  slug: string;                            // URL 슬러그 (유니크, 인덱스)
  story_id: string;                        // 스토리 고유 ID (예: STORY-2025-001)

  // 카테고리
  category: 'product_story' | 'usage' | 'health_info' | 'welfare_info' | 'company_news' | 'interview';
  category_id?: ObjectId;                  // 참조: Category (동적 카테고리)

  // 기본 정보
  title: {
    ko: string;                            // 제목 (한국어)
    en?: string;                           // 제목 (영어)
  };

  subtitle: {
    ko?: string;                           // 부제목 (한국어)
    en?: string;                           // 부제목 (영어)
  };

  excerpt: {
    ko?: string;                           // 요약 (한국어)
    en?: string;                           // 요약 (영어)
  };

  // 콘텐츠
  content: {
    ko: {
      body: string;                        // 본문 (리치 텍스트)
      blocks?: ContentBlock[];             // 구조화된 콘텐츠 블록
    };
    en?: {
      body?: string;
      blocks?: ContentBlock[];
    };
  };

  // 미디어
  thumbnail_image_id?: ObjectId;           // 참조: Image
  featured_image_id?: ObjectId;            // 참조: Image
  gallery_image_ids: ObjectId[];           // 참조: Image[]

  // 동영상
  youtube_url?: string;                    // YouTube URL
  youtube_video_id?: string;               // YouTube 비디오 ID
  youtube_thumbnail_url?: string;          // YouTube 썸네일 URL
  video_ids: ObjectId[];                   // 참조: Video[] (자체 호스팅)

  // 관련 콘텐츠
  related_product_ids: ObjectId[];         // 참조: Product[]
  related_story_ids: ObjectId[];           // 참조: SonaverseStory[]

  // 분류
  tags: ObjectId[];                        // 참조: Tag[]

  // 발행 정보
  is_main: boolean;                        // 메인 스토리 여부
  is_published: boolean;                   // 발행 여부
  is_featured: boolean;                    // 추천 스토리 여부
  featured_order?: number;                 // 추천 정렬 순서
  display_priority: number;                // 표시 우선순위 (1-100)
  published_at?: Date;                     // 발행일
  scheduled_publish_at?: Date;             // 예약 발행일
  unpublished_at?: Date;                   // 미발행 시간

  // 작성자 정보
  author: {
    name_ko: string;
    name_en?: string;
    title_ko?: string;                     // 직함
    title_en?: string;
    bio_ko?: string;                       // 약력
    bio_en?: string;
    image_id?: ObjectId;                   // 참조: Image
  };

  // 통계
  view_count: number;                      // 조회수
  read_time_minutes: number;               // 예상 읽기 시간 (분)
  like_count: number;                      // 좋아요 수
  share_count: number;                     // 공유 수
  comment_count: number;                   // 댓글 수 (미래 확장)

  // SEO
  seo: {
    meta_title_ko?: string;
    meta_title_en?: string;
    meta_description_ko?: string;
    meta_description_en?: string;
    keywords_ko?: string[];
    keywords_en?: string[];
    og_image_id?: ObjectId;
    canonical_url?: string;
    structured_data?: Record<string, any>; // JSON-LD
  };

  // 버전 관리
  version: number;
  is_latest_version: boolean;

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;                    // 참조: AdminUser
  updated_by?: ObjectId;                   // 참조: AdminUser
  deleted_at?: Date;                       // Soft delete
}

// 콘텐츠 블록 타입
interface ContentBlock {
  _id: ObjectId;
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'list' | 'code' | 'callout' | 'divider' | 'embed';
  order: number;
  data: {
    // paragraph
    text?: string;

    // heading
    level?: 1 | 2 | 3 | 4 | 5 | 6;

    // image
    image_id?: ObjectId;
    caption?: string;
    alt_text?: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large' | 'full';

    // video
    video_id?: ObjectId;
    youtube_url?: string;

    // quote
    quote?: string;
    author?: string;

    // list
    items?: string[];
    ordered?: boolean;

    // code
    code?: string;
    language?: string;

    // callout
    message?: string;
    variant?: 'info' | 'warning' | 'success' | 'error';

    // embed
    url?: string;
    html?: string;
  };
}
```

**인덱스**:
- `slug` (유니크)
- `story_id` (유니크)
- `{ is_published: 1, published_at: -1 }` (복합)
- `{ category: 1, is_published: 1, published_at: -1 }` (복합)
- `{ is_main: 1, display_priority: -1 }` (복합)
- `{ is_featured: 1, featured_order: 1 }` (복합)
- `tags`
- `created_at`
- `deleted_at` (Sparse)

---

### 3.3 Category (카테고리)

```typescript
interface Category {
  _id: ObjectId;

  // 카테고리 정보
  name: {
    ko: string;                            // 카테고리명 (한국어)
    en?: string;                           // 카테고리명 (영어)
  };

  slug: string;                            // 슬러그 (유니크, 인덱스)

  description: {
    ko?: string;                           // 설명 (한국어)
    en?: string;                           // 설명 (영어)
  };

  // 타입 및 계층
  type: 'press' | 'story' | 'product' | 'faq';
  parent_id?: ObjectId;                    // 참조: Category (상위 카테고리)
  level: number;                           // 계층 레벨 (0: 최상위)
  path: string;                            // 계층 경로 (예: "parent/child")

  // 표시 정보
  icon?: string;                           // 아이콘 (Material Symbols)
  color?: string;                          // 색상 (HEX)
  image_id?: ObjectId;                     // 참조: Image

  // 정렬 및 상태
  order: number;                           // 정렬 순서
  is_active: boolean;                      // 활성 상태
  is_visible_in_menu: boolean;             // 메뉴 표시 여부

  // 통계
  item_count: number;                      // 항목 수

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by?: ObjectId;
  updated_by?: ObjectId;
}
```

**인덱스**:
- `slug` (유니크)
- `{ type: 1, parent_id: 1, order: 1 }` (복합)
- `{ is_active: 1, is_visible_in_menu: 1 }` (복합)
- `path`

---

### 3.4 Tag (태그)

```typescript
interface Tag {
  _id: ObjectId;

  // 태그 정보
  name: {
    ko: string;                            // 태그명 (한국어)
    en?: string;                           // 태그명 (영어)
  };

  slug: string;                            // 슬러그 (유니크, 인덱스)

  // 타입
  type: 'press' | 'story' | 'product' | 'general';

  // 표시 정보
  color?: string;                          // 태그 색상
  icon?: string;                           // 아이콘

  // 통계
  usage_count: number;                     // 사용 횟수

  // 관련 정보
  related_tag_ids: ObjectId[];             // 관련 태그

  // 메타데이터
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: ObjectId;
}
```

**인덱스**:
- `slug` (유니크)
- `{ type: 1, usage_count: -1 }` (복합)
- `is_active`

---

### 3.5 CompanyHistory (회사 연혁)

```typescript
interface CompanyHistory {
  _id: ObjectId;

  // 시간 정보
  year: number;                            // 연도
  month?: number;                          // 월 (1-12)
  day?: number;                            // 일 (1-31)
  quarter?: 1 | 2 | 3 | 4;                // 분기
  date?: Date;                             // 정확한 날짜

  // 이벤트 정보
  title: {
    ko: string;                            // 제목 (한국어)
    en?: string;                           // 제목 (영어)
  };

  description: {
    ko?: string;                           // 설명 (한국어)
    en?: string;                           // 설명 (영어)
  };

  content: {
    ko?: string;                           // 상세 내용 (리치 텍스트)
    en?: string;
  };

  // 분류
  event_type: 'founding' | 'award' | 'certification' | 'product_launch' | 'partnership' | 'funding' | 'milestone' | 'other';
  category?: string;                       // 커스텀 카테고리

  // 미디어
  icon?: string;                           // 아이콘 (Material Symbols)
  image_id?: ObjectId;                     // 참조: Image
  image_ids: ObjectId[];                   // 참조: Image[] (갤러리)

  // 관련 링크
  related_press_release_ids: ObjectId[];   // 참조: PressRelease[]
  related_story_ids: ObjectId[];           // 참조: SonaverseStory[]
  external_links: {
    title: string;
    url: string;
  }[];

  // 표시 정보
  order: number;                           // 정렬 순서
  is_active: boolean;                      // 활성 상태
  is_major_event: boolean;                 // 주요 이벤트 여부
  highlight_color?: string;                // 강조 색상

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
  updated_by?: ObjectId;
}
```

**인덱스**:
- `{ year: -1, month: -1, day: -1 }` (복합)
- `{ is_active: 1, order: 1 }` (복합)
- `event_type`
- `is_major_event`

---

### 3.6 ContentBlock (재사용 가능한 콘텐츠 블록)

```typescript
interface ContentBlock {
  _id: ObjectId;

  // 블록 정보
  name: {
    ko: string;
    en?: string;
  };

  slug: string;                            // 슬러그 (유니크)

  description: {
    ko?: string;
    en?: string;
  };

  // 블록 타입
  block_type: 'hero' | 'cta' | 'feature' | 'testimonial' | 'faq' | 'banner' | 'custom';

  // 콘텐츠
  content: {
    ko: Record<string, any>;               // 블록별 커스텀 데이터
    en?: Record<string, any>;
  };

  // 미디어
  image_ids: ObjectId[];
  video_ids: ObjectId[];

  // 사용처
  usage_locations: {
    page: string;                          // 페이지 식별자
    section: string;                       // 섹션 식별자
  }[];

  // 메타데이터
  is_active: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
  updated_by?: ObjectId;
}
```

**인덱스**:
- `slug` (유니크)
- `{ block_type: 1, is_active: 1 }` (복합)

---

## 4. 제품 관리

### 4.1 Product (제품)

```typescript
interface Product {
  _id: ObjectId;

  // URL 및 식별자
  slug: string;                            // URL 슬러그 (유니크)
  product_id: string;                      // 제품 고유 ID (예: PROD-MANBO-001)
  sku?: string;                            // SKU 코드

  // 제품 타입
  type: 'manbo' | 'bodeum' | 'accessory' | 'other';

  // 기본 정보
  name: {
    ko: string;                            // 제품명 (한국어)
    en?: string;                           // 제품명 (영어)
  };

  subtitle: {
    ko?: string;                           // 부제목 (한국어)
    en?: string;                           // 부제목 (영어)
  };

  short_description: {
    ko?: string;                           // 짧은 설명
    en?: string;
  };

  description: {
    ko?: string;                           // 상세 설명
    en?: string;
  };

  content: {
    ko?: string;                           // 상세 내용 (리치 텍스트)
    en?: string;
  };

  // 미디어
  hero_image_id?: ObjectId;                // 참조: Image (히어로 이미지)
  thumbnail_image_id?: ObjectId;           // 참조: Image
  gallery_image_ids: ObjectId[];           // 참조: Image[]
  video_ids: ObjectId[];                   // 참조: Video[]

  // 분류
  category_id?: ObjectId;                  // 참조: Category
  subcategory_ids: ObjectId[];             // 참조: Category[]
  tags: ObjectId[];                        // 참조: Tag[]

  // 제품 특징
  features: {
    ko: string[];                          // 주요 기능 (배지)
    en?: string[];
  };

  specifications: {
    key: string;                           // 스펙 키 (예: "무게", "크기")
    value_ko: string;
    value_en?: string;
    unit?: string;                         // 단위
    order: number;
  }[];

  // 가격 정보
  pricing: {
    retail_price?: number;                 // 소비자가
    sale_price?: number;                   // 판매가
    discount_rate?: number;                // 할인율
    currency: string;                      // 통화 (KRW, USD)
    tax_included: boolean;                 // 세금 포함 여부
    pricing_note_ko?: string;              // 가격 안내
    pricing_note_en?: string;
  };

  // 재고 관리
  inventory: {
    track_inventory: boolean;              // 재고 추적 여부
    quantity?: number;                     // 재고 수량
    low_stock_threshold?: number;          // 낮은 재고 기준
    is_in_stock: boolean;                  // 재고 있음
    is_backorder_allowed: boolean;         // 품절 시 예약주문 허용
  };

  // 구매 옵션
  purchase_options: {
    online_purchase_enabled: boolean;      // 온라인 구매 가능
    purchase_url?: string;                 // 구매 링크
    inquiry_enabled: boolean;              // 문의 가능
    demo_request_enabled: boolean;         // 데모 요청 가능
  };

  // 배송 정보
  shipping: {
    weight?: number;                       // 무게 (kg)
    dimensions?: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'inch';
    };
    shipping_fee?: number;                 // 배송비
    free_shipping_threshold?: number;      // 무료배송 기준
  };

  // 관련 제품
  related_product_ids: ObjectId[];         // 참조: Product[]

  // 표시 정보
  is_active: boolean;                      // 활성 상태
  is_featured: boolean;                    // 추천 제품 여부
  display_order: number;                   // 표시 순서

  // 통계
  view_count: number;
  purchase_count: number;
  review_count: number;
  average_rating: number;                  // 평균 평점 (0-5)

  // SEO
  seo: {
    meta_title_ko?: string;
    meta_title_en?: string;
    meta_description_ko?: string;
    meta_description_en?: string;
    keywords_ko?: string[];
    keywords_en?: string[];
    og_image_id?: ObjectId;
    canonical_url?: string;
  };

  // 메타데이터
  version: number;
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
  updated_by?: ObjectId;
  deleted_at?: Date;
}
```

**인덱스**:
- `slug` (유니크)
- `product_id` (유니크)
- `sku` (유니크, Sparse)
- `{ type: 1, is_active: 1, display_order: 1 }` (복합)
- `{ is_featured: 1, display_order: 1 }` (복합)
- `category_id`
- `deleted_at` (Sparse)

---

### 4.2 ProductCategory (제품 카테고리)

```typescript
interface ProductCategory {
  _id: ObjectId;

  // 카테고리 정보
  product_id: ObjectId;                    // 참조: Product

  name: {
    ko: string;                            // 카테고리명 (한국어)
    en?: string;                           // 카테고리명 (영어)
  };

  slug: string;                            // 슬러그

  description: {
    ko?: string;                           // 설명 (한국어)
    en?: string;                           // 설명 (영어)
  };

  // 표시 정보
  icon?: string;
  color?: string;
  image_id?: ObjectId;

  order: number;                           // 정렬 순서
  is_active: boolean;                      // 활성 상태

  // 메타데이터
  created_at: Date;
  updated_at: Date;
}
```

**인덱스**:
- `product_id`
- `{ product_id: 1, order: 1 }` (복합)
- `{ slug: 1, is_active: 1 }` (복합)

---

### 4.3 ProductVariant (제품 변형)

```typescript
interface ProductVariant {
  _id: ObjectId;

  // 관계
  product_id: ObjectId;                    // 참조: Product
  category_id?: ObjectId;                  // 참조: ProductCategory

  // 변형 정보
  name: {
    ko: string;                            // 변형명 (한국어)
    en?: string;                           // 변형명 (영어)
  };

  sku?: string;                            // SKU 코드 (유니크)

  description: {
    ko?: string;                           // 설명 (한국어)
    en?: string;                           // 설명 (영어)
  };

  // 옵션 (예: 사이즈, 색상)
  options: {
    name_ko: string;                       // 옵션명
    name_en?: string;
    value_ko: string;                      // 옵션값
    value_en?: string;
  }[];

  // 미디어
  thumbnail_image_id?: ObjectId;           // 참조: Image
  image_ids: ObjectId[];                   // 참조: Image[]

  // 가격
  price?: number;                          // 가격
  sale_price?: number;                     // 할인가

  // 재고
  inventory: {
    track_inventory: boolean;
    quantity?: number;
    is_in_stock: boolean;
  };

  // 표시 정보
  is_active: boolean;                      // 활성 상태
  is_default: boolean;                     // 기본 변형 여부
  order: number;                           // 정렬 순서

  // 메타데이터
  created_at: Date;
  updated_at: Date;
}
```

**인덱스**:
- `product_id`
- `category_id`
- `sku` (유니크, Sparse)
- `{ product_id: 1, is_active: 1, order: 1 }` (복합)

---

### 4.4 ProductImage (제품 이미지)

```typescript
interface ProductImage {
  _id: ObjectId;

  // 관계
  product_id: ObjectId;                    // 참조: Product
  variant_id?: ObjectId;                   // 참조: ProductVariant
  image_id: ObjectId;                      // 참조: Image

  // 이미지 타입
  type: 'hero' | 'thumbnail' | 'feature' | 'gallery' | 'detail' | 'lifestyle';

  // 대체 텍스트
  alt_text: {
    ko?: string;
    en?: string;
  };

  caption: {
    ko?: string;
    en?: string;
  };

  // 표시 정보
  order: number;                           // 정렬 순서
  is_primary: boolean;                     // 주 이미지 여부

  // 메타데이터
  created_at: Date;
  updated_at?: Date;
}
```

**인덱스**:
- `product_id`
- `variant_id`
- `{ product_id: 1, type: 1, order: 1 }` (복합)

---

### 4.5 ProductReview (제품 리뷰 - 미래 확장)

```typescript
interface ProductReview {
  _id: ObjectId;

  // 관계
  product_id: ObjectId;                    // 참조: Product
  variant_id?: ObjectId;                   // 참조: ProductVariant

  // 리뷰어 정보 (익명)
  reviewer_name: string;                   // 리뷰어 이름
  reviewer_email?: string;                 // 이메일 (비공개)
  is_verified_purchase: boolean;           // 구매 인증 여부

  // 리뷰 내용
  rating: number;                          // 평점 (1-5)
  title?: string;                          // 제목
  content: string;                         // 내용

  pros?: string[];                         // 장점
  cons?: string[];                         // 단점

  // 미디어
  image_ids: ObjectId[];                   // 참조: Image[]

  // 상태
  is_approved: boolean;                    // 승인 여부
  is_featured: boolean;                    // 추천 리뷰 여부

  // 통계
  helpful_count: number;                   // 도움됨 수
  unhelpful_count: number;                 // 도움 안됨 수

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  approved_at?: Date;
  approved_by?: ObjectId;                  // 참조: AdminUser
}
```

**인덱스**:
- `product_id`
- `{ product_id: 1, is_approved: 1, created_at: -1 }` (복합)
- `{ is_featured: 1, helpful_count: -1 }` (복합)

---

## 5. 이미지 및 미디어 관리

### 5.1 Image (이미지 메타데이터)

```typescript
interface Image {
  _id: ObjectId;

  // 파일 정보
  filename: string;                        // 파일명 (유니크, 인덱스)
  original_filename: string;               // 원본 파일명

  // 저장 경로
  storage_provider: 'local' | 'vercel_blob' | 's3' | 'cloudinary';
  path: string;                            // 저장 경로
  url: string;                             // CDN URL
  public_url?: string;                     // 공개 URL

  // 파일 속성
  mime_type: string;                       // MIME 타입
  size: number;                            // 파일 크기 (bytes)
  width: number;                           // 너비 (px)
  height: number;                          // 높이 (px)
  aspect_ratio: string;                    // 종횡비 (예: "16:9")
  format: 'webp' | 'avif' | 'jpg' | 'png' | 'gif' | 'svg';

  // 대체 텍스트
  alt_text: {
    ko?: string;                           // 대체 텍스트 (한국어)
    en?: string;                           // 대체 텍스트 (영어)
  };

  caption: {
    ko?: string;                           // 캡션 (한국어)
    en?: string;                           // 캡션 (영어)
  };

  // 분류
  category: 'hero' | 'product' | 'story' | 'press' | 'profile' | 'logo' | 'icon' | 'common';
  tags: string[];                          // 태그 (검색용)

  // 최적화
  is_optimized: boolean;                   // 최적화 여부
  optimization_version?: number;           // 최적화 버전
  optimization_details?: {
    original_size: number;
    compressed_size: number;
    compression_ratio: number;
    quality: number;
  };

  // 색상 정보
  dominant_color?: string;                 // 주요 색상 (HEX)
  color_palette?: string[];                // 색상 팔레트

  // 메타데이터 (EXIF)
  exif?: Record<string, any>;

  // 사용 추적
  usage_count: number;                     // 사용 횟수
  last_used_at?: Date;                     // 마지막 사용 시간

  // 접근 제어
  is_public: boolean;                      // 공개 여부
  requires_auth: boolean;                  // 인증 필요 여부

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;                    // 참조: AdminUser
  deleted_at?: Date;                       // Soft delete
}
```

**인덱스**:
- `filename` (유니크)
- `{ category: 1, created_at: -1 }` (복합)
- `{ is_optimized: 1, category: 1 }` (복합)
- `tags`
- `deleted_at` (Sparse)

---

### 5.2 ImageVariant (이미지 변형)

```typescript
interface ImageVariant {
  _id: ObjectId;

  // 관계
  image_id: ObjectId;                      // 참조: Image

  // 변형 정보
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original';
  width: number;                           // 너비 (px)
  height: number;                          // 높이 (px)

  // 저장 경로
  path: string;                            // 저장 경로
  url: string;                             // CDN URL

  // 파일 속성
  format: 'webp' | 'avif' | 'jpg' | 'png';
  quality: number;                         // 품질 (0-100)
  size_bytes: number;                      // 파일 크기 (bytes)

  // 변환 옵션
  transform_options?: {
    crop?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    fit?: 'cover' | 'contain' | 'fill';
    filter?: string;
  };

  // 메타데이터
  created_at: Date;
}
```

**인덱스**:
- `image_id`
- `{ image_id: 1, size: 1 }` (유니크 복합)

---

### 5.3 ImageUsage (이미지 사용처 추적)

```typescript
interface ImageUsage {
  _id: ObjectId;

  // 관계
  image_id: ObjectId;                      // 참조: Image

  // 엔티티 정보
  entity_type: 'press' | 'story' | 'product' | 'variant' | 'page' | 'category' | 'profile';
  entity_id: ObjectId;                     // 엔티티 ID

  // 사용 타입
  usage_type: 'thumbnail' | 'hero' | 'featured' | 'gallery' | 'content' | 'background' | 'icon';

  // 위치 정보 (리치 텍스트 내부)
  content_block_id?: ObjectId;             // 콘텐츠 블록 ID
  field_name?: string;                     // 필드명

  // 메타데이터
  created_at: Date;
  removed_at?: Date;                       // 제거 시간
}
```

**인덱스**:
- `image_id`
- `{ entity_type: 1, entity_id: 1 }` (복합)
- `{ image_id: 1, entity_type: 1, entity_id: 1 }` (복합)

---

### 5.4 Video (비디오 메타데이터)

```typescript
interface Video {
  _id: ObjectId;

  // 파일 정보
  filename: string;                        // 파일명 (유니크)
  original_filename: string;               // 원본 파일명

  // 저장 경로
  storage_provider: 'local' | 'vercel_blob' | 's3' | 'cloudinary' | 'youtube' | 'vimeo';
  path?: string;                           // 저장 경로
  url: string;                             // CDN URL
  streaming_url?: string;                  // 스트리밍 URL

  // 외부 비디오
  youtube_id?: string;                     // YouTube 비디오 ID
  youtube_url?: string;                    // YouTube URL
  vimeo_id?: string;                       // Vimeo 비디오 ID

  // 파일 속성
  mime_type?: string;                      // MIME 타입
  size?: number;                           // 파일 크기 (bytes)
  duration: number;                        // 재생 시간 (초)
  width: number;                           // 너비 (px)
  height: number;                          // 높이 (px)
  aspect_ratio: string;                    // 종횡비
  format?: string;                         // 포맷 (mp4, webm)

  // 썸네일
  thumbnail_image_id?: ObjectId;           // 참조: Image
  thumbnail_url?: string;                  // 썸네일 URL

  // 제목 및 설명
  title: {
    ko?: string;
    en?: string;
  };

  description: {
    ko?: string;
    en?: string;
  };

  // 자막
  subtitles: {
    language: string;                      // 언어 코드 (ko, en)
    url: string;                           // 자막 파일 URL
    label: string;                         // 레이블
  }[];

  // 분류
  category: 'product' | 'story' | 'tutorial' | 'interview' | 'event' | 'other';
  tags: string[];

  // 통계
  view_count: number;
  play_count: number;

  // 접근 제어
  is_public: boolean;
  requires_auth: boolean;

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
  deleted_at?: Date;
}
```

**인덱스**:
- `filename` (유니크, Sparse)
- `youtube_id` (Sparse)
- `{ category: 1, created_at: -1 }` (복합)
- `deleted_at` (Sparse)

---

## 6. 문의 및 고객지원

### 6.1 Inquiry (문의)

```typescript
interface Inquiry {
  _id: ObjectId;

  // 문의 번호
  inquiry_number: string;                  // 문의 번호 (예: INQ-2025-00001)

  // 문의 유형
  inquiry_type: 'service_introduction' | 'product_inquiry' | 'quote_request' | 'demo_request' |
                'technical_support' | 'partnership_proposal' | 'technical_partnership' |
                'channel_partnership' | 'investment_ir' | 'press_pr' | 'recruitment' |
                'complaint' | 'suggestion' | 'other';

  inquiry_type_label: {
    ko: string;                            // 문의 유형 라벨 (한국어)
    en?: string;                           // 문의 유형 라벨 (영어)
  };

  // 문의자 정보
  inquirer: {
    name: string;                          // 성함
    position?: string;                     // 직급
    company_name?: string;                 // 회사명
    phone_number: string;                  // 연락처
    email: string;                         // 이메일
    country?: string;                      // 국가
    language: 'ko' | 'en';                 // 선호 언어
  };

  // 문의 내용
  subject?: string;                        // 제목
  message: string;                         // 문의 내용

  // 관련 제품
  related_product_ids: ObjectId[];         // 참조: Product[]

  // 첨부파일
  attached_file_ids: ObjectId[];           // 참조: File[]

  // 처리 상태
  status: 'pending' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed' | 'spam';
  priority: 'low' | 'medium' | 'high' | 'urgent';

  // 담당자
  assigned_to?: ObjectId;                  // 참조: AdminUser (담당자)
  assigned_at?: Date;                      // 할당 시간

  // 답변
  response?: string;                       // 답변 내용
  responded_at?: Date;                     // 답변일
  responded_by?: ObjectId;                 // 참조: AdminUser (답변자)

  // 추가 응답 (히스토리)
  responses: {
    _id: ObjectId;
    content: string;
    created_by: ObjectId;                  // 참조: AdminUser
    created_at: Date;
    is_internal_note: boolean;             // 내부 메모 여부
  }[];

  // 개인정보 동의
  privacy_consented: boolean;              // 개인정보 수집 동의
  privacy_consented_at?: Date;             // 동의 시간

  // 추적 정보
  ip_address?: string;                     // IP 주소
  user_agent?: string;                     // User Agent
  referrer?: string;                       // 리퍼러
  utm_source?: string;                     // UTM 소스
  utm_medium?: string;                     // UTM 미디엄
  utm_campaign?: string;                   // UTM 캠페인

  // 태그
  tags: string[];                          // 태그 (검색 및 분류)

  // 만족도 조사 (답변 후)
  satisfaction_rating?: 1 | 2 | 3 | 4 | 5; // 만족도 (1-5)
  satisfaction_comment?: string;           // 만족도 코멘트

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;                        // 종료 시간
  deleted_at?: Date;                       // Soft delete
}
```

**인덱스**:
- `inquiry_number` (유니크)
- `{ inquiry_type: 1, status: 1, created_at: -1 }` (복합)
- `{ status: 1, priority: -1, created_at: -1 }` (복합)
- `{ assigned_to: 1, status: 1 }` (복합)
- `inquirer.email`
- `tags`
- `deleted_at` (Sparse)

---

### 6.2 InquiryFile (문의 첨부파일)

```typescript
interface InquiryFile {
  _id: ObjectId;

  // 관계
  inquiry_id: ObjectId;                    // 참조: Inquiry
  file_id: ObjectId;                       // 참조: File

  // 메타데이터
  order: number;                           // 정렬 순서
  created_at: Date;
}
```

**인덱스**:
- `inquiry_id`
- `{ inquiry_id: 1, order: 1 }` (복합)

---

### 6.3 FAQ (자주 묻는 질문)

```typescript
interface FAQ {
  _id: ObjectId;

  // 질문 및 답변
  question: {
    ko: string;                            // 질문 (한국어)
    en?: string;                           // 질문 (영어)
  };

  answer: {
    ko: string;                            // 답변 (한국어, 리치 텍스트)
    en?: string;                           // 답변 (영어, 리치 텍스트)
  };

  // 분류
  category_id?: ObjectId;                  // 참조: Category
  tags: string[];

  // 관련 링크
  related_product_ids: ObjectId[];         // 참조: Product[]
  related_story_ids: ObjectId[];           // 참조: SonaverseStory[]

  // 표시 정보
  order: number;                           // 정렬 순서
  is_active: boolean;                      // 활성 상태
  is_featured: boolean;                    // 추천 FAQ 여부

  // 통계
  view_count: number;                      // 조회수
  helpful_count: number;                   // 도움됨 수
  unhelpful_count: number;                 // 도움 안됨 수

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
  updated_by?: ObjectId;
}
```

**인덱스**:
- `{ category_id: 1, order: 1 }` (복합)
- `{ is_active: 1, is_featured: 1, order: 1 }` (복합)
- `tags`

---

## 7. 분석 및 로깅

### 7.1 VisitorLog (방문자 로그)

```typescript
interface VisitorLog {
  _id: ObjectId;

  // 세션 정보
  session_id: string;                      // 세션 ID (인덱스)
  visitor_id?: string;                     // 방문자 고유 ID (쿠키 기반)

  // 디바이스 정보
  ip_address: string;                      // IP 주소
  user_agent: string;                      // User Agent
  device_type: 'desktop' | 'mobile' | 'tablet' | 'bot';
  browser?: string;                        // 브라우저
  browser_version?: string;                // 브라우저 버전
  os?: string;                             // 운영체제
  os_version?: string;                     // OS 버전

  // 위치 정보
  location?: {
    country?: string;                      // 국가
    country_code?: string;                 // 국가 코드 (KR, US)
    region?: string;                       // 지역
    city?: string;                         // 도시
    latitude?: number;
    longitude?: number;
    timezone?: string;                     // 시간대
  };

  // 언어
  language: string;                        // 언어 (ko, en)
  accept_languages: string[];              // Accept-Language 헤더

  // 리퍼러
  referrer?: string;                       // 리퍼러
  referrer_domain?: string;                // 리퍼러 도메인
  referrer_source?: 'search' | 'social' | 'direct' | 'referral' | 'email' | 'ad';

  // UTM 파라미터
  utm_source?: string;                     // UTM 소스
  utm_medium?: string;                     // UTM 미디엄
  utm_campaign?: string;                   // UTM 캠페인
  utm_term?: string;                       // UTM 검색어
  utm_content?: string;                    // UTM 콘텐츠

  // 세션 통계
  first_visit_at: Date;                    // 첫 방문 시간
  last_visit_at: Date;                     // 마지막 방문 시간
  visit_count: number;                     // 방문 횟수
  page_view_count: number;                 // 페이지 뷰 수
  session_duration?: number;               // 세션 지속 시간 (초)

  // 메타데이터
  created_at: Date;
  updated_at: Date;
}
```

**인덱스**:
- `session_id` (유니크)
- `visitor_id`
- `{ ip_address: 1, created_at: -1 }` (복합)
- `created_at` (TTL 인덱스, 90일)

---

### 7.2 PageView (페이지 뷰)

```typescript
interface PageView {
  _id: ObjectId;

  // 방문자 정보
  visitor_id?: ObjectId;                   // 참조: VisitorLog
  session_id: string;                      // 세션 ID

  // 페이지 정보
  page_path: string;                       // 페이지 경로
  page_title?: string;                     // 페이지 제목
  page_type: 'home' | 'product' | 'story' | 'press' | 'inquiry' | 'about' | 'other';

  // 엔티티 정보 (상세 페이지)
  entity_type?: 'product' | 'story' | 'press';
  entity_id?: ObjectId;                    // 엔티티 ID

  // 리퍼러
  referrer?: string;                       // 리퍼러
  referrer_page_path?: string;             // 이전 페이지 경로 (내부)

  // 행동 추적
  duration?: number;                       // 체류 시간 (초)
  scroll_depth?: number;                   // 스크롤 깊이 (%)
  interactions: {
    type: 'click' | 'scroll' | 'form_submit' | 'video_play' | 'download';
    target?: string;                       // 대상 (버튼 ID, 링크 등)
    timestamp: Date;
  }[];

  // 이탈
  is_bounce: boolean;                      // 이탈 여부 (단일 페이지 방문)
  is_exit: boolean;                        // 나가기 여부 (마지막 페이지)

  // 성능 메트릭
  performance?: {
    load_time?: number;                    // 로드 시간 (ms)
    dom_content_loaded?: number;           // DOM 로드 시간 (ms)
    first_contentful_paint?: number;       // FCP (ms)
    largest_contentful_paint?: number;     // LCP (ms)
    time_to_interactive?: number;          // TTI (ms)
  };

  // 메타데이터
  created_at: Date;
  updated_at?: Date;
}
```

**인덱스**:
- `session_id`
- `{ page_path: 1, created_at: -1 }` (복합)
- `{ page_type: 1, created_at: -1 }` (복합)
- `{ entity_type: 1, entity_id: 1, created_at: -1 }` (복합)
- `created_at` (TTL 인덱스, 90일)

---

### 7.3 EventLog (이벤트 로그)

```typescript
interface EventLog {
  _id: ObjectId;

  // 이벤트 정보
  event_name: string;                      // 이벤트명
  event_category: 'user_action' | 'system' | 'error' | 'conversion' | 'engagement';

  // 세션 정보
  session_id?: string;
  visitor_id?: ObjectId;

  // 이벤트 데이터
  event_data?: Record<string, any>;        // 이벤트 추가 데이터

  // 페이지 정보
  page_path?: string;
  page_type?: string;

  // 엔티티 정보
  entity_type?: string;
  entity_id?: ObjectId;

  // 메타데이터
  created_at: Date;
}
```

**인덱스**:
- `{ event_name: 1, created_at: -1 }` (복합)
- `{ event_category: 1, created_at: -1 }` (복합)
- `session_id`
- `created_at` (TTL 인덱스, 90일)

---

### 7.4 Analytics (분석 데이터 집계)

```typescript
interface Analytics {
  _id: ObjectId;

  // 날짜
  date: Date;                              // 날짜 (YYYY-MM-DD)
  hour?: number;                           // 시간 (0-23)

  // 메트릭 타입
  metric_type: 'page_views' | 'unique_visitors' | 'sessions' | 'bounce_rate' |
               'avg_duration' | 'top_pages' | 'top_referrers' | 'top_devices' |
               'top_browsers' | 'top_countries' | 'conversion_rate';

  // 페이지 정보
  page_path?: string;                      // 페이지 경로
  page_type?: string;                      // 페이지 타입

  // 값
  value: number;                           // 값
  count?: number;                          // 카운트

  // 추가 메타데이터
  metadata?: Record<string, any>;          // 추가 정보

  // 차원 (Dimension)
  dimension?: {
    device_type?: string;
    browser?: string;
    country?: string;
    referrer_source?: string;
  };

  // 메타데이터
  created_at: Date;
  updated_at: Date;
}
```

**인덱스**:
- `{ date: -1, metric_type: 1 }` (복합)
- `{ metric_type: 1, page_path: 1, date: -1 }` (복합)
- `{ date: -1, hour: 1 }` (복합)

---

## 8. 시스템 설정

### 8.1 SystemSetting (시스템 설정)

```typescript
interface SystemSetting {
  _id: ObjectId;

  // 설정 키
  key: string;                             // 설정 키 (유니크, 인덱스)

  // 값
  value: string | number | boolean | object | any[];
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';

  // 카테고리
  category: 'general' | 'seo' | 'social' | 'email' | 'image' | 'performance' |
            'analytics' | 'security' | 'payment' | 'shipping' | 'feature_flags';

  // 설명
  description: {
    ko?: string;                           // 설명 (한국어)
    en?: string;                           // 설명 (영어)
  };

  // 표시 정보
  display_name: {
    ko: string;
    en?: string;
  };

  // 검증
  validation?: {
    type: 'string' | 'number' | 'email' | 'url' | 'regex';
    pattern?: string;                      // 정규식 패턴
    min?: number;
    max?: number;
    required?: boolean;
    options?: any[];                       // 선택 옵션
  };

  // 기본값
  default_value?: any;

  // 접근 제어
  is_public: boolean;                      // 공개 설정 여부 (API로 노출)
  is_editable: boolean;                    // 수정 가능 여부
  is_system: boolean;                      // 시스템 설정 (삭제 불가)

  // 환경별 설정
  environment?: 'development' | 'staging' | 'production' | 'all';

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  updated_by?: ObjectId;                   // 참조: AdminUser
}
```

**인덱스**:
- `key` (유니크)
- `{ category: 1, is_public: 1 }` (복합)
- `environment`

---

### 8.2 File (파일 관리)

```typescript
interface File {
  _id: ObjectId;

  // 파일 정보
  filename: string;                        // 파일명
  original_filename: string;               // 원본 파일명

  // 저장 경로
  storage_provider: 'local' | 'vercel_blob' | 's3' | 'cloudinary';
  path: string;                            // 저장 경로
  url: string;                             // CDN URL

  // 파일 속성
  mime_type: string;                       // MIME 타입
  size: number;                            // 파일 크기 (bytes)
  extension: string;                       // 확장자

  // 분류
  category: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';

  // 엔티티 관계
  entity_type?: string;                    // 엔티티 타입
  entity_id?: ObjectId;                    // 엔티티 ID

  // 접근 제어
  is_public: boolean;                      // 공개 여부
  requires_auth: boolean;                  // 인증 필요 여부

  // 통계
  download_count: number;                  // 다운로드 횟수
  last_downloaded_at?: Date;               // 마지막 다운로드 시간

  // 바이러스 스캔 (선택적)
  virus_scan_status?: 'pending' | 'clean' | 'infected' | 'error';
  virus_scan_at?: Date;

  // 메타데이터
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;                    // 참조: AdminUser
  deleted_at?: Date;                       // Soft delete
}
```

**인덱스**:
- `filename`
- `{ category: 1, created_at: -1 }` (복합)
- `{ entity_type: 1, entity_id: 1 }` (복합)
- `{ is_public: 1, requires_auth: 1 }` (복합)
- `deleted_at` (Sparse)

---

### 8.3 Menu (메뉴 관리)

```typescript
interface Menu {
  _id: ObjectId;

  // 메뉴 위치
  location: 'header' | 'footer' | 'sidebar' | 'mobile';

  // 메뉴 아이템
  items: MenuItem[];

  // 메타데이터
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  updated_by?: ObjectId;
}

interface MenuItem {
  _id: ObjectId;

  // 레이블
  label: {
    ko: string;
    en?: string;
  };

  // 링크
  link_type: 'internal' | 'external' | 'dropdown';
  url?: string;                            // 외부 링크 또는 내부 경로
  entity_type?: 'product' | 'story' | 'press' | 'page';
  entity_id?: ObjectId;                    // 엔티티 참조

  // 아이콘
  icon?: string;                           // Material Symbols

  // 서브 메뉴
  children?: MenuItem[];

  // 표시 정보
  order: number;
  is_active: boolean;
  open_in_new_tab: boolean;                // 새 탭에서 열기

  // 접근 제어
  requires_auth: boolean;                  // 인증 필요 여부
  allowed_roles?: string[];                // 허용 역할
}
```

**인덱스**:
- `{ location: 1, is_active: 1 }` (복합)

---

## 9. 버전 관리 및 히스토리

### 9.1 ContentVersion (콘텐츠 버전)

```typescript
interface ContentVersion {
  _id: ObjectId;

  // 엔티티 정보
  entity_type: 'press' | 'story' | 'product' | 'faq';
  entity_id: ObjectId;                     // 원본 엔티티 ID

  // 버전 정보
  version: number;                         // 버전 번호
  is_published: boolean;                   // 발행 버전 여부

  // 스냅샷 데이터
  snapshot: Record<string, any>;           // 전체 데이터 스냅샷

  // 변경 사항
  changes: {
    field: string;                         // 변경된 필드
    old_value: any;                        // 이전 값
    new_value: any;                        // 새 값
  }[];

  // 변경 이유
  change_reason?: string;                  // 변경 사유
  change_summary?: string;                 // 변경 요약

  // 메타데이터
  created_at: Date;
  created_by: ObjectId;                    // 참조: AdminUser
}
```

**인덱스**:
- `{ entity_type: 1, entity_id: 1, version: -1 }` (복합)
- `{ entity_type: 1, entity_id: 1, is_published: 1 }` (복합)

---

### 9.2 ChangeHistory (변경 히스토리)

```typescript
interface ChangeHistory {
  _id: ObjectId;

  // 엔티티 정보
  entity_type: string;                     // 엔티티 타입
  entity_id: ObjectId;                     // 엔티티 ID

  // 액션
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'restore';

  // 변경 사항
  changes?: {
    field: string;
    old_value: any;
    new_value: any;
  }[];

  // 메타데이터
  metadata?: Record<string, any>;          // 추가 메타데이터

  // IP 및 위치
  ip_address?: string;
  user_agent?: string;

  // 메타데이터
  created_at: Date;
  created_by: ObjectId;                    // 참조: AdminUser
}
```

**인덱스**:
- `{ entity_type: 1, entity_id: 1, created_at: -1 }` (복합)
- `{ action: 1, created_at: -1 }` (복합)
- `created_by`

---

## 10. 인덱스 전략

### 10.1 필수 인덱스

**유니크 인덱스**:
- `slug` (모든 콘텐츠 컬렉션)
- `email` (AdminUser)
- `token`, `refresh_token` (AdminSession)
- `filename` (Image, File)
- `inquiry_number` (Inquiry)

**조회 인덱스**:
- `is_published`, `is_active`, `status` (상태 필드)
- `category_id`, `type` (분류 필드)

**정렬 인덱스**:
- `created_at`, `updated_at`, `published_date` (시간 필드)
- `order`, `display_priority` (정렬 필드)

**복합 인덱스**:
- `{ is_published: 1, published_date: -1 }` (발행된 콘텐츠 조회)
- `{ category: 1, is_published: 1, published_at: -1 }` (카테고리별 콘텐츠)
- `{ entity_type: 1, entity_id: 1 }` (엔티티 관계)

### 10.2 TTL 인덱스

- `VisitorLog.created_at`: 90일 후 자동 삭제
- `PageView.created_at`: 90일 후 자동 삭제
- `EventLog.created_at`: 90일 후 자동 삭제
- `AdminSession.expires_at`: 만료 시 자동 삭제

### 10.3 텍스트 인덱스 (선택적)

- 전문 검색이 필요한 필드에 텍스트 인덱스 추가
- 예: `{ title.ko: "text", content.ko: "text" }`

---

## 11. 데이터 마이그레이션 계획

### 11.1 초기 마이그레이션 순서

1. **시스템 설정**: SystemSetting
2. **인증 및 권한**: AdminUser, AdminSession
3. **분류 시스템**: Category, Tag
4. **이미지 및 미디어**: Image, ImageVariant, ImageUsage, Video
5. **콘텐츠**: PressRelease, SonaverseStory, CompanyHistory
6. **제품**: Product, ProductCategory, ProductVariant, ProductImage
7. **고객지원**: Inquiry, InquiryFile, FAQ
8. **분석**: VisitorLog, PageView, EventLog, Analytics
9. **기타**: File, Menu, ContentVersion, ChangeHistory

### 11.2 데이터 변환 규칙

**기존 SonaverseStory → 새 스키마**:
- `tags` (문자열 배열) → Tag 컬렉션으로 변환 후 ObjectId 배열로 저장
- `content` (단일 객체) → 다국어 구조로 변환
- `thumbnail_url` → Image 컬렉션으로 등록 후 `thumbnail_image_id` 참조
- `images` 배열 → Image 컬렉션으로 등록 후 `gallery_image_ids` 참조

---

**작성일**: 2025년 1월
**버전**: 2.0
**목적**: Sonaverse Re 데이터베이스 스키마 설계
**상태**: 설계 완료 (구현 대기)
