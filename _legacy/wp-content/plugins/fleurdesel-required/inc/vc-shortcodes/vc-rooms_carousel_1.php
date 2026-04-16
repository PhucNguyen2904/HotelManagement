<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

if ( ! class_exists( 'AweBooking' ) ) {
	return;
}

/**
 * Register rooms carousel content element
 */
function vcmap_rooms_carousel_1() {
	$order_by_values = array(
		'',
		esc_html__( 'Date', 'fleurdesel' ) 			=> 'date',
		esc_html__( 'ID', 'fleurdesel' ) 			=> 'ID',
		esc_html__( 'Author', 'fleurdesel' ) 		=> 'author',
		esc_html__( 'Title', 'fleurdesel' ) 			=> 'title',
		esc_html__( 'Modified', 'fleurdesel' ) 		=> 'modified',
		esc_html__( 'Random', 'fleurdesel' ) 		=> 'rand',
		esc_html__( 'Comment count', 'fleurdesel' ) 	=> 'comment_count',
		esc_html__( 'Menu order', 'fleurdesel' ) 	=> 'menu_order',
	);

	$order_way_values = array(
		'',
		esc_html__( 'Descending', 'fleurdesel' ) => 'DESC',
		esc_html__( 'Ascending', 'fleurdesel' ) 	=> 'ASC',
	);

	$params = array(
		array(
			'type'        => 'dropdown',
			'param_name'  => 'layout',
			'heading'     => esc_html__( 'Layout', 'fleurdesel' ),
			'value'       => array(
				__( 'Standard', 'fleurdesel' )   	=> 'standard',
				__( 'Grid', 'fleurdesel' )   		=> 'grid',
				__( 'List', 'fleurdesel' ) 			=> 'list',
				__( 'Zigzag', 'fleurdesel' ) 		=> 'zigzag',
				__( 'Grid with extra information', 'fleurdesel' ) 		=> 'grid_extra_info',
				__( 'Grid with extra information icon', 'fleurdesel' ) 	=> 'grid_extra_info_icon',
				__( 'Overlay with content', 'fleurdesel' ) 				=> 'overlay_with_content',
				__( 'Overlay with extra information', 'fleurdesel' ) 	=> 'overlay_with_extra_info',
			),
			'std'         => 'grid',
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'alignment',
			'heading'     => esc_html__( 'Alignment', 'fleurdesel' ),
			'value'       => array(
				__( 'Left', 'fleurdesel' )   	=> 'left',
				__( 'Center', 'fleurdesel' ) 	=> 'center',
				__( 'Right', 'fleurdesel' )   	=> 'right',
			),
			'std'         => 'center',
		),
		array(
			'type' 			=> 'textfield',
			'heading' 		=> esc_html__( 'Per page', 'fleurdesel' ),
			'param_name' 	=> 'per_page',
			'std' 		    => 6,
			'description' 	=> esc_html__( 'How much items per page to show', 'fleurdesel' ),
		),
		array(
			'type' 			=> 'dropdown',
			'heading' 		=> esc_html__( 'Order by', 'fleurdesel' ),
			'param_name' 	=> 'orderby',
			'value' 		=> $order_by_values,
			'description' 	=> sprintf( esc_html__( 'Select how to sort retrieved products. More at %s.', 'fleurdesel' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' ),
		),
		array(
			'type' 			=> 'dropdown',
			'heading' 		=> esc_html__( 'Sort order', 'fleurdesel' ),
			'param_name' 	=> 'order',
			'value' 		=> $order_way_values,
			'description' 	=> sprintf( esc_html__( 'Designates the ascending or descending order. More at %s.', 'fleurdesel' ), '<a href="http://codex.wordpress.org/Class_Reference/WP_Query#Order_.26_Orderby_Parameters" target="_blank">WordPress codex page</a>' ),
		),
	);

	$params = array_merge(
		$params,
		VC_Extended_Snippets::design_options(),
		VC_Extended_Snippets::slick_params( 'lg:4|md:4|sm:2|xs:1' )
	);

	return array(
		'name'        => esc_html__( 'Rooms Carousel (Normal)', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display rooms as normal carousel.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_rooms_carousel_1', 'vcmap_rooms_carousel_1' );

/**
 * WPBakeryShortCode_Fleurdesel_Rooms_Carousel_1
 */
class WPBakeryShortCode_Fleurdesel_Rooms_Carousel_1 extends Fleurdesel_Shortcode_Abstract {
}
