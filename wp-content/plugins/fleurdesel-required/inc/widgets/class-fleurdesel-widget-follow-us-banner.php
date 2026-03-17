<?php
/**
 * Widget Follow Us Banner
 *
 * @package Fleurdesel
 */

/**
 * Fleurdesel_Widget_Follow_Us_Banner
 */
class Fleurdesel_Widget_Follow_Us_Banner extends WP_Widget {

	/**
	 * Constructor of class
	 */
	public function __construct() {
		$widget_ops = array(
			'classname'   => 'fleurdesel-follow-us-banner-widget',
			'description' => esc_html__( 'Display the social banner in widgets', 'fleurdesel' ),
		);

		parent::__construct( 'fleurdesel-follow-us-banner', esc_html__( 'Fleurdesel: Follow us banner', 'fleurdesel' ), $widget_ops );
	}

	/**
	 * Display widget.
	 *
	 * @param  array $args     Sidebar data.
	 * @param  array $instance Widget data.
	 * @return void
	 */
	public function widget( $args, $instance ) {
		$instance = wp_parse_args( (array) $instance, array(
			'icon_class' => 'fa fa-instagram',
			'title'      => '',
			'image_url'  => '',
			'text'       => 'FOLLOW US ON <span>Instagram</span>',
			'tag'        => 'awethemes',
		) );

		echo $args['before_widget']; // WPCS: XSS OK.

		if ( $instance['title'] ) {
			echo $args['before_title'] . $instance['title'] . $args['after_title']; // WPCS: XSS OK.
		}

		?>
		<div class="social-banner">
			<?php if ( $instance['image_url'] ) : ?>
				<div class="social-banner__image">
					<img src="<?php echo esc_url( $instance['image_url'] ); ?>" alt="">
				</div>
			<?php endif; ?>

			<div class="social-banner__content">
				<?php if ( $instance['icon_class'] ) : ?>
					<div class="social-banner__icon">
						<i class="<?php echo esc_attr( $instance['icon_class'] ); ?>"></i>
					</div>
				<?php endif; ?>

				<?php if ( $instance['text'] ) : ?>
					<div class="social-banner__text">
						<?php echo wp_kses_post( $instance['text'] ); ?>
					</div>
				<?php endif; ?>

				<?php if ( $instance['tag'] ) : ?>
					<div class="social-banner__tag">
						# <?php echo esc_html( $instance['tag'] ); ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<?php

		echo $args['after_widget']; // WPCS: XSS OK.
	}

	/**
	 * Display widget control.
	 *
	 * @param  array $instance Widget data.
	 * @return void
	 */
	public function form( $instance ) {
		$instance = wp_parse_args( (array) $instance, array(
			'icon_class' => 'fa fa-instagram',
			'title'      => '',
			'image_url'  => '',
			'text'       => 'FOLLOW US ON <span>Instagram</span>',
			'tag'        => 'awethemes',
		) );

		$title = strip_tags( $instance['title'] );
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Title', 'fleurdesel' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'icon_class' ) ); ?>"><?php esc_html_e( 'Icon class', 'fleurdesel' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'icon_class' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'icon_class' ) ); ?>" type="text" value="<?php echo esc_attr( $instance['icon_class'] ); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'image_url' ) ); ?>"><?php esc_html_e( 'Banner image', 'fleurdesel' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'image_url' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'image_url' ) ); ?>" type="text" value="<?php echo esc_url( $instance['image_url'] ); ?>" />
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'text' ) ); ?>"><?php esc_html_e( 'Banner text', 'fleurdesel' ); ?></label>
			<textarea class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'text' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'text' ) ); ?>"><?php echo esc_textarea( $instance['text'] ); ?></textarea>
		</p>

		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'tag' ) ); ?>"><?php esc_html_e( 'Tag', 'fleurdesel' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'tag' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'tag' ) ); ?>" type="text" value="<?php echo esc_attr( $instance['tag'] ); ?>" />
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

		$instance['title'] = isset( $new_instance['title'] ) ? sanitize_text_field( $new_instance['title'] ) : '';
		$instance['icon_class'] = isset( $new_instance['icon_class'] ) ? sanitize_text_field( $new_instance['icon_class'] ) : '';
		$instance['image_url'] = isset( $new_instance['image_url'] ) ? esc_url( $new_instance['image_url'] ) : '';
		$instance['text'] = isset( $new_instance['text'] ) ? wp_kses_post( $new_instance['text'] ) : 'FOLLOW US ON <span>Instagram</span>';
		$instance['tag'] = isset( $new_instance['tag'] ) ? sanitize_text_field( $new_instance['tag'] ) : 'awethemes';

		return $instance;
	}
}

/**
 * Register widget.
 */
function fleurdesel_follow_us_banner_widget_register() {
	register_widget( 'Fleurdesel_Widget_Follow_Us_Banner' );
}
add_action( 'widgets_init', 'fleurdesel_follow_us_banner_widget_register' );
