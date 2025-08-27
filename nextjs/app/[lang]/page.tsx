import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWebsiteSettings, findPostByPath } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";

// Revalidate every hour
export const revalidate = 3600;

/**
 * Router properties received by the page
 */
type PageProps = {
  params: Promise<{
    lang: string;
  }>;
};

/**
 * Language-specific home page
 * Shows the frontpage for the specified language
 */
export default async function LanguageHomePage(props: PageProps) {
  const params = await props.params;
  const lang = params.lang;

  try {
    // Get website settings to find the frontpage for this language
    const settings = await getWebsiteSettings();

    // Get the frontpage for this language
    const frontpage = settings.frontpages[lang];

    if (!frontpage) {
      notFound();
    }

    // If there's a specific frontpage, fetch it
    if (frontpage.ID > 0) {
      const post = await findPostByPath(`${lang}/${frontpage.slug}`);

      if (!post || "code" in post) {
        notFound();
      }

      return (
        <Section>
          <Container>
            <Prose>
              <h1>{post.title.rendered}</h1>
              <div
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </Prose>
          </Container>
        </Section>
      );
    } else {
      // No specific frontpage set, show default content
      return (
        <Section>
          <Container>
            <Prose>
              <h1>{frontpage.title}</h1>
              <p>Welcome to {settings.site.name}</p>
              <p>{settings.site.description}</p>
            </Prose>
          </Container>
        </Section>
      );
    }
  } catch (error) {
    console.error("Error loading language home page:", error);
    notFound();
  }
}

/**
 * Generate SEO metadata for the language home page
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;

  try {
    const settings = await getWebsiteSettings();
    const frontpage = settings.frontpages[lang];

    if (!frontpage) {
      return {
        title: `Page Not Found`,
      };
    }

    if (frontpage.ID > 0) {
      // Try to get the actual post for metadata
      try {
        const post = await findPostByPath(`${lang}/${frontpage.slug}`);

        if (post && !("code" in post)) {
          return {
            title: post.title.rendered,
            description: post.excerpt?.rendered
              ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
              : post.content.rendered
                  .replace(/<[^>]*>/g, "")
                  .trim()
                  .slice(0, 200) + "...",
            openGraph: {
              type: "website",
              locale: lang,
              url: `${
                process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
              }/${lang}`,
              title: post.title.rendered,
              description: post.excerpt?.rendered
                ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
                : post.content.rendered
                    .replace(/<[^>]*>/g, "")
                    .trim()
                    .slice(0, 200) + "...",
            },
          };
        }
      } catch (error) {
        console.error("Error fetching post for metadata:", error);
      }
    }

    // Fallback metadata
    return {
      title: `${frontpage.title} | ${settings.site.name}`,
      description: settings.site.description,
      openGraph: {
        type: "website",
        locale: lang,
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
        }/${lang}`,
        title: frontpage.title,
        description: settings.site.description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Home | ${lang.toUpperCase()}`,
    };
  }
}

/**
 * Return 404 for params not pre-generated
 */
export const dynamicParams = false;

/**
 * Generate static parameters to pre-render pages
 */
export async function generateStaticParams() {
  try {
    const settings = await getWebsiteSettings();

    return Object.keys(settings.frontpages).map((lang) => ({
      lang,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback to common languages
    return [{ lang: "en" }, { lang: "fr" }, { lang: "de" }, { lang: "es" }];
  }
}
