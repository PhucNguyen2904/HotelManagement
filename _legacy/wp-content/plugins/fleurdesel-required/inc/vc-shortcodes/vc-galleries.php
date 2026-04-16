<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Galleries content element.
 */
function vcmap_fleurdesel_galleries() {
	$params[] = array(
		'type'        => 'dropdown',
		'param_name'  => 'layout',
		'heading'     => esc_html__( 'Layout', 'fleurdesel' ),
		'value'       => array(
			__( 'Grid', 'fleurdesel' )       => 'grid',
			__( 'Masonry', 'fleurdesel' )    => 'masonry',
		),
		'std'         => 'grid',
		'admin_label' => true,
	);

	$params[] = array(
		'type'        => 'param_group',
		'param_name'  => 'galleries',
		'heading'     => esc_html__( 'Galleries', 'fleurdesel' ),
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
				'param_name'  => 'group',
				'heading'     => esc_html__( 'Group', 'fleurdesel' ),
				'admin_label' => true,
			),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Galleries', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display galleries.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_galleries', 'vcmap_fleurdesel_galleries' );

/**
 * WPBakeryShortCode_Fleurdesel_Galleries
 */
class WPBakeryShortCode_Fleurdesel_Galleries extends Fleurdesel_Shortcode_Abstract {
}
