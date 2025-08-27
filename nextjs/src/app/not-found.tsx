import Link from 'next/link';

import { Container, Section } from '@/components/craft';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div
          className={`
            flex min-h-[50vh] flex-col items-center justify-center text-center
          `}
        >
          <h1 className='mb-4 text-4xl font-bold'>404 - Page Not Found</h1>
          <p className='mb-8'>
            Sorry, the page you are looking for does not exist.
          </p>
          <Button asChild className='mt-6'>
            <Link href='/'>Return Home</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
