<?php

if ( ! function_exists( 'atfw') ) {
	return;
}

$js_atfw = atfw( 'url' ) . '/js/atfw.js';

// Working well
vc_add_shortcode_param( 'atfw-oembed', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'oembed', $settings, $value );
});

// Working well
vc_add_shortcode_param( 'atfw-icon', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'icon', $settings, $value );
}, $js_atfw );

// Working with enqueue JS
vc_add_shortcode_param( 'atfw-datepicker', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'datepicker', $settings, $value );
}, $js_atfw );

// Working with enqueue JS
vc_add_shortcode_param( 'atfw-gallery', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'gallery', $settings, $value );
}, $js_atfw );

// Working with enqueue JS
vc_add_shortcode_param( 'atfw-image', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'image', $settings, $value );
}, $js_atfw );

// Not working
vc_add_shortcode_param( 'atfw-switcher', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'switcher', $settings, $value );
}, $js_atfw );

// Working but need fixed setting
vc_add_shortcode_param( 'atfw-notice', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'notice', $settings, $value );
});

// Working but need fixed setting
vc_add_shortcode_param( 'atfw-number', function( $settings, $value ) {
	return vc_extended_add_atfw_field( 'number', $settings, $value );
});

function vc_extended_add_atfw_field( $type, $settings, $value, $field = array() ) {
	$field = wp_parse_args( $field, array(
		'type'  => $type,
		'name'  => $settings['param_name'],
		'class' => sprintf( 'wpb_vc_param_value %1$s %2$s_field', $settings['param_name'], $settings['type'] ),
	) );

	return cs_add_element( $field, $value );
}
