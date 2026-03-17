<?php
use Skeleton\Skeleton;
use Awethemes\Theme_Options\Theme_Options;

define( 'SKELETON_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Load Skeleton in locally.
$vendor_path = trailingslashit( __DIR__ ) . 'vendor/awethemes/skeleton/skeleton.php';
if ( ! defined( 'SKELETON_LOADED' ) && file_exists( $vendor_path ) ) {
	require_once $vendor_path;
}

// Register psr4 autoloader.
skeleton_psr4_autoloader( 'Awethemes\\Theme_Options\\', trailingslashit( __DIR__ ) . '/inc' );

/**
 * Init the theme options.
 *
 * @param  Skeleton $skeleton The Skeleton instance.
 * @return void
 */
function awethemes_theme_options_init( Skeleton $skeleton ) {
	// Only active when current support theme_options.
	$theme_support = 'awethemes/theme_options';
	if ( current_theme_supports( $theme_support ) ) {
		$theme_support = get_theme_support( $theme_support );
		$theme_support = isset( $theme_support[0] ) ? $theme_support[0] : array();

		new Theme_Options( $skeleton, $theme_support );
	}
}
add_action( 'skeleton/init', 'awethemes_theme_options_init' );

/**
 * Enqueue JS, CSS on theme option page.
 *
 * @return void
 */
function awethemes_theme_options_enqueue_scripts() {
	wp_enqueue_style( 'awethemes-theme-options', SKELETON_PLUGIN_URL . 'css/theme-options.css', array(), '1.0.0' );
}
add_action( 'admin_enqueue_scripts', 'awethemes_theme_options_enqueue_scripts' );
