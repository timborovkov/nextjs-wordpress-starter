<?php

/**
 * Enable Application Passwords for REST API authentication.
 */
add_filter('wp_is_application_passwords_available', '__return_true');

/**
 * Force REST API authentication for all requests.
 * 
 * This function will return a 401 error if the user is not logged in.
 */
function force_rest_api_authentication($result)
{
    // If there's already an error, just return it.
    if (!empty($result)) {
        return $result;
    }

    // If the user is not logged in (which includes valid Application Password authentication)
    if (!is_user_logged_in()) {
        return new WP_Error(
            'rest_not_authenticated',
            __('You must be authenticated to access the REST API.', 'text-domain'),
            array('status' => 401)
        );
    }

    return $result;
}

add_filter('rest_authentication_errors', 'force_rest_api_authentication', 300);
