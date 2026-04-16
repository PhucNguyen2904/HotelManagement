<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Pricing table content element
 */
function vcmap_fleurdesel_pricing_table() {

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'title',
		'heading'     => esc_html__( 'Title', 'fleurdesel' ),
		'admin_label' => true,
	);

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'subtitle',
		'heading'     => esc_html__( 'Subtitle', 'fleurdesel' ),
		'std'         => 'PACKAGE',
	);

	$params[] = array(
		'type'        => 'textarea',
		'param_name'  => 'desc',
		'heading'     => esc_html__( 'Description', 'fleurdesel' ),
	);

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'price',
		'heading'     => esc_html__( 'Price', 'fleurdesel' ),
		'std'         => '',
	);

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'price_unit',
		'heading'     => esc_html__( 'Price unit', 'fleurdesel' ),
		'std'         => '/package',
	);

	$params[] = array(
		'type'        => 'param_group',
		'param_name'  => 'features',
		'heading'     => esc_html__( 'Features', 'fleurdesel' ),
		'params'      => array(
			array(
				'type'        => 'textfield',
				'param_name'  => 'text',
				'heading'     => esc_html__( 'Feature', 'fleurdesel' ),
				'admin_label' => true,
				'description' => esc_html__( 'Use <b> for highlighted text', 'fleurdesel' ),
			),
		),
	);

	$params[] = array(
		'type'        => 'vc_link',
		'param_name'  => 'button',
		'heading'     => esc_html__( 'Button', 'fleurdesel' ),
	);

	$params[] = array(
		'type'        => 'checkbox',
		'param_name'  => 'active',
		'heading'     => esc_html__( 'Recommended', 'fleurdesel' ),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Pricing table', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display pricing table.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_pricing_table', 'vcmap_fleurdesel_pricing_table' );

/**
 * WPBakeryShortCode_Fleurdesel_Pricing_Table
 */
class WPBakeryShortCode_Fleurdesel_Pricing_Table extends Fleurdesel_Shortcode_Abstract {
}
