<?php
/**
 * Awethemes Twitter Admin.
 *
 * @package AweThemes
 * @subpackage Twitter Client
 */

if ( ! class_exists( 'AT_Twitter_Admin' ) ) :
	/**
	 * Register admin setting for Twitter client.
	 */
	class AT_Twitter_Admin {
		/**
		 * Singleton reference to singleton instance.
		 *
		 * @var self
		 */
		protected static $instance;

		/**
		 * Gets the instance via lazy initialization.
		 *
		 * @return self
		 */
		public static function instance() {
			if ( null === static::$instance ) {
				static::$instance = new static;
			}

			return static::$instance;
		}

		/**
		 * Hooks actions to WP.
		 *
		 * Private constuctor for Singleton Design Pattern.
		 * @see https://github.com/domnikl/DesignPatternsPHP/tree/master/Creational/Singleton
		 */
		private function __construct() {
			add_action( 'admin_menu', array( $this, '_register_options_page' ) );
			add_action( 'admin_welcome_init', array( $this, '_register_welcome_tab' ) );
		}

		/**
		 * Add new welcome tab.
		 *
		 * @param AT_Admin_Welcome $instance
		 *
		 * @access private
		 */
		public function _register_welcome_tab( $instance ) {
			$instance->add_tab( array(
				'id'    => 'twitter',
				'title' => esc_html__( 'Twitter Credentials', 'awethemes' ),
				'link'  => admin_url( 'options-general.php?page=at-twitter' ),
			) );
		}

		/**
		 * Add twitter setting menu.
		 *
		 * @access private
		 */
		public function _register_options_page() {
			$title = esc_html__( 'Twitter Credentials', 'awethemes' );
			add_options_page( $title, $title, 'manage_options', 'at-twitter', array( $this, '_display_settings_page' ) );
		}

		/**
		 * Display option page.
		 *
		 * @access private
		 */
		public function _display_settings_page() {
			global $allowedposttags;

			$fields = array(
				'consumer_key'        => esc_html__( 'Consumer Key (API Key)', 'awethemes' ),
				'consumer_secret'     => esc_html__( 'Consumer Secret (API Secret)', 'awethemes' ),
				'access_token'        => esc_html__( 'Access Token', 'awethemes' ),
				'access_token_secret' => esc_html__( 'Access Token Secret', 'awethemes' ),
			);

			$credentials = wp_parse_args( (array) get_option( 'at-twitter' ), array(
				'consumer_key'        => '',
				'consumer_secret'     => '',
				'access_token'        => '',
				'access_token_secret' => '',
			) );

			?>

			<div class="wrap">
				<h2><?php echo esc_html__( 'Twitter Credentials', 'awethemes' ); ?></h2>
				<p><?php echo wp_kses( __( 'Visit <a target="_blank" href="https://apps.twitter.com">here</a> to create and get API and access keys.', 'awethemes' ), $allowedposttags ); ?></p>

				<?php if ( class_exists( 'AT_Admin_Welcome' ) ) :
					AT_Admin_Welcome::instance()->display_nav_tabs( 'twitter' );
				endif; ?>

				<form method="post" action="options.php">
					<?php wp_nonce_field( 'update-options' ); ?>
					<input type="hidden" name="action" value="update">
					<input type="hidden" name="page_options" value="at-twitter">

					<table class="form-table">
						<tbody>
						<?php foreach ( $fields as $key => $name ) : ?>
						<tr>
							<th scope="row">
								<label for="<?php echo esc_attr( $key ); ?>"><?php print $name; // WPCS: XSS OK. ?></label>
							</th>

							<td>
								<input name="at-twitter[<?php echo esc_attr( $key ); ?>]" type="text" id="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $credentials[ $key ] ); ?>" class="regular-text" required="">
							</td>
						</tr>
						<?php endforeach; ?>
						</tbody>
					</table>

					<p class="submit">
						<input type="submit" name="submit" id="submit" class="button button-primary" value="<?php echo esc_html__( 'Save Changes', 'awethemes' ); ?>">
					</p>
				</form>
			</div><?php
		}
	}
endif;
