<?php
/*
Plugin Name:       Fleur De Sel Required
Plugin URI:        http://awethemes.com/
Description:       Registers custom post types, custom fields, widgets and importer for the Fleur De Sel theme
Version:           2.0.0
Author:            Awethemes
Author URI:        http://awethemes.com/
License:           GPL-2.0+
License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
Text Domain:       fleurdesel
Domain Path:       /languages
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
define( 'FLEURDESEL_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define( 'FLEURDESEL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

require_once FLEURDESEL_PLUGIN_PATH . '/vendor/autoload.php';

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'vendor/awethemes/skeleton/skeleton.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-fleurdesel-required-activator.php
 */
function activate_fleurdesel_required() {
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-fleurdesel-required-deactivator.php
 */
function deactivate_fleurdesel_required() {
}

register_activation_hook( __FILE__, 'activate_fleurdesel_required' );
register_deactivation_hook( __FILE__, 'deactivate_fleurdesel_required' );

/**
 * Fleurdesel Autoload
 */
function autoload_vc() {
	if ( ! class_exists( 'WPBakeryShortCode_Extended' ) ) {
		// Required vc-extended package.
		return;
	}

	require_once FLEURDESEL_PLUGIN_PATH . '/inc/class-fleurdesel-shortcode-abstract.php';

	$paths = glob( FLEURDESEL_PLUGIN_PATH . '/inc/vc-shortcodes/vc-*.php' );

	foreach ( $paths as $path ) {
		require_once $path;
	}
}
add_action( 'vc_after_init', 'autoload_vc', 20 );

add_action( 'plugins_loaded', function() {
	require plugin_dir_path( __FILE__ ) . 'vendor/awethemes/theme-options/theme-options.php';
	require plugin_dir_path( __FILE__ ) . 'inc/widgets/class-fleurdesel-widget-recent-comments.php';
	require plugin_dir_path( __FILE__ ) . 'inc/functions.php';
	require plugin_dir_path( __FILE__ ) . 'inc/widgets/class-fleurdesel-widget-follow-us.php';
	require plugin_dir_path( __FILE__ ) . 'inc/widgets/class-fleurdesel-widget-follow-us-banner.php';
	require plugin_dir_path( __FILE__ ) . 'inc/class-fleurdesel-custom-layout.php';

	Fleurdesel_Required::get_instance();
} );

add_action( 'skeleton/init', function() {
	require plugin_dir_path( __FILE__ ) . 'inc/class-fleurdesel-event-post-type.php';
	require plugin_dir_path( __FILE__ ) . 'inc/class-fleurdesel-package-post-type.php';

	new Fleurdesel_Custom_Layout();
	$event = new Fleurdesel_Event_Post_Type();
	$event->register();

	$event_cats = new Fleurdesel_Event_Type_Taxonomy();
	$event_cats->register();

	$package = new Fleurdesel_Package_Post_Type();
	$package->register();
} );

/**
 * Set up and initialize
 */
class Fleurdesel_Required {

	private static $instance;

	/**
	 * Returns the instance.
	 */
	public static function get_instance() {

		if ( ! self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Actions setup
	 */
	public function __construct() {
		add_action( 'plugins_loaded', array( $this, 'i18n' ), 3 );
		add_action( 'admin_notices', array( $this, 'admin_notice' ), 4 );
		add_action( 'admin_init', array( $this, 'insert_default_options' ) );
	}
	/**
	 * Translations
	 */
	function i18n() {
		load_plugin_textdomain( 'fleurdesel', false, 'fleurdesel-required/languages' );
	}

	/**
	 * Admin notice
	 */
	function admin_notice() {
		$theme  = wp_get_theme();
		$parent = wp_get_theme()->parent();
		if ( ( 'Fleurdesel' != $theme ) && ( 'Fleurdesel' != $parent ) ) {
			echo '<div class="error">';
			echo  '<p>' . __( 'Please note that the <strong>Fleurdesel Required</strong> plugin is meant to be used only with the <strong>Fleurdesel</strong> theme</p>', 'fleurdesel' );
			echo '</div>';
		}
	}

	/**
	 * Inser default options.
	 */
	function insert_default_options() {
		if ( ! function_exists( 'fleurdesel_defaults' ) ) {
			return;
		}
		$options = fleurdesel_defaults();

		if ( ! get_option( 'fleurdesel_options' ) ) {
			update_option( 'fleurdesel_options', $options );
		}
	}
}
