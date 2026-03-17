<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Video box content element
 */
function vcmap_fleurdesel_video_box() {

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'video_url',
		'heading'     => esc_html__( 'Video url', 'fleurdesel' ),
	);

	$params[] = array(
		'type'        => 'attach_image',
		'param_name'  => 'video_image',
		'heading'     => esc_html__( 'Video image', 'fleurdesel' ),
	);

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'video_height',
		'heading'     => esc_html__( 'Video max height', 'fleurdesel' ),
		'std'         => 500,
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Video box', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display video box.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_video_box', 'vcmap_fleurdesel_video_box' );

/**
 * WPBakeryShortCode_Fleurdesel_Video_Box
 */
class WPBakeryShortCode_Fleurdesel_Video_Box extends Fleurdesel_Shortcode_Abstract {
}
