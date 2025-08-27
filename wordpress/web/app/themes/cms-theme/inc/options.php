<?php

add_action('acf/init', function () {
    acf_add_options_page(array(
        'page_title' => 'Site Settings',
        'menu_slug' => 'site-settings',
        'position' => '',
        'redirect' => false,
    ));
});
