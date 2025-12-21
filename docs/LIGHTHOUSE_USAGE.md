# Lighthouse 점수 확인 가이드

## 🚀 빠른 시작

### 방법 1: 브라우저 DevTools (가장 간단) ⭐

1. **개발 서버 실행**
   ```bash
   npm run dev
   ```

2. **브라우저에서 페이지 열기**
   - Chrome 또는 Edge에서 `http://localhost:3000` 접속

3. **Lighthouse 실행**
   - `F12` 또는 `Ctrl + Shift + I` (Mac: `Cmd + Option + I`)로 DevTools 열기
   - 상단 탭에서 **"Lighthouse"** 클릭
   - 측정할 카테고리 선택:
     - ✅ Performance (성능)
     - ✅ Accessibility (접근성)
     - ✅ Best Practices (모범 사례)
     - ✅ SEO
   - 기기 유형 선택: **Mobile** 또는 **Desktop**
   - **"Analyze page load"** 버튼 클릭

4. **결과 확인**
   - 각 카테고리별 점수 (0-100)
   - Core Web Vitals (LCP, FID, CLS)
   - 개선 제안사항

---

## 📊 방법 2: CLI 도구로 자동화

### 설치 완료 ✅

Lighthouse CI가 이미 설치되어 있습니다.

### 사용 방법

#### 개발 서버 측정
개발 서버가 실행 중일 때 (`npm run dev`):
```bash
npm run lighthouse:dev
```

#### 프로덕션 빌드 측정 (권장)
더 정확한 성능 측정을 위해 프로덕션 빌드로 측정:
```bash
# 1. 빌드
npm run build

# 2. 프로덕션 서버 시작 (별도 터미널)
npm run start

# 3. Lighthouse 실행 (새 터미널)
npm run lighthouse:prod
```

또는 자동으로 서버 시작:
```bash
npm run lighthouse
```

---

## 🔧 방법 3: 프로덕션 빌드 측정

프로덕션 빌드 후 실제 성능 측정:

```bash
# 1. 빌드
npm run build

# 2. 프로덕션 서버 시작
npm run start

# 3. 별도 터미널에서 Lighthouse 실행
npm run lighthouse:prod
```

---

## 📝 측정할 주요 페이지

다음 페이지들의 성능을 정기적으로 확인하세요:

- `/` (홈)
- `/products/**` (제품 목록)
- `/sonaverse-story` (스토리)
- `/press` (보도자료)
- `/inquiry` (문의)

---

## 🎯 목표 점수

| 카테고리 | 최소 점수 | 권장 점수 |
|---------|----------|----------|
| Performance | 70 | 90+ |
| Accessibility | 90 | 95+ |
| Best Practices | 90 | 95+ |
| SEO | 90 | 95+ |

---

## 📈 Core Web Vitals 목표

| 메트릭 | 좋음 | 개선 필요 | 나쁨 |
|--------|------|-----------|------|
| LCP (Largest Contentful Paint) | ≤ 2.5초 | 2.5-4.0초 | > 4.0초 |
| FID (First Input Delay) | ≤ 100ms | 100-300ms | > 300ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.1-0.25 | > 0.25 |

---

## 💡 팁

1. **프로덕션 빌드로 측정**: 개발 모드보다 프로덕션 빌드가 실제 성능을 더 정확히 반영합니다.

2. **여러 번 측정**: 네트워크 상태에 따라 결과가 달라질 수 있으므로 3-5회 측정 후 평균을 확인하세요.

3. **모바일 우선**: Lighthouse는 기본적으로 모바일 환경을 시뮬레이션합니다. 모바일 점수가 더 중요합니다.

4. **개선 제안 우선순위**: Lighthouse가 제시하는 "Opportunities"를 우선순위대로 개선하세요.

