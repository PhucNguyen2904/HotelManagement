<?php
/**
 * Visual Composer Shortcode Builder.
 *
 * @package Event2
 */

// if ( class_exists( 'Fleurdesel_Event_Post_Type' ) ) {
	/**
	 * Get event type.
	 */
	function vc_fleurdesel_get_event_categories() {
		$autocomplete_value = array();
		$terms = get_terms( 'fl_event_cat' );

		if ( empty( $terms ) ) {
			return $autocomplete_value;
		}

		if ( ! is_wp_error( $terms ) ) {
			foreach ( $terms as $term ) {
				$autocomplete_value[] = array(
					'label' => $term->name,
					'value' => $term->term_id,
				);
			}
		}

		return $autocomplete_value;
	}

	/**
	 * Register speakers carousel content element
	 */
	function vcmap_events() {
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
					__( 'Grid', 'fleurdesel' )       => 'grid',
					__( 'List', 'fleurdesel' )       => 'list',
					__( 'Zigzag', 'fleurdesel' )     => 'zigzag',
					__( 'Modern', 'fleurdesel' )     => 'modern',
				),
				'std'         => 'grid',
				'admin_label' => true,
			),
			array(
				'type'        => 'dropdown',
				'param_name'  => 'column',
				'heading'     => esc_html__( 'Column', 'fleurdesel' ),
				'value'       => array(
					__( '1', 'fleurdesel' )       => '1',
					__( '2', 'fleurdesel' )       => '2',
					__( '3', 'fleurdesel' )       => '3',
				),
				'std'         => '2',
				'dependency'  => array(
					'element' => 'layout',
					'value'   => array( 'grid' ),
				),
			),
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
			VC_Extended_Snippets::design_options()
		);

		return array(
			'name'        => esc_html__( 'Events', 'fleurdesel' ),
			'category'    => esc_html__( 'AweThemes', 'fleurdesel' ),
			'description' => esc_html__( 'Display events.', 'fleurdesel' ),
			'icon'        => 	FLEURDESEL_PLUGIN_URL . 'icons/awethemes.png',
			'params'      => $params,
		);
	}
	vc_lean_map( 'fleurdesel_events', 'vcmap_events' );

	/**
	 * WPBakeryShortCode_Fleurdesel_Events
	 */
	class WPBakeryShortCode_Fleurdesel_Events extends Fleurdesel_Shortcode_Abstract {
	}
// }
