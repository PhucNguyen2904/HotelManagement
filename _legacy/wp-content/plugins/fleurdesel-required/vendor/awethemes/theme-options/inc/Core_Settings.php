<?php
namespace Awethemes\Theme_Options;

use Skeleton\Skeleton;
use Skeleton\Admin_Page;

class Core_Settings {
	/**
	 * The globally available instance of the skeleton container.
	 *
	 * @var Skeleton
	 */
	protected $skeleton;

	/**
	 * Admin page instance.
	 *
	 * @var Admin_Page
	 */
	protected $page;

	/**
	 * Page setting ID.
	 *
	 * @var string
	 */
	protected $page_id = '_skeleton_settings';

	/**
	 * Constructor.
	 *
	 * @param Skeleton $skeleton The skeleton container instance.
	 */
	public function __construct( Skeleton $skeleton ) {
		$this->skeleton = $skeleton;

		$this->page = Admin_Page::make( $this->page_id )->set( array(
			'parent_slug' => $skeleton['admin_menu']->get_topmenu(),
			'menu_slug'   => $skeleton['admin_menu']->get_topmenu(),
			'menu_title'  => esc_html__( 'Settings', 'skeleton' ),
			'page_title'  => esc_html__( 'Awethemes Settings', 'skeleton' ),
		) );

		$this->google_apis_settings( $this->page );

		$this->post_type_settings( $this->page );
	}

	public function get_settings() {
		return get_option( $this->page_id, array() );
	}

	protected function post_type_settings( Admin_Page $page ) {
		$page->add_hidden_field( array(
			'id' => 'sdasd',
			'value' => '1',
			'type' => 'hidden',
		) );

		$section = $this->page->add_section( 'post_types' )->set( array(
			'title' => esc_html__( 'Post Types', 'skeleton' ),
			'icon'  => 'dashicons-twitter',
		));

		$section->add_field( array(
			'type'     => 'multicheck',
			'id'       => 'post_type_plugable',
			'name'     => esc_html__( 'Consumer Key (API Key)', 'skeleton' ),
			'options_cb'  => function() {
				return $this->get_plugable_post_types();
			},
		) );

		$section->add_field( array(
			'type'     => 'multicheck',
			'id'       => 'post_type_plugable',
			'name'     => esc_html__( 'Consumer Key (API Key)', 'skeleton' ),
			'options_cb'  => function() {
				return $this->get_plugable_post_types();
			},
		) );
	}

	public function get_plugable_post_types() {
		return array_map(function($post_type) {
			return $post_type->get_display_title();
		}, $this->skeleton->registered_post_type());
	}

	/**
	 * Register Google APIs settings.
	 *
	 * @param Admin_Page $page Admin Page instance.
	 */
	public function google_apis_settings( Admin_Page $page ) {
		$page->add_section( 'google_apis', function ( $tab ) {
			$tab->set( array(
				'title' => 'Google APIs',
				// 'icon' => 'dashicons-googleplus',
			));

			$tab->add_field( array(
				'type' => 'typography',
				'id'   => 'typography',
				'name' => esc_html__( 'Typography', 'skeleton' ),
			) );

			$tab->add_field( array(
				'type' => 'raw',
				'id'   => 'raw',
				// 'name' => esc_html__( 'Typography', 'skeleton' ),
				// 'resource' => 'https://raw.githubusercontent.com/anhskohbo/no-captcha/master/README.md',
			) );

			$tab->add_field( array(
				'type' => 'text',
				'id'   => 'google_map_api_key',
				'name' => esc_html__( 'Google Maps API Key', 'skeleton' ),
				'desc' => 'Enter a valid Google Maps API Key to use all map related theme functions.',
				'before_field' => '<p style="margin-top: 0;">Google recently changed the way their map service works. <br> New pages which want to use Google Maps need to register an API key for their website. Older pages should work fine without this API key. <br> If the google map elements of this theme do not work properly you need to register a new API key.</p>',
			) );

			$tab->add_field( array(
				'type' => 'text',
				'id'   => 'google_fonts_api_key',
				'name' => esc_html__( 'Google Fonts API Key', 'skeleton' ),
				'desc' => esc_html__( 'Your theme will update itself with the latest Google Fonts automatically.', 'skeleton' ),
			) );
		});
	}

	/**
	 * Register Google APIs settings.
	 *
	 * @param Admin_Page $page Admin Page instance.
	 */
	public function twitter_credentials_settings( Admin_Page $page ) {
		$tab = $this->page->add_section( 'twitter_credentials' )->set( array(
			'title' => esc_html__( 'Twitter Credentials', 'skeleton' ),
			'icon'  => 'dashicons-twitter',
		));

		$tab->add_field( array(
			'type' => 'title',
			'id'   => 'twitter_credentials_title',
			'name' => esc_html__( 'Twitter Credentials', 'skeleton' ),
		) );

		$tab->add_field( array(
			'type'     => 'text',
			'id'       => 'twitter_consumer_key',
			'name'     => esc_html__( 'Consumer Key (API Key)', 'skeleton' ),
		) );

		$tab->add_field( array(
			'type'     => 'text',
			'id'       => 'twitter_consumer_secret',
			'name'     => esc_html__( 'Consumer Secret (API Secret)', 'skeleton' ),
		) );

		$tab->add_field( array(
			'type'     => 'text',
			'id'       => 'twitter_access_token',
			'name'     => esc_html__( 'Access Token', 'skeleton' ),
		) );

		$tab->add_field( array(
			'type'     => 'text',
			'id'       => 'twitter_access_token_secret',
			'name'     => esc_html__( 'Access Token Secret', 'skeleton' ),
		) );
	}
}
