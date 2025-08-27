<?php

// Register custom post types
require get_template_directory() . '/inc/post-types.php';

// Register custom taxonomies
require get_template_directory() . '/inc/taxonomies.php';

// Register custom blocks
require get_template_directory() . '/inc/blocks.php';

// Register custom fields
require get_template_directory() . '/inc/fields.php';

// Register custom options pages
require get_template_directory() . '/inc/options.php';

// Load dictionaries admin page
require get_template_directory() . '/inc/admin/dictionaries-page.php';

// Register menus
require get_template_directory() . '/inc/menus.php';

// Load custom REST API configurations
require get_template_directory() . '/inc/api.php';

// Load redirections
require get_template_directory() . '/inc/redirect.php';

// Load utilities and helpers
require get_template_directory() . '/inc/helpers.php';

add_theme_support('post-thumbnails');
add_theme_support('wp-block-styles');
