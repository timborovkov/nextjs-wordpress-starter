<?php

/**
 * Callback function to render a specific block
 */
function block_render_callback($block, $content = '', $is_preview = false, $post_id = 0)
{
    // If it’s a preview in the block editor:
    if ($is_preview) {
        // Load a specific “editor preview” template, or just echo a preview markup
        include get_template_directory() . '/blocks/block-preview.php';
        return;
    }

    // If it’s a REST request, you can detect that:
    if (defined('REST_REQUEST') && REST_REQUEST) {
        // Possibly load a separate minimal template, or skip output
        include get_template_directory() . '/blocks/block-rest.php';
        return;
    }

    // Otherwise (front-end render):
    include get_template_directory() . '/blocks/block-render.php';
}

/**
 * Initialise custom ACF blocks.
 */
function register_acf_blocks()
{
    // Ensure ACF is active.
    if (function_exists('acf_register_block_type')) {

        /**
         * Register custom headless content blocks.
         */

        // Define an array of blocks to register.
        $blocks = array(
            'articles-section' => array(
                'title'       => __('Articles Section', 'text-domain'),
                'description' => __('A custom block for displaying articles.', 'text-domain'),
                'icon'        => 'admin-post',
                'keywords'    => array('articles', 'section'),
            ),
            'careers-section' => array(
                'title'       => __('Careers Section', 'text-domain'),
                'description' => __('A custom block for displaying career opportunities.', 'text-domain'),
                'icon'        => 'admin-users',
                'keywords'    => array('careers', 'jobs', 'section'),
            ),
            'contact-section' => array(
                'title'       => __('Contact Section', 'text-domain'),
                'description' => __('A custom block for displaying contact information.', 'text-domain'),
                'icon'        => 'email',
                'keywords'    => array('contact', 'section'),
            ),
            'content-section' => array(
                'title'       => __('Content Section', 'text-domain'),
                'description' => __('A custom block for displaying content.', 'text-domain'),
                'icon'        => 'editor-textcolor',
                'keywords'    => array('content', 'section'),
            ),
            'cta-dark-section' => array(
                'title'       => __('CTA Dark Section', 'text-domain'),
                'description' => __('A custom block for a dark call-to-action section.', 'text-domain'),
                'icon'        => 'megaphone',
                'keywords'    => array('cta', 'dark', 'section'),
            ),
            'cta-section' => array(
                'title'       => __('CTA Section', 'text-domain'),
                'description' => __('A custom block for a call-to-action section.', 'text-domain'),
                'icon'        => 'megaphone',
                'keywords'    => array('cta', 'section'),
            ),
            'faq-section' => array(
                'title'       => __('FAQ Section', 'text-domain'),
                'description' => __('A custom block for frequently asked questions.', 'text-domain'),
                'icon'        => 'editor-help',
                'keywords'    => array('faq', 'questions', 'section'),
            ),
            'features-section' => array(
                'title'       => __('Features Section', 'text-domain'),
                'description' => __('A custom block for displaying features.', 'text-domain'),
                'icon'        => 'star-filled',
                'keywords'    => array('features', 'section'),
            ),
            'hero-section' => array(
                'title'       => __('Hero Section', 'text-domain'),
                'description' => __('A custom block for the hero section.', 'text-domain'),
                'icon'        => 'cover-image',
                'keywords'    => array('hero', 'section'),
            ),
            'logo-cloud-section' => array(
                'title'       => __('Logo Cloud Section', 'text-domain'),
                'description' => __('A custom block for displaying a logo cloud.', 'text-domain'),
                'icon'        => 'format-image',
                'keywords'    => array('logos', 'cloud', 'section'),
            ),
            'newsletter-section' => array(
                'title'       => __('Newsletter Section', 'text-domain'),
                'description' => __('A custom block for newsletter signup.', 'text-domain'),
                'icon'        => 'email',
                'keywords'    => array('newsletter', 'signup', 'section'),
            ),
            'numbers-section' => array(
                'title'       => __('Numbers Section', 'text-domain'),
                'description' => __('A custom block for displaying numbers or statistics.', 'text-domain'),
                'icon'        => 'chart-bar',
                'keywords'    => array('numbers', 'stats', 'section'),
            ),
            'price-section' => array(
                'title'       => __('Price Section', 'text-domain'),
                'description' => __('A custom block for pricing information.', 'text-domain'),
                'icon'        => 'money-alt',
                'keywords'    => array('price', 'pricing', 'section'),
            ),
            'team-section' => array(
                'title'       => __('Team Section', 'text-domain'),
                'description' => __('A custom block for displaying team members.', 'text-domain'),
                'icon'        => 'groups',
                'keywords'    => array('team', 'members', 'section'),
            ),
            'testimonial-section' => array(
                'title'       => __('Testimonial Section', 'text-domain'),
                'description' => __('A custom block for testimonials.', 'text-domain'),
                'icon'        => 'testimonial',
                'keywords'    => array('testimonial', 'reviews', 'section'),
            ),
        );

        // Loop through each block and register it.
        foreach ($blocks as $slug => $block) {
            acf_register_block_type(array(
                'name'              => $slug,
                'title'             => $block['title'],
                'description'       => $block['description'],
                'category'          => 'custom-section-blocks',
                'icon'              => $block['icon'],
                'keywords'          => $block['keywords'],
                'render_callback' => 'block_render_callback',
            ));
        }

        /**
         * Register other custom blocks.
         */
        acf_register_block_type(array(
            'name'            => 'section-wrapper',
            'title'           => __('Section Wrapper', 'text-domain'),
            'description'     => __('A container block to wrap that allows nesting and size options.', 'text-domain'),
            'render_template' => get_template_directory() . '/blocks/block-section-wrapper.php',
            'category'        => 'layout',
            'icon'            => 'feedback',
            'keywords'        => array('container', 'layout'),
            'supports'        => array(
                'align'  => false,
                'jsx'    => true,
                'anchor' => true,
            ),
        ));
    }
}
add_action('acf/init', 'register_acf_blocks');
