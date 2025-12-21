/**
 * i18n 설정 파일
 * 다국어 지원을 위한 기본 설정
 */

export const i18nConfig = {
  locales: ['ko', 'en'] as const,
  defaultLocale: 'ko' as const,
  localeDetection: true,
} as const;

export type Locale = (typeof i18nConfig.locales)[number];

