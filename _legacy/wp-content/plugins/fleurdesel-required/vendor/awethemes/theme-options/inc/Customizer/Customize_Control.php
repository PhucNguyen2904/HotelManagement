<?php
namespace Awethemes\Theme_Options\Customizer;

use WP_Customize_Control;
use WP_Customize_Manager;
use Skeleton\CMB2\CMB2;
use Skeleton\Support\Multidimensional;

class Customize_Control extends WP_Customize_Control {
	/**
	 * CMB2 instance.
	 *
	 * @var CMB2
	 */
	protected $cmb2;

	/**
	 * CMB2 field arguments.
	 *
	 * @var array
	 */
	protected $field_args = array();

	/**
	 * Constructor.
	 *
	 * @param WP_Customize_Manager $manager    Customizer bootstrap instance.
	 * @param CMB2                 $cmb2       CMB2 instance.
	 * @param array                $field_args CMB2 field arguments.
	 */
	public function __construct( WP_Customize_Manager $manager, CMB2 $cmb2, array $field_args ) {
		$this->cmb2 = $cmb2;
		$this->field_args = $field_args;

		parent::__construct( $manager, $field_args['id'], $this->get_control_args() );
	}

	/**
	 * Build WP_Customize_Control args based on CMB2_Field object.
	 *
	 * TODO: ...
	 *
	 * @return array
	 */
	protected function get_control_args() {
		return array(
			'settings' => $this->get_setting_id(),
			'section' => isset( $this->field_args['section'] ) ? $this->field_args['section'] : '',
		);
	}

	/**
	 * Render the control's content.
	 *
	 * @return void
	 */
	public function render_content() {
		$this->field_args['attributes']['data-setting'] = $this->cmb2->object_id();
		$this->field_args['attributes']['data-customize-setting-link'] = esc_attr( $this->settings['default']->id );

		echo '<div class="cmb2-wrap">';
		$this->cmb2->render_field( $this->field_args );
		echo '</div>';
	}

	/**
	 * Return setting ID with multi-dimensional format support.
	 *
	 * @return string
	 */
	public function get_setting_id() {
		$id_data['keys'] = preg_split( '/\.|\[/', str_replace( ']', '', $this->field_args['id'] ) );
		$id_data['base'] = $this->cmb2->object_id();

		return Multidimensional::join( $id_data );
	}
}
