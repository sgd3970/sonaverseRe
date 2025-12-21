# GitHub → Vercel 자동 배포 연결 문제 해결 가이드

> **작성일**: 2025-01-21  
> **문제**: GitHub에 푸시했는데 Vercel로 자동 배포가 트리거되지 않음  
> **목적**: GitHub와 Vercel의 연결을 복구하고 자동 배포 활성화

---

## 📋 빠른 진단 체크리스트

GitHub 푸시가 Vercel에 전달되지 않을 때 확인할 사항:

- [ ] **Vercel 대시보드에서 Git 연결 상태 확인**
- [ ] **GitHub 저장소 권한 확인**
- [ ] **Vercel Webhook이 GitHub에 등록되어 있는지 확인**
- [ ] **프로덕션 브랜치 설정 확인**
- [ ] **GitHub Actions나 다른 CI/CD 간섭 확인**

---

## 🔍 문제 진단 단계

### Step 1: Vercel 대시보드에서 Git 연결 확인

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard

2. **프로젝트 선택**
   - 문제가 있는 프로젝트 클릭

3. **Settings → Git 확인**
   - Git 탭에서 연결된 저장소 확인
   - **Connected Repository**에 올바른 GitHub 저장소가 표시되는지 확인

4. **연결이 안 되어 있다면**
   - "Connect Git Repository" 클릭
   - GitHub 저장소 선택 및 권한 부여

---

### Step 2: GitHub 저장소 권한 확인

1. **GitHub 저장소 접속**
   - 저장소 → Settings → Webhooks

2. **Vercel Webhook 확인**
   - `vercel.com` 또는 `vercel.app` 도메인의 webhook이 있는지 확인
   - Webhook이 없다면 Vercel이 저장소 변경을 감지하지 못함

3. **Webhook이 있다면**
   - Webhook 클릭 → Recent Deliveries 확인
   - 최근 푸시 이벤트가 전달되었는지 확인
   - 실패한 요청이 있다면 에러 메시지 확인

---

### Step 3: Vercel 프로젝트 설정 확인

1. **Settings → General**
   - **Production Branch**: `main` 또는 `master`로 설정되어 있는지 확인
   - 현재 푸시한 브랜치와 일치하는지 확인

2. **Settings → Git**
   - **Auto-deploy**: 활성화되어 있는지 확인
   - **Production Branch**: 올바른 브랜치로 설정되어 있는지 확인

---

## 🛠️ 해결 방법

### 방법 1: Git 연결 재설정 (가장 확실한 방법)

#### Step 1: Vercel에서 연결 해제

1. Vercel 대시보드 → 프로젝트 → Settings
2. Git 탭 클릭
3. "Disconnect" 또는 "Remove" 클릭
4. 확인

#### Step 2: GitHub에서 Webhook 제거 (선택적)

1. GitHub 저장소 → Settings → Webhooks
2. Vercel 관련 webhook이 있다면 삭제

#### Step 3: Vercel에서 다시 연결

1. Vercel 대시보드 → 프로젝트 → Settings → Git
2. "Connect Git Repository" 클릭
3. GitHub 저장소 선택
4. 권한 부여 확인
5. 브랜치 선택 (일반적으로 `main` 또는 `master`)

#### Step 4: 테스트 배포

1. GitHub에 작은 변경사항 푸시:
```bash
git commit --allow-empty -m "Test Vercel auto-deploy"
git push
```

2. Vercel 대시보드 → Deployments에서 새 배포가 시작되는지 확인

---

### 방법 2: Webhook 수동 재등록

#### Step 1: Vercel 프로젝트 정보 확인

1. Vercel 대시보드 → 프로젝트 → Settings → General
2. **Project ID** 복사

#### Step 2: GitHub Webhook 수동 추가

1. GitHub 저장소 → Settings → Webhooks
2. "Add webhook" 클릭
3. 다음 정보 입력:
   - **Payload URL**: `https://api.vercel.com/v1/integrations/github/xxx` (Vercel이 제공)
   - **Content type**: `application/json`
   - **Secret**: (Vercel이 제공하는 secret, 있으면)
   - **Events**: "Just the push event" 또는 "Let me select individual events" → "Push" 선택
4. "Add webhook" 클릭

**참고**: 이 방법은 복잡하므로, 방법 1(재연결)을 권장합니다.

---

### 방법 3: Vercel CLI로 수동 배포

연결 문제를 해결하는 동안 수동으로 배포:

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결 (처음만)
vercel link

# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```

---

### 방법 4: GitHub Actions로 자동 배포 설정 (대안)

Vercel 연결이 계속 안 될 경우, GitHub Actions 사용:

#### `.github/workflows/deploy.yml` 파일 생성

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main
      - master

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Vercel CLI
        run: npm install -g vercel@latest
      
      - name: Deploy to Vercel
        run: vercel --prod --yes --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### GitHub Secrets 설정

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `VERCEL_TOKEN`: Vercel 대시보드 → Settings → Tokens에서 생성
   - `VERCEL_ORG_ID`: Vercel 프로젝트 설정에서 확인
   - `VERCEL_PROJECT_ID`: Vercel 프로젝트 설정에서 확인

---

## 🔎 상세 진단

### Vercel 대시보드에서 확인할 사항

#### 1. Deployments 탭

- **최근 배포 기록 확인**
  - 마지막 배포가 언제인지 확인
  - GitHub 커밋과 연결되어 있는지 확인
  - "Triggered by GitHub" 표시가 있는지 확인

#### 2. Settings → Git

확인 사항:
- [ ] **Connected Repository**: 올바른 저장소 표시
- [ ] **Production Branch**: `main` 또는 `master`
- [ ] **Auto-deploy**: 활성화됨
- [ ] **Deploy Hooks**: 비어있거나 올바르게 설정됨

#### 3. Settings → General

확인 사항:
- [ ] **Project Name**: 올바른 이름
- [ ] **Framework Preset**: Next.js
- [ ] **Root Directory**: `./` (프로젝트 루트)

---

### GitHub에서 확인할 사항

#### 1. 저장소 → Settings → Webhooks

확인 사항:
- [ ] Vercel webhook이 등록되어 있는지
- [ ] Webhook 상태가 "Active"인지
- [ ] Recent Deliveries에서 최근 푸시가 전달되었는지

#### 2. 저장소 → Settings → Integrations

확인 사항:
- [ ] Vercel 앱이 설치되어 있는지
- [ ] 권한이 올바르게 설정되어 있는지

#### 3. 저장소 → Settings → Collaborators

확인 사항:
- [ ] Vercel 앱 또는 봇이 협력자로 추가되어 있는지 (필요시)

---

## 🚨 일반적인 원인과 해결책

### 원인 1: Vercel과 GitHub 연결이 끊어짐

**증상**: 
- Vercel 대시보드에서 "No Git repository connected" 표시
- Deployments에 GitHub 커밋 정보가 없음

**해결**:
- 방법 1: Git 연결 재설정 (위 참조)

---

### 원인 2: 잘못된 브랜치 설정

**증상**:
- `main` 브랜치에 푸시했는데 배포가 안 됨
- Vercel 설정에서 `master`로 되어 있음

**해결**:
1. Vercel 대시보드 → Settings → General
2. Production Branch를 `main`으로 변경
3. 또는 GitHub에서 `main` 브랜치에 푸시

---

### 원인 3: GitHub Webhook 실패

**증상**:
- GitHub Webhooks에서 실패한 요청 표시
- "Delivery failed" 또는 "Timeout" 에러

**해결**:
1. GitHub 저장소 → Settings → Webhooks
2. 실패한 webhook 클릭
3. "Redeliver" 클릭하여 재시도
4. 계속 실패하면 webhook 삭제 후 재연결

---

### 원인 4: GitHub Actions 간섭

**증상**:
- GitHub Actions가 실행 중
- Vercel 배포가 트리거되지 않음

**해결**:
- GitHub Actions 워크플로우 확인
- Vercel 배포와 충돌하는지 확인
- 필요시 GitHub Actions 비활성화 또는 수정

---

### 원인 5: Vercel 프로젝트가 다른 저장소에 연결됨

**증상**:
- Vercel에서 다른 저장소가 연결되어 있음
- 현재 푸시한 저장소와 다름

**해결**:
1. Vercel 대시보드 → Settings → Git
2. "Disconnect" 클릭
3. 올바른 저장소로 다시 연결

---

## ✅ 빠른 해결 체크리스트

문제가 발생했을 때 순서대로 시도:

### 1단계: 기본 확인
- [ ] Vercel 대시보드 → Settings → Git에서 저장소 연결 확인
- [ ] Production Branch가 푸시한 브랜치와 일치하는지 확인
- [ ] Auto-deploy가 활성화되어 있는지 확인

### 2단계: GitHub 확인
- [ ] GitHub 저장소 → Settings → Webhooks에서 Vercel webhook 확인
- [ ] Webhook이 Active 상태인지 확인
- [ ] Recent Deliveries에서 최근 푸시가 전달되었는지 확인

### 3단계: 재연결 시도
- [ ] Vercel에서 Git 연결 해제
- [ ] 다시 연결
- [ ] 테스트 푸시로 확인

### 4단계: 수동 배포 (임시)
- [ ] Vercel CLI로 수동 배포
- [ ] 연결 문제 해결하는 동안 사용

### 5단계: 대안 고려
- [ ] GitHub Actions로 자동 배포 설정
- [ ] 또는 Vercel 지원팀에 문의

---

## 🧪 테스트 방법

연결이 제대로 되었는지 테스트:

### 방법 1: 빈 커밋 푸시

```bash
git commit --allow-empty -m "Test Vercel auto-deploy"
git push
```

**예상 결과**: 
- Vercel 대시보드 → Deployments에 새 배포가 자동으로 시작됨
- 배포 상태가 "Building" 또는 "Queued"로 표시됨

### 방법 2: 작은 변경사항 푸시

```bash
# README에 작은 변경
echo "# Test" >> README.md
git add README.md
git commit -m "Test deployment"
git push
```

**예상 결과**: Vercel이 변경사항을 감지하고 자동 배포 시작

---

## 📞 추가 지원

위 방법으로 해결되지 않으면:

1. **Vercel 지원팀에 문의**
   - Vercel 대시보드 → Help → Contact Support
   - 문제 설명과 함께 문의

2. **Vercel 커뮤니티**
   - https://github.com/vercel/vercel/discussions
   - 유사한 문제 검색

3. **GitHub Issues**
   - Vercel CLI 또는 관련 도구의 GitHub Issues 확인

---

## 📝 참고 자료

- [Vercel Git Integration 문서](https://vercel.com/docs/concepts/git)
- [Vercel Webhooks 가이드](https://vercel.com/docs/concepts/git/deploy-hooks)
- [GitHub Webhooks 문서](https://docs.github.com/en/webhooks)

---

**작성자**: AI Assistant  
**최종 수정일**: 2025-01-21

