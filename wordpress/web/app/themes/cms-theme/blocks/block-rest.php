<?php

/**
 * block-rest.php
 * A universal REST template for all custom ACF blocks.
 *
 * We wrap JSON of the block in <script> tag with type="application/json".
 * This way, it’s still valid HTML in the final rendered content,
 * and you can parse it on the front end by targeting the <script> tags.
 */

if (! defined('ABSPATH')) {
    exit;
}

// For an ACF block, get_fields() returns the fields for THIS block context.
$fields = get_fields() ?: [];

// Construct data to output (including block name, if desired).
$response_data = [
    'block_name' => isset($block['name']) ? $block['name'] : 'unknown',
    'fields'     => $fields,
];

// For safety, ensure JSON is escaped. We'll produce a script tag with JSON inside.
// You can add a custom CSS class or data attribute to identify these tags easily in your front end.
?>
<script type="application/json" class="acf-block-json" data-block-id="<?php echo esc_attr($block['id']); ?>">
    <?php echo wp_json_encode($response_data); ?>
</script>
<?php
