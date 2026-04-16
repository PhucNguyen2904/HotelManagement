<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register packages content element
 */
function vcmap_fleurdesel_packages() {

	$params = array(
		array(
			'type'        => 'autocomplete',
			'param_name'  => 'packages',
			'heading'     => esc_html__( 'Choose packages', 'fleurdesel' ),
			'settings'    => array(
				'values'         => fleurdesel_get_packages_autocomplete_value(),
				'multiple'       => true,
				'sortable'       => true,
				'display_inline' => true,
			),
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'layout',
			'heading'     => esc_html__( 'Layout', 'fleurdesel' ),
			'std'         => 'grid',
			'value'       => array(
				__( 'Grid', 'fleurdesel' )                 => 'grid',
				__( 'Grid no excerpt', 'fleurdesel' )      => 'grid_no_excerpt',
				__( 'Grid with background', 'fleurdesel' ) => 'grid_bg',
			),
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'columns',
			'heading'     => esc_html__( 'Number of columns', 'fleurdesel' ),
			'std'         => 3,
			'value'       => array( 1, 2, 3, 4 ),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Packages', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display packages.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_packages', 'vcmap_fleurdesel_packages' );

/**
 * WPBakeryShortCode_Fleurdesel_Packages
 */
class WPBakeryShortCode_Fleurdesel_Packages extends Fleurdesel_Shortcode_Abstract {
}
