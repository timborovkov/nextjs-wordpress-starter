<?php

/**
 * Register ACF fields for all public post types in the REST API.
 */
add_action('rest_api_init', function () {
    // Check if ACF is active.
    if (! function_exists('get_fields')) {
        return;
    }

    // Get all public post types.
    $post_types = get_post_types(array('public' => true), 'names');

    foreach ($post_types as $post_type) {
        register_rest_field($post_type, 'acf', array(
            'get_callback'    => function ($object, $field_name, $request) {
                $fields = get_fields($object['id']);
                // Ensure the response is an array.
                return is_array($fields) ? $fields : array();
            },
            'update_callback' => null,
            'schema'          => null,
        ));
    }
});
