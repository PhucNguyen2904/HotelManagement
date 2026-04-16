<?php
/*
Plugin Name: AT: Sidebar Manager
Description: Description
Plugin URI: http://#
Author: Author
Author URI: http://#
Version: 1.0
License: GPL2
Text Domain: Text Domain
Domain Path: Domain Path
*/

/**
 * Class AT_Sidebar_Manager.
 */
class AT_Sidebar_Manager {
	/**
	 * AT_Sidebar_Manager version.
	 */
	const VERSION = '0.1.1-dev';

	/**
	 * //
	 *
	 * @var string
	 */
	protected $option_key = '_at_sidebars';

	/**
	 * //
	 *
	 * @var array
	 */
	protected $translation = array();

	/**
	 * //
	 *
	 * @var AT_Sidebar_Manager
	 */
	protected static $instance;

	/**
	 * Singleton implementation.
	 *
	 * @return AT_Sidebar_Manager
	 */
	public static function instance() {
		if ( ! static::$instance ) {
			static::$instance = new AT_Sidebar_Manager;
		}

		return static::$instance;
	}

	/**
	 * Constructor class
	 */
	public function __construct() {
		// Set default translation.
		$this->translation = $this->register_translation();

		// Register the custom sidebars.
		add_action( 'widgets_init', array( $this, 'register_sidebars' ) , 100 );

		// Enqueue the UI scripts and localize on the widgets page.
		add_action( 'sidebar_admin_setup', array( $this, 'enqueue_scripts' ) );

		// Setup template.
		add_action( 'sidebar_admin_page', array( $this, 'setup_template' ) );

		// Handler actions request.
		add_action( 'sidebar_admin_setup', array( $this, 'action_handler' ) );
		add_action( 'wp_ajax_at_add_sidebar', array( $this, 'action_handler' ) );
		add_action( 'wp_ajax_at_delete_sidebar', array( $this, 'action_handler' ) );

		static::$instance = $this;
	}

	/**
	 * //
	 *
	 * @return array
	 */
	protected function register_translation() {
		$translation = array(
			'new' => esc_html__( 'New Widget Area', 'awethemes' ),
			'edit' => esc_html__( 'Edit', 'awethemes' ),
			'delete' => esc_html__( 'Delete', 'awethemes' ),
		);

		return apply_filters( 'at_sidebar_translation', $translation );
	}

	/**
	 * Enqueue the UI scripts.
	 */
	public function enqueue_scripts() {
		add_thickbox();

		wp_enqueue_style( 'at-sidebar-manager', plugin_dir_url( __FILE__ ) . '/sidebar-ui.css', array(), static::VERSION );
		wp_enqueue_script( 'at-sidebar-manager', plugin_dir_url( __FILE__ ) . '/sidebar-ui.js', array( 'jquery' ), static::VERSION, true );

		wp_localize_script( 'at-sidebar-manager', 'ATSidebar', array(
			'nonce' => wp_create_nonce( 'at-sidebar-nonce' ),
			'button' => $this->create_button(),
			'sidebars' => $this->get_sidebars(),
		) );
	}

	/**
	 * Handle action requests.
	 *
	 * @return array|void Output JSON if DOING_AJAX, otherwise return an array
	 */
	public function action_handler() {
		if ( empty( $_POST['action'] ) || empty( $_POST['_atnonce'] ) ) {
			return;
		}

		if ( ! wp_verify_nonce( $_POST['_atnonce'], 'at-sidebar-nonce' ) ) { // WPCS: Sanitization OK.
			return;
		}

		$action = $_POST['action']; // WPCS: Sanitization OK.
		$result = false;

		switch ( $action ) {
			case 'at_add_sidebar':
				$result = $this->add_sidebar( $_POST['at-sidebar'] );
				break;

			case 'at_delete_sidebar':
				if ( ! empty( $_POST['id'] ) ) {
					$id = sanitize_title( wp_unslash( $_POST['id'] ) );
					$result = $this->delete_sidebar( $id );
				}

				break;
		}

		$response = array(
			'success' => false,
			'error' => null,
		);

		if ( is_wp_error( $result ) ) {
			$response['error'] = $result->get_error_message();
		} else {
			$response['success'] = (bool) $result;
		}

		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			wp_send_json( $response );
		}

		wp_redirect( admin_url( 'widgets.php' ) );
		exit();
	}

	/**
	 * Add a new custom sidebar.
	 *
	 * @param  array $args //.
	 * @return bool|WP_Error
	 */
	public function add_sidebar( $args ) {
		if ( empty( $args['name'] ) ) {
			return false;
		}

		// Registered sidebars.
		$registered_sidebars = $this->get_sidebars();

		$args['id'] = empty( $args['id'] ) ? $args['name'] : $args['id'];

		// Sanitize the sidebar ID the same way as dynamic_sidebar().
		$args['id'] = sanitize_title( $args['id'] );

		if ( isset( $registered_sidebars[ $args['id'] ] ) ) {
			return new WP_Error( 'sidebar-exists', __( 'Sidebar with the same ID is already registered.', 'awethemes' ) );
		}

		$registered_sidebars[ $args['id'] ] = $args;

		return update_option( $this->option_key, $registered_sidebars );
	}

	/**
	 * Remove a custom sidebar by ID.
	 *
	 * @param string $id Sidebar ID.
	 * @return bool|WP_Error
	 */
	public function delete_sidebar( $id ) {
		$registered_sidebars = $this->get_sidebars();

		if ( isset( $registered_sidebars[ $id ] ) ) {
			unset( $registered_sidebars[ $id ] );
		} else {
			return new WP_Error( 'sidebar-not-found', __( 'Sidebar not found.', 'awethemes' ) );
		}

		return update_option( $this->option_key, $registered_sidebars );
	}

	/**
	 * Get all the registered custom sidebars.
	 *
	 * @return array
	 */
	public function get_sidebars() {
		$raw_sidebars = (array) get_option( $this->option_key, array() );

		$registered_sidebars = array_map( array( $this, 'parse_args' ), $raw_sidebars );

		return apply_filters( 'at_sidebars', $registered_sidebars );
	}

	/**
	 * Register the custom sidebars.
	 */
	public function register_sidebars() {
		$registered_sidebars = $this->get_sidebars();

		foreach ( $registered_sidebars as $id => $args ) {
			$args['class'] = 'at-sidebar';

			if ( ! empty( $args['id'] ) ) {
				register_sidebar( $args );
			}
		}
	}

	/**
	 * //
	 */
	public function setup_template() {
		?>
		<!-- // -->
		<div id="at-sidebar-manager-popup" style="display:none;"></div>
		<div id="at-sidebar-manager-edit" style="display:none;"></div>

		<!-- / -->
		<script type="text/html" id="tmpl-at-sidebar-manager">
			<form class="at-create-sidebar" action="widgets.php" method="POST">
				<?php wp_nonce_field( 'at-sidebar-nonce', '_atnonce' ); ?>
				<input type="hidden" name="action" value="at_add_sidebar">

				<p>
					<label for="at_sidebar_name">Name</label>
					<input type="text" id="at_sidebar_name" name="at-sidebar[name]" placeholder="<?php esc_html_e( 'Enter sidebar name', 'awethemes' ) ?>">
				</p class="">

				<!-- <a href="#" class="show">Show</a> -->

				<div class="display" style="display: none;">
					<p>
						<label for="at_sidebar_id">ID</label>
						<input type="text" id="at_sidebar_id" name="at-sidebar[id]" placeholder="<?php esc_html_e( 'Sidebar ID', 'awethemes' ) ?>">
					</p>

					<p>
						<label for="at_sidebar_description">Description</label>
						<textarea id="at_sidebar_description" placeholder="<?php esc_html_e( 'Enter sidebar description', 'awethemes' ) ?>" name="at-sidebar[description]"></textarea>
					</p>
				</div>

		    	<div class="at-sidebar-actions">
		    		<input class="button" type="submit" value="<?php esc_html_e( 'Create New', 'awethemes' ) ?>">
		    	</div>
			</form>
		</script>

		<script type="text/html" id="tmpl-at-sidebar-action">
			<div class="abc submitbox ">
				<a href="#" class="submitdelete" data-id="{{{ data.id }}}">Delete</a>
				<a href="#" class="button carbon-btn-remove-sidebar">Edit</a>
			</div>
		</script>
		<?php
	}

	/**
	 * //
	 *
	 * @return string
	 */
	protected function create_button() {
		$output = '<a class="page-title-action at-create-sidebar thickbox" href="#TB_inline?width=320&height=auto&inlineId=at-sidebar-manager-popup" title="' . $this->translation['new'] . '">' . $this->translation['new'] . '</a>';

		/**
		 * //
		 *
		 * @param string $output
		 * @param AT_Sidebar_Manager $this
		 * @var string
		 */
		$output = apply_filters( 'at_sidebar_Manager_button', $output, $this );

		return $output;
	}

	/**
	 * //
	 *
	 * @param  string $args //.
	 * @return array
	 */
	protected function parse_args( $args ) {
		$default = array(
			'id' => '',
			'name' => '',
			'description' => '',
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget' => '</section>',
			'before_title' => '<h2 class="widget-title">',
			'after_title' => '</h2>',
		);

		/**
		 * //
		 *
		 * @var string
		 */
		$default = apply_filters( 'at_widget_default_args', $default );

		return wp_parse_args( $args, $default );
	}
}

new AT_Sidebar_Manager();
