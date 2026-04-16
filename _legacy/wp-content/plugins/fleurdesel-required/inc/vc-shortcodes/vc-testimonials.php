<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Testimonials content element
 */
function vcmap_fleurdesel_testimonials() {
	$params[] = array(
		'type'        => 'checkbox',
		'param_name'  => 'hidden_form',
		'heading'     => esc_html__( 'Hidden form?', 'fleurdesel' ),
		'value' => array( __( 'Yes', 'fleurdesel' ) => 'yes' ),
		'std'	=> '',
	);

	$params[] = array(
		'type'        => 'textfield',
		'param_name'  => 'form_title',
		'heading'     => esc_html__( 'Form Title', 'fleurdesel' ),
		'value'       => '',
		'dependency'  => array(
			'element' => 'hidden_form',
			'value_not_equal_to'   => array( 'yes' ),
		),
	);

	$params[] = array(
		'type'        => 'textarea',
		'param_name'  => 'form_description',
		'heading'     => esc_html__( 'Form Desciption', 'fleurdesel' ),
		'value'       => '',
		'dependency'  => array(
			'element' => 'hidden_form',
			'value_not_equal_to'   => array( 'yes' ),
		),
	);

	$params[] = array(
		'type'        => 'textarea',
		'param_name'  => 'form_content',
		'heading'     => esc_html__( 'Form Content', 'fleurdesel' ),
		'value'       => '',
		'dependency'  => array(
			'element' => 'hidden_form',
			'value_not_equal_to'   => array( 'yes' ),
		),
	);

	$params[] = array(
		'type'        => 'param_group',
		'param_name'  => 'testimonials',
		'heading'     => esc_html__( 'Testimonials', 'fleurdesel' ),
		'params'      => array(
			array(
				'type'        => 'attach_image',
				'param_name'  => 'avatar',
				'heading'     => esc_html__( 'Avatar', 'fleurdesel' ),
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
				'param_name'  => 'from',
				'heading'     => esc_html__( 'From', 'fleurdesel' ),
				'value'       => '',
			),
			array(
				'type'        => 'textfield',
				'param_name'  => 'title',
				'heading'     => esc_html__( 'Title', 'fleurdesel' ),
				'value'       => '',
			),
			array(
				'type'        => 'textarea',
				'param_name'  => 'content',
				'heading'     => esc_html__( 'Content', 'fleurdesel' ),
				'value'       => '',
			),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Testimonials', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display testimonials as grid.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_testimonials', 'vcmap_fleurdesel_testimonials' );

/**
 * WPBakeryShortCode_Fleurdesel_Testimonials
 */
class WPBakeryShortCode_Fleurdesel_Testimonials extends Fleurdesel_Shortcode_Abstract {
}
