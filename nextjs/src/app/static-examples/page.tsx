// Craft Imports
// Next.js Imports
import Link from 'next/link';

// Icons
import { Diamond, File, Folder, Pen, Tag, User } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import { Container, Prose, Section } from '@/components/craft';
import { NextJsIcon } from '@/components/icons/nextjs';
import { WordPressIcon } from '@/components/icons/wordpress';

// This page is using the craft.tsx component and design system
export default function Home() {
  return (
    <Section>
      <Container>
        <ToDelete />
      </Container>
    </Section>
  );
}

// This is just some example TSX
const ToDelete = () => {
  return (
    <main className='space-y-6'>
      <Prose>
        <h1>
          <Balancer>Headless WordPress built with the Next.js</Balancer>
        </h1>

        <p>
          This is <a href='https://github.com/9d8dev/next-wp'>next-wp</a>,
          created as a way to build WordPress sites with Next.js at rapid speed.
          This starter is designed with{' '}
          <a href='https://ui.shadcn.com'>shadcn/ui</a>,{' '}
          <a href='https://craft-ds.com'>craft-ds</a>, and Tailwind CSS. Use{' '}
          <a href='https://components.work'>brijr/components</a> to build your
          site with prebuilt components. The data fetching and typesafety is
          handled in <code>lib/wordpress.ts</code> and{' '}
          <code>lib/wordpress.d.ts</code>.
        </p>
      </Prose>

      <div className='flex items-center justify-between gap-4'>
        {/* Vercel Clone Starter */}
        <div className='flex items-center gap-3'>
          <a
            className='block h-auto'
            href='https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME&envDescription=Add%20WordPress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%20abd%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev'
          >
            {/* eslint-disable-next-line */}
            <img
              className='my-4'
              src='https://vercel.com/button'
              alt='Deploy with Vercel'
              width={105}
              height={32.62}
            />
          </a>
          <p
            className={`
              sr-only !text-sm text-muted-foreground
              sm:not-sr-only
            `}
          >
            Deploy with Vercel in seconds.
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <WordPressIcon className='text-foreground' width={32} height={32} />
          <NextJsIcon className='text-foreground' width={32} height={32} />
        </div>
      </div>

      <div
        className={`
          mt-6 grid gap-4
          md:grid-cols-3
        `}
      >
        <Link
          className={`
            flex h-48 flex-col justify-between rounded-lg border bg-accent/50
            p-4 transition-all
            hover:scale-[1.02]
          `}
          href='/posts'
        >
          <Pen size={32} />
          <span>
            Posts{' '}
            <span className='block text-sm text-muted-foreground'>
              All posts from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className={`
            flex h-48 flex-col justify-between rounded-lg border bg-accent/50
            p-4 transition-all
            hover:scale-[1.02]
          `}
          href='/pages'
        >
          <File size={32} />
          <span>
            Pages{' '}
            <span className='block text-sm text-muted-foreground'>
              Custom pages from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className={`
            flex h-48 flex-col justify-between rounded-lg border bg-accent/50
            p-4 transition-all
            hover:scale-[1.02]
          `}
          href='/posts/authors'
        >
          <User size={32} />
          <span>
            Authors{' '}
            <span className='block text-sm text-muted-foreground'>
              List of the authors from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className={`
            flex h-48 flex-col justify-between rounded-lg border bg-accent/50
            p-4 transition-all
            hover:scale-[1.02]
          `}
          href='/posts/tags'
        >
          <Tag size={32} />
          <span>
            Tags{' '}
            <span className='block text-sm text-muted-foreground'>
              Content by tags from your WordPress
            </span>
          </span>
        </Link>
        <Link
          className={`
            flex h-48 flex-col justify-between rounded-lg border bg-accent/50
            p-4 transition-all
            hover:scale-[1.02]
          `}
          href='/posts/categories'
        >
          <Diamond size={32} />
          <span>
            Categories{' '}
            <span className='block text-sm text-muted-foreground'>
              Categories from your WordPress
            </span>
          </span>
        </Link>
        <a
          className={`
            flex h-48 flex-col justify-between rounded-lg border bg-accent/50
            p-4 transition-all
            hover:scale-[1.02]
          `}
          href='https://github.com/9d8dev/next-wp/blob/main/README.md'
        >
          <Folder size={32} />
          <span>
            Documentation{' '}
            <span className='block text-sm text-muted-foreground'>
              How to use `next-wp`
            </span>
          </span>
        </a>
      </div>
    </main>
  );
};
