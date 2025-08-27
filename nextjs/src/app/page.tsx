import { Container, Prose, Section } from '@/components/craft';

// Revalidate every hour
export const revalidate = 3600;

export default async function RootPage() {
  // This page should never be reached because middleware handles locale routing
  // But we'll show a fallback just in case
  return (
    <Section>
      <Container>
        <Prose>
          <h1>Loading...</h1>
          <p>Please wait while we redirect you to your preferred language.</p>
        </Prose>
      </Container>
    </Section>
  );
}
