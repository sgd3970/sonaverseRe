# Sonaverse 프로젝트 종합 분석 - Google AI Studio Build용 컨텍스트

> **작성 목적**: Google AI Studio Build 시스템에서 Sonaverse 홈페이지 리뉴얼 디자인을 요청할 때 사용할 수 있는 종합 컨텍스트 문서
> **핵심 내용**: HTML/CSS 코드 패턴, 색상 시스템, 컴포넌트 구조

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [브랜드 아이덴티티](#2-브랜드-아이덴티티)
3. [디자인 스타일 분석](#3-stitch-디자인-파일-분석-핵심-레퍼런스)
4. [통합 디자인 시스템 (색상, 타이포그래피, 컴포넌트)](#4-통합-디자인-시스템)
5. [페이지별 상세 요구사항](#5-페이지별-상세-요구사항)
6. [팝업 시스템 (데이터 스키마 포함)](#6-팝업-시스템-데이터-스키마-포함)
7. [기술 스택 및 개발 환경](#7-기술-스택-및-개발-환경)
8. [중요 디자인 원칙](#8-중요-디자인-원칙)
9. [이전 디자인 요청에서 부족했던 점](#9-이전-디자인-요청에서-부족했던-점)
10. [요약: Google AI Studio Build 요청 시 핵심 포인트](#10-요약-google-ai-studio-build-요청-시-핵심-포인트)

---

## 1. 프로젝트 개요

### 1.1 회사 소개
- **회사명**: (주)소나버스 / Sonaverse Co., Ltd.
- **사업 분야**: 시니어테크 스타트업
- **핵심 미션**: "시니어의 더 나은 일상을 위해" / "For a Better Daily Life for Seniors"
- **비전**: 불편을 겪는 사용자를 통해 발견한 혁신, 명확한 브랜딩으로 시니어 생활 문제 해결

### 1.2 주요 제품
1. **만보 (MANBO) 워크메이트**
   - 하이브리드형 스마트 보행 보조기
   - 핵심 기능: 하이브리드 주행, 경사지 제어, 비상 자동 정지, 실종 방지(GPS)
   
2. **보듬 (BO DUME) 기저귀**
   - 프리미엄 성인용 기저귀
   - 제품 라인: 팬티형, 속기저귀, 깔개매트, 테이프형

### 1.3 웹사이트 목표
- 기존 홈페이지의 이미지 로딩 지연 및 콘텐츠 로딩 속도 저하 문제 개선
- 브랜드 메시지를 직관적이고 설득력 있게 시각화
- 모바일/태블릿/데스크톱 전 구간에서 빠르고 가벼운 경험 제공
- **우선순위**: 성능(속도) > 가독성 > 모듈화된 UI 구조 > 디자인

---

## 2. 브랜드 아이덴티티

### 2.1 핵심 메시지
```
한국어: "시니어의 더 나은 일상을 위해"
영어: "For a Better Daily Life for Seniors"
```

### 2.2 브랜드 톤 & 매너
- **따뜻함**: 시니어와 보호자 모두에게 편안한 느낌
- **신뢰감**: 기술 기반 기업의 전문성
- **접근성**: 크고 여백이 충분한 레이아웃, 가독성 우선
- **현대적**: 세련되고 깔끔한 UI/UX

### 2.3 로고 시스템
- 메인 로고: `/logo/ko_logo.png`, `/logo/en_logo.png`
- 심볼 로고: `/logo/symbol_logo.png`
- 크기: 데스크톱 95x32px, 모바일 72px

---

## 3. 디자인 스타일 분석

> ⚠️ **중요**: 아래 스타일 패턴들을 디자인에 반영해주세요.

### 3.1 공개 페이지 디자인

#### 3.1.1 홈페이지
```css
/* 배경색 */
--background-beige: #f0ece9;
--background-soft: #fcfbf9;

/* 레이아웃 */
- Hero: 전체 화면 그라데이션 배경 + 중앙 정렬 텍스트 + CTA 버튼
- 깔끔한 카드 레이아웃 (rounded-2xl, shadow-md)
- 부드러운 애니메이션 (transition-all, hover:-translate-y-1)
```

#### 3.1.2 만보 제품 상세
```css
/* 핵심 스타일 */
--primary: #2eb865;           /* 밝은 그린 - 만보 브랜드 컬러 */
--primary-dark: #249652;
--primary-light: #e8f9ee;
--beige-header: #f0ece9;
--beige-soft: #fcfbf9;
--text-main: #2d3330;
--text-sub: #5c6660;
```

```
디자인 특징:
- Hero: 좌측 텍스트 + 우측 이미지 레이아웃, 그라데이션 배경
- 배지: 둥근 필 스타일 (rounded-full), 프라이머리 라이트 배경
- 문제 해결 카드: 4열 그리드, 각 카드 하단에 컬러 라인 효과
- 기능 섹션: 이미지-텍스트 지그재그 레이아웃 (좌-우, 우-좌 교차)
- 제품 사양: 2열 그리드 테이블 형식
- CTA: 둥근 버튼 (rounded-full), 그림자 효과
- 전체적으로 둥근 모서리 (rounded-2xl, rounded-3xl)
- 부드러운 블러 효과 (backdrop-blur)
```

#### 3.1.3 보듬 제품 상세
```css
/* 핵심 스타일 */
--primary: #5eba7d;           /* 소프트 그린 - 보듬 브랜드 컬러 */
--primary-dark: #4da86e;
--soft-bg: #f0ece9;
--text-main: #3f3f3f;
--text-sub: #707070;
--border-color: #e6e2de;
```

```
디자인 특징:
- Hero: 좌측 이미지 + 우측 텍스트, 블러 배경 효과
- 스탯 표시: 3열 그리드 (100% 순면, 12시간 보호, 국제인증)
- 제품 라인업: 스티키 카테고리 필터 바
- 제품 카드: 호버 시 scale-110 이미지 확대 + 버튼 오버레이
- 카테고리 배지: 카드 좌상단 위치
- 태그: 프라이머리 배경 라이트 + 프라이머리 다크 텍스트
```

#### 3.1.4 소나버스 스토리 목록
```css
/* 핵심 스타일 */
--primary: #1C4376;           /* Deep Navy - 공통 브랜드 컬러 */
--primary-foreground: #ffffff;
--accent: #BDA191;            /* Warm Beige - 악센트 컬러 */
--accent-light: #F2EBE8;
--background-light: #fcfcfc;
--text-main: #1C4376;
--text-body: #4B5563;
```

```
디자인 특징:
- 헤더: 흰색 배경 + 그림자, 로그인 버튼 포함
- 페이지 헤딩: 대형 타이틀 (text-4xl md:text-5xl font-black)
- 카테고리 필터: 가로 스크롤, 둥근 필 버튼 (rounded-full)
- Featured 카드: 가로 레이아웃 (md:flex), 이미지 55-60% + 텍스트 40-45%
- 일반 카드: 3열 그리드 (lg:grid-cols-3)
- 영상 카드: 재생 아이콘 오버레이 (빨간색 원형)
- 날짜 형식: "2023. 10. 25"
- 더 보기 버튼: 하단 중앙 정렬
```

#### 3.1.5 언론보도 목록
```css
/* 핵심 스타일 */
--primary: #648bbe;
--sona-navy: #1C4376;
--sona-beige: #BDA191;
--background-light: #f6f7f7;
```

```
디자인 특징:
- 검색바: 대형 입력 필드 + 검색 아이콘
- 카테고리 칩: 둥근 필 (rounded-full), 활성/비활성 상태
- 기사 카드: 가로 레이아웃 (md:flex-row), 썸네일 + 콘텐츠
- 언론사 배지: 작은 라벨 형식
- 자세히 보기: 화살표 아이콘 + 호버 시 이동 효과
- 페이지네이션: 원형 버튼 스타일
```

#### 3.1.6 문의 페이지
```css
/* 핵심 스타일 */
--primary: #648bbe;
--sona-blue: #1C4376;
--sona-beige: #BDA191;
```

```
디자인 특징:
- 폼 컨테이너: 최대 너비 640px, 카드 형식 (rounded-2xl)
- 문의 유형: 라디오 버튼 그룹 (Chip 스타일)
- 입력 필드: 높이 48px (h-12), 둥근 모서리
- 파일 업로드: 드래그 앤 드롭 영역
- 동의 영역: 베이지 배경 박스
- 제출 버튼: 대형 (h-14), 네이비 배경, 그림자 효과
```

### 3.2 관리자 페이지 디자인

#### 3.2.1 관리자 대시보드
```css
/* 핵심 스타일 - 다크 테마 */
--primary: #36e27b;           /* 밝은 그린 */
--background-dark: #112117;
--surface-dark: #1c2e25;
--surface-dark-hover: #25382f;
--border-dark: #2a4035;
--text-secondary: #9eb7a8;
```

```
디자인 특징:
- 다크 테마 기반 (어두운 그린 톤)
- 사이드바: 고정 너비 (w-72), 네비게이션 메뉴
- KPI 카드: 4열 그리드, 호버 시 border 변경
- 빠른 실행: 아이콘 + 텍스트 버튼 카드
- 테이블: 다크 배경, 호버 효과
- 배지: 프라이머리 색상 강조
- 검색바: 상단 헤더에 위치
```

#### 3.2.2 관리자 로그인
```
디자인 특징:
- 중앙 정렬 로그인 폼
- 다크 테마 또는 라이트 테마
- 심플한 입력 필드
- 로딩 상태 표시
```

---

## 4. 통합 디자인 시스템

### 4.1 색상 시스템 (통일)

> ⚠️ **통합 필요**: Stitch 파일들에서 Primary 색상이 페이지마다 다름. 아래와 같이 통일 권장.

#### 공개 페이지 색상
```css
/* Primary (통일) */
--primary: #1C4376;           /* Deep Navy - 메인 브랜드 컬러 */
--primary-dark: #15325b;      /* 호버/액티브 상태 */
--primary-light: #1C4376/10;  /* 연한 배경 */
--primary-foreground: #ffffff;

/* 제품별 서브 컬러 (선택적 사용) */
--manbo-green: #2eb865;       /* 만보 제품 페이지 악센트 */
--bodeum-green: #5eba7d;      /* 보듬 제품 페이지 악센트 */

/* Accent (공통) */
--accent: #BDA191;            /* Warm Beige */
--accent-light: #F2EBE8;
--accent-dark: #8c6b5d;

/* Background */
--background-light: #fcfcfc;
--background-beige: #f0ece9;  /* 헤더/푸터 배경 */
--background-white: #ffffff;

/* Text */
--text-main: #1C4376;         /* 또는 #111827, #222222 */
--text-body: #4B5563;
--text-secondary: #6B7280;
--text-muted: #9CA3AF;

/* Border */
--border-light: #eaedf0;
--border-gray: #dce0e5;
```

#### 관리자 페이지 색상 (다크 테마)
```css
--admin-primary: #36e27b;     /* 밝은 그린 */
--admin-bg: #112117;
--admin-surface: #1c2e25;
--admin-surface-hover: #25382f;
--admin-border: #2a4035;
--admin-text-secondary: #9eb7a8;
```

### 4.2 타이포그래피

#### 폰트 패밀리
```css
/* 공개 페이지 */
font-family: "Inter", "Noto Sans KR", sans-serif;

/* 관리자 페이지 */
font-family: "Spline Sans", "Noto Sans KR", sans-serif;
```

#### 폰트 크기 가이드 (반응형)
| 요소 | 모바일 | 태블릿 | 데스크톱 | Tailwind |
|------|--------|--------|----------|----------|
| 메인 헤드라인 | 24px | 28px | 36-48px | `text-2xl sm:text-3xl lg:text-4xl xl:text-5xl` |
| 섹션 타이틀 | 20px | 24px | 28-32px | `text-xl sm:text-2xl lg:text-3xl` |
| 카드 제목 | 18px | 20px | 20-24px | `text-lg sm:text-xl lg:text-2xl` |
| 본문 | 16px | 18px | 18-20px | `text-base sm:text-lg lg:text-xl` |
| 작은 텍스트 | 14px | 14px | 14-16px | `text-sm sm:text-base` |

### 4.3 Border Radius
```css
--radius-sm: 0.5rem;    /* 8px */
--radius-md: 1rem;      /* 16px */
--radius-lg: 1.5rem;    /* 24px */
--radius-xl: 2rem;      /* 32px */
--radius-2xl: 3rem;     /* 48px */
--radius-full: 9999px;  /* 완전 둥근 */
```

### 4.4 그림자 & 효과
```css
/* 카드 기본 */
shadow-sm

/* 호버 시 */
shadow-lg hover:shadow-xl

/* 버튼 */
shadow-md shadow-primary/20

/* 블러 효과 */
backdrop-blur-sm
backdrop-blur-md
```

---

## 5. 페이지별 상세 요구사항

### 5.1 홈페이지 (/)

#### Hero 섹션
```html
<section class="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
  <!-- 배경: 그라데이션 또는 bg-cover -->
  <div class="absolute inset-0 bg-gradient-to-b from-[#f0ece9] to-[#fcfbf9]"></div>
  <div class="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center gap-8">
    <h1 class="text-4xl lg:text-5xl font-black text-primary">시니어의 더 나은 일상을 위해</h1>
    <p class="text-2xl font-bold text-gray-600">소나버스 / SONAVERSE</p>
    <p class="text-lg text-gray-500 max-w-2xl">불편을 겪는 사용자를 통해 발견한 혁신. 명확한 브랜딩으로 시니어 생활 문제를 해결합니다.</p>
    <div class="flex gap-4">
      <button class="h-14 px-8 rounded-full bg-primary text-white font-bold">제품 보러가기</button>
      <button class="h-14 px-8 rounded-full border-2 border-gray-200 bg-white font-bold">소나버스 스토리 보기</button>
    </div>
  </div>
</section>
```

#### 문제 정의 섹션
```html
<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-6">
    <h2 class="text-3xl lg:text-4xl font-black text-primary mb-12">우리가 해결하고자 하는 문제들</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 카드 1: 안전성 및 성능의 한계 (아이콘: warning, 색상: red) -->
      <!-- 카드 2: 인체공학 설계 미흡 (아이콘: accessibility_new, 색상: blue) -->
      <!-- 카드 3: 심리적 만족감 (아이콘: psychology_alt, 색상: orange) -->
      <!-- 카드 4: 기술 사각지대 (아이콘: wifi_off, 색상: purple) -->
    </div>
  </div>
</section>
```

#### 제품 섹션
```html
<section class="py-20 bg-[#f0ece9]">
  <div class="max-w-7xl mx-auto px-6">
    <h2 class="text-3xl font-black text-primary mb-8">제품 소개</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- 만보 카드: 타이틀 + 설명 + 배지 (하이브리드 주행, 경사지 제어) -->
      <!-- 보듬 카드: 타이틀 + 설명 + 배지 (흡수력, 샘 방지막) -->
    </div>
  </div>
</section>
```

#### 소나버스 스토리 섹션
```html
<section class="py-20 bg-white">
  <h2 class="text-3xl font-black text-primary mb-8">소나버스 스토리</h2>
  <!-- Featured 스토리 1개 (와이드 카드: md:flex) -->
  <!-- 서브 스토리 3-4개 (grid-cols-3) -->
</section>
```

#### 회사 연혁 섹션
```html
<section class="py-20 bg-[#fcfcfc]">
  <h2 class="text-3xl font-black text-primary mb-12">소나버스의 성장 여정</h2>
  <!-- 타임라인: 2022-2026 주요 이정표 -->
</section>
```

#### 언론보도 섹션
```html
<section class="py-20 bg-white">
  <h2 class="text-3xl font-black text-primary mb-8">언론보도</h2>
  <!-- 메인 기사 1개 (와이드) + 서브 기사 3개 (세로 카드) -->
</section>
```

### 5.2 제품 상세 페이지

#### 만보 (/products/manbo-walker)
- **Primary 색상**: `#2eb865` (그린)
- **배경**: 그라데이션 `from-[#f0ece9] to-[#fcfbf9]`

```html
<!-- Hero: 좌측 텍스트 + 우측 제품 비주얼 -->
<section class="bg-gradient-to-b from-[#f0ece9] to-[#fcfbf9] py-24">
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
    <div class="flex-1"><!-- 텍스트 --></div>
    <div class="flex-1"><!-- 제품 비주얼 영역 --></div>
  </div>
</section>

<!-- 문제 정의: 4열 카드, 각 카드 하단에 컬러 라인 -->
<!-- 기능 섹션: 이미지-텍스트 지그재그 (lg:flex-row, lg:flex-row-reverse 교차) -->
<!-- 제품 사양: 2열 그리드 테이블 -->
<!-- CTA: rounded-full 버튼 -->
```

#### 보듬 (/products/bodeum-diaper)
- **Primary 색상**: `#5eba7d` (소프트 그린)
- **배경**: 흰색 + 연한 베이지

```html
<!-- Hero: 좌측 비주얼 + 우측 텍스트 -->
<section class="py-24">
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
    <div class="flex-1"><!-- 제품 비주얼 영역 --></div>
    <div class="flex-1">
      <h1 class="text-6xl font-black">보듬</h1>
      <p class="text-2xl">프리미엄 성인용 기저귀</p>
      <!-- 스탯: 3열 그리드 (100% 순면, 12시간, 국제인증) -->
      <div class="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
        <div><p class="text-2xl font-bold">100%</p><p class="text-sm">순면 감촉</p></div>
        <div><p class="text-2xl font-bold">12시간</p><p class="text-sm">안심 보호</p></div>
        <div><p class="text-2xl font-bold">국제인증</p><p class="text-sm">인증 완료</p></div>
      </div>
    </div>
  </div>
</section>

<!-- 스티키 필터 바 -->
<section class="sticky top-[73px] z-40 bg-white/90 backdrop-blur border-b py-4">
  <div class="flex gap-2">
    <button class="rounded-full bg-primary text-white px-5 py-2 font-bold">전체</button>
    <button class="rounded-full bg-white border px-5 py-2">팬티형</button>
    <button class="rounded-full bg-white border px-5 py-2">속기저귀</button>
    <button class="rounded-full bg-white border px-5 py-2">깔개매트</button>
  </div>
</section>

<!-- 제품 카드 그리드 -->
<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  <!-- 호버 시 scale-110 + 버튼 오버레이 -->
</section>
```

### 5.3 소나버스 스토리 (/sonaverse-story)
- **Primary 색상**: `#1C4376` (Deep Navy)
- **Accent 색상**: `#BDA191` (Warm Beige)

```html
<!-- 페이지 헤딩 -->
<div class="mb-12">
  <h2 class="text-4xl md:text-5xl font-black text-primary">소나버스 스토리</h2>
  <p class="text-xl text-gray-600">소나버스 제품의 개발 스토리부터 유용한 <span class="text-accent font-bold">복지/건강 정보</span>까지!</p>
</div>

<!-- 카테고리 필터 (가로 스크롤) -->
<div class="overflow-x-auto pb-2">
  <div class="flex min-w-max gap-3">
    <button class="h-12 rounded-full bg-primary px-6 text-lg font-bold text-white">전체</button>
    <button class="h-12 rounded-full bg-white border-2 border-[#eaedf0] px-6 text-lg font-bold text-gray-600">제품스토리</button>
    <button class="h-12 rounded-full bg-white border-2 border-[#eaedf0] px-6 text-lg font-bold text-gray-600">사용법</button>
    <button class="h-12 rounded-full bg-white border-2 border-[#eaedf0] px-6 text-lg font-bold text-gray-600">건강정보</button>
    <button class="h-12 rounded-full bg-white border-2 border-[#eaedf0] px-6 text-lg font-bold text-gray-600">복지정보</button>
  </div>
</div>

<!-- Featured 카드 (와이드): md:flex, 이미지 55-60% + 텍스트 40-45% -->
<!-- 스토리 그리드: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 -->
<!-- 영상 카드: 빨간색 원형 재생 아이콘 오버레이 -->
<!-- 더 보기 버튼: 하단 중앙 정렬 -->
```

### 5.4 언론보도 (/press)
- **Primary 색상**: `#1C4376` (Deep Navy)
- **Accent 색상**: `#BDA191` (Warm Beige)

```html
<!-- 검색바 -->
<div class="relative w-full">
  <div class="absolute inset-y-0 left-0 pl-4 flex items-center">
    <span class="material-symbols-outlined text-gray-400">search</span>
  </div>
  <input class="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white shadow-sm ring-1 ring-gray-200 text-lg" placeholder="기사 제목 또는 언론사를 검색하세요"/>
</div>

<!-- 카테고리 칩: rounded-full, 활성/비활성 상태 -->
<!-- 기사 카드: flex-col md:flex-row, 썸네일 + 콘텐츠 -->
<!-- 자세히 보기: 화살표 아이콘 + hover:translate-x-1 -->
<!-- 페이지네이션: 원형 버튼 스타일 -->
```

### 5.5 문의 페이지 (/inquiry)

```html
<!-- 폼 컨테이너 -->
<div class="w-full max-w-[640px] mx-auto">
  <form class="bg-white p-8 rounded-2xl shadow-sm border">
    <!-- 문의 유형 (Chip 버튼) -->
    <div class="flex flex-wrap gap-3">
      <label class="cursor-pointer">
        <input type="radio" name="inquiry_type" class="peer sr-only"/>
        <div class="h-12 px-5 rounded-xl bg-[#eaedf0] font-medium peer-checked:bg-primary peer-checked:text-white">
          서비스 도입 문의
        </div>
      </label>
      <!-- 기타 옵션: 제품 기능, 사업 제휴, 채널 제휴, 투자/IR, 언론/홍보, 기타 -->
    </div>
    
    <!-- 입력 필드: h-12, rounded-lg -->
    <input class="h-12 w-full rounded-lg border px-4" placeholder="홍길동"/>
    
    <!-- 동의 영역 -->
    <div class="p-4 rounded-xl bg-[#BDA191]/10 border border-[#BDA191]/30">
      <input type="checkbox"/>
      <label>[필수] 개인정보 수집 및 이용에 동의합니다.</label>
    </div>
    
    <!-- 제출 버튼 -->
    <button class="w-full h-14 rounded-xl bg-[#1C4376] text-white text-lg font-bold shadow-lg">
      문의하기
    </button>
  </form>
</div>
```

### 5.6 관리자 페이지

> **공통 스타일**: 다크 테마, 배경 `#112117`, 표면 `#1c2e25`, Primary `#36e27b`

#### 5.6.1 로그인 (/admin/login)
```html
<div class="min-h-screen flex items-center justify-center bg-[#112117]">
  <div class="w-full max-w-md p-8 rounded-xl bg-[#1c2e25] border border-[#2a4035]">
    <h1 class="text-2xl font-bold text-white mb-6">관리자 로그인</h1>
    <input class="w-full h-12 rounded-lg bg-[#112117] border border-[#2a4035] px-4 text-white mb-4" placeholder="이메일"/>
    <input type="password" class="w-full h-12 rounded-lg bg-[#112117] border border-[#2a4035] px-4 text-white mb-6" placeholder="비밀번호"/>
    <button class="w-full h-12 rounded-lg bg-[#36e27b] text-black font-bold">로그인</button>
  </div>
</div>
```

#### 5.6.2 공통 레이아웃 (사이드바 + 메인)
```html
<div class="flex h-screen bg-[#112117]">
  <!-- 사이드바 -->
  <aside class="w-72 bg-[#0e1a12] border-r border-[#2a4035] flex flex-col">
    <!-- 로고 -->
    <div class="p-6 flex items-center gap-3">
      <div class="size-10 rounded-full bg-[#36e27b]/20"></div>
      <div>
        <h1 class="text-white text-lg font-bold">Sonaverse</h1>
        <p class="text-[#9eb7a8] text-xs">Admin Console</p>
      </div>
    </div>
    
    <!-- 네비게이션 -->
    <nav class="flex flex-col gap-2 p-6 flex-1">
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#36e27b]/10 border border-[#36e27b]/20 text-white">
        <span class="material-symbols-outlined text-[#36e27b]">dashboard</span>
        대시보드
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">newspaper</span>
        언론보도 관리
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">auto_stories</span>
        소나버스 스토리
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">inventory_2</span>
        제품 관리
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">inbox</span>
        <span class="flex-1">문의 내역</span>
        <span class="bg-[#36e27b] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">web</span>
        팝업 관리
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">bar_chart</span>
        통계 분석
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">group</span>
        관리자 계정
      </a>
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">settings</span>
        설정
      </a>
    </nav>
    
    <!-- 프로필 -->
    <div class="p-4 border-t border-[#2a4035]">
      <div class="flex items-center gap-3 px-3 py-2">
        <div class="size-9 rounded-full bg-[#2a4035]"></div>
        <div>
          <p class="text-white text-sm font-medium">Administrator</p>
          <p class="text-[#9eb7a8] text-xs">admin@sonaverse.com</p>
        </div>
      </div>
    </div>
  </aside>
  
  <!-- 메인 콘텐츠 영역 -->
  <main class="flex-1 flex flex-col overflow-hidden">
    <!-- 상단 헤더 -->
    <header class="h-16 border-b border-[#2a4035] flex items-center justify-between px-10 bg-[#112117]/80 backdrop-blur">
      <div class="flex items-center gap-4">
        <!-- 검색바 -->
        <div class="flex items-center h-10 bg-[#1c2e25] rounded-lg border border-[#2a4035] px-3">
          <span class="material-symbols-outlined text-[#9eb7a8] text-[20px]">search</span>
          <input class="bg-transparent border-none text-white placeholder-[#9eb7a8] text-sm px-3 w-64" placeholder="검색어를 입력하세요"/>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="size-10 rounded-lg hover:bg-[#1c2e25] text-[#9eb7a8] hover:text-white relative">
          <span class="material-symbols-outlined">notifications</span>
          <span class="absolute top-2.5 right-2.5 size-2 bg-[#36e27b] rounded-full"></span>
        </button>
      </div>
    </header>
    
    <!-- 스크롤 가능한 콘텐츠 -->
    <div class="flex-1 overflow-y-auto p-10">
      <!-- 페이지별 콘텐츠 -->
    </div>
  </main>
</div>
```

#### 5.6.3 대시보드 (/admin)
```html
<!-- KPI 카드 그리드 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <div class="p-5 rounded-xl bg-[#1c2e25] border border-[#2a4035]/50 hover:border-[#36e27b]/30">
    <div class="flex justify-between items-start mb-4">
      <div class="p-2 bg-[#112117] rounded-lg text-[#36e27b]">
        <span class="material-symbols-outlined">newspaper</span>
      </div>
      <span class="bg-[#36e27b]/10 text-[#36e27b] text-xs font-medium px-2 py-1 rounded">+2 this week</span>
    </div>
    <p class="text-[#9eb7a8] text-sm mb-1">언론보도</p>
    <p class="text-white text-3xl font-bold">12</p>
  </div>
  <!-- 소나버스 스토리, 문의, 방문자 카드 동일 패턴 -->
</div>

<!-- 빠른 실행 -->
<h3 class="text-white text-lg font-bold mb-4">빠른 실행</h3>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <button class="flex items-center gap-4 p-4 rounded-xl bg-[#1c2e25] hover:bg-[#25382f] border border-[#2a4035] hover:border-[#36e27b]/50 text-left">
    <div class="size-12 rounded-full bg-[#112117] flex items-center justify-center text-[#36e27b]">
      <span class="material-symbols-outlined">add_circle</span>
    </div>
    <div>
      <span class="text-white font-semibold text-sm">새 언론보도 등록</span>
      <span class="text-[#9eb7a8] text-xs block">New Press Release</span>
    </div>
  </button>
  <!-- 새 스토리 작성, 팝업 등록, 문의 확인 버튼 동일 패턴 -->
</div>

<!-- 최근 게시물 테이블 -->
<h3 class="text-white text-lg font-bold mb-4">최근 게시물</h3>
<div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] overflow-hidden">
  <table class="w-full">
    <thead>
      <tr class="border-b border-[#2a4035] bg-[#14221b]">
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Type</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Title</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Date</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[#2a4035]/50">
      <tr class="hover:bg-white/5">
        <td class="p-4"><span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#36e27b]/20 text-[#36e27b]">Press</span></td>
        <td class="p-4 text-white text-sm">소나버스, 시니어 맞춤형 AI 컴패니언 서비스 출시</td>
        <td class="p-4 text-[#9eb7a8] text-sm">2023-10-24</td>
        <td class="p-4"><button class="text-[#9eb7a8] hover:text-white"><span class="material-symbols-outlined text-[20px]">more_vert</span></button></td>
      </tr>
    </tbody>
  </table>
</div>
```

#### 5.6.4 언론보도 관리 (/admin/press)
```html
<!-- 페이지 헤더 -->
<div class="flex justify-between items-center mb-8">
  <div>
    <h1 class="text-white text-3xl font-bold">언론보도 관리</h1>
    <p class="text-[#9eb7a8]">총 12개의 언론보도가 등록되어 있습니다.</p>
  </div>
  <button class="flex items-center gap-2 h-12 px-6 rounded-lg bg-[#36e27b] text-black font-bold">
    <span class="material-symbols-outlined">add</span>
    새 언론보도 등록
  </button>
</div>

<!-- 필터 + 검색 -->
<div class="flex gap-4 mb-6">
  <select class="h-10 px-4 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white">
    <option>전체</option>
    <option>게시됨</option>
    <option>임시저장</option>
  </select>
  <input class="flex-1 h-10 px-4 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white placeholder-[#9eb7a8]" placeholder="제목으로 검색"/>
</div>

<!-- 테이블 -->
<div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] overflow-hidden">
  <table class="w-full">
    <thead>
      <tr class="border-b border-[#2a4035] bg-[#14221b]">
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase w-12"><input type="checkbox"/></th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">썸네일</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">제목</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">언론사</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">게시일</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">상태</th>
        <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-[#2a4035]/50">
      <tr class="hover:bg-white/5">
        <td class="p-4"><input type="checkbox"/></td>
        <td class="p-4"><div class="w-16 h-12 rounded bg-[#2a4035]"></div></td>
        <td class="p-4 text-white text-sm max-w-xs truncate">소나버스, 시니어 맞춤형 AI 서비스...</td>
        <td class="p-4 text-[#9eb7a8] text-sm">한국경제</td>
        <td class="p-4 text-[#9eb7a8] text-sm">2023-10-24</td>
        <td class="p-4"><span class="px-2 py-1 rounded text-xs bg-[#36e27b]/20 text-[#36e27b]">게시됨</span></td>
        <td class="p-4">
          <div class="flex gap-2">
            <button class="text-[#9eb7a8] hover:text-white"><span class="material-symbols-outlined text-[18px]">edit</span></button>
            <button class="text-[#9eb7a8] hover:text-red-400"><span class="material-symbols-outlined text-[18px]">delete</span></button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- 페이지네이션 -->
<div class="flex justify-between items-center mt-6">
  <p class="text-[#9eb7a8] text-sm">1-10 of 12 items</p>
  <div class="flex gap-2">
    <button class="size-10 rounded-lg border border-[#2a4035] text-[#9eb7a8] hover:text-white">
      <span class="material-symbols-outlined">chevron_left</span>
    </button>
    <button class="size-10 rounded-lg bg-[#36e27b] text-black font-bold">1</button>
    <button class="size-10 rounded-lg border border-[#2a4035] text-[#9eb7a8] hover:text-white">2</button>
    <button class="size-10 rounded-lg border border-[#2a4035] text-[#9eb7a8] hover:text-white">
      <span class="material-symbols-outlined">chevron_right</span>
    </button>
  </div>
</div>
```

#### 5.6.5 언론보도 등록/수정 (/admin/press/new, /admin/press/[id]/edit)
```html
<div class="max-w-4xl">
  <h1 class="text-white text-3xl font-bold mb-8">새 언론보도 등록</h1>
  
  <form class="flex flex-col gap-6">
    <!-- 기본 정보 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">기본 정보</h2>
      
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">제목 *</label>
          <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="언론보도 제목"/>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">언론사 *</label>
            <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="한국경제"/>
          </div>
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">원문 링크</label>
            <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="https://"/>
          </div>
        </div>
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">요약</label>
          <textarea class="w-full h-24 px-4 py-3 rounded-lg bg-[#112117] border border-[#2a4035] text-white resize-none" placeholder="언론보도 요약..."></textarea>
        </div>
      </div>
    </div>
    
    <!-- 썸네일 업로드 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">썸네일</h2>
      <div class="border-2 border-dashed border-[#2a4035] rounded-lg p-8 text-center">
        <span class="material-symbols-outlined text-[#9eb7a8] text-4xl mb-2">cloud_upload</span>
        <p class="text-[#9eb7a8]">클릭하여 업로드 또는 드래그 앤 드롭</p>
        <p class="text-[#9eb7a8]/60 text-sm">PNG, JPG, WebP (최대 5MB)</p>
      </div>
    </div>
    
    <!-- 게시 설정 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">게시 설정</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">게시일</label>
          <input type="date" class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white"/>
        </div>
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">상태</label>
          <select class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white">
            <option>게시됨</option>
            <option>임시저장</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 버튼 -->
    <div class="flex justify-end gap-4">
      <button type="button" class="h-12 px-6 rounded-lg border border-[#2a4035] text-[#9eb7a8] hover:text-white">취소</button>
      <button type="button" class="h-12 px-6 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white">임시저장</button>
      <button type="submit" class="h-12 px-6 rounded-lg bg-[#36e27b] text-black font-bold">게시하기</button>
    </div>
  </form>
</div>
```

#### 5.6.6 소나버스 스토리 관리 (/admin/sonaverse-story)
```html
<!-- 언론보도 관리와 동일한 테이블 레이아웃 -->
<!-- 추가 컬럼: 카테고리 (제품스토리, 사용법, 건강정보, 복지정보), YouTube URL -->
```

#### 5.6.7 제품 관리 (/admin/products)
```html
<!-- 제품 목록: 카드 그리드 형식 -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] overflow-hidden">
    <div class="aspect-video bg-[#2a4035]"></div>
    <div class="p-4">
      <span class="text-xs text-[#36e27b] font-medium">팬티형</span>
      <h3 class="text-white font-bold mt-1">편안한 팬티형</h3>
      <p class="text-[#9eb7a8] text-sm mt-1 line-clamp-2">활동적인 시니어를 위한...</p>
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-[#2a4035]">
        <span class="text-[#9eb7a8] text-sm">활성화됨</span>
        <div class="flex gap-2">
          <button class="text-[#9eb7a8] hover:text-white"><span class="material-symbols-outlined text-[18px]">edit</span></button>
          <button class="text-[#9eb7a8] hover:text-red-400"><span class="material-symbols-outlined text-[18px]">delete</span></button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 5.6.8 문의 관리 (/admin/inquiries)
```html
<!-- 문의 목록 테이블 -->
<table class="w-full">
  <thead>
    <tr class="border-b border-[#2a4035] bg-[#14221b]">
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">문의 유형</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">회사명</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">담당자</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">연락처</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">접수일</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">상태</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr class="hover:bg-white/5 cursor-pointer">
      <td class="p-4"><span class="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">서비스 도입</span></td>
      <td class="p-4 text-white text-sm">(주)테스트</td>
      <td class="p-4 text-[#9eb7a8] text-sm">홍길동</td>
      <td class="p-4 text-[#9eb7a8] text-sm">010-1234-5678</td>
      <td class="p-4 text-[#9eb7a8] text-sm">2023-10-24</td>
      <td class="p-4"><span class="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">대기중</span></td>
      <td class="p-4">
        <button class="text-[#36e27b] hover:underline text-sm">상세보기</button>
      </td>
    </tr>
  </tbody>
</table>

<!-- 문의 상세 모달 -->
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="w-full max-w-2xl bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-white text-xl font-bold">문의 상세</h2>
      <button class="text-[#9eb7a8] hover:text-white">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
    <!-- 문의 정보 표시 -->
    <!-- 답변 작성 영역 -->
    <!-- 상태 변경 버튼 -->
  </div>
</div>
```

#### 5.6.9 팝업 관리 (/admin/popups) ⭐ 신규
```html
<!-- 페이지 헤더 -->
<div class="flex justify-between items-center mb-8">
  <div>
    <h1 class="text-white text-3xl font-bold">팝업 관리</h1>
    <p class="text-[#9eb7a8]">현재 3개의 팝업이 활성화되어 있습니다.</p>
  </div>
  <button class="flex items-center gap-2 h-12 px-6 rounded-lg bg-[#36e27b] text-black font-bold">
    <span class="material-symbols-outlined">add</span>
    새 팝업 등록
  </button>
</div>

<!-- 팝업 목록 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] overflow-hidden">
    <!-- 팝업 미리보기 -->
    <div class="aspect-video bg-[#2a4035] relative">
      <span class="absolute top-2 right-2 px-2 py-1 rounded text-xs bg-[#36e27b]/20 text-[#36e27b]">활성</span>
    </div>
    <div class="p-4">
      <h3 class="text-white font-bold">신제품 출시 안내</h3>
      <p class="text-[#9eb7a8] text-sm mt-1">2023.10.01 ~ 2023.12.31</p>
      <div class="flex gap-2 mt-2">
        <span class="text-xs text-[#9eb7a8] bg-[#2a4035] px-2 py-1 rounded">500x400</span>
        <span class="text-xs text-[#9eb7a8] bg-[#2a4035] px-2 py-1 rounded">버튼 2개</span>
      </div>
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-[#2a4035]">
        <div class="flex gap-2">
          <button class="text-[#9eb7a8] hover:text-white text-sm">미리보기</button>
        </div>
        <div class="flex gap-2">
          <button class="text-[#9eb7a8] hover:text-white"><span class="material-symbols-outlined text-[18px]">edit</span></button>
          <button class="text-[#9eb7a8] hover:text-red-400"><span class="material-symbols-outlined text-[18px]">delete</span></button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 5.6.10 팝업 등록/수정 (/admin/popups/new, /admin/popups/[id]/edit) ⭐ 신규
```html
<div class="max-w-4xl">
  <h1 class="text-white text-3xl font-bold mb-8">새 팝업 등록</h1>
  
  <form class="flex flex-col gap-6">
    <!-- 기본 정보 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">기본 정보</h2>
      <div class="flex flex-col gap-4">
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">팝업 제목 (관리용) *</label>
          <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="신제품 출시 안내"/>
        </div>
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">팝업 설명 (관리용)</label>
          <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="내부 관리용 설명"/>
        </div>
      </div>
    </div>
    
    <!-- 게시 기간 설정 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">게시 기간</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">시작일 *</label>
          <input type="datetime-local" class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white"/>
        </div>
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">종료일 *</label>
          <input type="datetime-local" class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white"/>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-4">
        <input type="checkbox" id="no_end_date" class="rounded bg-[#112117] border-[#2a4035]"/>
        <label for="no_end_date" class="text-[#9eb7a8] text-sm">종료일 없음 (무기한)</label>
      </div>
    </div>
    
    <!-- 사이즈 설정 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">팝업 사이즈</h2>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">너비 (px) *</label>
          <input type="number" class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="500"/>
        </div>
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">높이 (px) *</label>
          <input type="number" class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="400"/>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button type="button" class="px-4 py-2 rounded-lg border border-[#2a4035] text-[#9eb7a8] text-sm">400x300</button>
        <button type="button" class="px-4 py-2 rounded-lg border border-[#2a4035] text-[#9eb7a8] text-sm">500x400</button>
        <button type="button" class="px-4 py-2 rounded-lg border border-[#2a4035] text-[#9eb7a8] text-sm">600x500</button>
        <button type="button" class="px-4 py-2 rounded-lg border border-[#2a4035] text-[#9eb7a8] text-sm">800x600</button>
      </div>
    </div>
    
    <!-- 콘텐츠 설정 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">팝업 콘텐츠</h2>
      
      <!-- 배경 설정 -->
      <div class="mb-6">
        <label class="text-[#9eb7a8] text-sm mb-2 block">배경 설정</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input type="radio" name="bg_type" value="color" class="text-[#36e27b]"/>
            <span class="text-white">배경색</span>
          </label>
          <label class="flex items-center gap-2">
            <input type="radio" name="bg_type" value="image" class="text-[#36e27b]"/>
            <span class="text-white">배경 이미지</span>
          </label>
        </div>
        <input type="color" class="mt-2 w-20 h-10 rounded cursor-pointer"/>
      </div>
      
      <!-- 이미지 업로드 -->
      <div class="mb-6">
        <label class="text-[#9eb7a8] text-sm mb-2 block">메인 이미지</label>
        <div class="border-2 border-dashed border-[#2a4035] rounded-lg p-6 text-center">
          <span class="material-symbols-outlined text-[#9eb7a8] text-3xl">cloud_upload</span>
          <p class="text-[#9eb7a8] mt-2">클릭하여 업로드</p>
        </div>
      </div>
      
      <!-- 텍스트 설정 -->
      <div class="mb-6">
        <label class="text-[#9eb7a8] text-sm mb-2 block">팝업 제목 (사용자에게 표시)</label>
        <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="신제품 출시!"/>
      </div>
      <div class="mb-6">
        <label class="text-[#9eb7a8] text-sm mb-2 block">팝업 내용</label>
        <textarea class="w-full h-32 px-4 py-3 rounded-lg bg-[#112117] border border-[#2a4035] text-white resize-none" placeholder="팝업에 표시할 내용을 입력하세요..."></textarea>
      </div>
    </div>
    
    <!-- 버튼 설정 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-white text-lg font-bold">버튼 설정</h2>
        <button type="button" class="flex items-center gap-1 text-[#36e27b] text-sm">
          <span class="material-symbols-outlined text-[18px]">add</span>
          버튼 추가
        </button>
      </div>
      
      <!-- 버튼 1 -->
      <div class="bg-[#112117] rounded-lg p-4 mb-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-white font-medium">버튼 1</span>
          <button type="button" class="text-red-400 text-sm">삭제</button>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">버튼 텍스트</label>
            <input class="w-full h-10 px-4 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white" placeholder="자세히 보기"/>
          </div>
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">링크 URL</label>
            <input class="w-full h-10 px-4 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white" placeholder="https://"/>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">배경색</label>
            <input type="color" value="#36e27b" class="w-full h-10 rounded cursor-pointer"/>
          </div>
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">텍스트색</label>
            <input type="color" value="#000000" class="w-full h-10 rounded cursor-pointer"/>
          </div>
          <div>
            <label class="text-[#9eb7a8] text-sm mb-2 block">새 탭에서 열기</label>
            <select class="w-full h-10 px-4 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white">
              <option>아니오</option>
              <option>예</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 옵션 설정 -->
    <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
      <h2 class="text-white text-lg font-bold mb-4">추가 옵션</h2>
      <div class="flex flex-col gap-4">
        <label class="flex items-center gap-3">
          <input type="checkbox" checked class="rounded bg-[#112117] border-[#2a4035] text-[#36e27b]"/>
          <span class="text-white">"오늘 하루 안보기" 버튼 표시</span>
        </label>
        <label class="flex items-center gap-3">
          <input type="checkbox" checked class="rounded bg-[#112117] border-[#2a4035] text-[#36e27b]"/>
          <span class="text-white">배경 클릭 시 닫기</span>
        </label>
        <label class="flex items-center gap-3">
          <input type="checkbox" class="rounded bg-[#112117] border-[#2a4035] text-[#36e27b]"/>
          <span class="text-white">닫기(X) 버튼 숨기기</span>
        </label>
        <div>
          <label class="text-[#9eb7a8] text-sm mb-2 block">표시 우선순위 (숫자가 낮을수록 먼저 표시)</label>
          <input type="number" class="w-32 h-10 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" placeholder="1"/>
        </div>
      </div>
    </div>
    
    <!-- 버튼 -->
    <div class="flex justify-end gap-4">
      <button type="button" class="h-12 px-6 rounded-lg border border-[#2a4035] text-[#9eb7a8]">취소</button>
      <button type="button" class="h-12 px-6 rounded-lg bg-[#1c2e25] text-white">미리보기</button>
      <button type="submit" class="h-12 px-6 rounded-lg bg-[#36e27b] text-black font-bold">저장하기</button>
    </div>
  </form>
</div>
```

#### 5.6.11 통계 분석 (/admin/analytics)
```html
<!-- 기간 필터 -->
<div class="flex gap-4 mb-8">
  <select class="h-10 px-4 rounded-lg bg-[#1c2e25] border border-[#2a4035] text-white">
    <option>최근 7일</option>
    <option>최근 30일</option>
    <option>최근 90일</option>
    <option>직접 선택</option>
  </select>
</div>

<!-- 통계 카드 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <!-- 총 방문자, 페이지뷰, 평균 체류시간, 이탈률 -->
</div>

<!-- 차트 영역 -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
    <h3 class="text-white font-bold mb-4">방문자 추이</h3>
    <div class="h-64 bg-[#112117] rounded-lg"><!-- 차트 --></div>
  </div>
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
    <h3 class="text-white font-bold mb-4">페이지별 조회수</h3>
    <div class="h-64 bg-[#112117] rounded-lg"><!-- 차트 --></div>
  </div>
</div>
```

#### 5.6.12 관리자 계정 관리 (/admin/users)
```html
<!-- 관리자 목록 테이블 -->
<table class="w-full">
  <thead>
    <tr class="border-b border-[#2a4035] bg-[#14221b]">
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">프로필</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">이름</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">이메일</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">권한</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">마지막 로그인</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">상태</th>
      <th class="p-4 text-left text-xs font-semibold text-[#9eb7a8] uppercase">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr class="hover:bg-white/5">
      <td class="p-4"><div class="size-10 rounded-full bg-[#2a4035]"></div></td>
      <td class="p-4 text-white">홍길동</td>
      <td class="p-4 text-[#9eb7a8]">admin@sonaverse.com</td>
      <td class="p-4"><span class="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400">슈퍼관리자</span></td>
      <td class="p-4 text-[#9eb7a8] text-sm">2023-10-24 14:30</td>
      <td class="p-4"><span class="px-2 py-1 rounded text-xs bg-[#36e27b]/20 text-[#36e27b]">활성</span></td>
      <td class="p-4">
        <div class="flex gap-2">
          <button class="text-[#9eb7a8] hover:text-white"><span class="material-symbols-outlined text-[18px]">edit</span></button>
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

#### 5.6.13 설정 (/admin/settings)
```html
<div class="max-w-3xl">
  <!-- 사이트 기본 설정 -->
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6 mb-6">
    <h2 class="text-white text-lg font-bold mb-4">사이트 기본 설정</h2>
    <div class="flex flex-col gap-4">
      <div>
        <label class="text-[#9eb7a8] text-sm mb-2 block">사이트 제목</label>
        <input class="w-full h-12 px-4 rounded-lg bg-[#112117] border border-[#2a4035] text-white" value="소나버스"/>
      </div>
      <div>
        <label class="text-[#9eb7a8] text-sm mb-2 block">사이트 설명</label>
        <textarea class="w-full h-24 px-4 py-3 rounded-lg bg-[#112117] border border-[#2a4035] text-white resize-none">시니어의 더 나은 일상을 위해</textarea>
      </div>
    </div>
  </div>
  
  <!-- SEO 설정 -->
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6 mb-6">
    <h2 class="text-white text-lg font-bold mb-4">SEO 설정</h2>
    <!-- 메타 태그, OG 태그 설정 -->
  </div>
  
  <!-- 연락처 정보 -->
  <div class="bg-[#1c2e25] rounded-xl border border-[#2a4035] p-6">
    <h2 class="text-white text-lg font-bold mb-4">연락처 정보</h2>
    <!-- 전화번호, 이메일, 주소 등 -->
  </div>
</div>
```

---

## 6. 팝업 시스템 (데이터 스키마 포함)

### 6.1 팝업 기능 개요

#### 핵심 기능
- **무제한 팝업 등록**: 개수 제한 없이 팝업 등록 가능
- **유연한 사이즈 조절**: 너비/높이 자유롭게 설정
- **게시 기간 설정**: 시작일~종료일 지정 (무기한 옵션)
- **오늘 하루 안보기**: localStorage 기반 쿠키 대체
- **배경 클릭 닫기**: 모달 외부 클릭 시 닫기
- **다중 버튼 지원**: 버튼 개수 제한 없이 추가 가능
- **콘텐츠 유연성**: 텍스트 + 이미지 조합, 배경색/배경이미지

### 6.2 팝업 데이터 스키마 (MongoDB)

```typescript
// Popup Collection
interface Popup {
  _id: ObjectId;
  
  // === 기본 정보 ===
  title: string;                      // 관리용 팝업 제목
  description?: string;               // 관리용 설명
  slug: string;                       // URL 슬러그 (unique)
  
  // === 게시 기간 ===
  start_date: Date;                   // 게시 시작일시
  end_date?: Date;                    // 게시 종료일시 (null = 무기한)
  is_no_end_date: boolean;            // 종료일 없음 여부
  
  // === 사이즈 설정 ===
  width: number;                      // 팝업 너비 (px)
  height: number;                     // 팝업 높이 (px)
  max_width?: number;                 // 최대 너비 (반응형)
  max_height?: number;                // 최대 높이 (반응형)
  
  // === 위치 설정 ===
  position: 'center' | 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  offset_x?: number;                  // X축 오프셋 (px)
  offset_y?: number;                  // Y축 오프셋 (px)
  
  // === 배경 설정 ===
  background_type: 'color' | 'image' | 'gradient';
  background_color?: string;          // HEX 색상 (#ffffff)
  background_image_url?: string;      // 배경 이미지 URL
  background_gradient?: string;       // CSS 그라데이션 문자열
  background_opacity?: number;        // 배경 투명도 (0-1)
  
  // === 오버레이 설정 ===
  overlay_enabled: boolean;           // 배경 오버레이 사용
  overlay_color: string;              // 오버레이 색상 (기본: #000000)
  overlay_opacity: number;            // 오버레이 투명도 (0-1, 기본: 0.5)
  overlay_blur?: number;              // 오버레이 블러 효과 (px)
  
  // === 콘텐츠 ===
  content: {
    // 메인 이미지
    image_url?: string;               // 메인 이미지 URL
    image_alt?: string;               // 이미지 alt 텍스트
    image_fit?: 'cover' | 'contain' | 'fill' | 'none';
    image_position?: string;          // CSS background-position
    
    // 텍스트 콘텐츠
    title?: string;                   // 팝업 제목 (사용자에게 표시)
    title_color?: string;             // 제목 색상
    title_size?: number;              // 제목 폰트 크기 (px)
    title_weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
    title_align?: 'left' | 'center' | 'right';
    
    subtitle?: string;                // 부제목
    subtitle_color?: string;
    subtitle_size?: number;
    
    body?: string;                    // 본문 내용 (HTML 허용)
    body_color?: string;
    body_size?: number;
    body_align?: 'left' | 'center' | 'right';
    
    // 커스텀 HTML (고급 사용자용)
    custom_html?: string;
    custom_css?: string;
  };
  
  // === 버튼 설정 (배열, 개수 제한 없음) ===
  buttons: PopupButton[];
  
  // === 옵션 ===
  options: {
    show_close_button: boolean;       // 닫기(X) 버튼 표시
    close_button_position?: 'inside' | 'outside'; // 닫기 버튼 위치
    close_button_color?: string;      // 닫기 버튼 색상
    
    show_today_hide: boolean;         // "오늘 하루 안보기" 표시
    today_hide_text?: string;         // 커스텀 텍스트 (기본: "오늘 하루 안보기")
    today_hide_position?: 'top' | 'bottom'; // 위치
    
    close_on_overlay_click: boolean;  // 배경 클릭 시 닫기
    close_on_escape: boolean;         // ESC 키로 닫기
    
    auto_close_seconds?: number;      // 자동 닫기 (초, null = 비활성)
    show_countdown?: boolean;         // 자동 닫기 카운트다운 표시
    
    animation_type?: 'fade' | 'slide-up' | 'slide-down' | 'scale' | 'none';
    animation_duration?: number;      // 애니메이션 시간 (ms)
    
    scroll_lock: boolean;             // 팝업 표시 시 스크롤 잠금
    
    z_index?: number;                 // z-index (기본: 9999)
  };
  
  // === 표시 조건 ===
  display_conditions: {
    pages?: string[];                 // 특정 페이지에서만 표시 (빈 배열 = 전체)
    exclude_pages?: string[];         // 특정 페이지 제외
    
    devices?: ('desktop' | 'tablet' | 'mobile')[]; // 디바이스 타겟팅
    
    user_type?: 'all' | 'guest' | 'member'; // 사용자 유형
    
    referrer_contains?: string[];     // 특정 리퍼러에서 유입 시
    
    min_scroll_percent?: number;      // 최소 스크롤 비율 후 표시
    delay_seconds?: number;           // 페이지 로드 후 지연 (초)
    
    max_impressions?: number;         // 최대 노출 횟수 (세션당)
    max_impressions_total?: number;   // 총 최대 노출 횟수 (사용자당)
  };
  
  // === 우선순위 & 상태 ===
  priority: number;                   // 표시 우선순위 (낮을수록 먼저)
  is_active: boolean;                 // 활성화 상태
  is_deleted: boolean;                // 소프트 삭제
  
  // === 통계 ===
  stats: {
    impressions: number;              // 노출 수
    clicks: number;                   // 클릭 수 (버튼 클릭)
    close_count: number;              // 닫기 횟수
    today_hide_count: number;         // "오늘 하루 안보기" 클릭 수
  };
  
  // === 메타데이터 ===
  created_by: ObjectId;               // 생성자 (Admin User)
  updated_by?: ObjectId;              // 수정자
  created_at: Date;
  updated_at: Date;
}

// 버튼 서브 스키마
interface PopupButton {
  _id: ObjectId;                      // 버튼 고유 ID
  order: number;                      // 버튼 순서
  
  text: string;                       // 버튼 텍스트
  
  // 스타일
  background_color: string;           // 배경색
  text_color: string;                 // 텍스트색
  border_color?: string;              // 테두리색
  border_width?: number;              // 테두리 두께
  border_radius?: number;             // 모서리 라운드 (px)
  
  font_size?: number;                 // 폰트 크기
  font_weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  padding_x?: number;                 // 좌우 패딩
  padding_y?: number;                 // 상하 패딩
  
  width?: 'auto' | 'full' | number;   // 버튼 너비
  
  // 호버 스타일
  hover_background_color?: string;
  hover_text_color?: string;
  
  // 액션
  action_type: 'link' | 'close' | 'custom';
  link_url?: string;                  // 링크 URL
  link_target?: '_self' | '_blank';   // 새 탭 여부
  custom_action?: string;             // 커스텀 JavaScript 함수명
  
  // 통계
  click_count: number;                // 클릭 수
}

// 팝업 노출 로그 (통계용)
interface PopupImpression {
  _id: ObjectId;
  popup_id: ObjectId;
  
  session_id: string;                 // 세션 ID
  user_id?: ObjectId;                 // 로그인 사용자 ID
  
  action: 'impression' | 'click' | 'close' | 'today_hide';
  button_id?: ObjectId;               // 클릭한 버튼 ID
  
  page_url: string;                   // 노출된 페이지
  referrer?: string;                  // 리퍼러
  
  device_type: 'desktop' | 'tablet' | 'mobile';
  browser?: string;
  os?: string;
  
  created_at: Date;
}
```

### 6.3 팝업 모달 UI (프론트엔드)

```html
<!-- 팝업 모달 컴포넌트 -->
<div class="fixed inset-0 z-[9999] flex items-center justify-center" role="dialog" aria-modal="true">
  <!-- 오버레이 -->
  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closePopup()"></div>
  
  <!-- 팝업 콘텐츠 -->
  <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden" style="width: 500px; height: 400px;">
    <!-- 닫기 버튼 -->
    <button class="absolute top-4 right-4 z-10 size-8 rounded-full bg-black/20 text-white hover:bg-black/40 flex items-center justify-center" onclick="closePopup()">
      <span class="material-symbols-outlined text-[20px]">close</span>
    </button>
    
    <!-- 메인 이미지 -->
    <div class="w-full h-[60%] bg-cover bg-center" style="background-image: url(...)"></div>
    
    <!-- 텍스트 콘텐츠 -->
    <div class="p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-2">신제품 출시 안내</h2>
      <p class="text-gray-600 mb-4">보듬 프리미엄 라인이 새롭게 출시되었습니다.</p>
      
      <!-- 버튼들 -->
      <div class="flex gap-3">
        <button class="flex-1 h-12 rounded-lg bg-primary text-white font-bold" onclick="window.location.href='/products/bodeum'">
          자세히 보기
        </button>
        <button class="flex-1 h-12 rounded-lg border border-gray-200 text-gray-600 font-bold" onclick="closePopup()">
          닫기
        </button>
      </div>
    </div>
    
    <!-- 오늘 하루 안보기 -->
    <div class="absolute bottom-0 left-0 right-0 px-6 py-3 bg-gray-50 border-t">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" class="rounded" onchange="setTodayHide(this.checked)"/>
        <span class="text-sm text-gray-500">오늘 하루 안보기</span>
      </label>
    </div>
  </div>
</div>
```

### 6.4 팝업 JavaScript 로직

```javascript
// 팝업 매니저
class PopupManager {
  constructor() {
    this.activePopups = [];
    this.hiddenPopups = this.getHiddenPopups();
  }
  
  // localStorage에서 숨긴 팝업 목록 가져오기
  getHiddenPopups() {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('sonaverse_hidden_popups');
    if (!stored) return {};
    
    const data = JSON.parse(stored);
    // 오늘 날짜가 아니면 초기화
    if (data.date !== today) {
      localStorage.removeItem('sonaverse_hidden_popups');
      return {};
    }
    return data.popups || {};
  }
  
  // 오늘 하루 안보기 설정
  setTodayHide(popupId) {
    const today = new Date().toDateString();
    const data = {
      date: today,
      popups: { ...this.hiddenPopups, [popupId]: true }
    };
    localStorage.setItem('sonaverse_hidden_popups', JSON.stringify(data));
    this.hiddenPopups = data.popups;
  }
  
  // 팝업 표시 여부 확인
  shouldShow(popup) {
    // 1. 오늘 하루 안보기 체크
    if (this.hiddenPopups[popup._id]) return false;
    
    // 2. 게시 기간 체크
    const now = new Date();
    if (new Date(popup.start_date) > now) return false;
    if (popup.end_date && new Date(popup.end_date) < now) return false;
    
    // 3. 페이지 조건 체크
    const currentPath = window.location.pathname;
    if (popup.display_conditions.pages?.length > 0) {
      if (!popup.display_conditions.pages.includes(currentPath)) return false;
    }
    if (popup.display_conditions.exclude_pages?.includes(currentPath)) return false;
    
    // 4. 디바이스 체크
    if (popup.display_conditions.devices?.length > 0) {
      const device = this.getDeviceType();
      if (!popup.display_conditions.devices.includes(device)) return false;
    }
    
    return true;
  }
  
  getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
  
  // 팝업 렌더링
  renderPopup(popup) {
    // React/Next.js 컴포넌트로 구현
  }
  
  // 통계 전송
  async trackEvent(popupId, action, buttonId = null) {
    await fetch('/api/popups/track', {
      method: 'POST',
      body: JSON.stringify({ popupId, action, buttonId })
    });
  }
}
```

---

## 7. 기술 스택 및 개발 환경

### 7.1 프론트엔드
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **아이콘**: Material Symbols Outlined
- **이미지**: next/image (최적화)

### 6.2 폰트 CDN
```html
<!-- Inter + Noto Sans KR -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet"/>

<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

### 6.3 Tailwind Config 예시
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "primary": "#1C4376",
        "primary-dark": "#15325b",
        "accent": "#BDA191",
        "accent-light": "#F2EBE8",
        "background-light": "#fcfcfc",
        "background-beige": "#f0ece9",
      },
      fontFamily: {
        "display": ["Inter", "Noto Sans KR", "sans-serif"],
        "body": ["Inter", "Noto Sans KR", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "full": "9999px"
      },
    },
  },
}
```

---

## 8. 중요 디자인 원칙

### 8.1 반응형 디자인
- **모바일 우선** (Mobile First) 접근법
- 브레이크포인트: sm(640px), md(768px), lg(1024px), xl(1280px)
- 터치 타겟: 최소 44px x 44px

### 8.2 접근성
- ARIA 레이블 적용
- 키보드 네비게이션 지원
- 색상 대비 WCAG AA 기준 충족

### 8.3 성능
- 이미지: WebP/AVIF 포맷, Lazy Loading
- 폰트: font-display: swap
- 애니메이션: GPU 가속 사용 (transform, opacity)

### 8.4 일관성
- 컴포넌트 재사용 (헤더, 푸터, 카드, 버튼 등)
- 간격 시스템: 4px 단위 (gap-4, p-6, py-8 등)
- 색상 팔레트 통일

---

## 9. 이전 디자인 요청에서 부족했던 점

> 🚨 **Google AI Studio Build 요청 시 반드시 참고해주세요**

### 9.1 색상 통일 실패
- **문제**: 각 페이지마다 Primary 색상이 달랐음 (그린, 네이비, 블루 등)
- **해결**: `#1C4376` (Deep Navy)로 통일하되, 제품 페이지에서는 제품별 서브 컬러 허용

### 9.2 스타일 일관성 부족
- **문제**: 버튼 스타일, 카드 모서리, 그림자 등이 페이지마다 달랐음
- **해결**: 위 디자인 시스템의 통일된 값 사용

### 9.3 세부 스타일 미반영
- **문제**: 원하는 디자인의 세부 스타일이 구현에 반영되지 않음
- **해결**: 아래 구체적인 CSS 패턴 적용

### 9.4 구체적으로 원하는 스타일 (CSS 패턴)
```css
/* Hero 섹션 */
.hero {
  background: linear-gradient(to bottom, #f0ece9, #fcfbf9);
  /* 좌측 텍스트 + 우측 콘텐츠 레이아웃 */
  display: flex;
  flex-direction: column;
  @media (min-width: 1024px) { flex-direction: row; }
}

/* 카드 디자인 */
.card {
  border-radius: 1rem; /* rounded-2xl */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: all 0.3s;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

/* 버튼 */
.btn-primary {
  border-radius: 9999px; /* rounded-full */
  box-shadow: 0 4px 14px rgba(28,67,118,0.3);
  background: #1C4376;
  color: white;
}

/* 필터 버튼 */
.filter-container {
  overflow-x: auto;
  display: flex;
  gap: 0.75rem;
}
.filter-btn {
  border-radius: 9999px;
  padding: 0.5rem 1.5rem;
  white-space: nowrap;
}

/* 배경 */
--bg-beige: #f0ece9;
--bg-light: #fcfcfc;

/* 텍스트 */
.headline { font-size: 2.25rem; font-weight: 900; } /* text-4xl font-black */
@media (min-width: 1024px) { .headline { font-size: 3rem; } } /* lg:text-5xl */

/* 아이콘 */
font-family: "Material Symbols Outlined";

/* 관리자 다크 테마 */
--admin-bg: #112117;
--admin-surface: #1c2e25;
--admin-primary: #36e27b;
```

---

## 10. 요약: Google AI Studio Build 요청 시 핵심 포인트

### 10.1 반드시 포함해야 할 내용
1. **통합 색상 시스템**: Primary `#1C4376`, Accent `#BDA191`
2. **폰트**: Inter + Noto Sans KR
3. **반응형**: 모바일 우선, Tailwind CSS 브레이크포인트
4. **컴포넌트 스타일**: 둥근 모서리, 그림자, 호버 효과

### 10.2 핵심 HTML/CSS 코드 구조

#### 헤더 구조
```html
<header class="sticky top-0 z-50 w-full border-b border-[#eaedf0] bg-white/95 backdrop-blur-sm">
  <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
    <!-- 로고 -->
    <div class="flex items-center gap-4 text-primary">
      <div class="flex size-10 items-center justify-center rounded-lg bg-primary/5">
        <span class="material-symbols-outlined text-3xl">accessibility_new</span>
      </div>
      <h1 class="text-2xl font-black tracking-tight">Sonaverse</h1>
    </div>
    <!-- 네비게이션 -->
    <nav class="hidden md:flex items-center gap-10">
      <a class="text-lg font-bold text-gray-600 hover:text-primary transition-colors" href="#">소개</a>
      <a class="text-lg font-bold text-primary" href="#">스토리</a>
    </nav>
    <button class="flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-white shadow-md hover:bg-[#15325b]">
      로그인
    </button>
  </div>
</header>
```

#### 카드 컴포넌트
```html
<article class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-900/5 transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer">
  <div class="relative aspect-video w-full overflow-hidden">
    <div class="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style="background-image: url(...)"></div>
  </div>
  <div class="flex flex-1 flex-col p-6">
    <div class="mb-3 flex items-center justify-between">
      <span class="text-base font-bold text-accent">카테고리</span>
      <span class="text-sm font-medium text-gray-400">2023. 10. 20</span>
    </div>
    <h3 class="mb-2 text-xl font-bold leading-tight text-primary line-clamp-2">제목</h3>
    <p class="mt-auto text-base text-gray-500 line-clamp-2">설명 텍스트</p>
  </div>
</article>
```

#### 버튼 스타일
```html
<!-- Primary 버튼 (둥근 필) -->
<button class="flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-[0_4px_14px_rgba(28,67,118,0.3)] hover:bg-primary-dark hover:shadow-[0_6px_20px_rgba(28,67,118,0.5)] hover:-translate-y-0.5 transition-all">
  버튼 텍스트
</button>

<!-- Secondary 버튼 -->
<button class="flex h-12 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-base font-bold text-gray-600 hover:bg-gray-50 transition-all">
  버튼 텍스트
</button>

<!-- 카테고리 필터 버튼 (활성) -->
<button class="flex h-12 items-center justify-center rounded-full bg-primary px-6 shadow-sm">
  <span class="text-lg font-bold text-white">전체</span>
</button>

<!-- 카테고리 필터 버튼 (비활성) -->
<button class="flex h-12 items-center justify-center rounded-full bg-white border-2 border-[#eaedf0] px-6 text-gray-600 hover:border-accent hover:text-primary hover:bg-accent-light transition-colors">
  <span class="text-lg font-bold">제품스토리</span>
</button>
```

#### 문제 해결 카드 (컬러 하단 라인)
```html
<div class="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-1">
  <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
    <span class="material-symbols-outlined">warning</span>
  </div>
  <h3 class="mb-2 text-xl font-bold text-gray-800">안전 문제 해결</h3>
  <p class="text-sm text-gray-600">단순 보조기를 넘어 능동적인 제어로 낙상 위험을 줄입니다.</p>
  <div class="absolute bottom-0 left-0 h-1 w-0 bg-red-500 transition-all duration-300 group-hover:w-full"></div>
</div>
```

#### Hero 섹션 (좌측 텍스트 + 우측 이미지)
```html
<section class="relative w-full px-6 py-12 lg:px-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#f0ece9] to-[#fcfbf9]">
  <div class="mx-auto flex max-w-7xl flex-col lg:flex-row gap-12 items-center">
    <!-- 텍스트 영역 -->
    <div class="flex flex-1 flex-col gap-6 lg:gap-8 z-10">
      <div class="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
        <span class="material-symbols-outlined text-sm text-primary">verified</span>
        <span class="text-xs font-bold text-primary">시니어를 위한 혁신</span>
      </div>
      <h1 class="text-5xl font-black leading-[1.2] tracking-tight lg:text-7xl text-gray-800">
        만보 <span class="text-primary font-light">/</span> 워크메이트
      </h1>
      <p class="text-2xl font-bold text-gray-600">하이브리드형 스마트 보행 보조기</p>
      <p class="text-lg leading-relaxed text-gray-600 max-w-2xl">설명 텍스트...</p>
      <div class="flex flex-wrap gap-4 pt-4">
        <button class="h-12 min-w-[140px] rounded-full bg-primary px-8 text-base font-bold text-white shadow-md hover:bg-primary-dark transition-all">
          자세히 보기
        </button>
      </div>
    </div>
    <!-- 이미지 영역 -->
    <div class="flex-1 w-full relative">
      <div class="absolute -inset-4 bg-gradient-to-r from-primary/10 to-gray-200/50 rounded-3xl blur-2xl opacity-60"></div>
      <div class="relative aspect-square lg:aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">
        <!-- 이미지 콘텐츠 -->
      </div>
    </div>
  </div>
</section>
```

#### 관리자 대시보드 (다크 테마)
```html
<div class="flex h-screen w-full flex-row bg-[#112117]">
  <!-- 사이드바 -->
  <aside class="w-72 flex-shrink-0 bg-[#0e1a12] border-r border-[#2a4035] flex flex-col">
    <nav class="flex flex-col gap-2 p-6">
      <a class="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#36e27b]/10 border border-[#36e27b]/20">
        <span class="material-symbols-outlined text-[#36e27b]">dashboard</span>
        <p class="text-white text-sm font-medium">대시보드</p>
      </a>
    </nav>
  </aside>
  <!-- 메인 콘텐츠 -->
  <main class="flex-1 p-10">
    <!-- KPI 카드 -->
    <div class="grid grid-cols-4 gap-6">
      <div class="flex flex-col gap-4 p-5 rounded-xl bg-[#1c2e25] border border-[#2a4035]/50 hover:border-[#36e27b]/30">
        <div class="p-2 bg-[#112117] rounded-lg text-[#36e27b]">
          <span class="material-symbols-outlined">newspaper</span>
        </div>
        <p class="text-[#9eb7a8] text-sm">Press Coverage</p>
        <p class="text-white text-3xl font-bold">12</p>
      </div>
    </div>
  </main>
</div>
```

### 10.3 피해야 할 것
- 페이지마다 다른 색상 사용
- 일관되지 않은 버튼/카드 스타일
- 위 코드 패턴과 동떨어진 레이아웃

---

**문서 작성일**: 2025년 12월 17일  
**목적**: Google AI Studio Build 시스템용 컨텍스트 문서

