<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register animate numbers content element
 */
function vcmap_fleurdesel_animated_number() {

	$params = array(
		array(
			'type'        => 'textfield',
			'param_name'  => 'number',
			'heading'     => esc_html__( 'Number', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'text',
			'heading'     => esc_html__( 'Text', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'colorpicker',
			'param_name'  => 'color',
			'heading'     => esc_html__( 'Color', 'fleurdesel' ),
		),
		array(
			'type'        => 'checkbox',
			'param_name'  => 'show_x_icon',
			'heading'     => esc_html__( 'Show "x" icon?', 'fleurdesel' ),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Animated Number', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display an animated number.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_animated_number', 'vcmap_fleurdesel_animated_number' );

/**
 * WPBakeryShortCode_Fleurdesel_Animate_Number
 */
class WPBakeryShortCode_Fleurdesel_Animated_Number extends Fleurdesel_Shortcode_Abstract {
}
