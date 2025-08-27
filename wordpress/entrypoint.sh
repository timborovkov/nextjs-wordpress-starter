#!/bin/bash
set -e

echo "Synchronising updated code from /app_source to /var/www/html"

# Rsync the code from /app_source to /var/www/html while excluding uploads and languages
rsync -a --delete \
  --exclude 'web/app/uploads' \
  --exclude 'web/app/languages' \
  /app_source/ /var/www/html/

echo "Fixing permissions on /var/www/html/web/app"
chown -R www-data:www-data /var/www/html/web/app
chmod -R 755 /var/www/html/web/app

# Execute the main container process (CMD)
exec "$@"
