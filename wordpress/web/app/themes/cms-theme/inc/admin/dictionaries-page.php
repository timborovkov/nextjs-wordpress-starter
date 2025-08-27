<?php

/**
 * Custom Admin Page: Dictionaries
 * Allows admins to manage key-value translation pairs for each language
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class Dictionaries_Admin_Page
{
    private $option_name = 'cms_theme_dictionaries';
    private $nonce_action = 'dictionaries_nonce';
    private $nonce_field = 'dictionaries_nonce_field';

    public function __construct()
    {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'init_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_save_dictionaries', array($this, 'ajax_save_dictionaries'));
    }

    public function add_admin_menu()
    {
        add_options_page(
            'Dictionaries',
            'Dictionaries',
            'manage_options',
            'dictionaries',
            array($this, 'render_admin_page')
        );
    }

    public function init_settings()
    {
        // We'll handle saving manually via AJAX
    }

    public function enqueue_scripts($hook)
    {
        if ($hook !== 'settings_page_dictionaries') {
            return;
        }

        wp_enqueue_script('jquery');

        wp_enqueue_style(
            'dictionaries-admin',
            get_template_directory_uri() . '/assets/css/dictionaries-admin.css',
            array(),
            '1.0.0'
        );

        wp_enqueue_script(
            'dictionaries-admin',
            get_template_directory_uri() . '/assets/js/dictionaries-admin.js',
            array('jquery'),
            '1.0.0',
            true
        );

        wp_localize_script('dictionaries-admin', 'dictionariesAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('dictionaries_nonce'),
            'strings' => array(
                'confirmDelete' => 'Are you sure you want to delete this translation?',
                'keyRequired' => 'Key is required',
                'saving' => 'Saving...',
                'saved' => 'Saved successfully!',
                'error' => 'Error saving translations'
            )
        ));
    }

    public function render_admin_page()
    {
        $dictionaries = get_option($this->option_name, array());
        $languages = $this->get_available_languages();

        // Convert to flat structure for table display
        $flat_translations = $this->convert_to_flat_structure($dictionaries);

?>
        <div class="wrap">
            <h1>Dictionaries</h1>
            <p>Manage key-value translation pairs for each language. Each row represents one translation key with values for all languages.</p>

            <div class="dictionaries-container">
                <div class="dictionaries-table-wrapper">
                    <table class="dictionaries-table">
                        <thead>
                            <tr>
                                <th class="key-column">Translation Key</th>
                                <?php foreach ($languages as $lang_code => $lang_name): ?>
                                    <th class="lang-column" data-lang="<?php echo esc_attr($lang_code); ?>">
                                        <?php echo esc_html($lang_name); ?>
                                        <br><small>(<?php echo esc_html($lang_code); ?>)</small>
                                    </th>
                                <?php endforeach; ?>
                                <th class="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="dictionaries-tbody">
                            <?php if (!empty($flat_translations)): ?>
                                <?php foreach ($flat_translations as $index => $translation): ?>
                                    <tr class="dictionary-row" data-index="<?php echo $index; ?>">
                                        <td class="key-cell">
                                            <input type="text"
                                                class="translation-key"
                                                value="<?php echo esc_attr($translation['key']); ?>"
                                                placeholder="e.g., nav_home" />
                                        </td>
                                        <?php foreach ($languages as $lang_code => $lang_name): ?>
                                            <td class="lang-cell" data-lang="<?php echo esc_attr($lang_code); ?>">
                                                <input type="text"
                                                    class="translation-value"
                                                    value="<?php echo esc_attr($translation['values'][$lang_code] ?? ''); ?>"
                                                    placeholder="Translation in <?php echo esc_attr($lang_name); ?>" />
                                            </td>
                                        <?php endforeach; ?>
                                        <td class="actions-cell">
                                            <button type="button" class="button remove-row">Remove</button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <div class="dictionaries-actions">
                    <button type="button" class="button button-primary add-row">Add New Translation</button>
                    <button type="button" class="button button-secondary save-all">Save All Changes</button>
                </div>

                <div id="save-status"></div>
            </div>
        </div>

        <script type="text/template" id="dictionary-row-template">
            <tr class="dictionary-row" data-index="{{index}}">
                <td class="key-cell">
                    <input type="text" class="translation-key" placeholder="e.g., nav_home" />
                </td>
                <?php foreach ($languages as $lang_code => $lang_name): ?>
                    <td class="lang-cell" data-lang="<?php echo esc_attr($lang_code); ?>">
                        <input type="text" class="translation-value" placeholder="Translation in <?php echo esc_attr($lang_name); ?>" />
                    </td>
                <?php endforeach; ?>
                <td class="actions-cell">
                    <button type="button" class="button remove-row">Remove</button>
                </td>
            </tr>
        </script>
<?php
    }

    private function get_available_languages()
    {
        $languages = array();

        // Check if Polylang is active
        if (function_exists('pll_the_languages')) {
            $polylang_languages = pll_the_languages(array('raw' => 1));
            foreach ($polylang_languages as $lang_code => $lang_data) {
                $languages[$lang_code] = $lang_data['name'];
            }
        } else {
            // Fallback to default language
            $languages[get_locale()] = 'Default Language';
        }

        return $languages;
    }

    private function convert_to_flat_structure($dictionaries)
    {
        $flat = array();
        $languages = $this->get_available_languages();

        if (is_array($dictionaries)) {
            foreach ($dictionaries as $lang_code => $entries) {
                if (is_array($entries)) {
                    foreach ($entries as $entry) {
                        if (!empty($entry['key'])) {
                            $key = $entry['key'];

                            // Find existing entry or create new one
                            $found = false;
                            foreach ($flat as &$flat_entry) {
                                if ($flat_entry['key'] === $key) {
                                    $flat_entry['values'][$lang_code] = $entry['value'];
                                    $found = true;
                                    break;
                                }
                            }

                            if (!$found) {
                                $new_entry = array(
                                    'key' => $key,
                                    'values' => array()
                                );
                                $new_entry['values'][$lang_code] = $entry['value'];
                                $flat[] = $new_entry;
                            }
                        }
                    }
                }
            }
        }

        return $flat;
    }

    public function ajax_save_dictionaries()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'dictionaries_nonce')) {
            wp_die('Security check failed');
        }

        // Check permissions
        if (!current_user_can('manage_options')) {
            wp_die('Insufficient permissions');
        }

        $translations_data = $_POST['translations'];
        $sanitized = array();

        if (is_array($translations_data)) {
            foreach ($translations_data as $row) {
                $key = sanitize_text_field($row['key']);
                $values = $row['values'];

                if (!empty($key)) {
                    // Convert flat structure back to language-based structure
                    foreach ($values as $lang_code => $value) {
                        if (!empty($value)) {
                            $sanitized[$lang_code][] = array(
                                'key' => $key,
                                'value' => sanitize_textarea_field($value)
                            );
                        }
                    }
                }
            }
        }

        // Save to options
        $result = update_option($this->option_name, $sanitized);

        if ($result) {
            wp_send_json_success('Dictionaries saved successfully');
        } else {
            wp_send_json_error('Failed to save dictionaries');
        }
    }
}

// Initialize the admin page
new Dictionaries_Admin_Page();
