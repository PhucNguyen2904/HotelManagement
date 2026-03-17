<?php

if ( ! function_exists( 'array_except' ) ) {
	/**
	 * Get all of the given array except for a specified array of items.
	 *
	 * @param  array        $array
	 * @param  array|string $keys
	 * @return array
	 */
	function array_except( $array, $keys ) {
		return array_diff_key( $array, array_flip( (array) $keys ) );
	}
}

if ( ! function_exists( 'array_only' ) ) {
	/**
	 * Get a subset of the items from the given array.
	 *
	 * @param  array        $array
	 * @param  array|string $keys
	 * @return array
	 */
	function array_only( $array, $keys ) {
		return array_intersect_key( $array, array_flip( (array) $keys ) );
	}
}

if ( ! function_exists( 'vc_extended_build_attributes' ) ) {
	/**
	 * Build an HTML attribute string from an array.
	 *
	 * @param array $attributes
	 *
	 * @return string
	 */
	function vc_extended_build_attributes( $attributes ) {
		$html = array();

		foreach ( (array) $attributes as $key => $value ) {
			if ( is_numeric( $key ) ) {
				$key = $value;
			}

			if ( ! is_null( $value ) ) {
				$html[] = $key . '="' . esc_attr( $value ) . '"';
			}
		}

		return count( $html ) > 0 ? ' ' . implode( ' ', $html ) : '';
	}
}

function vc_extras_shortcode_icon( $name ) {
	return VC_EXTENDED_URL . 'icons/' . $name . '.png';
}
