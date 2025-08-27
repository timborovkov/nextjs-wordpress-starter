import type { Metadata } from 'next';

import Link from 'next/link';

import { siteConfig } from '@/site.config';
import Balancer from 'react-wrap-balancer';

import { cn } from '@/lib/utils';
import {
  getAllPostSlugs,
  getAuthorById,
  getCategoryById,
  getFeaturedMediaById,
  getPostBySlug,
} from '@/lib/wordpress';

import { Article, Container, Prose, Section } from '@/components/craft';
import { badgeVariants } from '@/components/ui/badge';

export async function generateStaticParams() {
  return await getAllPostSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {};
  }

  const ogUrl = new URL(`${siteConfig.site_domain}/api/og`);
  ogUrl.searchParams.append('title', post.title.rendered);
  // Strip HTML tags for description
  const description = post.excerpt.rendered.replace(/<[^>]*>/g, '').trim();
  ogUrl.searchParams.append('description', description);

  return {
    title: post.title.rendered,
    description: description,
    openGraph: {
      title: post.title.rendered,
      description: description,
      type: 'article',
      url: `${siteConfig.site_domain}/posts/${post.slug}`,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: post.title.rendered,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <Section>
      <Container>
        <Prose>
          <h1>
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
            </Balancer>
          </h1>
          <div className='mb-4 flex items-center justify-between gap-4 text-sm'>
            <h5>
              Published {date} by{' '}
              {author.name && (
                <span>
                  <a href={`/posts/?author=${author.id}`}>{author.name}</a>{' '}
                </span>
              )}
            </h5>

            <Link
              href={`/posts/?category=${category.id}`}
              className={cn(
                badgeVariants({ variant: 'outline' }),
                '!no-underline'
              )}
            >
              {category.name}
            </Link>
          </div>
          {featuredMedia?.source_url && (
            <div
              className={`
                my-12 flex h-96 items-center justify-center overflow-hidden
                rounded-lg border bg-accent/25
                md:h-[500px]
              `}
            >
              {/* eslint-disable-next-line */}
              <img
                className='size-full object-cover'
                src={featuredMedia.source_url}
                alt={post.title.rendered}
              />
            </div>
          )}
        </Prose>

        <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
      </Container>
    </Section>
  );
}
