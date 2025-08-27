import type { Metadata } from 'next';

import { Inter as FontSans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { contentMenu, mainMenu } from '@/menu.config';
import Logo from '@/public/logo.svg';
import { siteConfig } from '@/site.config';
import { Analytics } from '@vercel/analytics/react';
import Balancer from 'react-wrap-balancer';

import { cn } from '@/lib/utils';
import { getAllDictionaryTranslations } from '@/lib/wordpress';

import { Container, Section } from '@/components/craft';
import { MobileNav } from '@/components/nav/mobile-nav';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';

import { LocaleProvider } from '@/context/LocaleContext';

import type {
  DictionaryLanguage,
  DictionaryTranslation,
} from '@/types/wordpress';

import './globals.css';

const font = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'WordPress & Next.js Starter by Tim Borovkov',
  description:
    'A starter template for Next.js with WordPress as a headless CMS.',
  metadataBase: new URL(siteConfig.site_domain),
  alternates: {
    canonical: '/',
  },
};

// Fetch locales and dictionaries at build time
async function getLocalesAndDictionaries() {
  try {
    const response = await getAllDictionaryTranslations();
    const availableLocales = Object.values(response.languages);
    const dictionaries: Record<string, DictionaryTranslation> = {};

    // Build dictionaries object
    Object.entries(response.translations).forEach(([langCode, langData]) => {
      if (
        langData &&
        typeof langData === 'object' &&
        'translations' in langData
      ) {
        dictionaries[langCode] = langData.translations as DictionaryTranslation;
      }
    });

    return { availableLocales, dictionaries };
  } catch (error) {
    console.warn('Failed to fetch locales and dictionaries:', error);
    // Return fallback data
    return {
      availableLocales: [
        { code: 'en', name: 'English', flag: '🇺🇸' },
      ] as DictionaryLanguage[],
      dictionaries: {
        en: {} as DictionaryTranslation,
      },
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { availableLocales, dictionaries } = await getLocalesAndDictionaries();

  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={cn('min-h-screen font-sans antialiased', font.variable)}>
        <LocaleProvider
          availableLocales={availableLocales}
          dictionaries={dictionaries}
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <Nav />
            {children}
            <Footer />
          </ThemeProvider>
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

const Nav = ({ className, children, id }: NavProps) => {
  return (
    <nav
      className={cn('sticky top-0 z-50 bg-background', 'border-b', className)}
      id={id}
    >
      <div
        id='nav-container'
        className={`
          mx-auto flex max-w-5xl items-center justify-between px-6 py-4
          sm:px-8
        `}
      >
        <Link
          className={`
            flex items-center gap-4 transition-all
            hover:opacity-75
          `}
          href='/'
        >
          <Image
            src={Logo}
            alt='Logo'
            loading='eager'
            className='dark:invert'
            width={42}
            height={26.44}
          />
          <h2 className='text-sm'>{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className='flex items-center gap-2'>
          <div
            className={`
              mx-2 hidden
              md:flex
            `}
          >
            {Object.entries(mainMenu).map(([key, href]) => (
              <Button key={href} asChild variant='ghost' size='sm'>
                <Link href={href}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Link>
              </Button>
            ))}
          </div>
          <Button
            asChild
            className={`
              hidden
              sm:flex
            `}
          >
            <Link href='https://github.com/9d8dev/next-wp'>Get Started</Link>
          </Button>
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer>
      <Section>
        <Container
          className={`
            grid gap-12
            md:grid-cols-[1.5fr_0.5fr_0.5fr]
          `}
        >
          <div className='flex flex-col gap-6'>
            <Link href='/'>
              <h3 className='sr-only'>{siteConfig.site_name}</h3>
              <Image
                src={Logo}
                alt='Logo'
                className='dark:invert'
                width={42}
                height={26.44}
              />
            </Link>
            <p>
              <Balancer>{siteConfig.site_description}</Balancer>
            </p>
          </div>
          <div className='flex flex-col gap-2 text-sm'>
            <h5 className='text-base font-medium'>Website</h5>
            {Object.entries(mainMenu).map(([key, href]) => (
              <Link
                className={`
                  underline-offset-4
                  hover:underline
                `}
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
          <div className='flex flex-col gap-2 text-sm'>
            <h5 className='text-base font-medium'>Blog</h5>
            {Object.entries(contentMenu).map(([key, href]) => (
              <Link
                className={`
                  underline-offset-4
                  hover:underline
                `}
                key={href}
                href={href}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Link>
            ))}
          </div>
        </Container>
        <Container
          className={`
            flex flex-col justify-between gap-6 border-t
            md:flex-row md:items-center md:gap-2
          `}
        >
          <ThemeToggle />
          <p className='text-muted-foreground'>
            &copy; <a href='https://9d8.dev'>9d8</a>. All rights reserved.
            2025-present.
          </p>
        </Container>
      </Section>
    </footer>
  );
};
