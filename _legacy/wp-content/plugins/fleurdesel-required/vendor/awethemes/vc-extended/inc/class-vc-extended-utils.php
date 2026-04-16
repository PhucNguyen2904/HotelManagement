<?php
/**
 * Visual Composer Extended Utils Slass.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

/**
 * The Extras_Composer_Utils class.
 */
class Extras_Composer_Utils {

	/**
	 * Get public post type for dropdown (select).
	 */
	public static function get_dropdown_post_types( $args = array(), $flip = true ) {
		$excluded_post_types = apply_filters( 'vc_extras_excluded_post_types', array(
			'attachment',
			'megamenu',
		) );

		$args = wp_parse_args( $args, array( 'public' => true ) );

		$post_types = array_except( get_post_types( $args ), $excluded_post_types );
		$post_types = array_map( function ( $value ) {
			return ucfirst( str_replace( array( '-', '_' ), ' ', $value ) );
		}, $post_types );

		return $flip ? array_flip( $post_types ) : $post_types;
	}

	/**
	 * Parse slick to data-attr HTML.
	 *
	 * @param  arrat $atts Shortcode atts.
	 * @return array
	 */
	public static function parse_slick_atts( $atts ) {
		$atts = shortcode_atts( array(
			'_slick_arrows'         => true,
			'_slick_dots'           => false,
			'_slick_autoplay'       => false,
			'_slick_autoplay_speed' => '3000',
			'_slick_draggable'      => true,
			'_slick_infinite'       => false,
			'_slick_breakpoints'    => '',
		), $atts );

		$boolean_atts = array( 'arrows', 'dots', 'autoplay', 'draggable', 'infinite' );

		if ( $atts['_slick_breakpoints'] ) {
			$atts['_slick_breakpoints'] = (array) vc_extended_parse_responsive_attr( $atts['_slick_breakpoints'] );
			foreach ( $atts['_slick_breakpoints'] as $key => &$value ) {
				$value = ( 0 == $value ) ? 1 : $value;
			}
			$atts['_slick_breakpoints'] = json_encode( $atts['_slick_breakpoints'] );
		}

		// Build data.
		$data['data-init'] = 'slick';

		foreach ( $atts as $key => $value ) {
			$key = str_replace( '_slick_', '', $key );

			if ( in_array( $key, $boolean_atts ) ) {
				$value = ( ! ! $value ) ? 'true' : 'false';
			}

			$data[ 'data-' . $key ] = $value;
		}

		return $data;
	}
}
