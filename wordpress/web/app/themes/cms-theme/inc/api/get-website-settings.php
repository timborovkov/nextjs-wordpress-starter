<?php

/**
 * Get comprehensive website settings for headless setup
 * Example: GET /wp/v2/website-settings
 */
function get_website_settings($data)
{
    $settings = array();

    // 1. Available languages (Polylang)
    $settings['languages'] = array();
    if (function_exists('pll_the_languages')) {
        $languages = pll_the_languages(array('raw' => 1));
        foreach ($languages as $lang_code => $lang_data) {
            $settings['languages'][] = array(
                'code' => $lang_code,
                'name' => $lang_data['name'],
                'flag' => $lang_data['flag'],
                'is_default' => $lang_data['current_lang'] === $lang_code,
                'is_current' => $lang_data['current_lang'] === $lang_code,
                'url' => $lang_data['url']
            );
        }
    } else {
        // Fallback to default language if Polylang is not active
        $settings['languages'][] = array(
            'code' => get_locale(),
            'name' => get_locale(),
            'flag' => '',
            'is_default' => true,
            'is_current' => true,
            'url' => home_url('/')
        );
    }

    // 2. Frontpage for each language
    $settings['frontpages'] = array();
    if (function_exists('pll_the_languages')) {
        $languages = pll_the_languages(array('raw' => 1));
        foreach ($languages as $lang_code => $lang_data) {
            $frontpage_id = get_option('page_on_front');
            if ($frontpage_id) {
                // Get the translated version if it exists
                if (function_exists('pll_get_post')) {
                    $translated_frontpage_id = pll_get_post($frontpage_id, $lang_code);
                    if ($translated_frontpage_id) {
                        $frontpage_id = $translated_frontpage_id;
                    }
                }

                $frontpage = get_post($frontpage_id);
                if ($frontpage) {
                    $settings['frontpages'][$lang_code] = array(
                        'ID' => $frontpage->ID,
                        'title' => $frontpage->post_title,
                        'slug' => $frontpage->post_name,
                        'url' => get_permalink($frontpage->ID),
                        'path' => $lang_code === pll_default_language() ? '/' : '/' . $lang_code . '/'
                    );
                }
            } else {
                // If no frontpage is set, use the default language home
                $settings['frontpages'][$lang_code] = array(
                    'ID' => 0,
                    'title' => get_bloginfo('name'),
                    'slug' => '',
                    'url' => $lang_data['url'],
                    'path' => $lang_code === pll_default_language() ? '/' : '/' . $lang_code . '/'
                );
            }
        }
    } else {
        // Fallback for non-Polylang setup
        $frontpage_id = get_option('page_on_front');
        if ($frontpage_id) {
            $frontpage = get_post($frontpage_id);
            $settings['frontpages'][get_locale()] = array(
                'ID' => $frontpage->ID,
                'title' => $frontpage->post_title,
                'slug' => $frontpage->post_name,
                'url' => get_permalink($frontpage->ID),
                'path' => '/'
            );
        } else {
            $settings['frontpages'][get_locale()] = array(
                'ID' => 0,
                'title' => get_bloginfo('name'),
                'slug' => '',
                'url' => home_url('/'),
                'path' => '/'
            );
        }
    }

    // 3. Posts page for each language
    $settings['posts_pages'] = array();
    if (function_exists('pll_the_languages')) {
        $languages = pll_the_languages(array('raw' => 1));
        foreach ($languages as $lang_code => $lang_data) {
            $posts_page_id = get_option('page_for_posts');
            if ($posts_page_id) {
                // Get the translated version if it exists
                if (function_exists('pll_get_post')) {
                    $translated_posts_page_id = pll_get_post($posts_page_id, $lang_code);
                    if ($translated_posts_page_id) {
                        $posts_page_id = $translated_posts_page_id;
                    }
                }

                $posts_page = get_post($posts_page_id);
                if ($posts_page) {
                    $settings['posts_pages'][$lang_code] = array(
                        'ID' => $posts_page->ID,
                        'title' => $posts_page->post_title,
                        'slug' => $posts_page->post_name,
                        'url' => get_permalink($posts_page->ID)
                    );
                }
            }
        }
    } else {
        // Fallback for non-Polylang setup
        $posts_page_id = get_option('page_for_posts');
        if ($posts_page_id) {
            $posts_page = get_post($posts_page_id);
            $settings['posts_pages'][get_locale()] = array(
                'ID' => $posts_page->ID,
                'title' => $posts_page->post_title,
                'slug' => $posts_page->post_name,
                'url' => get_permalink($posts_page->ID)
            );
        }
    }

    // 4. Menus for each language
    $settings['menus'] = array();
    $registered_menus = get_registered_nav_menus();

    if (function_exists('pll_the_languages')) {
        $languages = pll_the_languages(array('raw' => 1));
        foreach ($languages as $lang_code => $lang_data) {
            $settings['menus'][$lang_code] = array();

            foreach ($registered_menus as $location => $description) {
                $menu = wp_get_nav_menu_object(get_nav_menu_locations()[$location]);
                if ($menu) {
                    // Get the translated menu if it exists
                    if (function_exists('pll_get_term')) {
                        $translated_menu_id = pll_get_term($menu->term_id, $lang_code);
                        if ($translated_menu_id) {
                            $translated_menu = wp_get_nav_menu_object($translated_menu_id);
                            if ($translated_menu) {
                                $menu = $translated_menu;
                            }
                        }
                    }

                    $settings['menus'][$lang_code][$location] = array(
                        'ID' => $menu->term_id,
                        'name' => $menu->name,
                        'slug' => $menu->slug,
                        'description' => $menu->description,
                        'count' => $menu->count
                    );
                }
            }
        }
    } else {
        // Fallback for non-Polylang setup
        foreach ($registered_menus as $location => $description) {
            $menu = wp_get_nav_menu_object(get_nav_menu_locations()[$location]);
            if ($menu) {
                $settings['menus'][get_locale()][$location] = array(
                    'ID' => $menu->term_id,
                    'name' => $menu->name,
                    'slug' => $menu->slug,
                    'description' => $menu->description,
                    'count' => $menu->count
                );
            }
        }
    }

    // 5. Additional useful settings for headless setup
    $settings['site'] = array(
        'name' => get_bloginfo('name'),
        'description' => get_bloginfo('description'),
        'url' => home_url('/'),
        'admin_url' => admin_url(),
        'rest_url' => rest_url(),
        'timezone' => get_option('timezone_string'),
        'date_format' => get_option('date_format'),
        'time_format' => get_option('time_format'),
        'posts_per_page' => get_option('posts_per_page'),
        'default_category' => get_option('default_category'),
        'default_post_format' => get_option('default_post_format'),
        'show_on_front' => get_option('show_on_front'), // 'posts' or 'page'
        'page_on_front' => get_option('page_on_front'),
        'page_for_posts' => get_option('page_for_posts')
    );

    // 6. Post types and taxonomies
    $settings['post_types'] = array();
    $post_types = get_post_types(array('public' => true), 'objects');
    foreach ($post_types as $post_type => $post_type_obj) {
        $settings['post_types'][] = array(
            'name' => $post_type,
            'label' => $post_type_obj->label,
            'labels' => $post_type_obj->labels,
            'public' => $post_type_obj->public,
            'has_archive' => $post_type_obj->has_archive,
            'supports' => get_all_post_type_supports($post_type)
        );
    }

    $settings['taxonomies'] = array();
    $taxonomies = get_taxonomies(array('public' => true), 'objects');
    foreach ($taxonomies as $taxonomy => $taxonomy_obj) {
        $settings['taxonomies'][] = array(
            'name' => $taxonomy,
            'label' => $taxonomy_obj->label,
            'labels' => $taxonomy_obj->labels,
            'public' => $taxonomy_obj->public,
            'hierarchical' => $taxonomy_obj->hierarchical,
            'show_ui' => $taxonomy_obj->show_ui,
            'show_in_rest' => $taxonomy_obj->show_in_rest
        );
    }

    // 7. Theme information
    $theme = wp_get_theme();
    $settings['theme'] = array(
        'name' => $theme->get('Name'),
        'version' => $theme->get('Version'),
        'description' => $theme->get('Description'),
        'author' => $theme->get('Author'),
        'text_domain' => $theme->get('TextDomain')
    );

    return $settings;
}

add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/website-settings', array(
        'methods' => 'GET',
        'callback' => 'get_website_settings',
        'permission_callback' => '__return_true',
    ));
});
