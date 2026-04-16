<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Heading content element
 */
function vcmap_fleurdesel_heading() {

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
	);

	$params[] = array(
		'type'        => 'dropdown',
		'param_name'  => 'order',
		'heading'     => esc_html__( 'Display order', 'fleurdesel' ),
		'std'         => 'subtitle_first',
		'value'       => array(
			__( 'Subtitle first', 'fleurdesel' ) => 'subtitle_first',
			__( 'Title first', 'fleurdesel' )    => 'title_first',
		),
	);

	$params[] = array(
		'type'        => 'dropdown',
		'param_name'  => 'style',
		'heading'     => esc_html__( 'Style', 'fleurdesel' ),
		'std'         => 'black',
		'value'       => array(
			__( 'Black', 'fleurdesel' ) => 'black',
			__( 'White', 'fleurdesel' ) => 'white',
		),
	);

	$params[] = array(
		'type'        => 'dropdown',
		'param_name'  => 'title_size',
		'heading'     => esc_html__( 'Title font size', 'fleurdesel' ),
		'std'         => '',
		'value'       => fleurdesel_get_font_size_values(),
	);

	$params[] = array(
		'type'        => 'dropdown',
		'param_name'  => 'align',
		'heading'     => esc_html__( 'Align', 'fleurdesel' ),
		'std'         => 'left',
		'value'       => array(
			__( 'Left', 'fleurdesel' )   => 'left',
			__( 'Center', 'fleurdesel' ) => 'center',
			__( 'Right', 'fleurdesel' )  => 'right',
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Heading', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display heading.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_heading', 'vcmap_fleurdesel_heading' );

/**
 * WPBakeryShortCode_Fleurdesel_Heading
 */
class WPBakeryShortCode_Fleurdesel_Heading extends Fleurdesel_Shortcode_Abstract {
}
