import { Metadata } from 'next';

import Link from 'next/link';

import { getAllTags } from '@/lib/wordpress';

import BackButton from '@/components/back';
import { Container, Prose, Section } from '@/components/craft';

export const metadata: Metadata = {
  title: 'All Tags',
  description: 'Browse all tags of our blog posts',
  alternates: {
    canonical: '/posts/tags',
  },
};

export default async function Page() {
  const tags = await getAllTags();

  return (
    <Section>
      <Container className='space-y-6'>
        <Prose className='mb-8'>
          <h2>All Tags</h2>
          <ul className='grid'>
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link href={`/posts/?tag=${tag.id}`}>{tag.name}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
