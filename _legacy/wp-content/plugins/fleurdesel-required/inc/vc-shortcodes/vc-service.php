<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register service content element
 */
function vcmap_fleurdesel_service() {

	$params = array(
		array(
			'type'        => 'attach_image',
			'param_name'  => 'image',
			'heading'     => esc_html__( 'Image', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'title',
			'heading'     => esc_html__( 'Title', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'subtitle',
			'heading'     => esc_html__( 'Sub-title', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'textfield',
			'param_name'  => 'link',
			'heading'     => esc_html__( 'Link', 'fleurdesel' ),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Service', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display a service.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_service', 'vcmap_fleurdesel_service' );

/**
 * WPBakeryShortCode_Fleurdesel_Service
 */
class WPBakeryShortCode_Fleurdesel_Service extends Fleurdesel_Shortcode_Abstract {
}
