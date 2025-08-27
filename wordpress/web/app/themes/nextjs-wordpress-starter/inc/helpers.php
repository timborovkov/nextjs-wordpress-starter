<?php

/**
 * Helper function to get the REST base for a given post type.
 *
 * @param string $post_type The post type.
 * @return string The REST base, e.g. 'pages' for post type 'page'.
 */
function my_get_rest_base($post_type)
{
    $post_type_object = get_post_type_object($post_type);
    return (! empty($post_type_object->rest_base)) ? $post_type_object->rest_base : $post_type;
}
