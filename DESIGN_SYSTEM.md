# Sonaverse 리뉴얼 프로젝트 - 통합 디자인 시스템

> 원본 sonaverse 프로젝트의 디자인 패턴을 기반으로 한 Next.js 15 프로젝트 디자인 가이드

---

## 📋 목차

1. [디자인 시스템 개요](#1-디자인-시스템-개요)
2. [색상 시스템](#2-색상-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [레이아웃 & 그리드](#4-레이아웃--그리드)
5. [컴포넌트 패턴](#5-컴포넌트-패턴)
6. [애니메이션 & 트랜지션](#6-애니메이션--트랜지션)
7. [반응형 디자인](#7-반응형-디자인)
8. [페이지별 디자인 패턴](#8-페이지별-디자인-패턴)

---

## 1. 디자인 시스템 개요

### 1.1 브랜드 아이덴티티

**핵심 메시지**
```
한국어: "시니어의 더 나은 일상을 위해"
영어: "For a Better Daily Life for Seniors"
```

**브랜드 톤**
- 따뜻함: 시니어와 보호자에게 편안한 느낌
- 신뢰감: 기술 기반 기업의 전문성
- 접근성: 크고 명확한 레이아웃
- 현대적: 세련되고 깔끔한 UI/UX

### 1.2 제품 브랜드

1. **만보 (MANBO) 워크메이트**
   - 하이브리드형 스마트 보행 보조기
   - 브랜드 컬러: 밝은 그린 (#2eb865)

2. **보듬 (BO DUME) 기저귀**
   - 프리미엄 성인용 기저귀
   - 브랜드 컬러: 부드러운 그린 (#5eba7d)

---

## 2. 색상 시스템

### 2.1 기본 색상 팔레트

#### Primary Colors (주색상)
```css
--primary: #1C4376;              /* 진한 파란색 - 신뢰감 */
--primary-dark: #15325b;         /* 더 어두운 파란색 */
--primary-light: rgba(28, 67, 118, 0.1);  /* 연한 파란색 */
```

#### Accent Colors (액센트)
```css
--accent: #BDA191;               /* 따뜻한 베이지 */
--accent-light: #F2EBE8;         /* 연한 베이지 */
```

#### Background Colors (배경)
```css
--bg-beige: #f0ece9;             /* 베이지 배경 */
--bg-soft: #fcfbf9;              /* 부드러운 배경 */
--bg-white: #ffffff;             /* 흰색 */
--bg-gray-50: #fafafa;           /* 매우 연한 회색 */
--bg-gray-100: #f5f5f5;          /* 연한 회색 */
```

#### Text Colors (텍스트)
```css
--text-main: #2d3330;            /* 주 텍스트 */
--text-sub: #5c6660;             /* 보조 텍스트 */
--text-gray-500: #6b7280;        /* 중간 회색 */
--text-gray-600: #4b5563;        /* 어두운 회색 */
```

### 2.2 제품별 브랜드 컬러

#### 만보 (Manbo) - 밝은 그린
```css
--manbo-green: #2eb865;          /* 주 색상 */
--manbo-green-dark: #249652;     /* 어두운 변형 */
--manbo-green-light: #e8f9ee;    /* 연한 배경 */
```

**사용 예시:**
- 버튼 배경: `bg-[#2eb865]`
- 버튼 호버: `hover:bg-[#249652]`
- 텍스트 강조: `text-[#2eb865]`
- 배지/라벨: `bg-[#e8f9ee] text-[#2eb865]`

#### 보듬 (Bodeum) - 부드러운 그린
```css
--bodeum-green: #5eba7d;         /* 주 색상 */
--bodeum-green-dark: #4a9863;    /* 어두운 변형 */
--bodeum-green-light: #edf7f1;   /* 연한 배경 */
```

**사용 예시:**
- 버튼 배경: `bg-[#5eba7d]`
- 버튼 호버: `hover:bg-[#4a9863]`
- 필터 활성: `bg-[#5eba7d] text-white`
- 라벨: `bg-[#edf7f1] text-[#5eba7d]`

### 2.3 상태별 색상

#### Success (성공)
```css
--success: #10b981;              /* Emerald 500 */
--success-light: #d1fae5;        /* Emerald 100 */
```

#### Danger (위험/오류)
```css
--danger: #ef4444;               /* Red 500 */
--danger-light: #fee2e2;         /* Red 100 */
```

#### Warning (경고)
```css
--warning: #f59e0b;              /* Amber 500 */
--warning-light: #fef3c7;        /* Amber 100 */
```

#### Info (정보)
```css
--info: #3b82f6;                 /* Blue 500 */
--info-light: #dbeafe;           /* Blue 100 */
```

### 2.4 문제 정의 카드 색상 (홈페이지)

```css
--problem-red: #ef4444;          /* 안전성 문제 */
--problem-blue: #3b82f6;         /* 인체공학 설계 */
--problem-orange: #f97316;       /* 심리적 만족감 */
--problem-purple: #8b5cf6;       /* 기술 사각지대 */
```

### 2.5 관리자 페이지 다크 테마

```css
--admin-bg: #0f172a;             /* Slate 900 */
--admin-surface: #1e293b;        /* Slate 800 */
--admin-surface-hover: #334155;  /* Slate 700 */
--admin-border: #334155;         /* Slate 700 */
--admin-primary: #3b82f6;        /* Blue 500 */
--admin-primary-dark: #2563eb;   /* Blue 600 */
--admin-text-main: #f8fafc;      /* Slate 50 */
--admin-text-secondary: #94a3b8; /* Slate 400 */
--admin-danger: #ef4444;         /* Red 500 */
--admin-success: #10b981;        /* Emerald 500 */
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

#### 공개 페이지
```css
font-family: 'Inter', 'Noto Sans KR', sans-serif;
```

#### 관리자 페이지
```css
font-family: 'Spline Sans', 'Noto Sans KR', sans-serif;
```

### 3.2 폰트 웨이트

```
Regular: 400
Medium: 500
Bold: 700
Black: 900
```

### 3.3 타이포그래피 스케일

#### Heading 1 (페이지 제목)
```css
font-size: 3rem (48px);          /* 모바일 */
font-size: 4rem (64px);          /* 태블릿 */
font-size: 5rem (80px);          /* 데스크톱 */
font-weight: 900;
line-height: 1.1;
letter-spacing: -0.02em;
```

**Tailwind 클래스:**
```
text-5xl md:text-7xl lg:text-8xl font-black tracking-tight
```

#### Heading 2 (섹션 제목)
```css
font-size: 1.875rem (30px);      /* 모바일 */
font-size: 2.25rem (36px);       /* 태블릿 */
font-size: 3rem (48px);          /* 데스크톱 */
font-weight: 700;
line-height: 1.2;
```

**Tailwind 클래스:**
```
text-3xl md:text-4xl lg:text-5xl font-bold
```

#### Heading 3 (소섹션 제목)
```css
font-size: 1.25rem (20px);       /* 모바일 */
font-size: 1.5rem (24px);        /* 태블릿 */
font-size: 1.875rem (30px);      /* 데스크톱 */
font-weight: 700;
line-height: 1.3;
```

**Tailwind 클래스:**
```
text-xl md:text-2xl lg:text-3xl font-bold
```

#### Body Large (큰 본문)
```css
font-size: 1.125rem (18px);      /* 모바일 */
font-size: 1.25rem (20px);       /* 데스크톱 */
font-weight: 400;
line-height: 1.6;
color: #5c6660;
```

**Tailwind 클래스:**
```
text-lg md:text-xl text-gray-600
```

#### Body Regular (일반 본문)
```css
font-size: 1rem (16px);
font-weight: 400;
line-height: 1.6;
color: #5c6660;
```

**Tailwind 클래스:**
```
text-base text-gray-600
```

#### Small Text (작은 텍스트)
```css
font-size: 0.875rem (14px);
font-weight: 400;
line-height: 1.5;
color: #6b7280;
```

**Tailwind 클래스:**
```
text-sm text-gray-500
```

#### Badge/Label (배지/라벨)
```css
font-size: 0.75rem (12px);
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.1em;
```

**Tailwind 클래스:**
```
text-xs font-bold uppercase tracking-widest
```

---

## 4. 레이아웃 & 그리드

### 4.1 컨테이너

#### 최대 너비
```css
max-width: 1280px;               /* 7xl */
margin: 0 auto;
padding: 0 1.5rem;               /* 좌우 패딩 */
```

**Tailwind 클래스:**
```
max-w-7xl mx-auto px-6
```

#### 반응형 패딩
```css
/* 모바일 */
padding: 0 1rem (16px);

/* 태블릿 */
padding: 0 1.5rem (24px);

/* 데스크톱 */
padding: 0 2rem (32px);
```

**Tailwind 클래스:**
```
px-4 md:px-6 lg:px-8
```

### 4.2 섹션 간격

#### Vertical Spacing (수직 간격)
```css
/* 섹션 간 간격 */
padding-top: 4rem (64px);        /* 모바일 */
padding-top: 6rem (96px);        /* 태블릿 */
padding-top: 8rem (128px);       /* 데스크톱 */

padding-bottom: 4rem;
padding-bottom: 6rem;
padding-bottom: 8rem;
```

**Tailwind 클래스:**
```
py-16 md:py-24 lg:py-32
```

#### 작은 섹션 간격
```css
padding-top: 2rem (32px);
padding-bottom: 2rem;
```

**Tailwind 클래스:**
```
py-8 md:py-12 lg:py-16
```

### 4.3 그리드 시스템

#### 3칼럼 그리드 (카드)
```css
display: grid;
grid-template-columns: 1fr;      /* 모바일 */
grid-template-columns: repeat(2, 1fr);  /* 태블릿 */
grid-template-columns: repeat(3, 1fr);  /* 데스크톱 */
gap: 1.5rem (24px);              /* 모바일 */
gap: 2rem (32px);                /* 데스크톱 */
```

**Tailwind 클래스:**
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8
```

#### 2칼럼 그리드
```css
grid-template-columns: 1fr;      /* 모바일 */
grid-template-columns: repeat(2, 1fr);  /* 태블릿+ */
```

**Tailwind 클래스:**
```
grid grid-cols-1 md:grid-cols-2 gap-6
```

#### 4칼럼 그리드 (작은 카드)
```css
grid-template-columns: 1fr;      /* 모바일 */
grid-template-columns: repeat(2, 1fr);  /* 태블릿 */
grid-template-columns: repeat(4, 1fr);  /* 데스크톱 */
```

**Tailwind 클래스:**
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6
```

### 4.4 플렉스 레이아웃

#### 좌우 레이아웃 (텍스트 + 이미지)
```css
display: flex;
flex-direction: column;          /* 모바일 */
flex-direction: row;             /* 데스크톱 */
align-items: center;
gap: 2rem;
```

**Tailwind 클래스:**
```
flex flex-col lg:flex-row items-center gap-8
```

#### 중앙 정렬
```css
display: flex;
justify-content: center;
align-items: center;
```

**Tailwind 클래스:**
```
flex justify-center items-center
```

---

## 5. 컴포넌트 패턴

### 5.1 카드 (Card)

#### 기본 카드
```tsx
<div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
  <div className="mb-4">
    <span className="text-xs font-bold uppercase tracking-widest text-primary">카테고리</span>
  </div>
  <h3 className="text-xl md:text-2xl font-bold mb-3">카드 제목</h3>
  <p className="text-gray-600 leading-relaxed">카드 설명 텍스트...</p>
</div>
```

**핵심 스타일:**
- 둥근 모서리: `rounded-2xl` (16px)
- 그림자: `shadow-md` → `hover:shadow-xl`
- 호버 효과: `hover:-translate-y-2` (위로 8px 이동)
- 보더: `border border-gray-200`
- 패딩: `p-6` (24px)

#### 문제 정의 카드 (Problem Card)
```tsx
<div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 relative overflow-hidden group">
  {/* 컬러 아이콘 배경 */}
  <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center mb-6">
    <Icon name="warning" className="text-white text-3xl" />
  </div>

  <h3 className="text-2xl font-bold mb-4">안전성 문제</h3>
  <p className="text-gray-600">노인들이 보행기를 이용할 때 내리막길에서...</p>

  {/* 우상단 장식 요소 */}
  <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
</div>
```

**핵심 요소:**
- 컬러 아이콘 배경: 각 문제별 색상 (red, blue, orange, purple)
- 장식 요소: 우상단에 연한 원형 배경
- 호버 시 장식 요소 확대: `group-hover:scale-110`

#### 제품 카드 (Product Card)
```tsx
<div className="bg-white rounded-3xl shadow-lg overflow-hidden group">
  {/* 헤더 */}
  <div className="p-8 pb-4">
    <span className="text-xs font-bold uppercase tracking-widest text-[#2eb865]">HYBRID WALKER</span>
    <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-4">만보 워크메이트</h3>
  </div>

  {/* 이미지 */}
  <div className="relative h-80 overflow-hidden">
    <img
      src="/products/manbo.png"
      alt="만보 워크메이트"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  </div>

  {/* CTA 버튼 */}
  <div className="p-8 flex gap-4">
    <button className="flex-1 bg-[#2eb865] text-white py-4 rounded-2xl font-bold hover:bg-[#249652] transition-all hover:-translate-y-0.5">
      자세히 보기
    </button>
    <button className="flex-1 border-2 border-[#2eb865] text-[#2eb865] py-4 rounded-2xl font-bold hover:bg-[#2eb865] hover:text-white transition-all">
      구매/문의
    </button>
  </div>
</div>
```

**핵심 요소:**
- 라벨 + 제목: 제품 브랜딩
- 이미지 호버: `group-hover:scale-105` (확대)
- 두 개의 CTA 버튼: Primary + Secondary

#### 스토리 카드 (Story Card)
```tsx
<div className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-xl">
  {/* 이미지 */}
  <div className="relative h-56 overflow-hidden">
    <img
      src="/stories/story-1.jpg"
      alt="스토리 제목"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <span className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold">
      제품스토리
    </span>
  </div>

  {/* 콘텐츠 */}
  <div className="p-6">
    <h4 className="text-xl font-bold mb-2">만보 워크메이트 개발 비하인드</h4>
    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
      만보 워크메이트가 탄생하기까지의 과정을 소개합니다...
    </p>
    <span className="text-xs text-gray-400">2024.12.15</span>
  </div>
</div>
```

**핵심 요소:**
- 카테고리 배지: 이미지 위 좌상단
- 제목 + 설명 + 날짜
- 설명 텍스트 2줄 제한: `line-clamp-2`
- 전체 카드 클릭 가능

#### 언론보도 카드 (Press Card)
```tsx
{/* 메인 기사 */}
<div className="bg-white rounded-3xl shadow-lg overflow-hidden group">
  <div className="flex flex-col lg:flex-row">
    {/* 이미지 */}
    <div className="lg:w-1/2 h-80 relative overflow-hidden">
      <img
        src="/press/press-1.jpg"
        alt="기사 제목"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <span className="absolute top-6 left-6 px-4 py-2 bg-black/70 backdrop-blur-sm text-white rounded-full text-xs font-bold">
        FEATURED
      </span>
    </div>

    {/* 텍스트 */}
    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
      <span className="text-sm font-bold text-gray-400 mb-3">TechCrunch Korea · 2024.12.15</span>
      <h3 className="text-2xl md:text-3xl font-bold mb-4">소나버스, 시니어 테크의 새로운 지평을 열다</h3>
      <p className="text-gray-600 mb-6">
        시니어들의 일상을 변화시키는 혁신적인 기술...
      </p>
      <a href="#" className="text-primary font-bold inline-flex items-center gap-2 hover:gap-3 transition-all">
        기사 전문 보기
        <Icon name="arrow_forward" />
      </a>
    </div>
  </div>
</div>

{/* 서브 기사 (컴팩트) */}
<div className="flex gap-4 p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
  <img src="/press/press-2.jpg" alt="기사 제목" className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
  <div className="flex-1">
    <span className="text-xs text-gray-400">Economic Daily · 2024.12.10</span>
    <h4 className="font-bold text-sm mt-1 mb-2 line-clamp-2">4차 혁신상 대상 수상</h4>
  </div>
</div>
```

**핵심 요소:**
- 메인: 와이드 레이아웃 (이미지 50% + 텍스트 50%)
- 서브: 썸네일 + 텍스트 가로 정렬
- FEATURED 배지

### 5.2 버튼 (Buttons)

#### Primary 버튼
```tsx
<button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold transition-all duration-300 hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg">
  자세히 보기
</button>
```

#### Secondary 버튼 (Outline)
```tsx
<button className="px-8 py-4 border-2 border-primary text-primary rounded-2xl font-bold transition-all duration-300 hover:bg-primary hover:text-white">
  문의하기
</button>
```

#### 제품별 버튼

**만보 버튼:**
```tsx
<button className="px-8 py-4 bg-[#2eb865] text-white rounded-2xl font-bold hover:bg-[#249652] transition-all">
  만보 자세히 보기
</button>
```

**보듬 버튼:**
```tsx
<button className="px-8 py-4 bg-[#5eba7d] text-white rounded-2xl font-bold hover:bg-[#4a9863] transition-all">
  보듬 제품 보기
</button>
```

#### 텍스트 버튼 (Link)
```tsx
<a className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
  더 알아보기
  <Icon name="arrow_forward" />
</a>
```

### 5.3 배지 & 라벨 (Badges & Labels)

#### 기본 배지
```tsx
<span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-widest">
  NEW
</span>
```

#### 컬러 배지
```tsx
{/* 만보 */}
<span className="px-4 py-2 bg-[#e8f9ee] text-[#2eb865] rounded-full text-xs font-bold">
  HYBRID WALKER
</span>

{/* 보듬 */}
<span className="px-4 py-2 bg-[#edf7f1] text-[#5eba7d] rounded-full text-xs font-bold">
  PREMIUM CARE
</span>
```

#### 카테고리 배지 (투명 배경)
```tsx
<span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold">
  제품스토리
</span>
```

### 5.4 섹션 헤더 (Section Headers)

```tsx
<div className="text-center mb-16">
  {/* 상단 배지 */}
  <span className="inline-block px-6 py-3 bg-accent-light text-accent rounded-full text-sm font-bold uppercase tracking-widest mb-6">
    OUR PRODUCTS
  </span>

  {/* 메인 제목 */}
  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
    시니어를 위한 프리미엄 라인업
  </h2>

  {/* 서브타이틀 */}
  <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
    불편을 겪는 사용자를 통해 발견한 혁신, 명확한 브랜딩으로 시니어 생활 문제를 해결합니다.
  </p>
</div>
```

### 5.5 타임라인 (Timeline)

```tsx
<div className="relative">
  {/* 중앙 수직선 */}
  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>

  {/* 타임라인 아이템 */}
  {events.map((event, index) => (
    <div key={index} className={`flex items-center gap-8 mb-16 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* 콘텐츠 */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-8">
        <span className="text-4xl font-black text-gray-200">{event.year}</span>
        <h3 className="text-2xl font-bold mt-4 mb-3">{event.title}</h3>
        <p className="text-gray-600">{event.description}</p>
      </div>

      {/* 중앙 점 */}
      <div className="w-6 h-6 bg-white border-4 border-blue-500 rounded-full z-10"></div>

      {/* 반대편 빈 공간 */}
      <div className="flex-1"></div>
    </div>
  ))}
</div>
```

**모바일 버전:**
```tsx
{/* 모바일: 좌측 정렬 */}
<div className="relative pl-8">
  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>

  {events.map((event, index) => (
    <div key={index} className="relative mb-12">
      <div className="absolute -left-[13px] top-0 w-6 h-6 bg-white border-4 border-blue-500 rounded-full"></div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* 콘텐츠 */}
      </div>
    </div>
  ))}
</div>
```

---

## 6. 애니메이션 & 트랜지션

### 6.1 기본 트랜지션

```css
transition-all duration-300    /* 모든 속성 300ms */
transition-colors              /* 색상만 */
transition-transform           /* 변환만 */
transition-shadow              /* 그림자만 */
transition-opacity             /* 투명도만 */
```

### 6.2 호버 효과

#### 카드 호버 (상승 + 그림자)
```css
transition-all duration-300
hover:shadow-xl
hover:-translate-y-2           /* 8px 위로 */
```

#### 이미지 호버 (확대)
```css
transition-transform duration-700
group-hover:scale-105          /* 5% 확대 */
```

#### 버튼 호버 (약간 상승)
```css
transition-all duration-300
hover:-translate-y-0.5         /* 2px 위로 */
hover:shadow-lg
```

#### 텍스트 링크 호버 (간격 증가)
```css
inline-flex items-center gap-2
hover:gap-3                    /* 간격 8px → 12px */
transition-all
```

### 6.3 스크롤 애니메이션

```tsx
// Intersection Observer 활용
const [isVisible, setIsVisible] = useState(false);
const ref = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    },
    { threshold: 0.1 }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => observer.disconnect();
}, []);

// 사용
<div
  ref={ref}
  className={`transition-all duration-700 ${
    isVisible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8'
  }`}
>
  콘텐츠
</div>
```

### 6.4 페이드 인 애니메이션

```css
/* Tailwind Config에 추가 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}
```

### 6.5 바운스 애니메이션 (스크롤 인디케이터)

```css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

.animate-bounce-slow {
  animation: bounce 2s ease-in-out infinite;
}
```

**사용 예:**
```tsx
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
  <Icon name="keyboard_arrow_down" className="text-white text-4xl" />
</div>
```

---

## 7. 반응형 디자인

### 7.1 브레이크포인트

```css
/* Tailwind 기본 브레이크포인트 */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**주로 사용:**
- 모바일: 기본 (< 768px)
- 태블릿: `md:` (≥ 768px)
- 데스크톱: `lg:` (≥ 1024px)

### 7.2 반응형 패턴

#### 텍스트 크기
```tsx
<h1 className="text-4xl md:text-5xl lg:text-6xl">
  제목
</h1>
```

#### 레이아웃 변경 (세로 → 가로)
```tsx
<div className="flex flex-col lg:flex-row">
  <div className="lg:w-1/2">좌측</div>
  <div className="lg:w-1/2">우측</div>
</div>
```

#### 그리드 칼럼 변경
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 카드들 */}
</div>
```

#### 숨김/표시
```tsx
{/* 데스크톱에서만 표시 */}
<div className="hidden lg:block">
  데스크톱 콘텐츠
</div>

{/* 모바일에서만 표시 */}
<div className="lg:hidden">
  모바일 콘텐츠
</div>
```

#### 패딩/마진 조정
```tsx
<section className="py-12 md:py-16 lg:py-24">
  {/* 콘텐츠 */}
</section>
```

---

## 8. 페이지별 디자인 패턴

### 8.1 홈페이지 (/)

#### Hero 섹션
```tsx
<section className="relative h-screen flex items-center justify-center overflow-hidden">
  {/* 배경 이미지 */}
  <div className="absolute inset-0">
    <img
      src="/hero-bg.jpg"
      alt="Hero Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
  </div>

  {/* 콘텐츠 */}
  <div className="relative z-10 text-center text-white max-w-5xl px-6">
    <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-widest mb-8">
      OUR MISSION
    </span>

    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
      시니어의 더 나은 일상을 위해
    </h1>

    <p className="text-xl md:text-2xl mb-12 text-white/90">
      불편을 겪는 사용자를 통해 발견한 혁신, 명확한 브랜딩으로 시니어 생활 문제를 해결합니다.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all">
        제품 소개
      </button>
      <button className="px-10 py-5 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-primary transition-all">
        회사 소개
      </button>
    </div>
  </div>

  {/* 스크롤 인디케이터 */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
    <Icon name="keyboard_arrow_down" className="text-white text-4xl" />
  </div>
</section>
```

#### 문제 정의 섹션
```tsx
<section className="py-16 md:py-24 bg-bg-soft">
  <div className="max-w-7xl mx-auto px-6">
    {/* 섹션 헤더 */}
    <div className="text-center mb-16">
      <span className="inline-block px-6 py-3 bg-accent-light text-accent rounded-full text-sm font-bold uppercase tracking-widest mb-6">
        OUR MISSION
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
        우리가 해결하고자 하는 <span className="text-primary">문제들</span>
      </h2>
      <p className="text-lg md:text-xl text-gray-600">
        불편함을 겪는 사용자를 통해 발견한 명확한 문제, 명확한 브랜딩으로 시니어 생활 문제를 해결합니다.
      </p>
    </div>

    {/* 4개 카드 그리드 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 문제 카드들 */}
    </div>
  </div>
</section>
```

#### 제품 섹션
```tsx
<section className="py-16 md:py-24">
  <div className="max-w-7xl mx-auto px-6">
    {/* 섹션 헤더 */}

    {/* 2개 제품 카드 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 만보 카드 */}
      {/* 보듬 카드 */}
    </div>
  </div>
</section>
```

### 8.2 만보 제품 페이지 (/products/manbo)

#### Product Hero
```tsx
<section className="relative bg-gradient-to-br from-[#e8f9ee] to-white py-20 lg:py-32 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* 텍스트 */}
      <div className="lg:w-1/2">
        <span className="inline-block px-6 py-3 bg-[#2eb865]/10 text-[#2eb865] rounded-full text-sm font-bold uppercase tracking-widest mb-6">
          HYBRID WALKER
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
          만보 워크메이트
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          하이브리드형 워크메이트로 더 안전하고 편안한 보행을 경험하세요.
        </p>
        <button className="px-10 py-5 bg-[#2eb865] text-white rounded-2xl font-bold text-lg hover:bg-[#249652] transition-all">
          사전 문의하기
        </button>
      </div>

      {/* 이미지 */}
      <div className="lg:w-1/2">
        <img
          src="/products/manbo-hero.png"
          alt="만보 워크메이트"
          className="w-full h-auto"
        />
      </div>
    </div>
  </div>

  {/* 배경 장식 */}
  <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#2eb865]/5 rounded-full blur-3xl"></div>
</section>
```

#### Features Grid (3칼럼)
```tsx
<section className="py-16 md:py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">핵심 기능</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center p-8">
        <div className="w-20 h-20 mx-auto mb-6 bg-[#e8f9ee] rounded-2xl flex items-center justify-center">
          <Icon name="electric_bolt" className="text-[#2eb865] text-4xl" />
        </div>
        <h3 className="text-xl font-bold mb-4">하이브리드 주행</h3>
        <p className="text-gray-600">
          전기 모터와 수동 주행을 자유롭게 전환할 수 있습니다.
        </p>
      </div>
      {/* 나머지 기능들 */}
    </div>
  </div>
</section>
```

#### ZigZag Specs (교차 레이아웃)
```tsx
<section className="py-16 md:py-24 bg-bg-soft">
  <div className="max-w-7xl mx-auto px-6 space-y-24">
    {/* 좌측 이미지 + 우측 텍스트 */}
    <div className="flex flex-col lg:flex-row items-center gap-12">
      <div className="lg:w-1/2">
        <img src="/products/manbo-1.jpg" alt="Feature 1" className="rounded-3xl shadow-xl" />
      </div>
      <div className="lg:w-1/2">
        <h3 className="text-3xl font-bold mb-6">자동 브레이크 시스템</h3>
        <p className="text-lg text-gray-600 mb-6">
          경사지에서 자동으로 속도를 제어하여 안전하게 보행할 수 있습니다.
        </p>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <Icon name="check_circle" className="text-[#2eb865]" />
            <span>5도 이상 경사 자동 감지</span>
          </li>
          {/* 더 많은 리스트 */}
        </ul>
      </div>
    </div>

    {/* 우측 이미지 + 좌측 텍스트 (반대) */}
    <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
      {/* 동일 구조, 순서만 반대 */}
    </div>
  </div>
</section>
```

### 8.3 보듬 제품 페이지 (/products/bodeum)

#### Product Hero (배경 형태 + 이미지 + 부동 배지)
```tsx
<section className="relative bg-gradient-to-br from-[#edf7f1] to-white py-20 lg:py-32 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* 텍스트 */}
      <div className="lg:w-1/2">
        <span className="inline-block px-6 py-3 bg-[#5eba7d]/10 text-[#5eba7d] rounded-full text-sm font-bold uppercase tracking-widest mb-6">
          PREMIUM CARE
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
          보듬 기저귀
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          프리미엄 성인용 기저귀로 편안한 일상을 선물하세요.
        </p>

        {/* 3개 배지 */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-black text-[#5eba7d] mb-2">100%</div>
            <div className="text-sm text-gray-600">순면 소재</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#5eba7d] mb-2">12h</div>
            <div className="text-sm text-gray-600">흡수력</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#5eba7d] mb-2">ISO</div>
            <div className="text-sm text-gray-600">품질 인증</div>
          </div>
        </div>

        <button className="px-10 py-5 bg-[#5eba7d] text-white rounded-2xl font-bold text-lg hover:bg-[#4a9863] transition-all">
          온라인 구매하기
        </button>
      </div>

      {/* 이미지 */}
      <div className="lg:w-1/2 relative">
        <img
          src="/products/bodeum-hero.png"
          alt="보듬 기저귀"
          className="w-full h-auto relative z-10"
        />
        {/* 부동 배지 */}
        <div className="absolute top-10 right-10 px-6 py-4 bg-white rounded-2xl shadow-xl">
          <div className="text-sm text-gray-600">피부 자극 테스트</div>
          <div className="text-2xl font-bold text-[#5eba7d]">0.0%</div>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Sticky Filter Bar
```tsx
<div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 py-4">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex gap-3 overflow-x-auto">
      <button className="px-6 py-3 bg-[#5eba7d] text-white rounded-full font-bold whitespace-nowrap">
        전체
      </button>
      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
        팬티형
      </button>
      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
        속기저귀
      </button>
      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
        깔개매트
      </button>
    </div>
  </div>
</div>
```

#### Product Grid
```tsx
<section className="py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* 제품 아이템 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden group">
        {/* 이미지 + 호버 오버레이 */}
        <div className="relative h-80 overflow-hidden">
          <img
            src="/products/bodeum-1.jpg"
            alt="보듬 팬티형 대형"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-bold">
              상세보기
            </button>
            <button className="px-6 py-3 bg-[#5eba7d] text-white rounded-xl font-bold">
              구매하기
            </button>
          </div>
        </div>

        {/* 정보 */}
        <div className="p-6">
          <span className="text-xs font-bold text-gray-400 uppercase">팬티형</span>
          <h3 className="text-xl font-bold mt-2 mb-3">보듬 팬티형 대형</h3>
          <p className="text-gray-600 text-sm mb-4">흡수력이 뛰어나고 착용감이 편안합니다.</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-[#5eba7d]">29,000원</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                -
              </button>
              <span className="w-12 text-center font-bold">1</span>
              <button className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 8.4 스토리 페이지 (/stories)

#### 카테고리 필터
```tsx
<div className="flex gap-3 overflow-x-auto mb-12">
  <button className="px-6 py-3 bg-primary text-white rounded-full font-bold whitespace-nowrap">
    전체
  </button>
  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
    제품스토리
  </button>
  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
    사용법
  </button>
  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
    건강정보
  </button>
  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap">
    복지정보
  </button>
</div>
```

#### Featured Story (와이드)
```tsx
<div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 group cursor-pointer">
  <div className="flex flex-col lg:flex-row">
    {/* 이미지 */}
    <div className="lg:w-2/3 h-96 relative overflow-hidden">
      <img
        src="/stories/featured.jpg"
        alt="Featured Story"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4">
          제품스토리
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          만보 워크메이트 개발 비하인드 스토리
        </h2>
        <p className="text-lg text-white/90 mb-4">
          시니어들의 불편함을 해소하기 위한 우리의 여정...
        </p>
        <span className="text-sm text-white/70">2024.12.15</span>
      </div>
    </div>

    {/* 우측 정보 (선택) */}
    <div className="lg:w-1/3 p-8 flex flex-col justify-center">
      {/* 추가 정보 */}
    </div>
  </div>
</div>
```

#### Story Grid (3칼럼)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* 스토리 카드들 */}
</div>

<div className="text-center mt-12">
  <button className="px-10 py-4 border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all">
    더 많은 스토리 보기
  </button>
</div>
```

### 8.5 언론보도 페이지 (/press)

#### 검색 입력
```tsx
<div className="max-w-2xl mx-auto mb-12">
  <div className="relative">
    <input
      type="text"
      placeholder="언론보도 검색..."
      className="w-full px-6 py-4 pl-14 bg-white border-2 border-gray-200 rounded-2xl focus:border-primary focus:outline-none text-lg"
    />
    <Icon name="search" className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-2xl" />
  </div>
</div>
```

#### Press Grid (2칼럼)
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* 언론보도 카드들 */}
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
    <div className="flex gap-6 p-6">
      {/* 썸네일 */}
      <img
        src="/press/press-1.jpg"
        alt="Press Title"
        className="w-40 h-40 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
      />

      {/* 정보 */}
      <div className="flex-1">
        <span className="text-sm font-bold text-gray-400 mb-2 block">
          TechCrunch Korea · 2024.12.15
        </span>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          소나버스, 시니어 테크의 새로운 지평을 열다
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          시니어들의 일상을 변화시키는 혁신적인 기술...
        </p>
      </div>
    </div>
  </div>
</div>
```

#### Pagination
```tsx
<div className="flex justify-center gap-2 mt-12">
  <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
    <Icon name="chevron_left" />
  </button>
  <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold">1</button>
  <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-bold">2</button>
  <button className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 font-bold">3</button>
  <button className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50">
    <Icon name="chevron_right" />
  </button>
</div>
```

### 8.6 문의 페이지 (/inquiry)

#### 문의 폼
```tsx
<div className="max-w-3xl mx-auto">
  <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
    <h2 className="text-3xl font-bold mb-8">구매/제휴 문의</h2>

    {/* 문의 유형 */}
    <div className="mb-8">
      <label className="block text-sm font-bold text-gray-700 mb-4">문의 유형</label>
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
          <input type="radio" name="type" value="product" className="accent-primary" />
          <span>제품 문의</span>
        </label>
        <label className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
          <input type="radio" name="type" value="partnership" className="accent-primary" />
          <span>제휴 문의</span>
        </label>
        <label className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors">
          <input type="radio" name="type" value="etc" className="accent-primary" />
          <span>기타 문의</span>
        </label>
      </div>
    </div>

    {/* 입력 필드들 */}
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
        <input
          type="text"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
        <input
          type="tel"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
          placeholder="010-0000-0000"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">이메일</label>
        <input
          type="email"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">문의 내용</label>
        <textarea
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none resize-none"
          placeholder="문의 내용을 상세히 입력해주세요"
        ></textarea>
      </div>
    </div>

    {/* 파일 업로드 */}
    <div className="mt-8">
      <label className="block text-sm font-bold text-gray-700 mb-4">첨부 파일 (선택)</label>
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer">
        <Icon name="cloud_upload" className="text-gray-400 text-5xl mb-4 mx-auto" />
        <p className="text-gray-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
        <p className="text-sm text-gray-400">최대 10MB, PDF, JPG, PNG</p>
      </div>
    </div>

    {/* 개인정보 동의 */}
    <div className="mt-8">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" className="mt-1 accent-primary" />
        <span className="text-sm text-gray-600">
          개인정보 수집 및 이용에 동의합니다.
          <button className="text-primary underline ml-1">자세히 보기</button>
        </span>
      </label>
    </div>

    {/* 제출 버튼 */}
    <button className="w-full mt-8 px-8 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all">
      문의 제출하기
    </button>
  </div>
</div>
```

---

## 9. 추가 패턴 & 가이드라인

### 9.1 아이콘 사용

Material Symbols Outlined 폰트 사용:
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">
```

컴포넌트:
```tsx
const Icon = ({ name, className = "" }) => (
  <span className={`material-symbols-outlined select-none ${className}`}>
    {name}
  </span>
);
```

### 9.2 이미지 최적화

Next.js Image 컴포넌트 사용:
```tsx
import Image from 'next/image';

<Image
  src="/products/manbo.png"
  alt="만보 워크메이트"
  width={800}
  height={600}
  className="rounded-2xl"
  priority={false}  // Above-the-fold만 true
  quality={85}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 9.3 접근성 (a11y)

- 모든 이미지에 `alt` 속성
- 키보드 네비게이션 지원
- 충분한 색상 대비 (WCAG AA 기준)
- ARIA 라벨 사용
- 포커스 스타일 명확히

```tsx
<button
  className="... focus:ring-4 focus:ring-primary/20"
  aria-label="제품 자세히 보기"
>
  자세히 보기
</button>
```

### 9.4 성능 최적화

- 이미지 지연 로딩
- 코드 스플리팅 (dynamic import)
- CSS 최소화 (Tailwind purge)
- 번들 크기 모니터링
- Core Web Vitals 최적화

---

## 10. 다음 단계

이 디자인 시스템을 기반으로:

1. **Tailwind 설정 업데이트** (`tailwind.config.ts`)
   - 커스텀 색상 추가
   - 커스텀 애니메이션 추가
   - 폰트 설정

2. **공통 컴포넌트 구현** (`src/shared/components/ui/`)
   - Button
   - Card
   - Badge
   - SectionHeader
   - Icon

3. **페이지별 컴포넌트 구현** (`src/features/`)
   - 홈페이지 섹션들
   - 제품 페이지 컴포넌트
   - 스토리/언론보도 카드

4. **레이아웃 구현** (`src/shared/components/layout/`)
   - Header (반응형 네비게이션)
   - Footer
   - MainLayout

5. **성능 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - 번들 분석

---

**문서 작성일**: 2024-12-18
**버전**: 1.0.0
**작성자**: Claude (기반: 원본 sonaverse 프로젝트 분석)
