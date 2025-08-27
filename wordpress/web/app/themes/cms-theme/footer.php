<footer>
    <div class="container">
        <p>
            &copy; <?php echo date("Y"); ?> <a href="<?php echo home_url(); ?>"><?php bloginfo('name'); ?></a> | All Rights Reserved</a>
        </p>
        <nav class="footer-menu">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'footer-menu',
                'container' => false,
                'menu_class' => 'footer-nav',
            ));
            ?>
            <?php
            if (function_exists('pll_the_languages')) {
                pll_the_languages(array(
                    'dropdown' => 0,
                    'show_flags' => 1,
                    'show_names' => 1,
                ));
            }
            ?>
        </nav>
    </div>
</footer>

<?php wp_footer(); ?>
</body>

</html>