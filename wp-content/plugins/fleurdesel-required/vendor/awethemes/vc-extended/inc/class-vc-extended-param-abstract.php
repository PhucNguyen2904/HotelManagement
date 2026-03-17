<?php
/**
 * The params abstract class.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

/**
 * VC_Extended_Param_Abstract class.
 */
abstract class VC_Extended_Param_Abstract {
	/**
	 * Setting the param name.
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Param value, pls do not setting this value.
	 *
	 * @var string
	 */
	protected $value;

	/**
	 * Param settings, pls do not setting this value.
	 *
	 * @var array
	 */
	protected $settings;

	/**
	 * Second way to init class.
	 *
	 * @return $this
	 */
	public static function init() {
		return new static;
	}

	/**
	 * Constructor of class.
	 */
	public function __construct() {
		if ( is_null( $this->name ) ) {
			$class_name = str_replace( array( 'VC_Extended_', '_Param' ), '', get_called_class() );
			$this->name = 'vce_' . sanitize_key( $class_name );
		}

		if ( ! empty( $this->name ) ) {
			vc_add_shortcode_param( $this->name, array( $this, 'render_callback' ), $this->include_js() );
		}
	}

	/**
	 * Include script URL.
	 *
	 * @return string
	 */
	public function include_js() {
		return null;
	}

	/**
	 * Display param HTML.
	 *
	 * @param  array  $settings Array of param settings.
	 * @param  string $value    Param value.
	 * @return void
	 */
	abstract protected function display( $settings, $value );

	/**
	 * Render param callback function.
	 *
	 * @param  array  $settings Array of param settings.
	 * @param  string $value    Param value.
	 * @return string
	 */
	public function render_callback( $settings, $value ) {
		$this->value = $value;
		$this->settings = $settings;

		ob_start();
		$this->display( $settings, $value );
		$output = ob_get_clean();

		$output = apply_filters( 'vc_extended_output_param', $output, $this );
		$output = apply_filters( 'vc_extended_output_param_' . $this->name, $output, $this );

		return $output;
	}
}
