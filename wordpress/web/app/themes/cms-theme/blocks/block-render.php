<?php

/**
 * block-render.php
 * A universal block render for custom sections used when viewing a page on the Wordpress site.
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Retrieve ACF field "title" with fallbacks.
$acf_title = get_field('title');
if (empty($acf_title)) {
    $acf_title = get_field('text');
}
if (empty($acf_title)) {
    $acf_title = get_field('label');
}

// Retrieve ACF field "subtitle" and "description".
$acf_subtitle    = get_field('subtitle');
$acf_description = get_field('description');
?>
<div class="custom-block" id="<?php echo esc_attr($block['id']); ?>">
    <?php if (! empty($acf_title)) : ?>
        <h3><?php echo esc_html($acf_title); ?></h3>
    <?php endif; ?>

    <?php if (! empty($acf_subtitle)) : ?>
        <h4><?php echo esc_html($acf_subtitle); ?></h4>
    <?php endif; ?>

    <?php if (! empty($acf_description)) : ?>
        <p><?php echo esc_html($acf_description); ?></p>
    <?php endif; ?>
</div>