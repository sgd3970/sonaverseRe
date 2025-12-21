/**
 * i18n 모듈 - Next.js App Router용 다국어 시스템
 * 
 * 사용법:
 * - Server Components: getDictionary 사용
 * - Client Components: useTranslation 훅 사용
 */

export { getDictionary, getDictionaryByNamespace, type Dictionary } from './getDictionary';
export { LanguageProvider, useTranslation, useLocale, useSetLocale } from './LanguageProvider';
export { i18nConfig, type Locale } from './config';

