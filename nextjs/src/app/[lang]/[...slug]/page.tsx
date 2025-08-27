import { Metadata } from "next";
import { notFound } from "next/navigation";
import { findPostByPath, getWebsiteSettings } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";

// Revalidate every hour
export const revalidate = 3600;

/**
 * Router properties received by the page
 */
type PageProps = {
  params: Promise<{
    slug: string | string[];
    lang: string;
  }>;
};

/**
 * Language-specific page handler
 * Shows any page/post for the specified language and slug
 */
export default async function LanguagePage(props: PageProps) {
  const params = await props.params;
  const lang = params.lang;

  try {
    // First validate that the language exists in our settings
    const settings = await getWebsiteSettings();
    if (!settings.languages.find((l) => l.code === lang)) {
      notFound();
    }

    // Construct the full path
    const path =
      typeof params.slug === "string"
        ? `${lang}/${params.slug}`
        : `${lang}/${params.slug.join("/")}`;

    // Find the post/page by path
    const post = await findPostByPath(path);

    if (!post || "code" in post) {
      notFound();
    }

    return (
      <Section>
        <Container>
          <Prose>
            <h1>{post.title.rendered}</h1>
            {post.excerpt?.rendered && (
              <div
                className="text-lg text-gray-600 mb-6"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </Prose>
        </Container>
      </Section>
    );
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}

/**
 * Generate SEO metadata for the pages
 */
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;

  try {
    const path =
      typeof params.slug === "string"
        ? `${lang}/${params.slug}`
        : `${lang}/${params.slug.join("/")}`;

    const post = await findPostByPath(path);

    if (!post || "code" in post) {
      return {
        title: `Page Not Found`,
      };
    }

    // Strip HTML tags for description and limit length
    const description = post.excerpt?.rendered
      ? post.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
      : post.content.rendered
          .replace(/<[^>]*>/g, "")
          .trim()
          .slice(0, 200) + "...";

    return {
      title: post.title.rendered,
      description: description,
      openGraph: {
        type: "article",
        locale: lang,
        url: `${
          process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
        }/${path}`,
        title: post.title.rendered,
        description: description,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title.rendered,
        description: description,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Page | ${lang.toUpperCase()}`,
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
    const links = [];

    // Get all page links
    const pages = await import("@/lib/wordpress").then((m) => m.getAllPages());
    if (pages) {
      links.push(...pages.map((page) => page.link));
    }

    // Get all post links
    const posts = await import("@/lib/wordpress").then((m) => m.getAllPosts());
    if (posts) {
      links.push(...posts.map((post) => post.link));
    }

    return links.map((link) => {
      const url = new URL(link);
      const path = url.pathname.replace(/^\/|\/$/g, ""); // Remove leading and trailing slashes
      const parts = path.split("/");
      const lang = parts[0];
      const slugParts = parts.slice(1);

      return {
        lang,
        slug: slugParts,
      };
    });
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return empty array to allow dynamic generation
    return [];
  }
}
