<?php
/**
 * Fleurdesel Posts Visual Composer Shortcode Builder
 *
 * @package Fleurdesel
 */

/**
 * //
 */
function vc_fleurdesel_posts_config() {

	$params = array(
		array(
			'type' 			=> 'loop',
			'heading' 		=> esc_html__( 'Query', 'fleurdesel' ),
			'param_name' 	=> 'loop',
			'value' 		=> 'size:5|order_by:date',
			'settings' 		=> array(
				'size' 		=> array( 'hidden' => false, 'value' => 5 ),
				'order_by' 	=> array( 'value' => 'date' ),
				'post_type' => array( 'hidden' => true ),
				'tax_query' => array( 'hidden' => true ),
			),
			'description' => esc_html__( 'Create WordPress loop, to populate content from your site.', 'fleurdesel' ),
			'admin_label' => true,
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'layout',
			'heading'     => esc_html__( 'Layout', 'fleurdesel' ),
			'value'       => array(
				__( 'Standard', 'fleurdesel' )   => 'standard',
				__( 'List', 'fleurdesel' )       => 'list',
				__( 'Zigzag', 'fleurdesel' )     => 'zigzag',
			),
			'std'         => 'standard',
			'admin_label' => true,
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Fleurdesel Posts', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'params'      => $params,
	);
}
vc_lean_map( 'vc_fleurdesel_posts', 'vc_fleurdesel_posts_config' );

/**
 * WPBakeryShortCode_VC_Fleurdesel_Posts class.
 */
class WPBakeryShortCode_VC_Fleurdesel_Posts extends Fleurdesel_Shortcode_Abstract {
}
