<?php
/**
 * Fleurdesel Child functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/advanced-topics/child-themes/
 *
 * @package Fleurdesel
 * @subpackage Fleurdesel Child
 */
/**
 * Enqueue child theme CSS and scripts.
 */
function fleurdesel_child_scripts() {
	wp_enqueue_style( 'fleurdesel-child', get_stylesheet_uri() );

	// Main js
	wp_enqueue_script( 'main-js', get_stylesheet_directory_uri() . '/lib/js/main.js', array('jquery'), '1.0', true );

	// Slick Slider
	wp_register_script( 'slick-js', get_stylesheet_directory_uri() . '/lib/js/slick.min.js', array('jquery'), '1.8.1', true );
	wp_register_style( 'slick-style', get_stylesheet_directory_uri() .'/lib/css/slick/slick.css' );
	wp_register_style( 'slick-theme-style', get_stylesheet_directory_uri() .'/lib/css/slick/slick-theme.css' );
}
add_action( 'wp_enqueue_scripts', 'fleurdesel_child_scripts', 9999 );
/*
 * Theme *********
 */
/**
 * Change custom background.
 * Uncomment this block below to activate this feature.
 *
 * @param color_array.
 */
/*function fleurdesel_child_custom_background_args( $color_array ) {
	$color_array = array(
			'default-color' => 'ffffff',
			'default-image' => '',
		);
	return $color_array;
}
add_filter( 'fleurdesel_custom_background_args', 'fleurdesel_child_custom_background_args', 5 );*/
/**
 * Change default sidebar.
 *
 * @param  [string] $default default sidebar
 * @return [string]              default sidebar
 */
/*function fleurdesel_child_default_sidebar( $default ) {
	$default = 'sidebar-1';
	return $default;
}
add_filter( 'fleurdesel_sidebar_default', 'fleurdesel_child_default_sidebar', 5 );*/
/**
 * Change default sidebar area.
 *
 * @param  [string] $default default sidebar area.
 * @return [string]          default sidebar area.
 */
/*function fleurdesel_child_default_sidebar_area( $default ) {
	$default = 'left';
	return $default;
}
add_filter( 'fleurdesel_sidebar_area_default', 'fleurdesel_child_default_sidebar_area', 5 );*/
/**
 * Change sidebar taxonomy supported.
 * @param  [string] $tax taxonomy
 * @return [array]          [taxonomy]
 */
/*function fleurdesel_child_sidebar_taxonomy_supported( $tax ) {
	$tax[] = '';
	return $tax;
}
add_filter( 'fleurdesel_sidebar_taxonomy', 'fleurdesel_child_sidebar_taxonomy_supported', 5 );*/
/**
 * Register Widget Area
 *
 */
function shtheme_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Menu Sidebar', 'shtheme' ),
		'id'            => 'sidebar-menu',
		'description'   => esc_html__( 'Add widgets here.', 'shtheme' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'shtheme_widgets_init' );
function sh_load_framework() {
	// Load Functions.
	require_once( get_stylesheet_directory() . '/inc/functions/formatting.php' );
	require_once( get_stylesheet_directory() . '/inc/functions/dashboard.php' );
}
add_action( 'init','sh_load_framework' );
// Load Shortcode
require get_stylesheet_directory() . '/inc/shortcode/shortcode-blog.php';
// Load Widget
require get_stylesheet_directory() . '/inc/widgets/wg-information.php';
/**
 * Add Thumb Size
**/
add_image_size( 'sh_thumb320x220', 320, 220, array( 'center', 'center' ) );
add_image_size( 'sh_thumb255x170', 255, 170, array( 'center', 'center' ) );

if ( class_exists( 'Vc_Manager' ) ) {
	require get_stylesheet_directory() . '/inc/vc_shortcode/wtb-shortcodes.php';
}