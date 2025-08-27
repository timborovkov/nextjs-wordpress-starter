'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import type {
  DictionaryLanguage,
  DictionaryTranslation,
} from '../types/wordpress';
import { setCookie } from '../utils/cookie';

// Type for available locales
export type Locale = string;

// Type for dictionary data
export interface Dictionary {
  [key: string]: string;
}

// Props for the LocaleProvider
interface LocaleProviderProps {
  children: ReactNode;
  availableLocales: DictionaryLanguage[];
  dictionaries: Record<string, DictionaryTranslation>;
}

/**
 * Locale context to provide the locale and dictionary to the app
 */
const LocaleContext = createContext<{
  locale?: Locale;
  dict: Dictionary;
  availableLocales: DictionaryLanguage[];
  switchLocale: (_newLocale: Locale) => void;
  translate: (key: string, fallback?: string) => string;
}>({
  locale: undefined,
  dict: {} as Dictionary,
  availableLocales: [],
  switchLocale: () => {},
  translate: () => '',
});

/**
 * Locale provider component to provide the locale context to the app
 * and handle locale switching
 *
 * @param children - The children components
 * @param availableLocales - Available locales from WordPress
 * @param dictionaries - All dictionaries from WordPress
 * @returns The locale provider component
 */
export function LocaleProvider({
  children,
  availableLocales: initialAvailableLocales,
  dictionaries: initialDictionaries,
}: LocaleProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useParams();

  // Determine current locale from URL params
  const currentLocale = useMemo<Locale | undefined>(
    () => (typeof lang === 'string' ? lang : undefined),
    [lang]
  );

  // Set locale based on URL params or fallback to default
  const [locale, setLocale] = useState<Locale | undefined>(() => {
    const isValidLocale = initialAvailableLocales.find(
      (l) => l.code === currentLocale
    );
    return isValidLocale ? currentLocale : undefined;
  });

  // Get dictionary for current locale
  const dict = useMemo<Dictionary>(() => {
    return locale ? initialDictionaries[locale] || {} : {};
  }, [locale, initialDictionaries]);

  // Get available locales from props
  const availableLocales = useMemo<DictionaryLanguage[]>(() => {
    return initialAvailableLocales;
  }, [initialAvailableLocales]);

  /**
   * Translate a key to the current locale
   * @param key - The translation key
   * @param fallback - Optional fallback text if translation not found
   * @returns The translated text or fallback
   */
  const translate = useCallback(
    (key: string, fallback?: string): string => {
      if (!locale) return fallback || key;

      const translation = dict[key];
      if (translation) return translation;

      return fallback || key;
    },
    [locale, dict]
  );

  /**
   * Switch the locale and update the cookie
   */
  const switchLocale = useCallback(
    (newLocale: Locale) => {
      if (!newLocale) return;

      setCookie('locale', newLocale, 365);
      setLocale(newLocale);

      // Remove the current locale from the pathname before adding the new locale
      // pathname format: /[locale]/rest/of/path
      const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

      router.push(`/${newLocale}${pathWithoutLocale}`);
    },
    [pathname, router, locale]
  );

  const value = useMemo(
    () => ({ locale, dict, availableLocales, switchLocale, translate }),
    [locale, dict, availableLocales, switchLocale, translate]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

/**
 * Hook to use the locale context
 */
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
