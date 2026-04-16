<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

if ( ! class_exists( 'AweBooking' ) ) {
	return;
}
/**
 * Register Check Availability.
 */
function vcmap_fleurdesel_check_availability() {
	$params = array(
		array(
			'type'        => 'dropdown',
			'param_name'  => 'layout',
			'heading'     => esc_html__( 'Layout', 'fleurdesel' ),
			'value'       => array(
				esc_html__( 'Vertical', 'fleurdesel' )   => 'vertical',
				esc_html__( 'Standard 1', 'fleurdesel' ) => 'standard-1',
				esc_html__( 'Standard 2', 'fleurdesel' ) => 'standard-2',
				esc_html__( 'Standard 3', 'fleurdesel' ) => 'standard-3',
				esc_html__( 'Modern', 'fleurdesel' )     => 'modern',
			),
			'std'         => 'standard-1',
		),
		array(
			'type'       => 'checkbox',
			'heading'    => esc_html__( 'Hotel location?', 'fleurdesel' ),
			'param_name' => 'location',
			'value'      => array( esc_html__( 'Yes', 'fleurdesel' ) => 'on' ),
			'std'        => 'on',
			'dependency'  => array(
				'element' => 'layout',
				'value'   => array( 'vertical', 'standard-1', 'standard-2', 'standard-3' ),
			),
		),
		array(
			'type'       => 'checkbox',
			'heading'    => esc_html__( 'Occupancy?', 'fleurdesel' ),
			'param_name' => 'occupancy',
			'value'      => array( esc_html__( 'Yes', 'fleurdesel' ) => 'on' ),
			'std'        => 'on',
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Check Availability Form', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display a Check Availability Form.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_check_availability', 'vcmap_fleurdesel_check_availability' );

function fleurdesel_enqueue_booking_form() {
	wp_enqueue_script( 'fleurdesel-awebooking-form' );
}
add_action( 'wp_enqueue_scripts', 'fleurdesel_enqueue_booking_form' );

/**
 * WPBakeryShortCode_Fleurdesel_Check_Availability
 */
class WPBakeryShortCode_Fleurdesel_Check_Availability extends Fleurdesel_Shortcode_Abstract {
}
