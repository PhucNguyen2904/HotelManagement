<?php
/**
 * Custom shortcode Separator Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

/**
 * Customizer shortcode visual separator
 */
function fleurdesel_custom_map() {
	$params[] = array(
		'type'       => 'checkbox',
		'param_name' => 'is_fleurdesel_popup_map',
		'heading'    => esc_html__( 'Use Pop-up?', 'fleurdesel' ),
		'value' => array( __( 'Yes', 'fleurdesel' ) => 'yes' ),
	);

	// Add new params image.
	$params[] = array(
		'type'        => 'textarea_raw_html',
		'param_name'  => 'popup_content',
		'heading'     => esc_html__( 'Pop-up content', 'fleurdesel' ),
		'dependency'  => array(
			'element'   => 'is_fleurdesel_popup_map',
			'value'     => 'yes',
		),
	);

	vc_add_params( 'awethemes_gmaps', $params );
}
add_action( 'init', 'fleurdesel_custom_map' );

/**
 * Edit ouput shortcode visual separator.
 *
 * @param  [string] $output    ouput.
 * @param  [string] $shortcode the shortcode.
 * @param  [array]  $atts      attributes.
 *
 * @return [string]            html output.
 */
function fleurdesel_vc_map_hook( $output, $shortcode, $atts ) {
	// Check valid shortcode and atts.
	if ( 'awethemes_gmaps' !== $shortcode->getShortcode() ) {
		return $output;
	}

	$before = '';
	$content = apply_filters( 'after_open_awethemes_gmaps', $before, $output, $shortcode, $atts );

	return preg_replace( '/(<div[^>]+class="[^"]*extras_vc-map-wrapper\s[^>]*>)/', "$1\n{$content}\n", $output );
}
add_filter( 'vc_shortcode_output', 'fleurdesel_vc_map_hook', 10, 3 );

/**
 * Output template for popup-map.
 *
 * @param  [string] $before    [before].
 * @param  [string] $output    [output].
 * @param  [string] $shortcode [the shortcode].
 * @param  [array]  $atts      [attributes].
 * @return [string]            [output html].
 */
function fleurdesel_vc_map_template( $before, $output, $shortcode, $atts ) {
	// Default.
	$atts = vc_map_get_attributes( $shortcode->getShortcode(), $atts );

	$popup_content = $atts['popup_content'];
	$output = '';
	if ( $popup_content ) {
		$output .= '<div class="fleurdesel-map--popup" data-init="mapjs">';
		$output .= '<div class="fleurdesel-map__data text-center">
					<span class="fleurdesel-map__icon" data-mapjs="icon"><i class="fa fa-map-marker"></i></span>';
		$output .= rawurldecode( base64_decode( strip_tags( $popup_content ) ) );
		$output .= '</div>';
		$output .= '</div>';
	}

	return $output;
}
add_filter( 'after_open_awethemes_gmaps', 'fleurdesel_vc_map_template', 10, 4 );
