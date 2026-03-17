<?php
/**
 * Custom functions
 *
 * @package Fleurdesel
 */

/**
 * Gte font size value.
 *
 * @return array
 */
function fleurdesel_get_font_size_values() {
	$sizes = array( 10, 12, 14, 16, 20, 25, 40, 60 );

	$values = array( 'default' => __( 'Default', 'fleurdesel' ) );

	foreach ( $sizes as $size ) {
		$values[ $size . 'px' ] = $size;
	}

	return $values;
}

/**
 * Get autocomplete value for packages.
 *
 * @return array
 */
function fleurdesel_get_packages_autocomplete_value() {
	$packages = get_posts( array(
		'post_type'   => 'fl_package',
		'nopaging'    => 1,
		'post_status' => 'publish',
	) );

	$values = array();

	foreach ( $packages as $package ) {
		$values[] = array(
			'value' => $package->ID,
			'label' => $package->post_title,
		);
	}

	return $values;
}
