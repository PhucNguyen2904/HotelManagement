<?php
/**
 * Visual Composer Extended Animate Shortcode.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

/**
 * Animate shortcode configs.
 *
 * @return array
 */
function vc_extended_scroll_animate_config() {
	$params = array(
		array(
			'type'        => 'el_id',
			'param_name'  => 'id',
			'heading'     => esc_html__( 'Element ID', 'vc_extended' ),
			'description' => sprintf( __( 'Enter element ID (Note: make sure it is unique and valid according to <a href="%s" target="_blank">w3c specification</a>).', 'vc_extended' ), 'http://www.w3schools.com/tags/att_global_id.asp' ),
			// 'holder'      => 'div',
			// 'class'       => 'bold',
		),

		array(
			'type'        => 'dropdown',
			'param_name'  => 'animation',
			'heading'     => esc_html__( 'Animation', 'vc_extended' ),
			'value'       => VC_Extended_Animate_Core::get_animations(),
			'std'         => 'fade-up',
			// 'admin_label' => true,
			'edit_field_class' => 'vc_col-xs-6',
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'easing',
			'heading'     => esc_html__( 'Easing function', 'vc_extended' ),
			'value'       => VC_Extended_Animate_Core::get_easings(),
			'std'         => 'ease',
			// 'admin_label' => true,
			'edit_field_class' => 'vc_col-xs-6',
		),

		array(
			'type'        => 'vce_textaddon',
			'param_name'  => 'duration',
			'heading'     => esc_html__( 'Duration of animation (ms)','vc_extended' ),
			'description' => esc_html__( '*Duration accept values from 50 to 3000, with step 50ms.','vc_extended' ),
			'std'         => '400',
			'addon_text'  => 'ms',
		),
		array(
			'type'        => 'vce_textaddon',
			'heading'     => esc_html__( 'Delay animation (ms)','vc_extended' ),
			'param_name'  => 'delay',
			'std'         => '0',
			'addon_text'  => 'ms',
		),
		array(
			'type'        => 'checkbox',
			'param_name'  => 'once',
			'value'       => array( esc_html__( 'Fire animation only one time?', 'vc_extended' ) => 'true' ),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'            => esc_html__( 'Scroll Animate', 'vc_extended' ),
		'icon'            => vc_extras_shortcode_icon( 'animate' ),
		'category'        => esc_html__( 'AweThemes', 'vc_extended' ),
		'description'     => esc_html__( 'Allows you to animate elements as you scroll.', 'vc_extended' ),
		'params'          => apply_filters( 'vc_extended_scroll_animate_params', $params ),
		'is_container'    => true,
		'content_element' => true,
		'as_parent'       => array( 'except' => 'vc_extended_scroll_animate' ),
		'html_template'   => VC_EXTENDED_PATH . '/inc/templates/vc_extended_scroll_animate.php',
		'js_view'         => 'VcColumnView',
		'show_settings_on_create' => true,
	) ;
}
vc_lean_map( 'vc_extended_scroll_animate', 'vc_extended_scroll_animate_config' );

/**
 * Extends WPBakeryShortCodesContainer class to make this shortcode as a container.
 */
class WPBakeryShortCode_VC_Extended_Scroll_Animate extends WPBakeryShortCodesContainer {
	// ...
}
