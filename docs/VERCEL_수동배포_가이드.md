# Vercel 수동 배포 가이드

GitHub 푸시가 Vercel에 전달되지 않을 때 수동으로 배포하는 방법

## 방법 1: Vercel 대시보드에서 수동 재배포

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - 배포할 프로젝트 클릭

3. **Deployments 탭**
   - 최근 배포 중 하나 선택 (또는 아무 배포나)

4. **Redeploy 클릭**
   - 배포 카드 우측 상단의 "..." 메뉴 클릭
   - "Redeploy" 선택
   - 확인

## 방법 2: Vercel CLI로 배포

### Step 1: Vercel CLI 로그인

```bash
vercel login
```

브라우저가 열리면 Vercel 계정으로 로그인

### Step 2: 프로젝트 연결

```bash
vercel link
```

프로젝트를 선택하고 설정 확인

### Step 3: 배포

```bash
# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```

## 방법 3: GitHub Webhook 수동 트리거

1. **GitHub 저장소 → Settings → Webhooks**
2. Vercel webhook 찾기
3. "Recent Deliveries" 클릭
4. 최근 실패한 요청이 있다면 "Redeliver" 클릭

## 방법 4: Vercel Deploy Hook 사용

1. **Vercel 대시보드 → Settings → Git**
2. "Deploy Hooks" 섹션 확인
3. 새 Deploy Hook 생성 (필요시)
4. 생성된 URL로 POST 요청:

```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/xxx
```

## 가장 빠른 해결책

**Vercel 대시보드에서 수동 재배포**가 가장 빠릅니다:
1. Vercel 대시보드 → 프로젝트
2. Deployments → 최근 배포 → "..." → Redeploy

