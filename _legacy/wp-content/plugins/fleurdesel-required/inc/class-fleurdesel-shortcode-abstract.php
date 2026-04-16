<?php

class Fleurdesel_Shortcode_Abstract extends WPBakeryShortCode_Extended {

	/**
	 * Constructor of class.
	 *
	 * @param array $settings
	 */
	public function __construct( $settings ) {
		parent::__construct( $settings );

		$this->template_directory = FLEURDESEL_PLUGIN_PATH . 'inc/vc-templates';
	}
}
