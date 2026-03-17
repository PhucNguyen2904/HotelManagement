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
 * Register rooms
 */
function vcmap_fleurdesel_rooms() {

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
			'admin_label' => true,
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'columns',
			'heading'     => esc_html__( 'Columns', 'fleurdesel' ),
			'value'       => array( 2, 3, 4 ),
			'std'         => 3,
			'dependency'  => array(
				'element' => 'layout',
				'value'   => array( 'grid', 'grid_extra_info', 'grid_extra_info_icon', 'overlay_with_content', 'overlay_with_extra_info' ),
			),
		),
		array(
			'type'        => 'dropdown',
			'param_name'  => 'room_content_alignment',
			'heading'     => esc_html__( 'Alignment', 'fleurdesel' ),
			'value'       => array(
				__( 'Left', 'fleurdesel' )   	=> 'left',
				__( 'Center', 'fleurdesel' )   	=> 'center',
				__( 'Right', 'fleurdesel' ) 	=> 'right',
			),
			'std'         => 'center',
		),
		array(
			'type' 			=> 'textfield',
			'heading' 		=> esc_html__( 'Per page', 'fleurdesel' ),
			'param_name' 	=> 'per_page',
			'std' 			=> 12,
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
		VC_Extended_Snippets::design_options()
	);

	return array(
		'name'        => esc_html__( 'Rooms', 'fleurdesel' ),
		'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
		'description' => esc_html__( 'Display rooms.', 'fleurdesel' ),
		'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
		'params'      => $params,
	);
}
vc_lean_map( 'fleurdesel_rooms', 'vcmap_fleurdesel_rooms' );

/**
 * WPBakeryShortCode_Fleurdesel_Rooms
 */
class WPBakeryShortCode_Fleurdesel_Rooms extends Fleurdesel_Shortcode_Abstract {
}
