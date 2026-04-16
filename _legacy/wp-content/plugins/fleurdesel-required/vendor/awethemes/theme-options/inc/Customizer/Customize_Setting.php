<?php
namespace Awethemes\Theme_Options\Customizer;

use WP_Error;
use WP_Customize_Manager;
use WP_Customize_Setting;
use Skeleton\CMB2\CMB2;
use Skeleton\Support\Validator;
use Skeleton\Support\Multidimensional;

class Customize_Setting extends WP_Customize_Setting {
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

		parent::__construct( $manager, $this->get_setting_id(), $this->get_setting_args() );
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

	/**
	 * Build WP_Customize_Setting args based on CMB2_Field object.
	 *
	 * TODO: ...
	 *
	 * @return array
	 */
	protected function get_setting_args() {
		return array(
			'type'              => 'option',
			'default'           => '',
			'transport'         => 'refresh',
			'sanitize_callback' => '',
			'validate_callback' => isset( $this->field_args['validate_cb'] ) ? $this->field_args['validate_cb'] : '',
		);
	}

	/**
	 * Validates an input.
	 *
	 * @param  mixed $value Value to validate.
	 * @return true|WP_Error True if the input was validated, otherwise WP_Error.
	 */
	public function validate( $value ) {
		$validity = new WP_Error();

		// Try validation by our Validator.
		if ( isset( $this->field_args['validate'] ) ) {
			$validator = new Validator( array( '_input' => $value ), array( '_input' => $this->field_args['validate'] ) );

			$label = isset( $this->field_args['name'] ) ? $this->field_args['name'] : $this->field_args['id'];
			$validator->labels( array( '_input' => $label ) );

			if ( $validator->fails() ) {
				$errors = $validator->errors( '_input' );
				$validity->add( 'validate_error', $errors[0] );
			}
		}

		if ( empty( $validity->errors ) ) {
			$validity = parent::validate( $value );
		}

		return $validity;
	}
}
