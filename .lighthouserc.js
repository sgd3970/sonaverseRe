// Lighthouse CI 설정
// 사용법: npm run lighthouse

module.exports = {
  ci: {
    collect: {
      // 측정할 URL 목록
      url: [
        'http://localhost:3000/',
        // 필요시 추가 페이지:
        // 'http://localhost:3000/products',
        // 'http://localhost:3000/sonaverse-story',
        // 'http://localhost:3000/press',
        // 'http://localhost:3000/inquiry',
      ],
      // 각 URL당 실행 횟수 (평균값 계산)
      numberOfRuns: 3,
      // 프로덕션 서버 시작 명령어
      startServerCommand: 'npm run start',
      // 서버 준비 완료 패턴 (Next.js는 "Ready" 메시지 출력)
      startServerReadyPattern: 'Ready',
      // 서버 시작 대기 시간 (초)
      startServerReadyTimeout: 60000,
      // Chrome 설정
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // 모바일 시뮬레이션 (기본값: 모바일)
        emulatedFormFactor: 'mobile',
        // 스로틀링 설정 (느린 네트워크 시뮬레이션)
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      // 점수 기준 설정
      assertions: {
        // 성능: 최소 70점 (개발 단계), 프로덕션에서는 90점 목표
        'categories:performance': ['warn', { minScore: 0.7 }],
        // 접근성: 최소 90점 필수
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // 모범 사례: 최소 90점
        'categories:best-practices': ['error', { minScore: 0.9 }],
        // SEO: 최소 90점
        'categories:seo': ['error', { minScore: 0.9 }],
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      // Lighthouse CI 서버에 업로드하지 않음 (로컬 테스트용)
      // Git 저장소가 아닌 경우를 대비해 환경 변수로 오버라이드 가능
      target: 'temporary-public-storage',
      githubToken: undefined,
    },
  },
};

