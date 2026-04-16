<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Register packages content element
 */
function vcmap_fleurdesel_packages_carousel() {

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
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options(),
		VC_Extended_Snippets::slick_params( 'lg:3|md:3|sm:1|xs:1' )
	);

	return array(
		'name'        => esc_html__( 'Packages carousel', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display packages carousel.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_packages_carousel', 'vcmap_fleurdesel_packages_carousel' );

/**
 * WPBakeryShortCode_Fleurdesel_Packages_Carousel
 */
class WPBakeryShortCode_Fleurdesel_Packages_Carousel extends Fleurdesel_Shortcode_Abstract {
}
