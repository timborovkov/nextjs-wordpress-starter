# WordPress Backend

This directory contains the WordPress backend built with Bedrock, serving as a headless CMS via the REST API.

## What's Included

- **WordPress with Bedrock**: Modern WordPress development using the [Bedrock](https://roots.io/bedrock/) boilerplate
- **Composer-based**: Dependency management for WordPress core, plugins, and themes
- **Starter Theme**: Barebones theme optimized for headless CMS usage
- **Starter Plugins**: Required plugins for this project + personal nice-to-have plugins
- **REST API**: Full WordPress REST API with custom endpoints
- **Docker Support**: Complete containerization for development and deployment
- **Sample Content**: Pre-configured database and media files to get started quickly

## Links

- **Bedrock Documentation:** [https://roots.io/bedrock/docs/](https://roots.io/bedrock/docs/)
- **WordPress Documentation:** [https://developer.wordpress.org/](https://developer.wordpress.org/)

## Requirements

- PHP >= 8.1
- PHP extensions as [required by WordPress](https://make.wordpress.org/hosting/handbook/server-environment/#php-extensions)
- Composer
- MySQL version 8.0 or greater
- Nginx
- Docker and Docker Compose (for containerized setup)

For further details on deployment environment requirements, see the [WordPress hosting handbook](https://make.wordpress.org/hosting/handbook/server-environment/).

## Bedrock Overview

Bedrock is a WordPress boilerplate designed for developers who wish to manage their projects with Git and Composer. Much of the philosophy behind Bedrock is inspired by the [Twelve-Factor App](http://12factor.net/) methodology, including its [WordPress-specific adaptation](https://roots.io/twelve-factor-wordpress/).

- Improved directory structure
- Dependency management with [Composer](https://getcomposer.org)
- Simple WordPress configuration with environment-specific files
- Environment variables with [Dotenv](https://github.com/vlucas/phpdotenv)
- Autoloader for must-use plugins (allowing you to use regular plugins as mu-plugins)

## Quick Start

### 1. Set Up WordPress Backend

```bash
cd wordpress
composer install
cp .env.example .env
# Edit .env with your database credentials and site URL
```

### 2. Start Development

**Using Docker (Recommended):**

```bash
docker-compose up -d
```

**Manual Setup:**

```bash
# Configure your local web server to point to web/ directory
# Set up MySQL database
# Update .env file with correct credentials
```

## Local Development

For local development, it is recommended to use [LocalWP](https://localwp.com/).

To get started, follow this guide: [Bedrock with LocalWP](https://roots.io/bedrock/docs/bedrock-with-local/).

Instead of creating a new Bedrock site as per the guide, **clone this repository**, install the dependencies with `composer install`, and follow the steps provided.

If you are using macOS, please refer to [this guide](https://localwp.com/help-docs/getting-started/managing-local-sites-ssl-certificate-in-macos/) to enable SSL for your LocalWP site.

### Database and Content Setup

This starter includes sample data to help you get up and running quickly. In the `sample-data/` folder, you will find:

- **setup.sql**: A SQL dump containing the default database structure and content.
- **uploads.zip**: A zip archive with the default media uploads.

Follow these steps to configure your development environment:

#### Step 1: Import the SQL Dump

Use [WP-CLI](https://wp-cli.org/) to import the SQL dump. From your project's root directory, run:

```bash
wp db import sample-data/setup.sql
```

This command imports the default content, including pages, posts, and a default user account.

#### Step 2: Update the Uploads Folder

Replace the existing uploads folder with the contents of `sample-data/uploads.zip`:

1. Unzip the file.
2. Copy the extracted uploads folder to your Bedrock uploads directory (located at `web/app/uploads`).

#### Step 3: Update Deployment URLs

The SQL dump uses `your-site.local` as a placeholder domain. Update all instances of this URL to match your deployment environment. Use WP-CLI's search-replace command:

```bash
wp search-replace 'your-site.local' 'your-deployment-url.com' --skip-columns=guid
```

Replace `your-deployment-url.com` with your actual domain name.

#### Default User Account

The database includes a default user for initial access:

- **Email:** `nextjs-wordpress-starter@example.com`
- **Username:** `r3ED9L0E8M`
- **Password:** `no77kZ19FL52hepH5Pf7UvRKaP4`

**Important:** Change this password immediately after setup for security.

#### Additional Notes

- **Refresh Permalinks:** After updating the URLs, go to **Settings > Permalinks** in your WordPress dashboard and click **Save Changes**. This refreshes the permalink structure and ensures that all links work correctly.
- **SSL/HTTP:** Verify that your site's URL settings (in **Settings > General**) are correct for your environment (e.g., http vs. https).
- **Environment Variables:** Ensure your `.env` file is updated with the correct database credentials and site URL for your deployment.

## Deployment using Docker

This guide will help you deploy the WordPress starter project using Docker with the provided `Dockerfile` and `docker-compose.yaml` files. With our deployment configuration, your application code is automatically updated into the persistent **app** volume at container startup, while user data in **uploads** and **languages** remains intact.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Steps

#### Clone the Repository and Set Up the Environment

If you haven't already, clone the repository:

```bash
git clone <your-repo-url>
cd tims-wordpress-starter/wordpress
```

Bedrock relies on a `.env` file for configuration. Create (or update) the `.env` file in the project root according to the provided `.env.example` file.

#### Build the Docker Images

The `Dockerfile` provided in the repository defines a custom PHP environment. Build the Docker images using Docker Compose:

```bash
docker-compose build
```

#### Run the Containers

Start the containers in detached mode with:

```bash
docker-compose up -d
```

During container startup, an entrypoint script will automatically synchronise updated code from a dedicated location in the image (e.g. `/app_source`) into the persistent **app** volume at `/var/www/html`. The script uses `rsync` to update the code while excluding the **uploads** and **languages** directories, which are mounted as separate volumes. This ensures that your updated application code is deployed without affecting user-generated data.

Docker Compose will initialise three services:

- **php:** The PHP-FPM container.
- **web:** The Nginx container using the custom `nginx.conf` for configuration.
- **db:** The MySQL container with persistent data stored in a Docker volume.

Once the containers are running, open your web browser and navigate to [http://localhost:8081](http://localhost:8081) (or the appropriate domain/IP address if deployed on a remote server).

#### Managing the Deployment

**Stopping Containers:**

To stop the running containers, use:

```bash
docker-compose down
```

**Viewing Logs:**

To view logs for a particular service (for example, Nginx), use:

```bash
docker-compose logs web
```

**Updating the Application:**

If you make changes to the codebase, rebuild the Docker images and restart the containers:

```bash
docker-compose build
docker-compose up -d
```

Thanks to the entrypoint script, the **app** volume is automatically refreshed with the updated code while the **uploads** and **languages** volumes are preserved. There is no need to manually remove the **app** volume unless you encounter issues with the synchronisation.

## Plugin and WordPress Updates

Updating your WordPress version, or the version of any plugin, is best achieved by re-requiring the dependencies to install the latest versions or specific versions:

```bash
# Update everything
composer update

# Update WordPress core
composer require roots/wordpress -W

# Update plugins
composer require wpackagist-plugin/wordpress-seo
```

## REST API Authentication

The WordPress REST API requires authentication for all requests. To authenticate, create a user account in the WordPress dashboard and use the Basic Authentication method, with the user-specific Application Password.

Application passwords allow authentication via non-interactive systems, such as XML-RPC or the REST API, without providing your actual password. Application passwords can be easily revoked. They cannot be used for traditional logins to your website.

Using cURL:

```bash
curl --user "your_username:your_application_password" https://example.com/wp-json/wp/v2/posts
```

Using JavaScript:

```javascript
const username = "your_username";
const applicationPassword = "your_application_password";
const credentials = Buffer.from(`${username}:${applicationPassword}`).toString(
  "base64"
);

fetch("https://example.com/wp-json/wp/v2/posts", {
  method: "GET",
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## Project Structure

This repository utilises the Bedrock directory structure, with some custom modifications tailored for a headless CMS setup:

```
.
├── config/                         # Environment-specific configuration files
│   ├── environments/               # Production, development, staging configurations
│   ├── application.php             # Global configuration for WordPress
├── web/                            # Publicly accessible webroot
│   ├── app/                        # WordPress application files
│   │   ├── plugins/                # Plugins managed via Composer
│   │   ├── mu-plugins/             # Must-use plugins for custom functionality
│   │   └── themes/                 # Themes
│   │       └── cms-theme/          # Custom theme for the headless CMS
│   ├── wp/                         # WordPress core files
│   └── index.php                   # Entry point for WordPress
├── vendor/                         # Composer dependencies
├── .env.example                    # Example environment variables file
├── composer.json                   # Composer configuration file
├── composer.lock                   # Composer lock file
└── README.md                       # Project documentation
```

### Custom Theme: cms-theme

The heart of the headless CMS lies within our custom theme, `cms-theme`, located in the `web/app/themes/cms-theme` directory.

This theme is not only responsible for the presentation layer (which is minimal in a headless setup), but also serves as the central hub for much of our CMS logic. Here, we handle tasks such as registering custom post types, custom fields, taxonomies, and custom REST API endpoints that drive the CMS functionality.

```
cms-theme/
├── assets/
│   ├── css/                        # Stylesheets for the theme
│   ├── js/                         # JavaScript files
│   └── images/                     # Images and icons
├── inc/                            # Contains all custom PHP logic
│   ├── post-types.php              # Register custom post types
│   ├── fields.php                  # Define custom fields (e.g. with ACF)
│   ├── options.php                 # Define custom options pages (e.g. with ACF)
│   ├── taxonomies.php              # Register custom taxonomies
│   ├── menus.php                   # Register custom menus
│   ├── blocks.php                  # Register custom blocks (Gutenberg)
│   ├── api.php                     # Register custom REST API configurations
│   ├── api/                        # API routes, handlers, and other API logic
│   └── helpers.php                 # Utility functions and helpers
│   └── redirect.php                # Redirect handlers
├── blocks/                         # Block handlers to parse and render custom blocks (Gutenberg)
│   ├── block-preview.php           # Handler to render preview of custom blocks in the editor
│   ├── block-render.php            # Handler to render custom blocks on the WordPress frontend
│   ├── block-rest.php              # Handler to parse and serve custom blocks via the REST API
│   └── block-section-wrapper.php   # Handler for the custom section wrapper block
├── functions.php                   # Bootstraps the theme, loads files from inc/
├── index.php                       # Minimal theme template
├── header.php                      # Minimal theme header template
├── footer.php                      # Minimal theme footer template
├── style.css                       # Theme header and basic styles
└── screenshot.png                  # Theme preview image
```

## Customization

### Adding Custom Post Types

Edit `web/app/themes/cms-theme/inc/post-types.php` to add new content types:

```php
register_post_type('custom_post_type', [
    'labels' => [
        'name' => 'Custom Posts',
        'singular_name' => 'Custom Post'
    ],
    'public' => true,
    'show_in_rest' => true, // Enable REST API
    'supports' => ['title', 'editor', 'thumbnail']
]);
```

### Adding Custom Fields

Use Advanced Custom Fields (ACF) or create custom meta fields in `web/app/themes/cms-theme/inc/fields.php`.

### Customizing the Theme

Modify the theme files in `web/app/themes/cms-theme/` to match your specific requirements. The theme is designed to be minimal and focused on providing content via the REST API.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support:

- Check the documentation links above
- Review the WordPress and Bedrock documentation
- Open an issue in the repository

---

This starter template provides everything you need to build a modern headless CMS application with WordPress and Bedrock. Customize it to fit your specific project requirements and start building amazing content-driven applications!
