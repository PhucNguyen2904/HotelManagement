<?php
/**
 * Fleurdesel Posts Visual Composer Shortcode Builder
 *
 * @package Fleurdesel
 */

/**
 * //
 */
function vc_fleurdesel_posts_carousel_configs() {

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
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options(),
		VC_Extended_Snippets::slick_params( 'lg:3|md:3|sm:2|xs:1' )
	);

	return array(
		'name'        => esc_html__( 'Fleurdesel Posts Carousel', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display Posts as carousel layout.', 'fleurdesel' ),
		'params'      => $params,
	);
}
vc_lean_map( 'vc_fleurdesel_posts_carousel', 'vc_fleurdesel_posts_carousel_configs' );

/**
 * WPBakeryShortCode_VC_Fleurdesel_Posts_Carousel class.
 */
class WPBakeryShortCode_VC_Fleurdesel_Posts_Carousel extends Fleurdesel_Shortcode_Abstract {
}
