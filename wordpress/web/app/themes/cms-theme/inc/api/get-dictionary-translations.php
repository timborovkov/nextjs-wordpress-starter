<?php

/**
 * Get dictionary translations by language
 * Example: GET /wp/v2/dictionary-translations?lang=en
 */
function get_dictionary_translations($request)
{
    // Get the language parameter
    $lang = $request->get_param('lang');

    // If no language specified, try to detect from current context
    if (empty($lang)) {
        if (function_exists('pll_current_language')) {
            $lang = pll_current_language();
        } else {
            $lang = get_locale();
        }
    }

    // Get dictionaries from options
    $dictionaries = get_option('cms_theme_dictionaries', array());

    // Get translations for the specified language
    $translations = array();
    if (isset($dictionaries[$lang]) && is_array($dictionaries[$lang])) {
        foreach ($dictionaries[$lang] as $entry) {
            if (!empty($entry['key']) && !empty($entry['value'])) {
                $translations[$entry['key']] = $entry['value'];
            }
        }
    }

    // Return the translations
    return array(
        'language' => $lang,
        'translations' => $translations,
        'count' => count($translations),
        'timestamp' => current_time('timestamp'),
        'cache_key' => 'dictionary_' . $lang . '_' . md5(serialize($translations))
    );
}

/**
 * Get all dictionary translations for all languages
 * Example: GET /wp/v2/dictionary-translations/all
 */
function get_all_dictionary_translations($request)
{
    // Get dictionaries from options
    $dictionaries = get_option('cms_theme_dictionaries', array());

    // Get available languages
    $languages = array();
    if (function_exists('pll_the_languages')) {
        $polylang_languages = pll_the_languages(array('raw' => 1));
        foreach ($polylang_languages as $lang_code => $lang_data) {
            $languages[$lang_code] = array(
                'code' => $lang_code,
                'name' => $lang_data['name'],
                'flag' => $lang_data['flag']
            );
        }
    } else {
        // Fallback to default language
        $languages[get_locale()] = array(
            'code' => get_locale(),
            'name' => 'Default Language',
            'flag' => ''
        );
    }

    // Build response with all languages
    $response = array(
        'languages' => $languages,
        'translations' => array(),
        'total_count' => 0,
        'timestamp' => current_time('timestamp')
    );

    foreach ($languages as $lang_code => $lang_info) {
        $lang_translations = array();
        if (isset($dictionaries[$lang_code]) && is_array($dictionaries[$lang_code])) {
            foreach ($dictionaries[$lang_code] as $entry) {
                if (!empty($entry['key']) && !empty($entry['value'])) {
                    $lang_translations[$entry['key']] = $entry['value'];
                }
            }
        }

        $response['translations'][$lang_code] = array(
            'language' => $lang_info,
            'translations' => $lang_translations,
            'count' => count($lang_translations)
        );

        $response['total_count'] += count($lang_translations);
    }

    return $response;
}

/**
 * Get dictionary translations by group/category
 * Example: GET /wp/v2/dictionary-translations/group?group=navigation
 */
function get_dictionary_translations_by_group($request)
{
    $group = $request->get_param('group');
    $lang = $request->get_param('lang');

    if (empty($group)) {
        return new WP_Error('missing_group', 'Group parameter is required', array('status' => 400));
    }

    // If no language specified, try to detect from current context
    if (empty($lang)) {
        if (function_exists('pll_current_language')) {
            $lang = pll_current_language();
        } else {
            $lang = get_locale();
        }
    }

    // Get dictionaries from options
    $dictionaries = get_option('cms_theme_dictionaries', array());

    // Filter translations by group (assuming keys follow a pattern like "group_keyname")
    $group_translations = array();
    if (isset($dictionaries[$lang]) && is_array($dictionaries[$lang])) {
        foreach ($dictionaries[$lang] as $entry) {
            if (!empty($entry['key']) && !empty($entry['value'])) {
                // Check if key starts with the group prefix
                if (strpos($entry['key'], $group . '_') === 0) {
                    $key_name = str_replace($group . '_', '', $entry['key']);
                    $group_translations[$key_name] = $entry['value'];
                }
            }
        }
    }

    return array(
        'group' => $group,
        'language' => $lang,
        'translations' => $group_translations,
        'count' => count($group_translations),
        'timestamp' => current_time('timestamp')
    );
}

add_action('rest_api_init', function () {
    // Main endpoint for single language
    register_rest_route('wp/v2', '/dictionary-translations', array(
        'methods' => 'GET',
        'callback' => 'get_dictionary_translations',
        'permission_callback' => '__return_true',
        'args' => array(
            'lang' => array(
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return is_string($param) && !empty(trim($param));
                },
                'sanitize_callback' => 'sanitize_text_field'
            ),
        ),
    ));

    // Endpoint for all languages
    register_rest_route('wp/v2', '/dictionary-translations/all', array(
        'methods' => 'GET',
        'callback' => 'get_all_dictionary_translations',
        'permission_callback' => '__return_true',
    ));

    // Endpoint for group-based translations
    register_rest_route('wp/v2', '/dictionary-translations/group', array(
        'methods' => 'GET',
        'callback' => 'get_dictionary_translations_by_group',
        'permission_callback' => '__return_true',
        'args' => array(
            'group' => array(
                'required' => true,
                'validate_callback' => function ($param, $request, $key) {
                    return is_string($param) && !empty(trim($param));
                },
                'sanitize_callback' => 'sanitize_text_field'
            ),
            'lang' => array(
                'required' => false,
                'validate_callback' => function ($param, $request, $key) {
                    return is_string($param) && !empty(trim($param));
                },
                'sanitize_callback' => 'sanitize_text_field'
            ),
        ),
    ));
});
