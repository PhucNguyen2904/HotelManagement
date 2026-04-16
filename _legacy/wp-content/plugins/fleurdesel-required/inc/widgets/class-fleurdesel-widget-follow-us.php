<?php
/**
 * Fleurdesel Widgets
 *
 * @package Fleurdesel Required
 */

/**
 * Fleurdesel_Follow_Us_Widget
 */
class Fleurdesel_Follow_Us_Widget extends WP_Widget {

	/**
	 * Constructor of class
	 */
	public function __construct() {
		$widget_ops = array(
			'classname'   => 'fleurdesel-follow-us-widget',
			'description' => esc_html__( 'Display the social network in widgets', 'fleurdesel' ),
		);

		parent::__construct( 'fleurdesel-follow-us', esc_html__( 'Fleurdesel: Follow us', 'fleurdesel' ), $widget_ops );
	}

	/**
	 * Display widget.
	 *
	 * @param  array $args     Sidebar data.
	 * @param  array $instance Widget data.
	 * @return void
	 */
	public function widget( $args, $instance ) {
		$title = $instance['title'];

		echo $args['before_widget']; // WPCS: XSS OK.

		if ( $title ) {
			echo $args['before_title'] . $title . $args['after_title']; // WPCS: XSS OK.
		}

		if ( $profiles = fleurdesel_social()->get_profile() ) :
			?>
			<div class="sociallist">
				<?php foreach ( $profiles as $key => $value ) : ?>
					<a href="<?php echo esc_url( $value['link'] ) ?>" title="<?php echo esc_html( $value['name'] ) ?>" <?php if ( fleurdesel_option( 'social_blank' ) ) : ?>target="_blank"<?php endif; ?>><i class="fa fa-<?php echo esc_html( $key ) ?>"></i></a>
				<?php endforeach; ?>
			</div>
			<?php
		endif;
		echo $args['after_widget']; // WPCS: XSS OK.
	}

	/**
	 * Display widget control.
	 *
	 * @param  array $instance Widget data.
	 * @return void
	 */
	public function form( $instance ) {
		$instance = wp_parse_args( (array) $instance, array( 'title' => '' ) );
		$title = strip_tags( $instance['title'] );
		?>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Title', 'fleurdesel' ); ?></label>
				<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
			</p>
		<?php
	}

	/**
	 * Save widget data.
	 *
	 * @param  array $new_instance New instance.
	 * @param  array $old_instance Old instnace.
	 * @return array Save data.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = $old_instance;

		$instance['title'] = $new_instance['title'];

		return $instance;
	}
}

/**
 * Register Fleurdesel_Follow_Us_Widget
 */
function fleurdesel_register_follow_us_widget() {
	register_widget( 'Fleurdesel_Follow_Us_Widget' );
}
add_action( 'widgets_init', 'fleurdesel_register_follow_us_widget' );
