<?php

/**
 * block-section-wrapper.php
 *
 * A container block using ACF fields to control:
 * - width_option  (normal, wide, full)
 * - hide_on_mobile (bool)
 * - hide_on_desktop (bool)
 * - padding[top,right,bottom,left]
 * - margin[top,right,bottom,left]
 *
 * FRONT-END / EDITOR:
 *   - Renders a <div> with inline styles for margin/padding
 *   - Adds CSS classes for hide_on_mobile/desktop
 *   - Includes <InnerBlocks />
 *
 * REST REQUEST:
 *   - Renders a <div> with data-* attributes containing these values
 *   - Includes <InnerBlocks.Content />
 */

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/*-----------------------------------------------------------------------------
 * 1) FETCH ACF FIELDS
 *---------------------------------------------------------------------------*/
$section_width = get_field('section_width') ?: 'wide';
$hide_on_mobile = get_field('hide_on_mobile') ?? false;
$hide_on_desktop = get_field('hide_on_desktop') ?? false;
$text_color      = get_field('text_color')      ?: '';
$text_color_dark = get_field('text_color_dark') ?: '';

// "padding" is a group with subfields:
$padding = get_field('padding') ?: array();
$pad_top    = !empty($padding['top'])    ? $padding['top']    : '0';
$pad_right  = !empty($padding['right'])  ? $padding['right']  : '0';
$pad_bottom = !empty($padding['bottom']) ? $padding['bottom'] : '0';
$pad_left   = !empty($padding['left'])   ? $padding['left']   : '0';

// "margin" is a group with subfields:
$margin  = get_field('margin')  ?: array();
$mar_top    = !empty($margin['top'])    ? $margin['top']    : '0';
$mar_right  = !empty($margin['right'])  ? $margin['right']  : 'auto';
$mar_bottom = !empty($margin['bottom']) ? $margin['bottom'] : '0';
$mar_left   = !empty($margin['left'])   ? $margin['left']   : 'auto';

// "background" is a group with subfields:
$background     = get_field('background') ?: array();
$bg_color       = $background['color']        ?? '';
$bg_color_dark  = $background['color_dark']   ?? '';
$bg_image       = $background['image']        ?? '';
$bg_image_dark  = $background['image_dark']   ?? '';
$bg_size        = $background['size']         ?? '';
$bg_position    = $background['position']     ?? '';
$bg_repeat        = $background['repeat']         ?? '';

// The block's unique ID (useful for anchors)
$block_id = $block['id'];

/*-----------------------------------------------------------------------------
 * 2) DETECT IF WE'RE IN A REST REQUEST
 *---------------------------------------------------------------------------*/
$is_rest_request = (defined('REST_REQUEST') && REST_REQUEST);

/*-----------------------------------------------------------------------------
 * 3) FRONT-END / EDITOR PREVIEW
 *---------------------------------------------------------------------------*/
if (! $is_rest_request) {
    // Build a CSS style string for margin and padding
    $style = sprintf(
        'margin:%s %s %s %s; padding:%s %s %s %s;',
        $mar_top,
        $mar_right,
        $mar_bottom,
        $mar_left,
        $pad_top,
        $pad_right,
        $pad_bottom,
        $pad_left
    );

    // Handle user selected text color
    if ($text_color) {
        $style .= "color: {$text_color};";
    }

    // Build background styles (for the "light" mode).
    if ($bg_color) {
        $style .= "background-color: {$bg_color};";
    }
    if ($bg_image) {
        $style .= "background-image: url('{$bg_image}');";
    }
    if ($bg_size) {
        $style .= "background-size: {$bg_size};";
    }
    if ($bg_position) {
        $style .= "background-position: {$bg_position};";
    }
    if ($bg_repeat) {
        $style .= "background-repeat: {$bg_repeat};";
    }

    // Handle the selected width option
    switch ($section_width) {
        case 'normal':
            $style .= 'max-width:700px; margin-left:auto; margin-right:auto;';
            break;
        case 'full':
            $style .= 'width:100%;';
            break;
        case 'narrow':
            $style .= 'max-width:400px;';
            break;
        case 'content':
            $style .= 'width:100%;max-width:content; margin-left:auto; margin-right:auto;';
            break;
        case 'wide':
        default:
            $style .= 'max-width:900px; margin-left:auto; margin-right:auto;';
            break;
    }

    // Build CSS classes
    $classes = array('block-section-wrapper');
    if ($hide_on_mobile) {
        $classes[] = 'hide-on-mobile';
    }
    if ($hide_on_desktop) {
        $classes[] = 'hide-on-desktop';
    }

    // If user typed additional classes in the "Advanced" panel
    if (! empty($block['className'])) {
        $classes[] = $block['className'];
    }

    $class_attr = implode(' ', array_map('esc_attr', $classes));
?>
    <div id="<?php echo esc_attr($block_id); ?>"
        class="<?php echo $class_attr; ?>"
        style="<?php echo esc_attr($style); ?>">
        <!-- Nested blocks -->
        <InnerBlocks />
    </div>
<?php
    return;
}

/*-----------------------------------------------------------------------------
 * 4) REST REQUEST
 *---------------------------------------------------------------------------*/
/**
 * If we ARE in a REST request, we output minimal HTML plus data-* attributes
 * so you can parse them in your React app. <InnerBlocks.Content /> includes
 * the rendered HTML of child blocks.
 */
?>
<div
    class="block-section-wrapper"
    id="<?php echo esc_attr($block_id); ?>"

    data-section-width="<?php echo esc_attr($section_width); ?>"

    data-hide-mobile="<?php echo $hide_on_mobile ? 'true' : 'false'; ?>"
    data-hide-desktop="<?php echo $hide_on_desktop ? 'true' : 'false'; ?>"

    data-padding-top="<?php echo esc_attr($pad_top); ?>"
    data-padding-right="<?php echo esc_attr($pad_right); ?>"
    data-padding-bottom="<?php echo esc_attr($pad_bottom); ?>"
    data-padding-left="<?php echo esc_attr($pad_left); ?>"

    data-margin-top="<?php echo esc_attr($mar_top); ?>"
    data-margin-right="<?php echo esc_attr($mar_right); ?>"
    data-margin-bottom="<?php echo esc_attr($mar_bottom); ?>"
    data-margin-left="<?php echo esc_attr($mar_left); ?>"

    data-bg-color="<?php echo esc_attr($bg_color); ?>"
    data-bg-color-dark="<?php echo esc_attr($bg_color_dark); ?>"
    data-bg-image="<?php echo esc_attr($bg_image); ?>"
    data-bg-image-dark="<?php echo esc_attr($bg_image_dark); ?>"
    data-bg-size="<?php echo esc_attr($bg_size); ?>"
    data-bg-position="<?php echo esc_attr($bg_position); ?>"
    data-bg-repeat="<?php echo esc_attr($bg_repeat); ?>"

    data-text-color="<?php echo esc_attr($text_color); ?>"
    data-text-color-dark="<?php echo esc_attr($text_color_dark); ?>">
    <InnerBlocks.Content />
</div>