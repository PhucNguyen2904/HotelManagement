<?php

$atts = shortcode_atts( array(
	'id'        => '',
	'animation' => 'fade-up',
	'easing'    => 'ease',
	'duration'  => '400',
	'delay'     => '0',
	'once'      => 'false',

	'el_class'  => '',
	'css'       => '',
), $atts );

// Build element class.
$el_class  = $this->getExtraClass( $atts['el_class'] . ' ' );
$el_class .= vc_shortcode_custom_css_class( $atts['css'] );

// Build element attributes.
$attributes = array(
	'class'             => 'vc-extended-scroll-animate' . rtrim( $el_class ),
	'data-aos'          => $atts['animation'],
	'data-aos-easing'   => $atts['easing'],
	'data-aos-duration' => $atts['duration'],
	'data-aos-delay'    => $atts['delay'],
	'data-aos-once'     => $atts['once'],
);

// Only pass id if visible.
if ( $atts['id'] ) {
	$attributes['id'] = $atts['id'];
}

wp_enqueue_style( 'aos' );
wp_enqueue_script( 'aos' );

printf( '<div%s>%s</div>', vc_extended_build_attributes( $attributes ), do_shortcode( $content ) ); // WPCS: xss ok.
