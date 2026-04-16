<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Fleurdesel
 */

// if ( class_exists( 'Fleurdesel_Event_Post_Type' ) ) {
	/**
	 * Register events carousel content element
	 */
	function vcmap_events_carousel() {
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
				'type'        => 'autocomplete',
				'param_name'  => 'filter_ids',
				'heading'     => __( 'Choose event categories', 'fleurdesel' ),
				'settings'    => array(
					'multiple'       => 1,
					'sortable'       => 1,
					'min_length'     => 1,
					'unique_values'  => true,
					'display_inline' => true,
					'values'         => vc_fleurdesel_get_event_categories(),
				),
				'description' => 'Default: Auto select',
			),
			array(
				'type' 			=> 'textfield',
				'heading' 		=> esc_html__( 'Per page', 'fleurdesel' ),
				'param_name' 	=> 'per_page',
				'std' 		    => 12,
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
			VC_Extended_Snippets::slick_params( 'lg:3|md:3|sm:2|xs:1' )
		);

		return array(
			'name'        => esc_html__( 'Events Carousel', 'fleurdesel' ),
			'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
			'description' => esc_html__( 'Display events as carousel.', 'fleurdesel' ),
			'icon'        => FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
			'params'      => $params,
		);
	}
	vc_lean_map( 'fleurdesel_events_carousel', 'vcmap_events_carousel' );

	/**
	 * WPBakeryShortCode_Fleurdesel_Events_Carousel
	 */
	class WPBakeryShortCode_Fleurdesel_Events_Carousel extends Fleurdesel_Shortcode_Abstract {
	}
// }
