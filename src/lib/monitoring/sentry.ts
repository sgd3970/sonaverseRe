import * as Sentry from '@sentry/nextjs';

// Sentry 초기화는 sentry.client.config.ts와 sentry.server.config.ts에서 수행
// 이 파일은 유틸리티 함수만 제공

export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      contexts: {
        custom: context || {},
      },
    });
  } else {
    console.error('Sentry (dev):', error, context);
  }
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`Sentry (dev) [${level}]:`, message);
  }
}

export function setUser(user: { id?: string; email?: string; username?: string }) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.setUser(user);
  }
}

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb(breadcrumb);
  }
}

