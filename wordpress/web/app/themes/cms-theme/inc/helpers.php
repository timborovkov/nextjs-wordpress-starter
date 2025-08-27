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

/**
 * Get a dictionary translation by key and language
 *
 * @param string $key The translation key
 * @param string $lang The language code (optional, defaults to current language)
 * @param string $default The default value if translation not found
 * @return string The translated value or default
 */
function get_dictionary_translation($key, $lang = null, $default = '')
{
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

    // Look for the translation
    if (isset($dictionaries[$lang]) && is_array($dictionaries[$lang])) {
        foreach ($dictionaries[$lang] as $entry) {
            if ($entry['key'] === $key && !empty($entry['value'])) {
                return $entry['value'];
            }
        }
    }

    // Return default if no translation found
    return $default;
}

/**
 * Get multiple dictionary translations by keys
 *
 * @param array $keys Array of translation keys
 * @param string $lang The language code (optional, defaults to current language)
 * @return array Array of key-value pairs
 */
function get_dictionary_translations_by_keys($keys, $lang = null)
{
    $translations = array();

    foreach ($keys as $key) {
        $translations[$key] = get_dictionary_translation($key, $lang, $key);
    }

    return $translations;
}

/**
 * Echo a dictionary translation
 *
 * @param string $key The translation key
 * @param string $lang The language code (optional, defaults to current language)
 * @param string $default The default value if translation not found
 */
function the_dictionary_translation($key, $lang = null, $default = '')
{
    echo get_dictionary_translation($key, $lang, $default);
}
