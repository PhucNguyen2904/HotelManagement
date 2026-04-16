<?php
/**
 * Visual Composer Extended Animate Core.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

/**
 * The VC_Extended_Animate_Core class.
 *
 * @see https://github.com/michalsnik/aos
 */
class VC_Extended_Animate_Core {

	/**
	 * Singleton instance of class.
	 *
	 * @var VC_Extended_Animate_Core
	 */
	private static $instance;

	/**
	 * Initializing class via static::init().
	 *
	 * @return VC_Extended_Animate_Core
	 */
	public static function init() {
		if ( ! static::$instance ) {
			static::$instance = new static;
		}

		return static::$instance;
	}

	/**
	 * Private constructor, please use static::init() method.
	 */
	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, '_register_scripts' ) );
	}

	/**
	 * Register animate scroll (AOS) scripts.
	 */
	public function _register_scripts() {
		wp_register_style( 'aos', VC_EXTENDED_URL . '/css/vendor/aos.css', array(), '2.0.4' );
		wp_register_script( 'aos', VC_EXTENDED_URL . '/js/vendor/aos.js', array(), '2.0.4', true );
		wp_add_inline_script( 'aos', 'window.AOS.init();' );
	}

	/**
	 * Get AOS animations.
	 *
	 * @return array
	 */
	public static function get_animations() {
		return apply_filters( 'vc_extended_animate_animations', array(
			// Fade animations.
			'fade-up',
			'fade-down',
			'fade-left',
			'fade-right',
			'fade-up-right',
			'fade-up-left',
			'fade-down-right',
			'fade-down-left',

			// Flip animations.
			'flip-up',
			'flip-down',
			'flip-left',
			'flip-right',

			// Slide animations.
			'slide-up',
			'slide-down',
			'slide-left',
			'slide-right',

			// Zoom animations.
			'zoom-in',
			'zoom-in-up',
			'zoom-in-down',
			'zoom-in-left',
			'zoom-in-right',
			'zoom-out',
			'zoom-out-up',
			'zoom-out-down',
			'zoom-out-left',
			'zoom-out-right',
		) );
	}

	/**
	 * Get AOS easing functions.
	 *
	 * @return array
	 */
	public static function get_easings() {
		return apply_filters( 'vc_extended_animate_easings', array(
			'linear',
			'ease',
			'ease-in',
			'ease-out',
			'ease-in-out',
			'ease-in-back',
			'ease-out-back',
			'ease-in-out-back',
			'ease-in-sine',
			'ease-out-sine',
			'ease-in-out-sine',
			'ease-in-quad',
			'ease-out-quad',
			'ease-in-out-quad',
			'ease-in-cubic',
			'ease-out-cubic',
			'ease-in-out-cubic',
			'ease-in-quart',
			'ease-out-quart',
			'ease-in-out-quart',
		) );
	}
}

VC_Extended_Animate_Core::init();
