/**
 * 서버 컴포넌트용 번역 함수
 * JSON 파일에서 번역 데이터를 로드합니다.
 */

import type { Locale } from './config';

// 번역 딕셔너리 타입 정의
export interface Dictionary {
  common: typeof import('../../../public/locales/ko/common.json');
  home: typeof import('../../../public/locales/ko/home.json');
  products: typeof import('../../../public/locales/ko/products.json');
  stories: typeof import('../../../public/locales/ko/stories.json');
  press: typeof import('../../../public/locales/ko/press.json');
  inquiry: typeof import('../../../public/locales/ko/inquiry.json');
  admin: typeof import('../../../public/locales/ko/admin.json');
}

// 딕셔너리 로더 타입
type DictionaryLoader = () => Promise<Dictionary[keyof Dictionary]>;

// 각 네임스페이스별 딕셔너리 로더
const dictionaries: Record<Locale, Record<keyof Dictionary, DictionaryLoader>> = {
  ko: {
    common: () => import('../../../public/locales/ko/common.json').then((m) => m.default),
    home: () => import('../../../public/locales/ko/home.json').then((m) => m.default),
    products: () => import('../../../public/locales/ko/products.json').then((m) => m.default),
    stories: () => import('../../../public/locales/ko/stories.json').then((m) => m.default),
    press: () => import('../../../public/locales/ko/press.json').then((m) => m.default),
    inquiry: () => import('../../../public/locales/ko/inquiry.json').then((m) => m.default),
    admin: () => import('../../../public/locales/ko/admin.json').then((m) => m.default),
  },
  en: {
    common: () => import('../../../public/locales/en/common.json').then((m) => m.default),
    home: () => import('../../../public/locales/en/home.json').then((m) => m.default),
    products: () => import('../../../public/locales/en/products.json').then((m) => m.default),
    stories: () => import('../../../public/locales/en/stories.json').then((m) => m.default),
    press: () => import('../../../public/locales/en/press.json').then((m) => m.default),
    inquiry: () => import('../../../public/locales/en/inquiry.json').then((m) => m.default),
    admin: () => import('../../../public/locales/en/admin.json').then((m) => m.default),
  },
};

/**
 * 전체 딕셔너리 가져오기 (서버 컴포넌트용)
 * @param locale - 로케일 (ko, en)
 * @returns 전체 번역 딕셔너리
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const [common, home, products, stories, press, inquiry, admin] = await Promise.all([
    dictionaries[locale].common(),
    dictionaries[locale].home(),
    dictionaries[locale].products(),
    dictionaries[locale].stories(),
    dictionaries[locale].press(),
    dictionaries[locale].inquiry(),
    dictionaries[locale].admin(),
  ]);

  return {
    common,
    home,
    products,
    stories,
    press,
    inquiry,
    admin,
  } as Dictionary;
}

/**
 * 특정 네임스페이스만 가져오기 (서버 컴포넌트용)
 * @param locale - 로케일 (ko, en)
 * @param namespace - 네임스페이스 (common, home, products 등)
 * @returns 해당 네임스페이스의 번역 데이터
 */
export async function getDictionaryByNamespace<K extends keyof Dictionary>(
  locale: Locale,
  namespace: K
): Promise<Dictionary[K]> {
  return dictionaries[locale][namespace]() as Promise<Dictionary[K]>;
}

