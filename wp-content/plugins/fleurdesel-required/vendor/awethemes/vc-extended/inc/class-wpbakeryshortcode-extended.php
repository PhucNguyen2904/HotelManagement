<?php
/**
 * Awethemes Shortcode Abstract.
 *
 * @package Awethemes
 */

class WPBakeryShortCode_Extended extends WPBakeryShortCode {
	/**
	 * Setting for template directory.
	 *
	 * @var string
	 */
	protected $template_directory;

	/**
	 * Constructor of class.
	 *
	 * @param array $settings
	 */
	public function __construct( $settings ) {
		parent::__construct( $settings );

		$this->registerScripts();

		$this->template_directory = VC_EXTENDED_PATH . '/inc/templates';
	}

	/**
	 * Register JS and CSS for render page.
	 */
	public function registerScripts() {}

	/**
	 * Enqueue JS and CSS for render page.
	 */
	public function enqueueScripts( $atts ) {}

	/**
	 * Load template function.
	 *
	 * @param array       $atts
	 * @param null|string $content
	 *
	 * @return mixed|void
	 */
	protected function loadTemplate( $atts, $content = null ) {
		$this->enqueueScripts( $atts );

		return parent::loadTemplate( $atts, $content );
	}

	/**
	 * Find html template for shortcode output.
	 */
	protected function findShortcodeTemplate() {
		$parent_template = parent::findShortcodeTemplate();

		// Find template in template_directory.
		$local_template = $this->template_directory . '/' . $this->shortcode . '.php';

		if ( ! $parent_template && file_exists( $local_template ) ) {
			return $this->setTemplate( $local_template );
		}

		return $parent_template;
	}

	/**
	 * Load template part in template directory.
	 *
	 * @param  string $path
	 * @param  array  $args
	 */
	public function load_template_part( $path, array $args = array() ) {
		// Find template in theme-directory first.
		$template_path = vc_shortcodes_theme_templates_dir( $path );

		if ( ! file_exists( $template_path ) ) {
			$template_path = $this->template_directory . '/' . $path;
		}

		if ( ! empty( $args ) ) {
			extract( $args );
		}

		include $template_path;
	}

	/**
	 * Decode HTML for textarea_raw_html param.
	 *
	 * @param  string $string Raw HTML.
	 * @return string
	 */
	public function decode_textarea_raw( $string ) {
		if ( ! $string ) {
			return '';
		}

		return rawurldecode( base64_decode( strip_tags( $string ) ) );
	}

	/**
	 * Build an HTML attribute string from an array.
	 *
	 * @param array $attributes
	 *
	 * @return string
	 */
	public function build_attributes( $attributes ) {
		return vc_extended_build_attributes( $attributes );
	}

	/**
	 * Build link attr.
	 *
	 * @param  array $attr Link after parser via vc_build_link().
	 */
	protected function build_link_atts( $attr ) {
		if ( ! empty( $attr['url'] ) ) {
			$attr['href'] = esc_url( $attr['url'] );
			unset( $attr['url'] );
		}

		return $this->build_attributes( $attr );
	}
}
