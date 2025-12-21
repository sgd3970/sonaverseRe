# Vercel 배포 문제 해결 가이드

> **작성일**: 2025-01-21  
> **대상**: GitHub와 Vercel이 연결된 프로젝트  
> **목적**: 배포 실패 시 빠른 문제 진단 및 해결

---

## 📋 목차

1. [빠른 체크리스트](#빠른-체크리스트)
2. [일반적인 배포 실패 원인](#일반적인-배포-실패-원인)
3. [단계별 문제 해결](#단계별-문제-해결)
4. [Vercel 대시보드 확인 사항](#vercel-대시보드-확인-사항)
5. [환경 변수 설정](#환경-변수-설정)
6. [빌드 로그 분석](#빌드-로그-분석)
7. [고급 문제 해결](#고급-문제-해결)

---

## 빠른 체크리스트

배포가 실패했을 때 먼저 확인할 사항들:

- [ ] **Vercel 대시보드에서 빌드 로그 확인**
  - Vercel 대시보드 → 프로젝트 → Deployments → 실패한 배포 클릭
  - 빌드 로그에서 에러 메시지 확인

- [ ] **환경 변수 확인**
  - Vercel 대시보드 → Settings → Environment Variables
  - 필수 환경 변수가 모두 설정되어 있는지 확인

- [ ] **GitHub 연결 확인**
  - Vercel 대시보드 → Settings → Git
  - GitHub 저장소가 올바르게 연결되어 있는지 확인

- [ ] **빌드 명령어 확인**
  - `package.json`의 `build` 스크립트 확인
  - Vercel이 자동으로 감지하는지 확인

- [ ] **Node.js 버전 확인**
  - Vercel 대시보드 → Settings → General → Node.js Version
  - 프로젝트와 호환되는 버전인지 확인

---

## 일반적인 배포 실패 원인

### 1. 환경 변수 누락 (가장 흔한 원인)

**증상**:
```
Error: Environment variable not found
MongoNetworkError: connection timeout
```

**해결 방법**:
1. Vercel 대시보드 → Settings → Environment Variables
2. 다음 환경 변수들이 설정되어 있는지 확인:

```bash
# 필수 환경 변수
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# 선택적 환경 변수 (사용하는 경우)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
SENTRY_DSN=your_sentry_dsn
RESEND_API_KEY=your_resend_api_key
```

3. 환경 변수 추가 후 **재배포** 필요

---

### 2. 빌드 메모리 부족

**증상**:
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**해결 방법**:

#### 방법 1: Vercel 빌드 설정 수정

1. Vercel 대시보드 → Settings → General → Build & Development Settings
2. **Build Command** 수정:
```bash
NODE_OPTIONS=--max-old-space-size=8192 npm run build
```

3. **Install Command** 확인:
```bash
npm install
```

#### 방법 2: `vercel.json` 파일 생성

프로젝트 루트에 `vercel.json` 파일 생성:

```json
{
  "buildCommand": "NODE_OPTIONS=--max-old-space-size=8192 npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "20.x"
}
```

---

### 3. TypeScript 오류

**증상**:
```
Type error: Property 'xxx' does not exist on type 'yyy'
```

**현재 설정**: `next.config.ts`에서 `ignoreBuildErrors: true`로 설정되어 있음

**해결 방법**:

#### 임시 해결 (현재 설정됨)
- `ignoreBuildErrors: true`로 빌드는 통과하지만, 타입 오류는 수정해야 함

#### 근본적 해결
1. 로컬에서 타입 체크 실행:
```bash
npm run typecheck
```

2. 타입 오류 수정 후 다시 배포

---

### 4. 의존성 설치 실패

**증상**:
```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
```

**해결 방법**:

1. **`package-lock.json` 확인**
   - `package-lock.json`이 Git에 포함되어 있는지 확인
   - 없으면 로컬에서 `npm install` 후 커밋

2. **Node.js 버전 확인**
   - Vercel Settings → General → Node.js Version
   - `20.x` 또는 `18.x` 권장

3. **의존성 재설치**
   - Vercel 대시보드 → Deployments → 실패한 배포 → Redeploy

---

### 5. MongoDB 연결 타임아웃

**증상**:
```
MongoNetworkError: connection timeout
MongooseServerSelectionError: connection timeout
```

**해결 방법**:

1. **MongoDB Atlas IP 화이트리스트 확인**
   - MongoDB Atlas → Network Access
   - `0.0.0.0/0` (모든 IP 허용) 또는 Vercel IP 추가

2. **연결 문자열 확인**
   - 환경 변수 `MONGODB_URI`가 올바른지 확인
   - 연결 문자열 형식: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

3. **Vercel Functions 타임아웃 설정**
   - `vercel.json`에 타임아웃 설정 추가 (필요시)

---

### 6. 빌드 타임아웃

**증상**:
```
Build exceeded maximum execution time
```

**해결 방법**:

1. **빌드 최적화**
   - 불필요한 파일 제거
   - `.vercelignore` 파일 생성하여 제외할 파일 지정

2. **Vercel Pro 플랜 고려**
   - 무료 플랜: 45분 빌드 타임아웃
   - Pro 플랜: 더 긴 타임아웃

---

## 단계별 문제 해결

### Step 1: Vercel 대시보드에서 빌드 로그 확인

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - 실패한 배포가 있는 프로젝트 클릭

3. **Deployments 탭**
   - 실패한 배포(빨간색 X 표시) 클릭

4. **Build Logs 확인**
   - 에러 메시지의 마지막 부분 확인
   - 일반적으로 가장 중요한 에러가 마지막에 표시됨

---

### Step 2: 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드가 성공하는지 확인:

```bash
# 환경 변수 설정 (로컬)
# .env.local 파일에 환경 변수 추가

# 빌드 테스트
npm run build

# 빌드 성공 시
npm run start
```

**로컬 빌드가 실패하면 Vercel에서도 실패합니다.**

---

### Step 3: 환경 변수 확인

#### 필수 환경 변수 목록

```bash
# 데이터베이스
MONGODB_URI=mongodb+srv://...

# 앱 URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# 선택적
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://...
RESEND_API_KEY=re_...
```

#### Vercel에서 환경 변수 설정 방법

1. Vercel 대시보드 → 프로젝트 → Settings
2. Environment Variables 클릭
3. 각 환경 변수 추가:
   - **Key**: 변수 이름 (예: `MONGODB_URI`)
   - **Value**: 변수 값
   - **Environment**: Production, Preview, Development 선택
4. **Save** 클릭
5. **재배포 필요** (자동으로 재배포되지 않음)

---

### Step 4: 빌드 설정 확인

#### Vercel 빌드 설정 확인

1. Vercel 대시보드 → Settings → General
2. **Build & Development Settings** 확인:

```
Framework Preset: Next.js
Build Command: npm run build (또는 자동 감지)
Output Directory: .next (자동)
Install Command: npm install (자동)
```

#### 커스텀 빌드 명령어 필요 시

`vercel.json` 파일 생성:

```json
{
  "buildCommand": "NODE_OPTIONS=--max-old-space-size=8192 npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "20.x",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## Vercel 대시보드 확인 사항

### 1. 프로젝트 설정

**경로**: Settings → General

확인 사항:
- [ ] Framework Preset: Next.js
- [ ] Root Directory: `./` (프로젝트 루트)
- [ ] Node.js Version: `20.x` 권장
- [ ] Build Command: 자동 감지 또는 명시적 설정
- [ ] Output Directory: `.next` (자동)

---

### 2. Git 연결 설정

**경로**: Settings → Git

확인 사항:
- [ ] Production Branch: `main` 또는 `master`
- [ ] GitHub Repository: 올바른 저장소 연결
- [ ] Auto-deploy: 활성화되어 있는지 확인

---

### 3. 환경 변수

**경로**: Settings → Environment Variables

확인 사항:
- [ ] 모든 필수 환경 변수 설정
- [ ] 각 환경(Production, Preview, Development)에 적절히 설정
- [ ] 환경 변수 값이 올바른지 확인 (특수문자, 따옴표 등)

---

### 4. 빌드 로그

**경로**: Deployments → 실패한 배포 클릭

확인 사항:
- [ ] 에러 메시지의 정확한 내용
- [ ] 어느 단계에서 실패했는지 (Install, Build, Deploy)
- [ ] 타임아웃 에러인지, 메모리 에러인지 확인

---

## 환경 변수 설정

### 필수 환경 변수

프로젝트에 필요한 환경 변수 목록:

```bash
# ============================================
# 데이터베이스
# ============================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# ============================================
# 앱 설정
# ============================================
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# ============================================
# 선택적 (사용하는 경우)
# ============================================
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry (에러 모니터링)
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx
SENTRY_ORG=xxx
SENTRY_PROJECT=xxx

# Resend (이메일)
RESEND_API_KEY=re_xxx

# 기타
NODE_ENV=production
```

### 환경 변수 설정 방법

#### 방법 1: Vercel 대시보드

1. Vercel 대시보드 → 프로젝트 → Settings
2. Environment Variables 클릭
3. Add New 클릭
4. Key, Value 입력
5. Environment 선택 (Production, Preview, Development)
6. Save 클릭

#### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 환경 변수 추가
vercel env add MONGODB_URI production
vercel env add NEXT_PUBLIC_APP_URL production
```

---

## 빌드 로그 분석

### 일반적인 에러 패턴

#### 1. 환경 변수 에러

```
Error: Environment variable "MONGODB_URI" is not set
```

**해결**: Vercel 대시보드에서 환경 변수 추가

---

#### 2. 메모리 에러

```
FATAL ERROR: Reached heap limit Allocation failed
```

**해결**: `vercel.json`에 빌드 명령어 수정

---

#### 3. 타입 에러

```
Type error: Property 'xxx' does not exist
```

**해결**: 
- 현재는 `ignoreBuildErrors: true`로 설정되어 있어 빌드는 통과
- 타입 오류는 로컬에서 수정 필요

---

#### 4. 의존성 에러

```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
```

**해결**: 
- `package-lock.json` 확인
- Node.js 버전 확인
- 의존성 재설치

---

#### 5. MongoDB 연결 에러

```
MongoNetworkError: connection timeout
```

**해결**: 
- MongoDB Atlas IP 화이트리스트 확인
- 연결 문자열 확인

---

## 고급 문제 해결

### 1. `vercel.json` 파일 생성

프로젝트 루트에 `vercel.json` 파일 생성:

```json
{
  "buildCommand": "NODE_OPTIONS=--max-old-space-size=8192 npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "20.x",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/_next/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### 2. `.vercelignore` 파일 생성

빌드에서 제외할 파일/폴더 지정:

```
# 테스트 파일
e2e/
*.spec.ts
*.test.ts

# 백업 파일
mongodb_backup/
*.backup

# 개발 파일
.vscode/
.idea/
*.log

# 문서 (선택적)
docs/
test/
```

---

### 3. 빌드 캐시 클리어

빌드 캐시 문제가 있을 때:

1. Vercel 대시보드 → Deployments
2. 실패한 배포 → ... (메뉴) → Clear Build Cache
3. 재배포

---

### 4. 수동 재배포

1. Vercel 대시보드 → Deployments
2. 실패한 배포 → ... (메뉴) → Redeploy
3. 또는 GitHub에 빈 커밋 푸시:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

---

### 5. Vercel CLI로 로컬 테스트

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

## 문제 해결 체크리스트

배포가 실패했을 때 순서대로 확인:

### 1단계: 빌드 로그 확인
- [ ] Vercel 대시보드에서 빌드 로그 확인
- [ ] 에러 메시지 정확히 읽기
- [ ] 어느 단계에서 실패했는지 확인 (Install/Build/Deploy)

### 2단계: 로컬 빌드 테스트
- [ ] 로컬에서 `npm run build` 실행
- [ ] 로컬 빌드가 성공하는지 확인
- [ ] 로컬 빌드 실패 시 오류 수정

### 3단계: 환경 변수 확인
- [ ] 필수 환경 변수가 모두 설정되어 있는지 확인
- [ ] 환경 변수 값이 올바른지 확인
- [ ] Production/Preview/Development 환경 모두 확인

### 4단계: 빌드 설정 확인
- [ ] Node.js 버전 확인 (20.x 권장)
- [ ] 빌드 명령어 확인
- [ ] `vercel.json` 파일 필요 시 생성

### 5단계: 의존성 확인
- [ ] `package-lock.json`이 Git에 포함되어 있는지 확인
- [ ] Node.js 버전과 호환되는지 확인

### 6단계: 재배포
- [ ] 환경 변수 추가/수정 후 재배포
- [ ] 빌드 캐시 클리어 후 재배포
- [ ] GitHub에 새 커밋 푸시하여 트리거

---

## 자주 묻는 질문 (FAQ)

### Q1: 배포가 계속 실패하는데 어떻게 해야 하나요?

**A**: 
1. 빌드 로그의 정확한 에러 메시지 확인
2. 로컬에서 빌드 테스트
3. 환경 변수 확인
4. Vercel 지원팀에 문의 (필요시)

---

### Q2: 환경 변수를 추가했는데도 배포가 실패해요

**A**: 
- 환경 변수 추가 후 **자동으로 재배포되지 않습니다**
- 수동으로 재배포해야 합니다:
  1. Deployments → Redeploy
  2. 또는 GitHub에 새 커밋 푸시

---

### Q3: 로컬에서는 빌드가 되는데 Vercel에서는 실패해요

**A**: 
- 환경 변수 누락 가능성 높음
- Vercel 대시보드에서 환경 변수 확인
- Node.js 버전 차이 확인

---

### Q4: 빌드 타임아웃이 발생해요

**A**: 
- 빌드 최적화 필요
- `.vercelignore`로 불필요한 파일 제외
- Vercel Pro 플랜 고려

---

### Q5: MongoDB 연결이 안 돼요

**A**: 
- MongoDB Atlas IP 화이트리스트 확인
- `0.0.0.0/0` (모든 IP 허용) 설정
- 연결 문자열 형식 확인

---

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Vercel 지원](https://vercel.com/support)

---

**작성자**: AI Assistant  
**최종 수정일**: 2025-01-21  
**다음 검토일**: 배포 문제 발생 시

