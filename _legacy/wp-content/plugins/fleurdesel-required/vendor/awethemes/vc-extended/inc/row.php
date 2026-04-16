<?php

add_action( 'admin_init', function() {
	$params = array(
		array(
			'type'       => 'colorpicker',
			'param_name' => 'row_overlay_color',
			'heading'    => esc_html__( 'Row Overlay', 'vc_extras' ),
			'group'      => esc_html__( 'Background', 'vc_extras' ),
		),
	);

	vc_add_params( 'vc_row', $params );
} );

/**
 * //
 *
 * @access private
 *
 * @param  string            $output    Origin vc_row output template.
 * @param  WPBakeryShortCode $shortcode The shortcode instance class.
 * @param  array             $atts      Default shortcode atts.
 *
 * @return string
 */
function _vc_row_hook( $output, $shortcode, $atts ) {
	if ( 'vc_row' !== $shortcode->getShortcode() ) {
		return $output;
	}

	$before = '';
	$content = apply_filters( 'after_open_vc_row', $before, $output, $shortcode, $atts );

	return preg_replace( '/(<div[^>]+class="[^"]*vc_row\s[^>]*>)/', "$1\n{$content}\n", $output );
}
add_filter( 'vc_shortcode_output', '_vc_row_hook', 10, 3 );

add_filter( 'after_open_vc_row', function( $before, $output, $shortcode, $atts ) {

	if ( isset( $atts['row_overlay_color'] ) ) {
		$before .= '<div class="vc_row-overlay" style="background-color: '.$atts['row_overlay_color'].'"></div>';
	}

	return $before;

}, 10, 4);
