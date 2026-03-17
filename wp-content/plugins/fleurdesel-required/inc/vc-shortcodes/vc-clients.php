<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Clients content element
 */
function vcmap_fleurdesel_clients() {

	$params[] = array(
		'type'        => 'param_group',
		'param_name'  => 'clients',
		'heading'     => esc_html__( 'Clients', 'fleurdesel' ),
		'params'      => array(
			array(
				'type'        => 'attach_image',
				'param_name'  => 'image',
				'heading'     => esc_html__( 'Image', 'fleurdesel' ),
				'admin_label' => true,
			),
			array(
				'type'        => 'textfield',
				'param_name'  => 'name',
				'heading'     => esc_html__( 'Name', 'fleurdesel' ),
				'admin_label' => true,
			),
			array(
				'type'        => 'textfield',
				'param_name'  => 'link',
				'heading'     => esc_html__( 'Link', 'fleurdesel' ),
				'value'       => '',
			),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options(),
		VC_Extended_Snippets::slick_params( 'lg:5|md:5|sm:2|xs:1' )
	);

	return array(
		'name'        => esc_html__( 'Clients', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display clients as carousel.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_clients', 'vcmap_fleurdesel_clients' );

/**
 * WPBakeryShortCode_Fleurdesel_Clients
 */
class WPBakeryShortCode_Fleurdesel_Clients extends Fleurdesel_Shortcode_Abstract {
}
