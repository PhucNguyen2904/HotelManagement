<?php
namespace Awethemes\Theme_Options;

use CMB2_JS;
use CMB2_hookup;
use WP_Customize_Manager;
use BadMethodCallException;
use Skeleton\Admin_Page;
use Skeleton\Skeleton;

/**
 * Make a framework theme options in WordPress.
 */
class Theme_Options {
	/**
	 * The globally available instance of the skeleton container.
	 *
	 * @var Skeleton
	 */
	protected $skeleton;

	/**
	 * Admin_Page instance.
	 *
	 * @var Admin_Page
	 */
	protected $admin_page;

	/**
	 * An instance of the current theme.
	 *
	 * @var WP_Theme
	 */
	protected $theme;

	/**
	 * //
	 *
	 * @param Skeleton $skeleton
	 * @param array    $theme_support
	 */
	public function __construct( Skeleton $skeleton, $theme_support = array() ) {
		$this->skeleton = $skeleton;
		$this->theme = wp_get_theme();

		$this->theme_support = wp_parse_args( $theme_support, array(
			'option_id'   => 'awethemes_options',
			'menu_slug'   => sprintf( '%s-settings', $this->theme->get_template() ),
			'menu_title'  => esc_html__( 'Theme Settings', 'skeleton' ),
			'parent_slug' => 'themes.php',
			'customizer'  => true,
		) );

		$this->admin_page = Admin_Page::make( $this->theme_support['option_id'] )->set(array(
			'menu_slug'       => $this->theme_support['menu_slug'],
			'parent_slug'     => $this->theme_support['parent_slug'],
			'menu_title'      => $this->theme_support['menu_title'],
			'render_callback' => array( $this, 'display' ),
		));

		$this->setting_admin_page();

		// Register core settings.
		// $this->register();

		/**
		 * User register theme settings.
		 *
		 * @param Theme_Options $theme_options Theme Options object instance.
		 */
		do_action( 'awethemes/theme_options/registers', $this );

		add_action( 'customize_register', array( $this, 'customize_register' ) );
		add_action( 'customize_controls_enqueue_scripts', array( $this, 'customize_enqueue_scripts' ) );

		add_action( 'load-appearance_page_' . $this->theme_support['menu_slug'], function () {
			$_GET['noheader'] = true;
		});

		// Listen hooks.
		// add_filter( 'body_class', array( $this, '_body_classes' ) );
		// add_action( 'skeleton/custom_css', array( $this, '_print_custom_styles' ) );
	}

	/**
	 * Enqueue script for custom customize control.
	 */
	public function customize_enqueue_scripts() {
		CMB2_hookup::enqueue_cmb_css();
		wp_enqueue_style( 'skeleton' );

		CMB2_JS::enqueue();
		wp_enqueue_script( 'jquery-ui-core' );
		wp_enqueue_script( 'jquery-ui-datepicker' );
		wp_enqueue_script( 'wp-color-picker-alpha' );

		wp_enqueue_script( 'skeleton' );
	}

	/**
	 * Register customize sections, panels, settings, controls.
	 *
	 * @param  WP_Customize_Manager $wp_customize
	 * @return void
	 */
	public function customize_register( WP_Customize_Manager $wp_customize ) {
		if ( ! $this->theme_support['customizer'] ) {
			return;
		}

		// CMB2 instance.
		$cmb2 = $this->admin_page;

		foreach ( $cmb2->sections() as $section ) {
			$wp_customize->add_section( new Customizer\Customize_Section( $wp_customize, $section ) );
		}

		foreach ( $cmb2->panels() as $panel ) {
			$wp_customize->add_panel( new Customizer\Customize_Panel( $wp_customize, $panel ) );
		}

		// Register settings and controls.
		foreach ( $cmb2->prop( 'fields' ) as $id => $args ) {
			$wp_customize->add_setting( new Customizer\Customize_Setting( $wp_customize, $cmb2, $args ) );
			$wp_customize->add_control( new Customizer\Customize_Control( $wp_customize, $cmb2, $args ) );
		}
	}

	/**
	 * Get the current theme.
	 *
	 * @return WP_Theme
	 */
	public function theme() {
		return $this->theme;
	}

	/**
	 * Register core theme options.
	 *
	 * @return void
	 */
	public function register() {
		// Custom code section.
		$this->add_section( '_custom_code', array(
			'title'    => esc_html__( 'Custom Code', 'skeleton' ),
			'icon'     => 'dashicons-editor-code',
			'priority' => 360,
		));

		$this->add_field(array(
			'id'      => '_custom_css',
			'type'    => 'css_code',
			'section' => '_custom_code',
			'default' => sprintf( "/*\n%s\n*/", __( "You can add your own CSS here.\n\nClick the help icon above to learn more." ) ),
			'before_field'        => sprintf( '<p>%s<br /><a href="%s" class="external-link" target="_blank">%s<span class="screen-reader-text">%s</span></a></p>',
				__( 'CSS allows you to customize the appearance and layout of your site with code. Separate CSS is saved for each of your themes. In the editing area the Tab key enters a tab character. To move below this area by pressing Tab, press the Esc key followed by the Tab key.' ),
				esc_url( __( 'https://codex.wordpress.org/CSS' ) ),
				__( 'Learn more about CSS' ),
				__( '(link opens in a new window)' )
			),
		));

		// Backups section.
		$this->add_panel( 'backups-panel', array(
			'title'    => esc_html__( 'Backups Manager', 'skeleton' ),
			'icon'     => 'dashicons-shield-alt',
			'priority' => 360,
		));

		$this->add_section( 'backups', array(
			'title'    => esc_html__( 'Backups', 'skeleton' ),
			'icon'     => 'dashicons-shield-alt',
			'priority' => 360,
			// 'panel'    => 'backups-panel',
		));
	}

	/**
	 * Print theme option custom CSS.
	 */
	public function _print_custom_styles() {
		// Add inline css from custom_css field.
		if ( $custom_css = $this->get( 'custom_css' ) ) {
			$this->skeleton['custom_css']->add_inline( $custom_css );
		}
	}

	/**
	 * Adds custom classes to the array of body classes.
	 *
	 * @param array $classes Classes for the body element.
	 * @return array
	 */
	public function _body_classes( $classes ) {
		if ( $this->get( 'custom_css' ) ) {
			$classes[] = 'custom-background';
		}

		return $classes;
	}

	/**
	 * Admin page markup. Mostly handled by CMB2.
	 */
	public function display() {
		$admin_page = $this->admin_page;

		// @todo more hardening?
		if ( isset( $_POST['submit-cmb'], $_POST['object_id'], $_POST[ $admin_page->nonce() ] ) &&
			wp_verify_nonce( $_POST[ $admin_page->nonce() ], $admin_page->nonce() ) ) {

			$admin_page->save_fields( $admin_page->page_id, $admin_page->object_type(), $_POST );

			wp_safe_redirect(
				add_query_arg( 'page', $this->theme_support['menu_slug'], admin_url( $this->theme_support['parent_slug'] ) )
			);

			exit;
		}

		\CMB2_hookup::enqueue_cmb_css();
		\CMB2_hookup::enqueue_cmb_js();

		if ( isset( $_GET['noheader'] ) && $_GET['noheader'] ) {
			require_once ABSPATH . 'wp-admin/admin-header.php';
		}

		?><div class="wrap"><h2></h2></div>

		<div id="page-settings-<?php echo esc_attr( $admin_page->page_id ); ?>" class="cmb2-page-framework">

			<form class="cmb-form" method="post" id="<?php echo esc_attr( $admin_page->cmb_id ); ?>" enctype="multipart/form-data" encoding="multipart/form-data">
				<input type="hidden" name="object_id" value="<?php echo esc_attr( $admin_page->page_id ); ?>">

				<?php $admin_page->show_form(); ?>
			</form>

		</div><?php
	}

	/**
	 * Display theme options header.
	 */
	public function display_header() {
		?>
		<style>
			.cmb2-wrap {
				margin-top: 0;
			}
		</style>
		<div class="cmb2-page-framework-header">
			<div style="float: right;">
				<input type="submit" name="submit-cmb" value="Save" class="button">
			</div>

			<div class="cmb2-page-framework-logo" style="padding-top: 18px;">
				<img src="<?php echo esc_url( SKELETON_PLUGIN_URL . 'img/logo.png' ); ?>">
				<h1 class="hidden">
					<?php echo esc_html( $this->theme->name ); ?>
					<small><?php printf( esc_html__( 'v%s', 'skeleton' ), $this->theme->version ); // WPCS: XSS OK. ?></small>
				</h1>
			</div>
		</div><?php
	}

	protected function setting_admin_page() {
		$this->admin_page->get_render()->before_display   = array( $this, 'display_header' );
		$this->admin_page->get_render()->navigation_class = 'cmb2-nav-vertical';
		$this->admin_page->get_render()->before_sections  = '<div class="abcaaas"></div>';
		$this->admin_page->get_render()->after_sections   = '<div class="sss-loading"></div>';
		$this->admin_page->get_render()->after_display    = '<div class="wp-clearfix"></div>';
	}

	public function get( $id ) {
		// return $this->get_field( $id )->value();
	}

	/**
	 * Allow call dynamic method from parent.
	 *
	 * @param  string $method     Method to call.
	 * @param  array  $parameters Call method parameters.
	 * @return mixed
	 */
	public function __call( $method, $parameters ) {
		if ( ! method_exists( $this->admin_page, $method ) ) {
			throw new BadMethodCallException;
		}

		return call_user_func_array( array( $this->admin_page, $method ), $parameters );
	}
}
