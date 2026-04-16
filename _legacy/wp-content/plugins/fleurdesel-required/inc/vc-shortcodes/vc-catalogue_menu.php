<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Catalogue menu content element
 */
function vcmap_fleurdesel_catalogue_menu() {

	$params[] = array(
		'type'        => 'param_group',
		'param_name'  => 'catalogue_menus',
		'heading'     => esc_html__( 'Catalogue Menus', 'fleurdesel' ),
		'params'      => array(
			array(
				'type'        => 'textfield',
				'param_name'  => 'title',
				'heading'     => esc_html__( 'Title', 'fleurdesel' ),
				'admin_label' => true,
			),
			array(
				'type'        => 'textarea',
				'param_name'  => 'description',
				'heading'     => esc_html__( 'Description', 'fleurdesel' ),
			),
			array(
				'type'        => 'textfield',
				'param_name'  => 'price',
				'heading'     => esc_html__( 'Price', 'fleurdesel' ),
				'value'       => '',
			),
			array(
				'type'        => 'textfield',
				'param_name'  => 'price_unit',
				'heading'     => esc_html__( 'Price unit', 'fleurdesel' ),
				'value'       => '',
			),
			array(
				'type'        => 'checkbox',
				'param_name'  => 'recommend',
				'heading'     => esc_html__( 'Recommend', 'fleurdesel' ),
				'value'       => '',
			),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Catalogue menu', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display catalogue menus.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_catalogue_menu', 'vcmap_fleurdesel_catalogue_menu' );

/**
 * WPBakeryShortCode_Fleurdesel_Catalogue_Menu
 */
class WPBakeryShortCode_Fleurdesel_Catalogue_Menu extends Fleurdesel_Shortcode_Abstract {
}
