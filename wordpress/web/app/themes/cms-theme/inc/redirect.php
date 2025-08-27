<?php

use function Env\env;

add_action('template_redirect', 'redirect_non_signed_in_users');
function redirect_non_signed_in_users()
{
    // Only redirect front-end requests (skip admin pages and AJAX calls).
    if (is_admin() || (defined('DOING_AJAX') && DOING_AJAX)) {
        return;
    }

    // If the user is logged in, do nothing.
    if (is_user_logged_in()) {
        return;
    }

    // Get the website's frontend URL.
    $frontend_url = env('WEBSITE_FRONTEND_URL') ?: 'https://nextjs-wordpress-starter.dev';

    // If already on the target domain, no need to redirect.
    if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === $frontend_url) {
        return;
    }

    // Get the current URI (path and query string, if any).
    $current_uri = $_SERVER['REQUEST_URI'];

    // Build the redirect URL to the corresponding path on $frontend_url.
    $redirect_url = $frontend_url . $current_uri;

    // Redirect with a 302 (temporary) redirection.
    wp_redirect($redirect_url);
    exit;
}
