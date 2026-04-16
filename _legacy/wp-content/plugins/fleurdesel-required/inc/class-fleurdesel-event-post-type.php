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
class Fleurdesel_Event_Post_Type extends Skeleton\Post_Type {
	/**
	 * Define a new post type.
	 */
	public function __construct() {
		parent::__construct( 'fl_event', esc_html__( 'Event', 'fleurdesel' ), esc_html__( 'Events', 'fleurdesel' ) );
		$fl_event = array(
			'public'   	 => true,
			'supports'	 => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'menu_icon'  => apply_filters( 'fleurdesel_event_icon','dashicons-calendar-alt' ),
			'rewrite'	 => array( 'slug' => 'event', 'with_front' => true ),
		);
		$this->set( apply_filters( 'fleurdesel_event_args', $fl_event ) );
	}

	/**
	 * Hook to column
	 *
	 * @param  [array] $columns [columns].
	 * @return [array]          [columns]
	 */
	public function columns( $columns ) {
		$new_column = array(
			'event_thumbnail' => sprintf( esc_html__( '%s Thumbnail', 'fleurdesel' ), $this->singular ),
		);

		return array_merge( $new_column, $columns );
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
			case 'event_thumbnail':
				the_post_thumbnail( array( 180, 180 ) );
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

		$this->create_metabox( 'fl_event', function ( $metabox ) {
			$metabox->set( array(
				'title' 	 => 'Settings',
				// 'object_types'  => array( 'event' ), // Post type
			));

			/** General Tab */

			$metabox->add_section( 'information', function( $tab ) {
				$prefix = 'information_';
				$tab->set( array(
					'title' => esc_html__( 'Information', 'fleurdesel' ),
				)  );

				$tab->add_field(array(
					'name' => esc_html__( 'Start Date', 'fleurdesel' ),
					'desc' => esc_html__( 'Your event will start on', 'fleurdesel' ),
					'id'   => $prefix . 'start_date',
					'default' => date( 'm/d/Y', strtotime( '+1 days' ) ),
					'type' => 'text_datetime_timestamp',
					'column' => array(
						'position' => 2,
					 ),
					'attributes' => array(
							'data-datepicker' => json_encode( array(
								'minDate'	=> date( 'm/d/Y', strtotime( '+1 days' ) ),
							) ),
							'readonly' 	=> 'true',
						),
				));

				$tab->add_field( array(
					'name' => esc_html__( 'End date', 'fleurdesel' ),
					'desc' => esc_html__( 'Your event will end on', 'fleurdesel' ),
					'id'   => $prefix . 'end_date',
					'type' => 'text_datetime_timestamp',
					'attributes' => array(
							'data-datepicker' => json_encode( array(
								'minDate'	=> date( 'm/d/Y', strtotime( '+1 days' ) ),
							) ),
							'readonly' 	=> 'true',
						 ),
				) );

				$tab->add_field( array(
					'name' => esc_html__( 'Location', 'fleurdesel' ),
					'id'   => $prefix . 'location',
					'type' => 'textarea',
				) );

				$tab->add_field( array(
					'name' => esc_html__( 'Map', 'fleurdesel' ),
					'id'   => $prefix . 'map',
					'type' => 'text_url',
				) );

			});

			/** Price Tab */
			$metabox->add_section( 'price', function( $tab ) {
				$prefix = 'price_';
				$tab->set( array(
					'title' => esc_html__( 'Price', 'fleurdesel' ),
				)  );

				$tab->add_field( array(
					'name' => esc_html__( 'Price Value', 'fleurdesel' ),
					'id'   => $prefix . 'value',
					'type' => 'text',
				) );

				$tab->add_field( array(
					'name' => esc_html__( 'Price Unit', 'fleurdesel' ),
					'id'   => $prefix . 'unit',
					'type' => 'text',
				) );
			});

			/** Extra Info tab */
			$metabox->add_section('organizer',function( $tab ) {
				$prefix = 'organizer_';
				$tab->set( array(
					'title' => esc_html__( 'Organizer', 'fleurdesel' ),
				)  );

				$tab->add_field( array(
					'name' => esc_html__( 'Phone', 'fleurdesel' ),
					'class' => 'regular-text',
					'id'   => $prefix . 'phone',
					'type' => 'text',
				));

				$tab->add_field( array(
					'name' => esc_html__( 'Email', 'fleurdesel' ),
					'class' => 'regular-text',
					'id'   => $prefix . 'email',
					'type' => 'text',
				));

				$tab->add_field( array(
					'name' => esc_html__( 'Address', 'fleurdesel' ),
					'class' => 'regular-text',
					'desc' => esc_html__( 'The place where your event will be hold', 'fleurdesel' ),
					'id'   => $prefix . 'address',
					'type' => 'textarea',
				));

				$tab->add_group( 'group_social', function( $group ) {
					$prefix = 'social_';
					$group->set( array(
						'name' => 'Social',
						'repeatable' => false,
					) );

					$group->add_field(array(
						'name' => esc_html__( 'Facebook', 'fleurdesel' ),
						'desc' => esc_html__( 'Enter Facebook page URL.', 'fleurdesel' ),
						'id'   => $prefix . 'facebook',
						'type' => 'text_url',
					));

					$group->add_field(array(
						'name' => esc_html__( 'Twitter', 'fleurdesel' ),
						'desc' => esc_html__( 'Enter Twitter page URL.', 'fleurdesel' ),
						'id'   => $prefix . 'twitter',
						'type' => 'text_url',
					));

					$group->add_field(array(
						'name' => esc_html__( 'Instagram', 'fleurdesel' ),
						'desc' => esc_html__( 'Enter Instagram page URL.', 'fleurdesel' ),
						'id'   => $prefix . 'instagram',
						'type' => 'text_url',
					));

					$group->add_field(array(
						'name' => esc_html__( 'Pinterest', 'fleurdesel' ),
						'desc' => esc_html__( 'Enter Pinterest page URL.', 'fleurdesel' ),
						'id'   => $prefix . 'pinterest',
						'type' => 'text_url',
					));

					$group->add_field(array(
						'name' => esc_html__( 'G+', 'fleurdesel' ),
						'desc' => esc_html__( 'Enter Google Plus page URL.', 'fleurdesel' ),
						'id'   => $prefix . 'gplus',
						'type' => 'text_url',
					));
				});
			});
		});
	}
}


/**
 * Fleurdesel Event Taxonomy.
 */
class Fleurdesel_Event_Type_Taxonomy extends Skeleton\Taxonomy {

	/**
	 * Define a custom taxonomy.
	 */
	public function __construct() {
		parent::__construct( 'fl_event_cat', array( 'fl_event' ), 'Event Category', 'Event Categories' );

		$this->set();
	}
}

/**
 * Event Functions
 */
class Fleurdesel_Event_Functions {
	/**
	 * Get event time meta data.
	 *
	 * @param  [int] $post_id [post id].
	 * @return [array]          [time]
	 */
	public static function get_event_time_meta( $post_id = null ) {
		if ( null == $post_id ) {
			$post_id = get_the_ID();
		}

		// Start date.
		$start_date_meta = get_post_meta( $post_id, 'information_start_date' , true );
		$start_date_str = '';
		if ( isset( $start_date_meta ) && $start_date_meta ) {
			$start_date_str = (int) $start_date_meta;
		}

		// End date.
		$end_date_meta = get_post_meta( $post_id, 'information_end_date' , true );
		$end_date_str = '';
		if ( isset( $end_date_meta ) && $end_date_meta ) {
			$end_date_str = (int) $end_date_meta;
		}

		$time = array(
			'start' => $start_date_str,
			'end'   => $end_date_str,
		);
		return $time;
	}

	/**
	 * Get event time with type and format.
	 *
	 * @param  string $type   [type].
	 * @param  string $format [format].
	 * @return [string]         [tine]
	 */
	public static function get_event_time( $type = 'start', $format = 'F Y' ) {
		$time = self::get_event_time_meta();
		$date = '';
		if ( $time[ $type ] ) {
			$date = date_i18n( $format, $time[ $type ] , false );
		}
		return $date;
	}

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
		$price = array(
			'value' => $value,
			'unit'  => $unit,
		);
		return $price;
	}

	/**
	 * Get more information.
	 *
	 * @param  string $key     [key].
	 * @param  [int]  $post_id [post id].
	 *
	 * @return [string]          [information]
	 */
	public static function get_more_info( $key = 'information_location', $post_id = null ) {
		if ( null == $post_id ) {
			$post_id = get_the_ID();
		}

		$info = get_post_meta( $post_id, $key , true );
		return $info;
	}
}
