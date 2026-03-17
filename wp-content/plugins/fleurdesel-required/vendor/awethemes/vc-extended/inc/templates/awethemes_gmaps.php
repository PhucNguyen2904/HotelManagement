<?php

// Parser shortcode atts.
$atts = shortcode_atts( array(
	'id'        => '',
	'el_class'  => '',
	'css'       => '',
	'markers'   => '',

	'lat'       => '21.030686',
	'lng'       => '105.852403',
	'width'     => '100%',
	'height'    => '350px',

	'zoom'      => 15,
	'map_type'  => 'roadmap',
	'map_style' => 'none',
	'custom_map_style' => '',

	'scrollwheel'         => 'true',
	'zoom_control'        => 'true',
	'map_type_control'    => 'true',
	'street_view_control' => 'false',
	'fullscreen_control'  => 'false',
	'draggable'           => 'true',
), $atts );

// Parser marker group param.
$markers = (array) vc_param_group_parse_atts( $atts['markers'] );
$marker_default = array(
	'label'   => null,
	'lat'     => null,
	'lng'     => null,
	'icon'    => null,
	'content' => null,
);

// Make sure we have unique map ID.
$atts['id'] = $atts['id'] ? $atts['id'] : 'map-' . uniqid();

if ( ! $atts['map_style'] || 'none' !== $atts['map_style'] ) {
	$atts['map_type'] = $atts['map_style'];
}

// Build wrapper atts.
$build_atts = array();
$build_atts['id'] = $atts['id'];

// Build data attributes.
$need_build_data = array_except( $atts,
	array( 'id', 'map_style', 'custom_map_style', 'el_class', 'css', 'markers' )
);

foreach ( $need_build_data as $key => $value ) {
	$key = 'data-' . str_replace( '_', '-', $key );
	$build_atts[ $key ] = is_null( $value ) ? null : esc_attr( $value );
}

// Wrapper map class.
$el_class  = $this->getExtraClass( $atts['el_class'] . ' ' );
$el_class .= vc_shortcode_custom_css_class( $atts['css'] );

?>

<div class="extras_vc-map-wrapper <?php echo esc_attr( $el_class ); ?>">
	<div <?php print $this->build_attributes( $build_atts ); // WPCS: XSS OK. ?>>

		<?php foreach ( $markers as $marker ) :
			$marker = shortcode_atts( $marker_default, $marker );
			$marker['icon'] = is_numeric( $marker['icon'] ) ? wp_get_attachment_image_url( $marker['icon'], 'full' ) : null;
			$marker_attr = array_except( $marker, array( 'content' ) );

			foreach ( $marker_attr as $key => $value ) {
				$new_key = 'data-' . str_replace( '_', '-', $key );
				$marker_attr[ $new_key ] = is_null( $value ) ? null : esc_attr( $value );

				unset( $marker_attr[ $key ] );
			}
			?>

			<div data-map="marker" <?php print $this->build_attributes( $marker_attr ); // WPCS: XSS OK. ?> style="visibility: hidden; overflow: hidden; height: 0;">
				<?php echo $marker['content'] ? wp_kses_post( $marker['content'] ) : ''; ?>
			</div>
		<?php endforeach ?>
	</div>

	<script type="text/javascript">
	(function($) {
		'use strict';

		$(function() {
			var jsonStyled, stringStyled;
			var map = VCExtras_Gmaps.init('<?php echo '#' . esc_attr( $atts['id'] ); ?>');

			<?php if ( 'custom' === $atts['map_type'] && $atts['custom_map_style'] ) : ?>
			stringStyled = '<?php print $this->decode_textarea_raw( $atts['custom_map_style'] ); // WPCS: XSS OK. ?>';

			try {
				jsonStyled = $.parseJSON(stringStyled);
				map.addStyle({ mapTypeId: 'custom', styles: jsonStyled });
			} catch(e) {
				map.setMapTypeId('roadmap');
			}
			<?php endif ?>
		});
	})(jQuery);
	</script>
</div><!-- /.extras_vc-map-wrapper -->
