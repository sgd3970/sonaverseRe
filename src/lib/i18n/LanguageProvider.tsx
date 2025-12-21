'use client';

/**
 * 클라이언트 컴포넌트용 다국어 Provider
 * useTranslation 훅을 통해 번역에 접근합니다.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Locale } from './config';
import { i18nConfig } from './config';
import type { Dictionary } from './getDictionary';

// Context 타입 정의
interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <T = string>(key: string, params?: Record<string, string | number>) => T;
  dictionary: Dictionary | null;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// 로컬 스토리지 키
const LOCALE_STORAGE_KEY = 'sonaverse-locale';

// 브라우저 언어 감지
function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return i18nConfig.defaultLocale;
  
  const browserLang = navigator.language.split('-')[0];
  if (i18nConfig.locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  return i18nConfig.defaultLocale;
}

// 저장된 로케일 가져오기
function getStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && i18nConfig.locales.includes(stored as Locale)) {
    return stored as Locale;
  }
  return null;
}

// 로케일 저장
function storeLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialDictionary?: Dictionary;
}

export function LanguageProvider({ 
  children, 
  initialLocale,
  initialDictionary 
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || i18nConfig.defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary | null>(initialDictionary || null);
  const [isLoading, setIsLoading] = useState(!initialDictionary);

  // 초기 로케일 설정 (클라이언트에서만)
  useEffect(() => {
    if (!initialLocale) {
      const storedLocale = getStoredLocale();
      const detectedLocale = storedLocale || detectBrowserLocale();
      setLocaleState(detectedLocale);
    }
  }, [initialLocale]);

  // 딕셔너리 로드
  useEffect(() => {
    if (initialDictionary && locale === initialLocale) {
      return;
    }

    const loadDictionary = async () => {
      setIsLoading(true);
      try {
        const [common, home, products, stories, press, inquiry, admin] = await Promise.all([
          import(`../../../public/locales/${locale}/common.json`).then(m => m.default),
          import(`../../../public/locales/${locale}/home.json`).then(m => m.default),
          import(`../../../public/locales/${locale}/products.json`).then(m => m.default),
          import(`../../../public/locales/${locale}/stories.json`).then(m => m.default),
          import(`../../../public/locales/${locale}/press.json`).then(m => m.default),
          import(`../../../public/locales/${locale}/inquiry.json`).then(m => m.default),
          import(`../../../public/locales/${locale}/admin.json`).then(m => m.default),
        ]);
        
        setDictionary({ common, home, products, stories, press, inquiry, admin });
      } catch (error) {
        console.error('Failed to load dictionary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDictionary();
  }, [locale, initialDictionary, initialLocale]);

  // 로케일 변경 함수
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    storeLocale(newLocale);
    // HTML lang 속성 업데이트
    document.documentElement.lang = newLocale;
  }, []);

  // 번역 함수
  const t = useCallback(<T = string>(key: string, params?: Record<string, string | number>): T => {
    if (!dictionary) {
      return key as T;
    }

    // 키를 점(.)으로 분리하여 중첩 객체에서 값 찾기
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 키를 찾지 못한 경우 원래 키 반환
        return key as T;
      }
    }

    // 문자열이 아닌 경우 (객체 등) 그대로 반환
    if (typeof value !== 'string') {
      return value as T;
    }

    // 파라미터 치환 (예: {{name}} -> 실제 값)
    if (params) {
      let result = value;
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      });
      return result as T;
    }

    return value as T;
  }, [dictionary]);

  const contextValue: LanguageContextType = {
    locale,
    setLocale,
    t,
    dictionary,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * 번역 훅 - 클라이언트 컴포넌트에서 사용
 * @returns t 함수와 로딩 상태
 */
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return {
    t: context.t,
    isLoading: context.isLoading,
    dictionary: context.dictionary,
  };
}

/**
 * 현재 로케일 가져오기
 * @returns 현재 로케일
 */
export function useLocale() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLocale must be used within a LanguageProvider');
  }
  return context.locale;
}

/**
 * 로케일 변경 함수 가져오기
 * @returns 로케일 변경 함수
 */
export function useSetLocale() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useSetLocale must be used within a LanguageProvider');
  }
  return context.setLocale;
}

