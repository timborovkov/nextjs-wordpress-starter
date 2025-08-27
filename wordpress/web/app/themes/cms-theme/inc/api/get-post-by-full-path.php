<?php

/**
 * Get WP post by full path
 * Example: GET /wp/v2/find-post?path=en/developers/faq&embed_
 */
function get_post_by_full_path(WP_REST_Request $request)
{
    // Retrieve the full path parameter, e.g. "en/developers/faq" or "en" for the frontpage.
    $full_path = $request->get_param('path');
    if (empty($full_path)) {
        return new WP_Error('missing_params', __('Missing path parameter', 'text-domain'), array('status' => 400));
    }

    // Trim any leading/trailing slashes.
    $full_path = trim($full_path, '/');

    // Split the path into segments.
    $segments = explode('/', $full_path);

    // At minimum, we expect a language code.
    if (empty($segments[0])) {
        return new WP_Error('invalid_path', __('Path must include a language code', 'text-domain'), array('status' => 400));
    }

    // The first segment is the language code (e.g. "en").
    $lang = array_shift($segments);

    // The remaining segments form the post's path.
    $post_path = implode('/', $segments);

    // Construct the full URL.
    if (empty($post_path) && ! empty($lang)) {
        // Frontpage URL for the given language.
        $constructed_url = home_url('/' . $lang . '/');
    } else if (empty($post_path) && empty($lang)) {
        // Frontpage URL for the default language.
        $constructed_url = home_url('/');
    } else {
        // Post URL for the given language.
        $constructed_url = home_url('/' . $lang . '/' . $post_path);
    }

    // Use WordPress's built-in function to get the post ID from the URL.
    $post_id = url_to_postid($constructed_url);

    if (! $post_id) {
        return new WP_Error('no_post', __('No post found for the provided path', 'text-domain'), array('status' => 404));
    }

    // Retrieve the post object.
    $post = get_post($post_id);
    if (! $post) {
        return new WP_Error('no_post', __('No post found', 'text-domain'), array('status' => 404));
    }

    // Use the appropriate REST controller to prepare the response in the same format as core endpoints.
    $controller = new WP_REST_Posts_Controller($post->post_type);
    $response   = $controller->prepare_item_for_response($post, $request);
    return rest_ensure_response($response);
}

add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/find-post', array(
        'methods'  => 'GET',
        'callback' => 'get_post_by_full_path',
    ));
});
