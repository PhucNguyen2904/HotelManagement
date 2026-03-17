<?php
namespace Awethemes\Theme_Options\Customizer;

use WP_Customize_Manager;
use WP_Customize_Section;
use Skeleton\CMB2\Section;

class Customize_Section extends WP_Customize_Section {
	/**
	 * Type of this section.
	 *
	 * @var string
	 */
	public $type = 'skeleton-section';

	/**
	 * CMB2 Section instance.
	 *
	 * @var Skeleton\CMB2\Section
	 */
	protected $cmb2_section;

	/**
	 * Constructor.
	 *
	 * @param WP_Customize_Manager $manager       Customizer bootstrap instance.
	 * @param Section              $cmb2_section CMB2 Section instance.
	 */
	public function __construct( WP_Customize_Manager $manager, Section $cmb2_section ) {
		$this->cmb2_section = $cmb2_section;
		parent::__construct( $manager, $cmb2_section->id, $this->get_section_args() );
	}

	/**
	 * Build WP_Customize_Section args based on CMB2 Section.
	 *
	 * @return array
	 */
	protected function get_section_args() {
		$args = get_object_vars( $this->cmb2_section );

		unset( $args ['fields'], $args['icon'] );
		unset( $args['show_on_cb'] ); // TODO: May be we need transform this to active_callback.

		return $args;
	}
}
