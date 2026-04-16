<?php
namespace Awethemes\Theme_Options\Customizer;

use WP_Customize_Panel;
use WP_Customize_Manager;
use Skeleton\CMB2\Panel;

class Customize_Panel extends WP_Customize_Panel {
	/**
	 * Type of this panel.
	 *
	 * @var string
	 */
	public $type = 'skeleton-panel';

	/**
	 * CMB2 Panel instance.
	 *
	 * @var Skeleton\CMB2\Panel
	 */
	protected $cmb2_panel;

	/**
	 * Constructor.
	 *
	 * @param WP_Customize_Manager $manager      Customizer bootstrap instance.
	 * @param Panel                $cmb2_panel CMB2 Panel instance.
	 */
	public function __construct( WP_Customize_Manager $manager, Panel $cmb2_panel ) {
		$this->cmb2_panel = $cmb2_panel;
		parent::__construct( $manager, $cmb2_panel->id, $this->get_panel_args() );
	}

	/**
	 * Build WP_Customize_Panel args based on CMB2 Panel.
	 *
	 * @return array
	 */
	protected function get_panel_args() {
		$args = get_object_vars( $this->cmb2_panel );

		unset( $args ['sections'], $args['icon'] );
		unset( $args['show_on_cb'] ); // TODO: May be we need transform this to active_callback.

		return $args;
	}
}
