<?php
/**
 * Fleurdesel Post Type Register and Use
 *
 * @class 		Fleurdesel_Post_Type
 * @package		Fleurdesel
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Fleurdesel Event post type.
 */
class Fleurdesel_Package_Post_Type extends Skeleton\Post_Type {
	/**
	 * Define a new post type.
	 */
	public function __construct() {
		parent::__construct( 'fl_package', esc_html__( 'Package', 'fleurdesel' ), esc_html__( 'Packages', 'fleurdesel' ) );
		$fl_package = array(
			'public'   	 => true,
			'supports'	 => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
			'menu_icon'  => apply_filters( 'fleurdesel_package_icon','dashicons-awards' ),
			'rewrite'	 => array( 'slug' => 'package', 'with_front' => true ),
			'has_archive' => false,
		);
		$this->set( apply_filters( 'fleurdesel_package_args', $fl_package ) );
	}

	/**
	 * Hook to column
	 *
	 * @param  [array] $columns [columns].
	 * @return [array]          [columns]
	 */
	public function columns( $columns ) {
		$new_columns = array();

		$i = 0;
		foreach ( $columns as $k => $v ) {
			if ( 1 === $i ) {
				$new_columns['package_thumbnail'] = sprintf( esc_html__( '%s Thumbnail', 'fleurdesel' ), $this->singular );
			}

			$new_columns[ $k ] = $v;

			$i++;
		}

		return $new_columns;
	}

	/**
	 * Handles admin column display. To be overridden by an extended class.
	 *
	 * @access private
	 *
	 * @param array $column  Array of registered column names.
	 * @param int   $post_id Current post ID.
	 */
	public function columns_display( $column, $post_id ) {
		switch ( $column ) {
			case 'package_thumbnail':
				the_post_thumbnail( 'thumbnail' );
				break;
		}
	}

	/**
	 * Add meta boxes to this post type.
	 *
	 * @see $this->create_metabox()
	 * @see \Awethemes\Skeleton\Metabox
	 */
	public function register_metaboxes() {

		$this->create_metabox( 'fl_package', function ( $metabox ) {
			$metabox->set( array(
				'title' 	 => 'Settings',
				// 'object_types'  => array( 'package' ), // Post type
			));

			/** Price */
			$prefix = 'price_';
			$metabox->set( array(
				'title' => esc_html__( 'Price', 'fleurdesel' ),
			)  );

			$metabox->add_field( array(
				'name' => esc_html__( 'Price Value', 'fleurdesel' ),
				'id'   => $prefix . 'value',
				'type' => 'text',
			) );

			$metabox->add_field( array(
				'name' => esc_html__( 'Price Unit', 'fleurdesel' ),
				'id'   => $prefix . 'unit',
				'type' => 'text',
				'default' => 'package',
			) );
		});
	}
}

/**
 * Event Functions
 */
class Fleurdesel_Package_Functions {
	/**
	 * Get price.
	 *
	 * @param  int $post_id   [post id].
	 * @return [type] [description]
	 */
	public static function get_price( $post_id = null ) {
		if ( null == $post_id ) {
			$post_id = get_the_ID();
		}

		$value = get_post_meta( $post_id, 'price_value' , true );
		$unit = get_post_meta( $post_id, 'price_unit' , true );

		if ( ! $value || ! $unit ) {
			return;
		}

		$price = array(
			'value' => $value,
			'unit'  => $unit,
		);
		return $price;
	}
}
