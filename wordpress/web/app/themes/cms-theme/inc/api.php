<?php

// Load custom REST API configurations
require get_template_directory() . '/inc/api/rest-api-auth.php';
require get_template_directory() . '/inc/api/acf-to-rest-api.php';

// Load custom REST API endpoints
require get_template_directory() . '/inc/api/get-menu-items.php';
require get_template_directory() . '/inc/api/get-post-by-full-path.php';
require get_template_directory() . '/inc/api/get-website-settings.php';
