import { Metadata } from 'next';

import Link from 'next/link';

import { getAllPages } from '@/lib/wordpress';

import BackButton from '@/components/back';
import { Container, Prose, Section } from '@/components/craft';

export const metadata: Metadata = {
  title: 'All Pages',
  description: 'Browse all pages of our blog posts',
  alternates: {
    canonical: '/posts/pages',
  },
};

export default async function Page() {
  const pages = await getAllPages();

  return (
    <Section>
      <Container className='space-y-6'>
        <Prose className='mb-8'>
          <h2>All Pages</h2>
          <ul className='grid'>
            {pages.map((page: any) => (
              <li key={page.id}>
                <Link href={`/pages/${page.slug}`}>{page.title.rendered}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
