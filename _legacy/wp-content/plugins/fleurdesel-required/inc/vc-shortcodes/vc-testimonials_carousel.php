<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register Testimonials content element
 */
function vcmap_fleurdesel_testimonials_carousel() {
	$params[] = array(
		'type'        => 'dropdown',
		'param_name'  => 'layout',
		'heading'     => esc_html__( 'Layout', 'fleurdesel' ),
		'value'       => array(
			__( 'Centered with big content', 'fleurdesel' )   => 'centered_big_content',
			__( 'Centered with small content', 'fleurdesel' ) => 'centered_small_content',
			__( 'List', 'fleurdesel' )                        => 'list',
		),
		'std'         => 'standard',
		'admin_label' => true,
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
				'type'        => 'textarea',
				'param_name'  => 'content',
				'heading'     => esc_html__( 'Content', 'fleurdesel' ),
				'value'       => '',
			),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options(),
		VC_Extended_Snippets::slick_params( 'lg:1|md:1|sm:1|xs:1' )
	);

	return array(
		'name'        => esc_html__( 'Testimonials Carousel', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display testimonials as carousel.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_testimonials_carousel', 'vcmap_fleurdesel_testimonials_carousel' );

/**
 * WPBakeryShortCode_Fleurdesel_Testimonials_Carousel
 */
class WPBakeryShortCode_Fleurdesel_Testimonials_Carousel extends Fleurdesel_Shortcode_Abstract {
}
