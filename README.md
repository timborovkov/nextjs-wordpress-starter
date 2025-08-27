# Tim's Next.js WordPress Starter

A comprehensive starter template for building modern headless CMS applications using **WordPress (Bedrock)** and **Next.js 15**. This project provides everything you need to get started with a production-ready headless WordPress setup, including localization, modern tooling, and pre-configured components.

## 🚀 What This Project Is

This is a complete starter template that combines the power of WordPress as a headless CMS with a modern Next.js frontend. It's designed for developers who want to build content-driven applications without the overhead of traditional WordPress themes, while maintaining the familiar WordPress admin interface for content management.

## 🛠️ Tech Stack & What It Provides

### Backend (WordPress)

- **WordPress with Bedrock**: Modern WordPress development using the [Bedrock](https://roots.io/bedrock/) boilerplate
- **Composer-based**: Dependency management for WordPress core, plugins, and themes
- **Starter Theme**: Barebones theme to be used in this headless setup
- **Starter Plugins**: Required plugins for this project + my personal nice-to-have plugins for WordPress
- **REST API**: Full WordPress REST API with custom endpoints
- **Docker Support**: Complete containerization for development and deployment
- **Sample Content**: Pre-configured database and media files to get started quickly

### Frontend (Next.js)

- **Next.js 15**: Latest version with App Router for optimal performance
- **React 18**: Modern React with concurrent features
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Beautiful, accessible component library built on Radix UI
- **Responsive Design**: Mobile-first approach with modern UI patterns

### Key Features

- **Type-safe WordPress integration** with comprehensive TypeScript definitions
- **Server-side rendering** for optimal SEO and performance
- **Dynamic sitemap generation** for search engine optimization
- **Open Graph image generation** for social media sharing
- **Intelligent caching system** with Next.js 15 cache tags
- **Search and filtering** capabilities for content discovery
- **Dark/light mode** support with theme persistence
- **WordPress revalidation plugin** for automatic content updates

## 🏗️ Built on Next-WP

This project is built on top of the excellent [next-wp](https://github.com/9d8dev/next-wp) starter by [Bridger Tower](https://twitter.com/bridgertower) and [Cameron Youngblood](https://twitter.com/youngbloodcyb) at [9d8](https://9d8.dev). Their starter provides:

- Comprehensive WordPress REST API integration
- Efficient pagination and caching systems
- Pre-built components for posts, categories, tags, and authors
- WordPress revalidation plugin for automatic content updates
- Production-ready configuration and deployment setup

We've extended their excellent foundation with additional features and modern tooling to create an even more comprehensive starting point.

## ✨ What We've Added

### 🌍 Localization with Polylang

- **Polylang integration** for multi-language content management
- **Language-specific routing** in Next.js
- **Localized content fetching** from WordPress
- **SEO-friendly language switching** with proper hreflang tags

### 🎨 Tailwind CSS v4

- **Latest Tailwind CSS v4** with improved performance
- **CSS-in-JS approach** for better developer experience
- **Enhanced color system** and design tokens
- **Optimized build process** for production

### 🚀 Enhanced WordPress Setup

- **Custom post types** and taxonomies pre-configured
- **Advanced Custom Fields (ACF)** integration examples
- **Custom REST API endpoints** for extended functionality
- **Performance optimizations** and caching strategies

### ⚡ Next.js Improvements

- **Enhanced TypeScript configuration** for better type safety
- **Optimized build configuration** for production deployment
- **Additional utility functions** for common development tasks
- **Improved error handling** and logging

## 🎯 Why This Starter Exists

I've gone through the setup process of creating headless WordPress applications too many times to count. Each time, I found myself:

- Setting up Bedrock from scratch
- Configuring WordPress REST API endpoints
- Building the same basic components (posts, categories, search)
- Setting up caching and revalidation systems
- Implementing localization patterns
- Configuring modern build tools

This starter eliminates that repetitive setup and provides a solid foundation that you can build upon immediately. It's the starting point I wish I had when I began building headless WordPress applications.

## 📁 Project Structure

```
├── wordpress/           # WordPress backend with Bedrock
│   ├── web/app/        # WordPress application files
│   ├── config/         # Environment-specific configuration
│   ├── composer.json   # PHP dependencies
│   └── docker-compose.yaml
├── nextjs/             # Next.js frontend application
│   ├── app/           # App Router pages and API routes
│   ├── components/    # Reusable React components
│   ├── lib/          # WordPress integration and utilities
│   └── package.json  # Node.js dependencies
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- PHP >= 8.1
- Node.js 18+
- Docker and Docker Compose
- Composer

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd tims-wordpress-starter
```

### 2. Start WordPress Backend

```bash
cd wordpress
composer install
cp .env.example .env
# Edit .env with your configuration
docker-compose up -d
```

### 3. Start Next.js Frontend

```bash
cd ../nextjs
pnpm install
pnpm dev
```

### 4. Access Your Application

- **WordPress Admin**: http://localhost:8081/wp-admin
- **Next.js Frontend**: http://localhost:3000

## 📚 Documentation

- **[WordPress Backend](./wordpress/README.md)**: Complete setup and configuration guide
- **[Next.js Frontend](./nextjs/README.md)**: Frontend development and API integration
- **[CLAUDE.md](./nextjs/CLAUDE.md)**: AI assistant guidelines for development

## 🔧 Customization

This starter is designed to be easily customizable:

- **Add custom post types** in `wordpress/web/app/themes/cms-theme/inc/post-types.php`
- **Extend REST API** with custom endpoints in `wordpress/web/app/themes/cms-theme/inc/api/`
- **Modify frontend components** in `nextjs/components/`
- **Add new pages** in `nextjs/app/`
- **Configure localization** in WordPress admin under Languages > Settings

## 🤝 Contributing

Contributions are welcome! This starter is designed to be a community resource for developers building headless WordPress applications.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **9d8 Team**: For the excellent [next-wp](https://github.com/9d8dev/next-wp) foundation
- **Roots Team**: For the [Bedrock](https://roots.io/bedrock/) WordPress boilerplate
- **Vercel**: For Next.js and deployment platform
- **WordPress Community**: For the robust CMS platform
