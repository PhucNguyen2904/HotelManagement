<?php
/**
 * Visual Composer Extended Utils Class.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

/**
 * The VC_Extended_Row_Overlay class.
 */
class VC_Extended_Row_Overlay {

	/**
	 * Contructor
	 */
	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'vcmap_row_overlay' ) );
		add_filter( 'vc_shortcode_output', array( __CLASS__, '_vc_row_hook' ), 10, 3 );
		add_filter( 'after_open_vc_row', array( __CLASS__, 'vcmap_row_overlay_template' ), 10, 4 );
	}

	/**
	 * Register settings
	 */
	public static function vcmap_row_overlay() {

		$params[] = array(
			'type'         => 'checkbox',
			'param_name'   => 'enable_overlay',
			'heading'      => esc_html__( 'Enable Overlay for this row?', 'awethemes' ),
			'group'        => esc_html__( 'Overlay settings', 'awethemes' ),
			'description'  => esc_html__( 'Do you want to setting overlay for this row?', 'awethemes' ),
			'value' 	   => array( __( 'Yes', 'awethemes' ) => 'yes' ),
		);

		$params[] = array(
			'type'         => 'colorpicker',
			'param_name'   => 'overlay_color',
			'heading'      => esc_html__( 'Background overlay color', 'awethemes' ),
			'description'  => esc_html__( 'Add background overlay color for row', 'awethemes' ),
			'group'        => esc_html__( 'Overlay settings', 'awethemes' ),
			'dependency'   => array(
				'element'  => 'enable_overlay',
				'value'    => 'yes',
			),
		);

		vc_add_params( 'vc_row', $params );
	}

	/**
	 * Parse shortcode.
	 */
	public static function _vc_row_hook( $output, $shortcode, $atts ) {
		if ( 'vc_row' !== $shortcode->getShortcode() ) {
			return $output;
		}

		$before = '';
		$content = apply_filters( 'after_open_vc_row', $before, $output, $shortcode, $atts );

		return preg_replace( '/(<div[^>]+class="[^"]*vc_row\s[^>]*>)/', "$1\n{$content}\n", $output );
	}

	/**
	 * Row overlay template.
	 */
	public static function vcmap_row_overlay_template( $before, $output, $shortcode, $atts ) {

		$atts = shortcode_atts( array(
			'enable_overlay'   => '',
			'overlay_color'    => '',
		), $atts );

		ob_start();
		?>
		<?php if ( $atts['enable_overlay'] && $atts['overlay_color'] ) : ?>
			<div class="vc_row-overlay" style="background-color: <?php echo esc_attr( $atts['overlay_color'] ) ?>;">
			</div>
		<?php endif; ?>
		<?php
		return ob_get_clean();
	}
}
VC_Extended_Row_Overlay::init();
