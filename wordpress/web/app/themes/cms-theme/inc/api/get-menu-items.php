<?php

/**
 * Get menu items by location
 * Example: GET /wp/v2/menus?slug=primary-menu-en
 */
function get_menu_items($data)
{
    $menu = wp_get_nav_menu_items($data['slug']);
    if (empty($menu)) {
        return new WP_Error('no_menu', 'Invalid menu location', array('status' => 404));
    }

    $menu_items = array();

    foreach ($menu as $menu_item) {
        $menu_items[] = array(
            'ID' => $menu_item->ID,
            'title' => $menu_item->title,
            'url' => $menu_item->url,
            'menu_order' => $menu_item->menu_order,
            'menu_item_parent' => $menu_item->menu_item_parent,
        );
    }

    return $menu_items;
}

add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/menus', array(
        'methods' => 'GET',
        'callback' => 'get_menu_items',
        'args' => array(
            'slug' => array(
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return is_string($param);
                }
            ),
        ),
    ));
});
