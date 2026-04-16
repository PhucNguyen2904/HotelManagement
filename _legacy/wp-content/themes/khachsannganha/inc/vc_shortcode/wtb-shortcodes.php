<?php
define('WTB_SHORTCODES_ASSET', dirname(__FILE__) . '/assets/');
define('WTB_SHORTCODES_PATH', dirname(__FILE__) . '/shortcodes/');
define('WTB_SHORTCODES_LIB', dirname(__FILE__) . '/lib/');
define('WTB_SHORTCODES_TEMPLATES', dirname(__FILE__) . '/templates/');
define('WTB_SHORTCODES_WOO_PATH', dirname(__FILE__) . '/woo_shortcodes/');
define('WTB_SHORTCODES_WOO_TEMPLATES', dirname(__FILE__) . '/woo_templates/');

class WTBShortcodesClass {

    private $shortcodes = array("wtb_blog",'wtb_blog_slider','wtb_carousel_image','wtb_static_block');
	private $woo_shortcodes = array("wtb_product","wtb_product_slider");
    
    function __construct() {

        $this->addShortcodes();
        add_filter('the_content', array($this, 'formatShortcodes'));
        add_filter('widget_text', array($this, 'formatShortcodes'));
        add_action('wp_enqueue_scripts', array($this,'wtb_enqueue_script'));

    }

    // Add shortcodes
    function addShortcodes() {
        require_once(WTB_SHORTCODES_LIB . 'functions.php');
        require_once(WTB_SHORTCODES_LIB . 'wtb-post-type.php');
        foreach ($this->shortcodes as $shortcode) {
            require_once(WTB_SHORTCODES_PATH . $shortcode . '.php');
        }

        if ( class_exists( 'WooCommerce' ) ) {
            foreach ($this->woo_shortcodes as $woo_shortcode) {
                require_once(WTB_SHORTCODES_WOO_PATH . $woo_shortcode . '.php');
            }
        }
    }

    // Format shortcodes content
    function formatShortcodes($content) {
        $block = join("|", $this->shortcodes);
        // opening tag
        $content = preg_replace("/(<p>)?\[($block)(\s[^\]]+)?\](<\/p>|<br \/>)?/", "[$2$3]", $content);
        // closing tag
        $content = preg_replace("/(<p>)?\[\/($block)](<\/p>|<br \/>)/", "[/$2]", $content);

        return $content;
    }

    function wtb_enqueue_script() {   
        wp_enqueue_style('wtb-core-style', get_stylesheet_directory_uri()  . '/inc/vc_shortcode/assets/css/wtb_core.css');  
    }

}

// Finally initialize code
new WTBShortcodesClass();
