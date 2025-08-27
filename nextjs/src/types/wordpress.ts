// Common types that are reused across multiple entities
interface WPEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  link: string;
  guid: {
    rendered: string;
  };
}

interface RenderedContent {
  rendered: string;
  protected: boolean;
}

interface RenderedTitle {
  rendered: string;
}

// Media types
interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
}

export interface FeaturedMedia extends WPEntity {
  title: RenderedTitle;
  author: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: MediaDetails;
  source_url: string;
}

// Content types
export interface Post extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  sticky: boolean;
  template: string;
  format:
    | "standard"
    | "aside"
    | "chat"
    | "gallery"
    | "link"
    | "image"
    | "quote"
    | "status"
    | "video"
    | "audio";
  categories: number[];
  tags: number[];
  meta: Record<string, unknown>;
}

export interface Page extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  excerpt: RenderedContent;
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: "open" | "closed";
  ping_status: "open" | "closed";
  template: string;
  meta: Record<string, unknown>;
}

// Taxonomy types
export interface Taxonomy {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  meta: Record<string, unknown>;
}

export interface Category extends Taxonomy {
  taxonomy: "category";
  parent: number;
}

export interface Tag extends Taxonomy {
  taxonomy: "post_tag";
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
  meta: Record<string, unknown>;
}

// Block types
interface BlockSupports {
  align?: boolean | string[];
  anchor?: boolean;
  className?: boolean;
  color?: {
    background?: boolean;
    gradients?: boolean;
    text?: boolean;
  };
  spacing?: {
    margin?: boolean;
    padding?: boolean;
  };
  typography?: {
    fontSize?: boolean;
    lineHeight?: boolean;
  };
  [key: string]: unknown;
}

interface BlockStyle {
  name: string;
  label: string;
  isDefault: boolean;
}

export interface BlockType {
  api_version: number;
  title: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  keywords: string[];
  parent: string[];
  supports: BlockSupports;
  styles: BlockStyle[];
  textdomain: string;
  example: Record<string, unknown>;
  attributes: Record<string, unknown>;
  provides_context: Record<string, string>;
  uses_context: string[];
  editor_script: string;
  script: string;
  editor_style: string;
  style: string;
}

export interface EditorBlock {
  id: string;
  name: string;
  attributes: Record<string, unknown>;
  innerBlocks: EditorBlock[];
  innerHTML: string;
  innerContent: string[];
}

export interface TemplatePart {
  id: string;
  slug: string;
  theme: string;
  type: string;
  source: string;
  origin: string;
  content: string | EditorBlock[];
  title: {
    raw: string;
    rendered: string;
  };
  description: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  wp_id: number;
  has_theme_file: boolean;
  author: number;
  area: string;
}

export interface SearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
  _links: {
    self: Array<{
      embeddable: boolean;
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
  };
}

// Component Props Types
export interface FilterBarProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: Author["id"];
  selectedTag?: Tag["id"];
  selectedCategory?: Category["id"];
  onAuthorChange?: (authorId: Author["id"] | undefined) => void;
  onTagChange?: (tagId: Tag["id"] | undefined) => void;
  onCategoryChange?: (categoryId: Category["id"] | undefined) => void;
}

// Custom API Endpoint Types

// Website Settings Types
export interface Language {
  code: string;
  name: string;
  flag: string;
  is_default: boolean;
  is_current: boolean;
  url: string;
}

export interface Frontpage {
  ID: number;
  title: string;
  slug: string;
  url: string;
  path: string;
}

export interface PostsPage {
  ID: number;
  title: string;
  slug: string;
  url: string;
}

export interface Menu {
  ID: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface SiteSettings {
  name: string;
  description: string;
  url: string;
  admin_url: string;
  rest_url: string;
  timezone: string;
  date_format: string;
  time_format: string;
  posts_per_page: number;
  default_category: number;
  default_post_format: string;
  show_on_front: string;
  page_on_front: number;
  page_for_posts: number;
}

export interface PostType {
  name: string;
  label: string;
  labels: Record<string, string>;
  public: boolean;
  has_archive: boolean;
  supports: Record<string, boolean>;
}

export interface Taxonomy {
  name: string;
  label: string;
  labels: Record<string, string>;
  public: boolean;
  hierarchical: boolean;
  show_ui: boolean;
  show_in_rest: boolean;
}

export interface ThemeInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  text_domain: string;
}

export interface WebsiteSettings {
  languages: Language[];
  frontpages: Record<string, Frontpage>;
  posts_pages: Record<string, PostsPage>;
  menus: Record<string, Record<string, Menu>>;
  site: SiteSettings;
  post_types: PostType[];
  taxonomies: Taxonomy[];
  theme: ThemeInfo;
}

// Menu Items Types
export interface MenuItem {
  ID: number;
  title: string;
  url: string;
  menu_order: number;
  menu_item_parent: number;
}

// ACF Fields Type
export interface ACFFields {
  [key: string]: any;
}

// Extended Post and Page types with ACF fields
export interface PostWithACF extends Post {
  acf?: ACFFields;
}

export interface PageWithACF extends Page {
  acf?: ACFFields;
}

// Find Post by Path Response
export interface FindPostResponse extends Post {
  // This will include all standard post fields plus any additional fields
  // The actual structure depends on the post type and ACF fields
}

// Dictionary Translation Types
export interface DictionaryLanguage {
  code: string;
  name: string;
  flag: string;
}

export interface DictionaryTranslation {
  [key: string]: string;
}

export interface DictionaryLanguageData {
  language: DictionaryLanguage;
  translations: DictionaryTranslation;
  count: number;
}

export interface DictionaryResponse {
  language: string;
  translations: DictionaryTranslation;
  count: number;
  timestamp: number;
  cache_key: string;
}

export interface DictionaryAllLanguagesResponse {
  languages: Record<string, DictionaryLanguage>;
  translations: Record<string, DictionaryLanguageData>;
  total_count: number;
  timestamp: number;
}
