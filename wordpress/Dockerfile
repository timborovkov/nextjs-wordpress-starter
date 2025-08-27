FROM php:8.1-fpm

# Install system dependencies and required packages
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libicu-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    unzip \
    git \
    curl \
    rsync 

# Install PHP extensions required by WordPress
RUN docker-php-ext-install pdo_mysql mysqli zip opcache

# Install and configure GD extension with FreeType and JPEG support
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd

# Install additional PHP extensions
RUN docker-php-ext-install curl mbstring intl xml exif

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory to a source directory
WORKDIR /app_source

# Copy project files into /app_source
COPY . /app_source

# Run Composer in /app_source (where composer.json is located)
RUN composer install --prefer-dist --no-dev --no-scripts --no-progress

EXPOSE 9000

# Copy the entrypoint script into the image
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
