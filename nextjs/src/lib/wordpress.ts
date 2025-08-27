// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Author,
  FeaturedMedia,
  WebsiteSettings,
  MenuItem,
  PostWithACF,
  PageWithACF,
  FindPostResponse,
  DictionaryResponse,
  DictionaryAllLanguagesResponse,
} from "../types/wordpress";

const baseUrl = process.env.WORDPRESS_URL;

const username = process.env.WORDPRESS_USERNAME ?? "";
const applicationPassword = process.env.WORDPRESS_APPLICATION_PASSWORD ?? "";
const credentials = Buffer.from(`${username}:${applicationPassword}`).toString(
  "base64"
);

// SSL configuration for local development
if (process.env.NODE_ENV === "development") {
  // Set Node.js to ignore SSL certificate errors for local development
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

if (!baseUrl) {
  throw new Error("WORDPRESS_URL environment variable is not defined");
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// New types for pagination support
export interface WordPressPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WordPressResponse<T> {
  data: T;
  headers: WordPressPaginationHeaders;
}

// Keep original function for backward compatibility
async function wordpressFetch<T>(
  path: string,
  query?: Record<string, any>
): Promise<T> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${credentials}`,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

// New function for paginated requests
async function wordpressFetchWithPagination<T>(
  path: string,
  query?: Record<string, any>
): Promise<WordPressResponse<T>> {
  const url = `${baseUrl}${path}${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${credentials}`,
    },
    next: {
      tags: ["wordpress"],
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

// New function for paginated posts
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 9,
  filterParams?: {
    author?: string;
    tag?: string;
    category?: string;
    search?: string;
  }
): Promise<WordPressResponse<PostWithACF[]>> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: perPage,
    page,
  };

  // Build cache tags based on filters
  const cacheTags = ["wordpress", "posts"];

  if (filterParams?.search) {
    query.search = filterParams.search;
    cacheTags.push("posts-search");
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
    cacheTags.push(`posts-author-${filterParams.author}`);
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
    cacheTags.push(`posts-tag-${filterParams.tag}`);
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
    cacheTags.push(`posts-category-${filterParams.category}`);
  }

  // Add page-specific cache tag for granular invalidation
  cacheTags.push(`posts-page-${page}`);

  const url = `${baseUrl}/wp-json/wp/v2/posts${
    query ? `?${querystring.stringify(query)}` : ""
  }`;
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      Authorization: `Basic ${credentials}`,
    },
    next: {
      tags: cacheTags,
      revalidate: 3600, // 1 hour cache
    },
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  const data = await response.json();

  return {
    data,
    headers: {
      total: parseInt(response.headers.get("X-WP-Total") || "0", 10),
      totalPages: parseInt(response.headers.get("X-WP-TotalPages") || "0", 10),
    },
  };
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<PostWithACF[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
  }

  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", query);
}

export async function getPostById(id: number): Promise<PostWithACF> {
  return wordpressFetch<PostWithACF>(`/wp-json/wp/v2/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<PostWithACF> {
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", { slug }).then(
    (posts) => posts[0]
  );
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories");
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", { slug }).then(
    (categories) => categories[0]
  );
}

export async function getPostsByCategory(
  categoryId: number
): Promise<PostWithACF[]> {
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", {
    categories: categoryId,
  });
}

export async function getPostsByTag(tagId: number): Promise<PostWithACF[]> {
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", { tags: tagId });
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { post: postId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags");
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`/wp-json/wp/v2/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", { slug }).then(
    (tags) => tags[0]
  );
}

export async function getAllPages(): Promise<PageWithACF[]> {
  return wordpressFetch<PageWithACF[]>("/wp-json/wp/v2/pages");
}

export async function getPageById(id: number): Promise<PageWithACF> {
  return wordpressFetch<PageWithACF>(`/wp-json/wp/v2/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<PageWithACF> {
  return wordpressFetch<PageWithACF[]>("/wp-json/wp/v2/pages", { slug }).then(
    (pages) => pages[0]
  );
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users");
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", { slug }).then(
    (users) => users[0]
  );
}

export async function getPostsByAuthor(
  authorId: number
): Promise<PostWithACF[]> {
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", {
    author: authorId,
  });
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<PostWithACF[]> {
  const author = await getAuthorBySlug(authorSlug);
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", {
    author: author.id,
  });
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<PostWithACF[]> {
  const category = await getCategoryBySlug(categorySlug);
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", {
    categories: category.id,
  });
}

export async function getPostsByTagSlug(
  tagSlug: string
): Promise<PostWithACF[]> {
  const tag = await getTagBySlug(tagSlug);
  return wordpressFetch<PostWithACF[]>("/wp-json/wp/v2/posts", {
    tags: tag.id,
  });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

// Custom API Endpoint Functions

/**
 * Get comprehensive website settings including languages, menus, and site configuration
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  return wordpressFetch<WebsiteSettings>("/wp-json/wp/v2/website-settings");
}

/**
 * Get menu items by menu slug
 */
export async function getMenuItems(menuSlug: string): Promise<MenuItem[]> {
  return wordpressFetch<MenuItem[]>("/wp-json/wp/v2/menus", { slug: menuSlug });
}

/**
 * Find a post by its full path (e.g., "en/developers/faq")
 */
export async function findPostByPath(path: string): Promise<FindPostResponse> {
  return wordpressFetch<FindPostResponse>("/wp-json/wp/v2/find-post", { path });
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
}

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
}

// Function specifically for generateStaticParams - fetches ALL posts
export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const allSlugs: { slug: string }[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await wordpressFetchWithPagination<Post[]>(
      "/wp-json/wp/v2/posts",
      {
        per_page: 100,
        page,
        _fields: "slug", // Only fetch slug field for performance
      }
    );

    const posts = response.data;
    allSlugs.push(...posts.map((post) => ({ slug: post.slug })));

    hasMore = page < response.headers.totalPages;
    page++;
  }

  return allSlugs;
}

// Enhanced pagination functions for specific queries
export async function getPostsByCategoryPaginated(
  categoryId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<PostWithACF[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    categories: categoryId,
  };

  return wordpressFetchWithPagination<PostWithACF[]>(
    "/wp-json/wp/v2/posts",
    query
  );
}

export async function getPostsByTagPaginated(
  tagId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<PostWithACF[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    tags: tagId,
  };

  return wordpressFetchWithPagination<PostWithACF[]>(
    "/wp-json/wp/v2/posts",
    query
  );
}

export async function getPostsByAuthorPaginated(
  authorId: number,
  page: number = 1,
  perPage: number = 9
): Promise<WordPressResponse<PostWithACF[]>> {
  const query = {
    _embed: true,
    per_page: perPage,
    page,
    author: authorId,
  };

  return wordpressFetchWithPagination<PostWithACF[]>(
    "/wp-json/wp/v2/posts",
    query
  );
}

// Dictionary Translation Functions

/**
 * Get dictionary translations for a specific language
 * @param lang - Language code (e.g., 'en', 'fi'). If not provided, uses current language
 * @returns Promise<DictionaryResponse>
 */
export async function getDictionaryTranslations(
  lang?: string
): Promise<DictionaryResponse> {
  const query: Record<string, any> = {};

  if (lang) {
    query.lang = lang;
  }

  return wordpressFetch<DictionaryResponse>(
    "/wp-json/wp/v2/dictionary-translations",
    query
  );
}

/**
 * Get all dictionary translations for all languages
 * @returns Promise<DictionaryAllLanguagesResponse>
 */
export async function getAllDictionaryTranslations(): Promise<DictionaryAllLanguagesResponse> {
  return wordpressFetch<DictionaryAllLanguagesResponse>(
    "/wp-json/wp/v2/dictionary-translations/all"
  );
}

export { WordPressAPIError };
