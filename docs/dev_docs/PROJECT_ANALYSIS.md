# 소나버스 홈페이지 프로젝트 상세 분석 문서

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 구조](#프로젝트-구조)
4. [페이지별 상세 분석](#페이지별-상세-분석)
5. [API 라우트 분석](#api-라우트-분석)
6. [컴포넌트 구조](#컴포넌트-구조)
7. [데이터베이스 모델](#데이터베이스-모델)
8. [주요 기능](#주요-기능)
9. [리뉴얼 제안사항](#리뉴얼-제안사항)

---

## 프로젝트 개요

### 기본 정보
- **프로젝트명**: 소나버스 (sonaverse)
- **버전**: 0.1.0
- **프레임워크**: Next.js 15.4.8
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 4
- **데이터베이스**: MongoDB (Mongoose)
- **배포**: Vercel

### 프로젝트 목적
소나버스는 시니어의 더 나은 일상을 위해 하이브리드 성인용 보행기 "만보"와 성인용 기저귀 브랜드 "보듬"을 연구개발하는 시니어테크 스타트업입니다. 이 홈페이지는 회사 소개, 제품 소개, 콘텐츠 관리, 고객 문의 등을 통합 관리하는 공식 웹사이트입니다.

### 리뉴얼 목적 및 최우선 목표
**리뉴얼을 진행하는 주요 이유:**
- **이미지 로딩 및 최적화 문제**: 현재 이미지 로딩 속도가 느리고 최적화가 부족하여 사용자 경험에 부정적 영향
- **콘텐츠 로딩 속도 저하**: 페이지 콘텐츠 로딩 시간이 길어 사용자가 빠르게 정보를 확인하기 어려움

**리뉴얼 시 최우선 원칙:**
- **속도 최우선**: 홈페이지 제작 시 **페이지 로딩 속도와 성능을 최우선**으로 고려
- 모든 기능과 디자인 결정은 성능에 미치는 영향을 먼저 평가
- 사용자 경험의 핵심은 빠른 로딩과 즉각적인 콘텐츠 표시
- 이미지 최적화, 코드 스플리팅, 캐싱 전략 등을 통해 최대한 빠른 로딩 속도 달성

---

## 기술 스택

### 프론트엔드
- **Next.js 15.4.8**: React 프레임워크 (App Router 사용)
- **React 19.1.1**: UI 라이브러리
- **TypeScript 5**: 타입 안정성
- **Tailwind CSS 4**: 유틸리티 기반 CSS 프레임워크
- **next-i18next**: 다국어 지원 (한국어/영어)

### 백엔드
- **Next.js API Routes**: 서버리스 API 엔드포인트
- **Mongoose 8.16.4**: MongoDB ODM
- **JWT (jsonwebtoken, jose)**: 인증 토큰 관리
- **bcryptjs**: 비밀번호 해싱

### 에디터 및 리치 텍스트
- **TipTap 3.0.7**: 리치 텍스트 에디터
  - 확장 기능: bullet-list, code-block, color, font-family, highlight, image, link, ordered-list, table, text-align, underline

### 이메일 및 파일 관리
- **Resend 6.0.2**: 이메일 전송 서비스
- **Nodemailer 7.0.6**: 이메일 전송 (대체)
- **@vercel/blob 1.1.1**: 파일 스토리지

### 기타 라이브러리
- **Swiper 11.2.10**: 슬라이더/캐러셀
- **Axios 1.11.0**: HTTP 클라이언트
- **lowlight 3.3.0**: 코드 하이라이팅

---

## 프로젝트 구조

```
sonaverse/
├── public/                    # 정적 파일
│   ├── images/               # 이미지 리소스
│   │   ├── hero/            # 히어로 섹션 이미지
│   │   └── default-thumbnail.png
│   ├── logo/                 # 로고 파일
│   ├── product/              # 제품 이미지
│   │   ├── manbo/           # 만보 제품 이미지
│   │   └── bodume/          # 보듬 제품 이미지
│   ├── locales/              # 다국어 파일
│   │   ├── ko/common.json
│   │   └── en/common.json
│   ├── css/widget.css        # 위젯 스타일
│   └── js/widget.js          # 위젯 스크립트
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx       # 루트 레이아웃
│   │   ├── page.tsx         # 홈페이지
│   │   ├── globals.css      # 전역 스타일
│   │   │
│   │   ├── admin/           # 관리자 페이지
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx     # 관리자 대시보드
│   │   │   ├── login/       # 관리자 로그인
│   │   │   ├── press/       # 언론보도 관리
│   │   │   ├── sonaverse-story/  # 스토리 관리
│   │   │   ├── diaper-products/   # 기저귀 제품 관리
│   │   │   ├── inquiries/   # 문의 관리
│   │   │   ├── users/       # 사용자 관리
│   │   │   └── analytics/   # 통계 분석
│   │   │
│   │   ├── api/             # API 라우트
│   │   │   ├── admin/       # 관리자 API
│   │   │   ├── auth/        # 인증 API
│   │   │   ├── press/       # 언론보도 API
│   │   │   ├── sonaverse-story/  # 스토리 API
│   │   │   ├── inquiries/   # 문의 API
│   │   │   ├── products/    # 제품 API
│   │   │   ├── diaper-products/  # 기저귀 제품 API
│   │   │   ├── upload/      # 파일 업로드
│   │   │   ├── analytics/   # 분석 API
│   │   │   └── widget/      # 위젯 API
│   │   │
│   │   ├── products/         # 제품 페이지
│   │   │   ├── layout.tsx
│   │   │   ├── manbo-walker/  # 만보 보행기
│   │   │   └── bodeum-diaper/ # 보듬 기저귀
│   │   │
│   │   ├── press/            # 언론보도 페이지
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx     # 목록
│   │   │   └── [slug]/      # 상세 페이지
│   │   │
│   │   ├── sonaverse-story/  # 소나버스 스토리
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx     # 목록
│   │   │   └── [slug]/      # 상세 페이지
│   │   │
│   │   ├── inquiry/          # 문의 페이지
│   │   │   └── page.tsx
│   │   │
│   │   └── sitemap.ts        # 사이트맵
│   │
│   ├── components/           # 재사용 컴포넌트
│   │   ├── Header.tsx       # 헤더
│   │   ├── Footer.tsx       # 푸터
│   │   ├── MainLayout.tsx   # 메인 레이아웃
│   │   ├── Toast.tsx        # 토스트 알림
│   │   ├── ScrollToTop.tsx  # 스크롤 상단 이동
│   │   ├── PrivacyConsent.tsx  # 개인정보 동의
│   │   ├── PrivacyPolicyModal.tsx  # 개인정보처리방침 모달
│   │   ├── SonaverseWidget.tsx  # 소나버스 위젯
│   │   ├── RecommendedPosts.tsx  # 추천 게시물
│   │   ├── ChunkErrorBoundary.tsx  # 에러 바운더리
│   │   ├── ChunkErrorHandler.tsx  # 에러 핸들러
│   │   └── admin/           # 관리자 컴포넌트
│   │
│   ├── contexts/            # React Context
│   │   └── LanguageContext.tsx  # 언어 컨텍스트
│   │
│   ├── lib/                 # 유틸리티 함수
│   │   ├── db.ts           # 데이터베이스 연결
│   │   ├── auth.ts         # 인증 유틸리티
│   │   ├── auth-client.ts   # 클라이언트 인증
│   │   ├── auth-server.ts   # 서버 인증
│   │   ├── email.ts        # 이메일 전송
│   │   ├── cache.ts        # 캐시 관리
│   │   ├── constants.ts    # 상수
│   │   └── referral-parser.ts  # 리퍼럴 파서
│   │
│   ├── models/              # MongoDB 모델
│   │   ├── AdminUser.ts
│   │   ├── AdminSetting.ts
│   │   ├── PressRelease.ts
│   │   ├── SonaverseStory.ts
│   │   ├── Inquiry.ts
│   │   ├── DiaperProduct.ts
│   │   ├── Product.ts
│   │   ├── Page.ts
│   │   ├── VisitorLog.ts
│   │   └── ReferralKeyword.ts
│   │
│   └── middleware/          # 미들웨어
│       ├── middleware.ts    # 메인 미들웨어
│       └── analytics.ts     # 분석 미들웨어
│
├── rules/                    # 프로젝트 규칙 문서
│   ├── CLEAN_CODE_RULES.md
│   ├── DEVELOPMENT_RULES.md
│   └── SECURITY_AND_VALIDATION.md
│
├── package.json
├── next.config.ts           # Next.js 설정
├── tsconfig.json            # TypeScript 설정
├── eslint.config.mjs        # ESLint 설정
└── README.md
```

---

## 페이지별 상세 분석

### 1. 홈페이지 (`/`)

#### 주요 섹션
1. **Hero 섹션**
   - 전체 화면 히어로 이미지
   - 반응형 이미지 (데스크톱/태블릿/모바일)
   - 메인 헤드라인: "시니어의 더 나은 일상을 위해"
   - 서브 헤드라인: "소나버스"
   - 설명 텍스트

2. **문제 정의 섹션**
   - 4개의 주요 문제점 제시
   - 지그재그 레이아웃
   - 각 문제별 아이콘 및 설명
   - 문제점:
     - 안전성 및 성능의 한계
     - 사용자 중심의 인체공학 설계 미흡
     - 심리적 만족감을 고려하지 않은 디자인
     - 고령화 시대 속 기술 사각지대

3. **제품 섹션**
   - 만보(Manbo) 워크메이트
     - 하이브리드형 워크메이트
     - 주요 특징 소개
     - 제품 이미지
     - "자세히 보기" / "사전 문의" 버튼
   - 보듬(BO DUME) 기저귀
     - 프리미엄 성인용 기저귀
     - 주요 특징 소개
     - 제품 이미지
     - "자세히 보기" / "온라인 구매" 버튼

4. **소나버스 스토리 섹션**
   - 최신 스토리 6개 표시
   - 메인 스토리 1개 (대형 카드)
   - 일반 스토리 3개 (그리드)
   - 자동 슬라이딩 캐러셀 (모바일)
   - "소나버스 이야기 보러가기" 버튼

5. **회사 연혁 섹션**
   - 타임라인 형식
   - 2022년~2026년 주요 이벤트
   - 년도별 그라데이션 색상
   - "더보기" 기능 (처음 2개만 표시)
   - 주요 이벤트:
     - 2022: 법인 설립, 기업부설연구소 설립
     - 2023: 기술력 검증 및 성장 기반 구축
     - 2024: 글로벌 진출 및 품질 인증
     - 2025: 제품 상용화 원년
     - 2026: 하이브리드 워크메이트 출시 목표

6. **언론보도 섹션**
   - 최신 언론보도 6개 표시
   - 메인 언론보도 1개 (대형 카드)
   - 사이드 언론보도 3개 (컴팩트 카드)
   - "모든 언론보도 보기" 버튼

#### 기능
- 다국어 지원 (한국어/영어)
- 반응형 디자인
- Intersection Observer를 통한 스크롤 애니메이션
- 이미지 최적화 (Next/Image)
- SEO 최적화 (메타데이터, JSON-LD)

---

### 2. 만보 워크메이트 페이지 (`/products/manbo-walker`)

#### 주요 섹션
1. **Hero 섹션**
   - 제품명: "만보 (MANBO)"
   - 부제: "하이브리드형 워크메이트"
   - 제품 설명
   - 제품 이미지
   - 4개 주요 기능 아이콘

2. **문제 정의 섹션**
   - 기존 보행기의 한계점 4가지
   - 각 문제별 이미지 및 설명
   - 카드 형식 레이아웃

3. **제품 특징 섹션**
   - 듀얼 구동 방식을 적용한 차세대 하이브리드 워크메이트
   - 주요 기능:
     - 하이브리드 주행 시스템
     - 경사지 제어 기능
     - 미세 모터 적용
   - 기능별 상세 설명 이미지

4. **스마트 기능 섹션**
   - 비상 시 자동 정지 기능
   - 실종 방지 기능 (GPS 프로토 완료)
   - 각 기능별 상세 설명

5. **개발 타임라인 섹션**
   - 1차 단계 완료: 시제품 제작 및 성능평가
   - 현재 진행중: 2차 시제품 제작
   - 2026년 6월 목표: 상용화 런칭

6. **CTA 섹션**
   - 제품 문의하기 버튼

7. **소나버스 스토리 섹션**
   - 관련 스토리 3개 표시
   - 슬라이딩 캐러셀 (모바일)

#### 기능
- 다국어 지원
- 반응형 디자인
- 이미지 호버 효과
- 스토리 자동 슬라이딩

---

### 3. 보듬 기저귀 페이지 (`/products/bodeum-diaper`)

#### 주요 섹션
1. **Hero 섹션**
   - 제품명: "보듬 (BO DUME)"
   - 부제: "프리미엄 성인용 기저귀"
   - 제품 설명
   - 제품 이미지 (호버 시 변경)
   - 5개 제품 라인업 아이콘

2. **제품 목록 섹션**
   - 카테고리 필터:
     - 전체보기
     - 팬티형
     - 속기저귀
     - 깔개매트
   - 제품 그리드 레이아웃
   - 각 제품별:
     - 썸네일 이미지
     - 제품명
     - 설명
     - 카테고리 태그

3. **소나버스 스토리 섹션**
   - 관련 스토리 3개 표시
   - 슬라이딩 캐러셀 (모바일)

#### 기능
- 카테고리별 필터링
- 제품 이미지 호버 효과
- 다국어 지원
- 반응형 디자인

---

### 4. 소나버스 스토리 페이지 (`/sonaverse-story`)

#### 주요 섹션
1. **페이지 헤더**
   - 제목: "소나버스 스토리"
   - 부제: "소나버스 제품의 개발 스토리부터 유용한 복지/건강 정보까지!"

2. **카테고리 필터**
   - 전체
   - 제품스토리
   - 사용법
   - 건강정보
   - 복지정보
   - 모바일: 슬라이딩 레이아웃

3. **스토리 목록**
   - 메인 스토리 1개 (대형 카드, is_main=true)
   - 일반 스토리들 (그리드 레이아웃)
   - 데스크톱: 3열 그리드
   - 모바일: 리스트 형식
   - 각 스토리별:
     - 썸네일 이미지
     - 제목
     - 부제목
     - 작성일
     - YouTube 아이콘 (YouTube URL이 있는 경우)

4. **더보기 기능**
   - 초기 4개 표시 (메인 1개 + 일반 3개)
   - "더 많은 스토리 보기" 버튼
   - 클릭 시 6개씩 추가 로드

#### 기능
- 카테고리별 필터링
- 무한 스크롤 (더보기)
- YouTube 비디오 지원
- 다국어 지원
- 반응형 디자인

---

### 5. 언론보도 페이지 (`/press`)

#### 주요 섹션
1. **페이지 헤더**
   - 제목: "언론보도"
   - 부제: "소나버스의 혁신적인 여정을 언론을 통해 만나보세요"

2. **언론보도 목록**
   - 데스크톱: 3열 그리드
   - 모바일: 컴팩트한 리스트 형식
   - 각 언론보도별:
     - 썸네일 이미지
     - 언론사명
     - 제목
     - 작성일
     - 외부 링크 (있는 경우)

3. **더보기 기능**
   - 초기 6개 표시
   - "더 많은 언론보도 보기" 버튼
   - 클릭 시 3개씩 추가 로드

#### 기능
- 다국어 지원
- 반응형 디자인
- 외부 링크 지원

---

### 6. 문의 페이지 (`/inquiry`)

#### 주요 섹션
1. **문의 폼**
   - 문의 카테고리 (12개):
     - 서비스 도입 문의
     - 제품 기능 문의
     - 견적 요청
     - 데모/시연 요청
     - 기술 지원 문의
     - 사업 제휴 제안
     - 기술 제휴 제안
     - 채널 제휴 문의
     - 투자/IR 문의
     - 언론/홍보 문의
     - 채용 문의
     - 불만/건의 사항
     - 기타
   - 성함 (필수)
   - 직급
   - 회사명
   - 연락처 (필수)
   - 이메일 (필수)
   - 문의 내용 (필수)
   - 첨부파일 (다중 선택 가능)
     - 허용 확장자: jpg, jpeg, png, gif, bmp, svg, heic, pdf, doc, docx, hwp, hwpx, txt, xls, xlsx, csv, ppt, pptx, zip
   - 개인정보 수집 및 이용 동의 (필수)

2. **제출 기능**
   - 폼 검증
   - 파일 업로드 (Vercel Blob)
   - 이메일 전송 (Resend)
   - 성공/실패 토스트 알림

#### 기능
- 다국어 지원
- 파일 업로드
- 이메일 전송
- 폼 검증
- 개인정보 동의

---

### 7. 관리자 페이지 (`/admin`)

#### 주요 섹션
1. **관리자 대시보드** (`/admin`)
   - 통계 카드:
     - 언론보도 총 개수
     - 소나버스 스토리 총 개수
     - 문의 총 개수
     - 오늘 방문자 수 / 전체 방문자 수
     - 전일 대비 증감률
   - 빠른 액션:
     - 새 언론보도 등록
     - 새 소나버스 스토리 작성
     - 문의 내역 확인
     - 통계 보기
   - 최근 업로드된 게시물 테이블

2. **언론보도 관리** (`/admin/press`)
   - 언론보도 목록
   - 새 언론보도 등록 (`/admin/press/new`)
   - 언론보도 수정 (`/admin/press/[slug]`)
   - TipTap 리치 텍스트 에디터
   - 다국어 지원 (한국어/영어)
   - 썸네일 이미지 업로드
   - 발행일 설정
   - 발행 상태 관리

3. **소나버스 스토리 관리** (`/admin/sonaverse-story`)
   - 스토리 목록
   - 새 스토리 작성 (`/admin/sonaverse-story/new`)
   - 스토리 수정 (`/admin/sonaverse-story/[slug]`)
   - TipTap 리치 텍스트 에디터
   - 카테고리 설정
   - 메인 스토리 설정 (is_main)
   - YouTube URL 지원
   - 썸네일 이미지 업로드
   - 발행 상태 관리

4. **기저귀 제품 관리** (`/admin/diaper-products`)
   - 제품 목록
   - 새 제품 등록 (`/admin/diaper-products/new`)
   - 제품 수정 (`/admin/diaper-products/[slug]`)
   - 다국어 지원 (한국어/영어)
   - 카테고리 설정
   - 썸네일 이미지 업로드

5. **문의 관리** (`/admin/inquiries`)
   - 문의 목록
   - 문의 상세 보기
   - 문의 삭제
   - 문의 상태 관리

6. **사용자 관리** (`/admin/users`)
   - 관리자 사용자 목록
   - 사용자 추가/수정/삭제

7. **통계 분석** (`/admin/analytics`)
   - 방문자 통계
   - 페이지별 통계
   - 시간대별 통계

8. **관리자 로그인** (`/admin/login`)
   - 이메일/비밀번호 로그인
   - JWT 토큰 기반 인증
   - 세션 관리

#### 기능
- 인증 및 권한 관리
- CRUD 작업
- 파일 업로드
- 리치 텍스트 에디터
- 다국어 지원
- 통계 및 분석

---

## API 라우트 분석

### 인증 API (`/api/auth`)
- **POST `/api/auth/login`**: 관리자 로그인
- **POST `/api/auth/logout`**: 로그아웃
- **GET `/api/auth/me`**: 현재 사용자 정보

### 언론보도 API (`/api/press`)
- **GET `/api/press`**: 언론보도 목록 조회
  - 쿼리 파라미터: `page`, `pageSize`, `active`, `lang`
- **GET `/api/press/[slug]`**: 언론보도 상세 조회
- **POST `/api/press`**: 새 언론보도 생성 (관리자)
- **PUT `/api/press/[slug]`**: 언론보도 수정 (관리자)
- **DELETE `/api/press/[slug]`**: 언론보도 삭제 (관리자)

### 소나버스 스토리 API (`/api/sonaverse-story`)
- **GET `/api/sonaverse-story`**: 스토리 목록 조회
  - 쿼리 파라미터: `page`, `pageSize`, `published`, `category`, `limit`
- **GET `/api/sonaverse-story/[slug]`**: 스토리 상세 조회
- **POST `/api/sonaverse-story`**: 새 스토리 생성 (관리자)
- **PUT `/api/sonaverse-story/[slug]`**: 스토리 수정 (관리자)
- **DELETE `/api/sonaverse-story/[slug]`**: 스토리 삭제 (관리자)

### 문의 API (`/api/inquiries`)
- **GET `/api/inquiries`**: 문의 목록 조회 (관리자)
- **GET `/api/inquiries/[id]`**: 문의 상세 조회 (관리자)
- **POST `/api/inquiries`**: 새 문의 생성
- **DELETE `/api/inquiries/[id]`**: 문의 삭제 (관리자)

### 제품 API (`/api/products`)
- **GET `/api/products`**: 제품 목록 조회
- **GET `/api/products/[slug]`**: 제품 상세 조회

### 기저귀 제품 API (`/api/diaper-products`)
- **GET `/api/diaper-products`**: 기저귀 제품 목록 조회
  - 쿼리 파라미터: `category`
- **GET `/api/diaper-products/[slug]`**: 기저귀 제품 상세 조회
- **POST `/api/diaper-products`**: 새 제품 생성 (관리자)
- **PUT `/api/diaper-products/[slug]`**: 제품 수정 (관리자)
- **DELETE `/api/diaper-products/[slug]`**: 제품 삭제 (관리자)

### 관리자 API (`/api/admin`)
- **GET `/api/admin/stats`**: 대시보드 통계
- **GET `/api/admin/analytics`**: 상세 분석 데이터
- **GET `/api/admin/users`**: 사용자 목록
- **GET `/api/admin/users/[id]`**: 사용자 상세
- **POST `/api/admin/users`**: 사용자 생성
- **PUT `/api/admin/users/[id]`**: 사용자 수정
- **DELETE `/api/admin/users/[id]`**: 사용자 삭제

### 파일 업로드 API (`/api/upload`)
- **POST `/api/upload`**: 파일 업로드
  - FormData: `file`, `type` (inquiry, press, sonaverse-story 등)
  - Vercel Blob 스토리지 사용

### 분석 API (`/api/analytics`)
- **POST `/api/analytics/log`**: 방문자 로그 기록

### 위젯 API (`/api/widget`)
- **GET `/api/widget/check-ip`**: IP 확인
- **GET `/api/widget/test-ip`**: IP 테스트
- **GET `/api/widget/proxy/[...path]`**: 프록시 요청

### 기타 API
- **GET `/api/check-slug`**: Slug 중복 확인
- **GET `/api/download`**: 파일 다운로드
- **GET `/api/pages`**: 페이지 목록
- **GET `/api/pages/[slug]`**: 페이지 상세

---

## 컴포넌트 구조

### 공통 컴포넌트

#### Header.tsx
- **기능**: 사이트 헤더
- **주요 기능**:
  - 로고 (언어별 다른 이미지)
  - 네비게이션 메뉴
  - 제품 드롭다운 메뉴
  - 언어 선택 드롭다운
  - 모바일 햄버거 메뉴
  - 반응형 디자인

#### Footer.tsx
- **기능**: 사이트 푸터
- **주요 기능**:
  - 로고
  - 사업자 정보
  - 네비게이션 링크
  - 고객지원 정보
  - SNS 링크 (네이버 블로그, YouTube, Instagram, 카카오)
  - 개인정보처리방침 모달
  - 제품 카탈로그 다운로드

#### MainLayout.tsx
- **기능**: 메인 레이아웃 래퍼
- **주요 기능**:
  - Header 포함
  - Footer 포함
  - 자식 컴포넌트 렌더링

#### Toast.tsx
- **기능**: 토스트 알림 시스템
- **주요 기능**:
  - 성공/에러/정보 메시지 표시
  - 자동 사라짐
  - 여러 토스트 동시 표시

#### ScrollToTop.tsx
- **기능**: 스크롤 상단 이동 버튼
- **주요 기능**:
  - 스크롤 시 버튼 표시
  - 클릭 시 상단으로 부드럽게 이동

#### PrivacyConsent.tsx
- **기능**: 개인정보 수집 동의 체크박스
- **주요 기능**:
  - 동의 체크박스
  - 개인정보처리방침 링크
  - 에러 메시지 표시

#### PrivacyPolicyModal.tsx
- **기능**: 개인정보처리방침 모달
- **주요 기능**:
  - 모달 표시/숨김
  - 개인정보처리방침 내용 표시
  - 다국어 지원

#### SonaverseWidget.tsx
- **기능**: 소나버스 위젯
- **주요 기능**:
  - 외부 사이트 임베드용 위젯
  - 스크립트 로드

#### RecommendedPosts.tsx
- **기능**: 추천 게시물 표시
- **주요 기능**:
  - 관련 게시물 추천
  - 카드 형식 표시

#### ChunkErrorBoundary.tsx
- **기능**: 에러 바운더리
- **주요 기능**:
  - React 에러 캐치
  - 에러 UI 표시

#### ChunkErrorHandler.tsx
- **기능**: 에러 핸들러
- **주요 기능**:
  - 전역 에러 처리
  - 에러 로깅

### 관리자 컴포넌트 (`components/admin/`)
- 리치 텍스트 에디터 컴포넌트
- 폼 컴포넌트
- 테이블 컴포넌트
- 모달 컴포넌트

---

## 데이터베이스 모델

### AdminUser
- 관리자 사용자 정보
- 필드: email, password (해시), name, role, created_at, updated_at

### AdminSetting
- 관리자 설정
- 필드: key, value, description

### PressRelease
- 언론보도
- 필드: slug, press_name (ko/en), thumbnail, content (ko/en), published_date, created_at, is_active

### SonaverseStory
- 소나버스 스토리
- 필드: slug, category, thumbnail_url, content (title, subtitle, body, images), youtube_url, tags, created_at, is_published, is_main

### Inquiry
- 문의
- 필드: inquiry_type, inquiry_type_label, name, position, company_name, phone_number, email, message, attached_files, privacy_consented, created_at, status

### DiaperProduct
- 기저귀 제품
- 필드: slug, name (ko/en), description (ko/en), thumbnail_image, category, created_at, is_active

### Product
- 일반 제품
- 필드: slug, name (ko/en), description (ko/en), image, created_at, is_active

### Page
- 동적 페이지
- 필드: slug, title (ko/en), content (ko/en), created_at, is_published

### VisitorLog
- 방문자 로그
- 필드: ip_address, user_agent, referrer, page_path, created_at

### ReferralKeyword
- 리퍼럴 키워드
- 필드: keyword, source, created_at

---

## 주요 기능

### 1. 다국어 지원
- **언어**: 한국어, 영어
- **구현**: next-i18next, LanguageContext
- **적용 범위**: 모든 페이지, 컴포넌트, API 응답

### 2. 반응형 디자인
- **브레이크포인트**: 모바일, 태블릿, 데스크톱
- **접근 방식**: Tailwind CSS 반응형 유틸리티
- **최적화**: 모바일 우선 디자인

### 3. SEO 최적화
- **메타데이터**: 각 페이지별 동적 메타데이터
- **JSON-LD**: 구조화된 데이터
- **사이트맵**: 자동 생성
- **Open Graph**: 소셜 미디어 공유 최적화

### 4. 이미지 최적화
- **Next/Image**: 자동 이미지 최적화
- **WebP/AVIF**: 최신 이미지 포맷
- **Lazy Loading**: 지연 로딩
- **반응형 이미지**: 디바이스별 최적 이미지

### 5. 성능 최적화
- **코드 스플리팅**: 자동 코드 분할
- **정적 생성**: 가능한 페이지는 정적 생성
- **캐싱**: 적절한 캐시 전략
- **압축**: Gzip/Brotli 압축

### 6. 보안
- **인증**: JWT 토큰 기반
- **권한 관리**: 관리자 권한 체크
- **입력 검증**: 폼 데이터 검증
- **XSS 방지**: 입력 데이터 이스케이프
- **CSRF 방지**: 토큰 기반 보호

### 7. 파일 관리
- **업로드**: Vercel Blob 스토리지
- **파일 타입 제한**: 허용 확장자만 업로드
- **파일 크기 제한**: 적절한 크기 제한

### 8. 분석 및 로깅
- **방문자 추적**: IP, User-Agent, Referrer
- **페이지 뷰**: 페이지별 통계
- **에러 로깅**: 에러 추적

---

## 리뉴얼 제안사항

> **⚠️ 중요: 성능 최우선 원칙**
> 
> 모든 리뉴얼 작업은 **페이지 로딩 속도와 성능을 최우선**으로 고려해야 합니다. 디자인, 기능, 사용자 경험 등 모든 요소는 성능에 미치는 영향을 먼저 평가한 후 구현해야 합니다.

### 1. 성능 최적화 (최우선)

#### 1.1 이미지 최적화 (핵심 개선 사항)
- **이미지 포맷 최적화**
  - WebP/AVIF 포맷 우선 사용
  - 기존 PNG/JPG는 자동 변환 시스템 구축
  - 이미지 품질과 파일 크기 최적 밸런스 설정
- **이미지 지연 로딩 (Lazy Loading)**
  - 모든 이미지에 `loading="lazy"` 속성 적용
  - 뷰포트 밖 이미지는 스크롤 시 로드
  - Intersection Observer API 활용
- **반응형 이미지**
  - `srcset` 및 `sizes` 속성으로 디바이스별 최적 이미지 제공
  - 모바일/태블릿/데스크톱별 다른 해상도 이미지
  - Next.js Image 컴포넌트 적극 활용
- **이미지 CDN 활용**
  - Vercel Image Optimization 또는 Cloudinary 등 CDN 사용
  - 자동 리사이징 및 포맷 변환
  - 글로벌 CDN으로 전송 속도 향상
- **이미지 프리로딩 전략**
  - Above-the-fold 이미지만 프리로드
  - Critical 이미지만 `<link rel="preload">` 사용
  - 나머지 이미지는 지연 로딩

#### 1.2 콘텐츠 로딩 최적화
- **코드 스플리팅**
  - 페이지별 동적 임포트 (`next/dynamic`)
  - 라우트 기반 코드 스플리팅
  - 컴포넌트 레벨 코드 스플리팅
  - 큰 라이브러리는 동적 로드
- **데이터 페칭 최적화**
  - 서버 컴포넌트 적극 활용 (Next.js 15 App Router)
  - 필요한 데이터만 선택적으로 페칭
  - API 응답 최소화 (필요한 필드만 반환)
  - 데이터베이스 쿼리 최적화
- **정적 생성 (SSG) 우선**
  - 가능한 모든 페이지는 정적 생성
  - ISR (Incremental Static Regeneration) 활용
  - 빌드 타임에 가능한 많은 콘텐츠 생성
- **스트리밍 및 Suspense**
  - React Suspense로 점진적 렌더링
  - 스트리밍 SSR로 초기 로딩 시간 단축
  - 로딩 상태를 명확히 표시

#### 1.3 Core Web Vitals 개선
- **LCP (Largest Contentful Paint) < 2.5초**
  - 히어로 이미지 최적화 및 프리로드
  - 폰트 로딩 최적화
  - 렌더링 차단 리소스 제거
- **FID (First Input Delay) < 100ms**
  - JavaScript 번들 크기 최소화
  - 긴 작업을 작은 청크로 분할
  - 이벤트 리스너 최적화
- **CLS (Cumulative Layout Shift) < 0.1**
  - 이미지에 명시적 width/height 지정
  - 동적 콘텐츠 영역에 고정 높이 설정
  - 폰트 로딩 전략 (font-display: swap)

#### 1.4 번들 크기 최적화
- **트리 쉐이킹**
  - 사용하지 않는 코드 제거
  - 라이브러리에서 필요한 모듈만 import
- **번들 분석**
  - `@next/bundle-analyzer`로 번들 크기 분석
  - 큰 의존성 라이브러리 대체 검토
  - 중복 코드 제거
- **압축**
  - Gzip/Brotli 압축 활성화
  - 텍스트 리소스 압축
  - 이미지는 이미 압축된 포맷 사용

#### 1.5 캐싱 전략
- **정적 자산 캐싱**
  - `_next/static` 파일은 1년 캐싱
  - 이미지는 적절한 캐시 헤더 설정
  - 버전 관리로 캐시 무효화
- **API 응답 캐싱**
  - ISR로 API 응답 캐싱
  - React Cache로 서버 컴포넌트 캐싱
  - 적절한 revalidate 시간 설정
- **브라우저 캐싱**
  - Service Worker로 오프라인 지원
  - 캐시 우선 전략으로 빠른 로딩

### 2. 코드 구조 및 모듈화 개선 (성능 최우선)

> **⚠️ 모듈화 원칙**
> 
> 모든 모듈화 작업은 **성능을 해치지 않는 범위**에서 진행해야 합니다. 과도한 추상화나 불필요한 레이어는 오히려 번들 크기를 증가시킬 수 있으므로, 실제 사용 패턴을 분석한 후 모듈화를 진행해야 합니다.

#### 2.1 기능 기반 폴더 구조 (Feature-based Structure)
- **현재 구조 문제점**
  - URL 기반 라우팅으로 인한 파일 분산
  - 관련 컴포넌트와 로직이 서로 다른 위치에 존재
  - 코드 재사용성 저하 및 유지보수 어려움

- **개선된 구조 제안**
  ```
  src/
  ├── app/                          # Next.js App Router
  │   ├── (public)/                 # 공개 페이지 그룹
  │   │   ├── page.tsx             # 홈페이지
  │   │   ├── products/
  │   │   │   ├── manbo-walker/
  │   │   │   └── bodeum-diaper/
  │   │   ├── press/
  │   │   ├── sonaverse-story/
  │   │   └── inquiry/
  │   └── (admin)/                  # 관리자 페이지 그룹
  │       └── admin/
  │
  ├── features/                     # 기능별 모듈화
  │   ├── home/                     # 홈페이지 기능
  │   │   ├── components/           # 홈 전용 컴포넌트
  │   │   ├── hooks/                # 홈 전용 훅
  │   │   └── lib/                  # 홈 전용 유틸리티
  │   ├── products/                 # 제품 기능
  │   │   ├── manbo/
  │   │   │   ├── components/
  │   │   │   ├── hooks/
  │   │   │   └── lib/
  │   │   └── bodeum/
  │   ├── stories/                  # 스토리 기능
  │   ├── press/                    # 언론보도 기능
  │   └── inquiry/                  # 문의 기능
  │
  ├── shared/                       # 공유 모듈
  │   ├── components/               # 공통 컴포넌트
  │   │   ├── ui/                   # 기본 UI 컴포넌트
  │   │   ├── layout/               # 레이아웃 컴포넌트
  │   │   └── common/               # 공통 기능 컴포넌트
  │   ├── hooks/                    # 공통 훅
  │   ├── lib/                      # 공통 유틸리티
  │   └── types/                    # 공통 타입
  ```

#### 2.2 컴포넌트 모듈화 전략
- **공통 컴포넌트 분리**
  - `components/shared/ui/`: 버튼, 카드, 배지, 입력 필드 등 기본 UI 컴포넌트
  - `components/shared/layout/`: Header, Footer, MainLayout 등 레이아웃 컴포넌트
  - `components/shared/common/`: Toast, Modal, ScrollToTop 등 공통 기능 컴포넌트
  - 각 컴포넌트는 단일 책임 원칙(SRP) 준수

- **기능별 컴포넌트 분리**
  - 각 기능(feature) 내부에 해당 기능 전용 컴포넌트 배치
  - 예: `features/stories/components/StoryCard.tsx`, `features/press/components/PressCard.tsx`
  - 공통 패턴은 `shared/components`로 추출하여 재사용

- **컴포넌트 구조 예시**
  ```typescript
  // features/stories/components/StoryCard.tsx
  import { Card } from '@/shared/components/ui/Card'
  import { Image } from 'next/image'
  
  interface StoryCardProps {
    story: Story
    variant?: 'default' | 'featured'
  }
  
  export function StoryCard({ story, variant = 'default' }: StoryCardProps) {
    // StoryCard 전용 로직
  }
  ```

#### 2.3 로직 분리 (Custom Hooks)
- **데이터 페칭 훅**
  - `usePressList`, `useStories`, `useInquiryForm` 등
  - API 호출 로직을 컴포넌트에서 분리
  - React Query 또는 SWR 활용 고려 (캐싱 및 성능 최적화)

- **UI 상태 관리 훅**
  - `useCarousel`, `useModal`, `useDropdown` 등
  - 재사용 가능한 UI 로직을 훅으로 추출
  - 컴포넌트는 렌더링에만 집중

- **비즈니스 로직 훅**
  - `useInquirySubmit`, `useProductFilter` 등
  - 폼 처리, 필터링 등 비즈니스 로직 분리

- **훅 구조 예시**
  ```
  features/
  ├── stories/
  │   └── hooks/
  │       ├── useStories.ts          # 스토리 목록 조회
  │       ├── useStoryDetail.ts     # 스토리 상세 조회
  │       └── useStoryFilter.ts     # 스토리 필터링
  ```

#### 2.4 API 레이어 분리
- **API 모듈 구조**
  ```
  lib/
  ├── api/
  │   ├── client.ts                 # API 클라이언트 설정
  │   ├── press.ts                  # 언론보도 API
  │   ├── stories.ts                # 스토리 API
  │   ├── products.ts               # 제품 API
  │   ├── inquiries.ts              # 문의 API
  │   └── admin/                    # 관리자 API
  │       ├── press.ts
  │       └── stories.ts
  ```

- **API 함수 예시**
  ```typescript
  // lib/api/stories.ts
  export async function getStories(params: StoriesParams) {
    const response = await fetch(`/api/sonaverse-story?${new URLSearchParams(params)}`)
    return response.json()
  }
  
  export async function getStoryBySlug(slug: string) {
    const response = await fetch(`/api/sonaverse-story/${slug}`)
    return response.json()
  }
  ```

- **서비스 레이어 (선택적)**
  - 복잡한 비즈니스 로직이 있는 경우 서비스 레이어 추가
  - API 호출과 비즈니스 로직 분리
  ```
  features/
  └── stories/
      └── services/
          └── storyService.ts        # 스토리 관련 비즈니스 로직
  ```

#### 2.5 성능을 고려한 모듈화
- **동적 임포트 전략**
  - 무거운 컴포넌트는 `next/dynamic`으로 지연 로딩
  - 관리자 페이지, 모달, 차트 등은 필요 시에만 로드
  ```typescript
  const AdminDashboard = dynamic(() => import('@/features/admin/components/Dashboard'), {
    loading: () => <Loading />,
    ssr: false
  })
  ```

- **코드 스플리팅**
  - 기능별로 자동 코드 스플리팅
  - 라우트 그룹(`(public)`, `(admin)`) 활용
  - 큰 라이브러리는 동적 임포트

- **트리 쉐이킹 최적화**
  - Named export 우선 사용
  - Barrel exports(`index.ts`) 최소화 (필요한 경우만)
  - 라이브러리에서 필요한 모듈만 import

#### 2.6 타입 정의 모듈화
- **타입 구조**
  ```
  shared/
  └── types/
      ├── api.ts                    # API 응답 타입
      ├── common.ts                 # 공통 타입
      └── index.ts                  # 타입 재export
  features/
  └── stories/
      └── types/
          └── story.ts              # 스토리 관련 타입
  ```

- **타입 재사용**
  - 공통 타입은 `shared/types`에 배치
  - 기능별 타입은 해당 기능 폴더 내부에 배치
  - 타입 중복 최소화

#### 2.7 스타일 모듈화
- **스타일 구조**
  ```
  shared/
  └── styles/
      ├── tokens.css                # 디자인 토큰 (색상, 간격 등)
      ├── components.css            # 공통 컴포넌트 스타일
      └── utilities.css             # 유틸리티 클래스
  ```

- **Tailwind 활용**
  - Tailwind CSS 유틸리티 클래스 우선 사용
  - 반복되는 패턴은 `@apply`로 컴포넌트 클래스 생성
  - 커스텀 유틸리티는 `tailwind.config.ts`에 정의

#### 2.8 모듈화 체크리스트
- [ ] 기능별 폴더 구조로 재구성
- [ ] 공통 컴포넌트를 `shared/components`로 분리
- [ ] 데이터 페칭 로직을 커스텀 훅으로 분리
- [ ] API 호출을 별도 모듈로 분리
- [ ] 타입 정의를 적절히 모듈화
- [ ] 무거운 컴포넌트는 동적 임포트 적용
- [ ] 코드 스플리팅으로 번들 크기 최적화
- [ ] 불필요한 추상화 제거 (YAGNI 원칙)
- [ ] 성능 측정 후 모듈화 적용

### 3. 디자인 개선 (성능 고려 필수)
- **현대적인 UI/UX**: 최신 디자인 트렌드 반영 (단, 성능 저하 없는 범위 내)
- **애니메이션**: CSS 기반 애니메이션 우선, JavaScript 애니메이션 최소화
- **색상 체계**: 브랜드 아이덴티티 강화
- **타이포그래피**: 웹폰트 최적화 (subset, preload, font-display)

### 4. 접근성 개선 (성능 영향 최소화)
- **ARIA 레이블**: 스크린 리더 지원 (성능 영향 없음)
- **키보드 네비게이션**: 키보드만으로 사용 가능
- **색상 대비**: WCAG 가이드라인 준수
- **포커스 관리**: 명확한 포커스 표시

### 5. 기능 추가 (성능 우선 평가)
- **소셜 공유**: 소셜 미디어 공유 버튼 (지연 로딩)
- 모든 추가 기능은 성능에 미치는 영향을 먼저 평가
- 필수 기능만 우선 구현, 선택적 기능은 지연 로딩

### 6. 모바일 경험 개선 (성능 최적화 포함)
- **터치 최적화**: 터치 제스처 개선 (네이티브 이벤트 활용)
- **모바일 메뉴**: 더 나은 모바일 네비게이션 (코드 스플리팅)
- **스와이프**: 스와이프 제스처 지원 (경량 라이브러리 사용)
- **PWA**: Progressive Web App 기능 (Service Worker로 캐싱)

### 7. 관리자 기능 강화
- **대시보드**: 더 상세한 통계
- **에디터**: 더 강력한 에디터 기능
- **미디어 라이브러리**: 중앙화된 미디어 관리
- **백업/복원**: 데이터 백업 기능

### 8. SEO 강화
- **구조화된 데이터**: 더 많은 스키마 마크업
- **사이트맵**: 더 상세한 사이트맵
- **로봇.txt**: 검색 엔진 최적화
- **캐노니컬 URL**: 중복 콘텐츠 방지

### 9. 보안 강화
- **HTTPS**: 강제 HTTPS
- **보안 헤더**: 더 강력한 보안 헤더
- **Rate Limiting**: API 요청 제한
- **입력 검증**: 더 엄격한 검증

### 10. 테스트
- **단위 테스트**: 컴포넌트 테스트
- **통합 테스트**: API 테스트
- **E2E 테스트**: 전체 플로우 테스트
- **성능 테스트**: 성능 벤치마크

### 11. 문서화
- **API 문서**: API 문서화
- **컴포넌트 문서**: Storybook 등
- **가이드**: 사용자 가이드
- **개발 문서**: 개발자 문서

---

## 결론

소나버스 홈페이지는 Next.js 15를 기반으로 한 현대적인 웹 애플리케이션입니다. 다국어 지원, 반응형 디자인, 관리자 시스템 등 다양한 기능을 제공하고 있습니다.

**리뉴얼 시 핵심 원칙:**
1. **성능 최우선**: 모든 결정은 페이지 로딩 속도와 성능을 최우선으로 고려
2. **이미지 최적화**: 이미지 로딩 속도 개선이 가장 중요한 개선 사항
3. **콘텐츠 로딩 최적화**: 사용자가 빠르게 콘텐츠를 볼 수 있도록 최적화
4. **코드 구조 및 모듈화**: 깔끔하고 유지보수하기 쉬운 코드 구조로 재구성
5. **점진적 개선**: 성능에 영향을 주지 않는 범위에서 디자인과 기능 개선

리뉴얼 시 위의 제안사항들을 참고하여, 특히 **성능 최적화 섹션**을 우선적으로 적용하여 빠르고 효율적인 사용자 경험을 제공할 수 있을 것입니다.

---

**작성일**: 2025년 1월
**작성자**: AI Assistant
**프로젝트**: 소나버스 홈페이지 리뉴얼 분석

