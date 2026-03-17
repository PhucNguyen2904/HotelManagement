<?php
/*
Plugin Name: At-Importer
Description: Description
Plugin URI: http://#
Author: Author
Author URI: http://#
Version: 1.0
License: GPL2
Text Domain: Text Domain
Domain Path: Domain Path
*/

if ( ! class_exists( 'WP_Importer' ) ) {
	defined( 'WP_LOAD_IMPORTERS' ) || define( 'WP_LOAD_IMPORTERS', true );
	require_once ABSPATH . '/wp-admin/includes/class-wp-importer.php';
}

if ( ! class_exists( 'WXR_Importer' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'inc/wp-importer/class-logger.php';
	require_once plugin_dir_path( __FILE__ ) . 'inc/wp-importer/class-wxr-importer.php';
}

/**
 * AT Importer.
 */
if ( ! class_exists( 'AT_Importer_Manager' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'inc/class-at-importer.php';
	require_once plugin_dir_path( __FILE__ ) . 'inc/class-at-printer-logger.php';
	require_once plugin_dir_path( __FILE__ ) . 'inc/class-at-importer-manager.php';
}

/**
 * Widget Importer & Exporter.
 */
if ( ! class_exists( 'Widget_Importer_Exporter' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'inc/widget-importer.php';
}

if ( ! class_exists( 'AT_Customizer_Import_Export' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'inc/class-at-customizer-import-export.php';
}

if ( ! function_exists( 'at_importers' ) ) {
	require_once plugin_dir_path( __FILE__ ) . 'inc/helpers.php';
}
