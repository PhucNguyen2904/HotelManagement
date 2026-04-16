<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Full screen slider content element
 */
function vcmap_fleurdesel_fullscreen_slider() {

	$params[] = array(
		'type'        => 'param_group',
		'param_name'  => 'sliders',
		'heading'     => esc_html__( 'Sliders', 'fleurdesel' ),
		'params'      => array(
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
				'param_name'  => 'link',
				'heading'     => esc_html__( 'Link', 'fleurdesel' ),
			),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Full screen slider', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_fullscreen_slider', 'vcmap_fleurdesel_fullscreen_slider' );

/**
 * WPBakeryShortCode_Fleurdesel_Fullscreen_Slider
 */
class WPBakeryShortCode_Fleurdesel_Fullscreen_Slider extends Fleurdesel_Shortcode_Abstract {
}
