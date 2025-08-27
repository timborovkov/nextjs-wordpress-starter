import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import {
  getAuthorById,
  getCategoryById,
  getFeaturedMediaById,
} from '@/lib/wordpress';

import type { Post } from '@/types/wordpress';

export async function PostCard({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = post.author ? await getAuthorById(post.author) : null;
  const date = new Date(post.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        `
          group flex flex-col justify-between gap-8 rounded-lg border
          bg-accent/30 p-4
        `,
        `
          transition-all
          hover:bg-accent/75
        `
      )}
    >
      <div className='flex flex-col gap-4'>
        <div
          className={`
            relative flex h-48 w-full items-center justify-center
            overflow-hidden rounded-md border bg-muted
          `}
        >
          {media?.source_url ? (
            <Image
              className='size-full object-cover'
              src={media.source_url}
              alt={post.title?.rendered || 'Post thumbnail'}
              width={400}
              height={200}
            />
          ) : (
            <div
              className={`
                flex size-full items-center justify-center text-muted-foreground
              `}
            >
              No image available
            </div>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || 'Untitled Post',
          }}
          className={`
            text-xl font-medium text-primary decoration-muted-foreground
            decoration-dotted underline-offset-4 transition-all
            group-hover:underline
          `}
        />
        <div
          className='text-sm'
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.split(' ').slice(0, 12).join(' ').trim() +
                '...'
              : 'No excerpt available',
          }}
        />
      </div>

      <div className='flex flex-col gap-4'>
        <hr />
        <div className='flex items-center justify-between text-xs'>
          <p>{category?.name || 'Uncategorized'}</p>
          <p>{author?.name || 'Unknown Author'}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
