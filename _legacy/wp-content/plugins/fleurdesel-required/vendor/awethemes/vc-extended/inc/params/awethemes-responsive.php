<?php
/**
 * The params responsive class.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

if ( ! class_exists( 'VC_Extended_Responsive_Param' ) ) :

	/**
	 * VC_Extended_Responsive_Param class.
	 */
	class VC_Extended_Responsive_Param extends VC_Extended_Param_Abstract {
		/**
		 * Include script URL.
		 *
		 * @return string
		 */
		public function include_js() {
			return VC_EXTENDED_URL . '/js/params/awethemes-responsive.js';
		}

		/**
		 * Display param HTML.
		 *
		 * @param  array  $settings Array of param settings.
		 * @param  string $value    Param value.
		 */
		protected function display( $settings, $value ) {
			if ( empty( $settings['settings'] ) || ! is_array( $settings['settings'] ) ) {
				$settings['settings'] = $this->get_default_settings();
			}

			if ( empty( $settings['settings'] ) ) {
				return;
			}

			// Allow setting default value as array with 'default' key.
			if ( is_null( $value ) && isset( $settings['default'] ) ) {
				$value = vc_extended_build_responsive_attr( $settings['default'] );
			}

			$raw_value = $value;
			$value = $this->get_parse_value( $value, $settings['settings'] );

			// Parse settings data.
			$settings['minimal_layout'] = isset( $settings['minimal_layout'] ) ? (bool) $settings['minimal_layout'] : true;
			$settings['simplify_controls'] = isset( $settings['simplify_controls'] ) ? (bool) $settings['simplify_controls'] : false;

			$el_class = '';
			if ( $settings['minimal_layout'] ) {
				$el_class = 'minimal open';

				if ( $settings['simplify_controls'] ) {
					$el_class  = ' minimal ';
					$el_class .= $this->need_open_minimal( $value ) ? 'open' : '';
				}
			}

			?>
			<div class="vce-param-responsive <?php echo esc_attr( $el_class ); ?>">
				<div class="vce-param-responsive__group">
					<?php foreach ( $settings['settings'] as $id => $field ) : $this->parse_field_args( $field ); ?>
					<label class="vce-input-group">
						<span class="vce-input-group__addon" title="<?php echo esc_attr( $field['title'] ); ?>">
							<?php if ( $field['icon'] ) : ?>
								<span class="vce-input-group__icon <?php echo esc_attr( $field['icon'] ); ?>"></span>
							<?php else : ?>
								<span class="vce-input-group__text"><?php echo esc_html( $id ); ?></span>
							<?php endif ?>
						</span>

						<input type="text" name="<?php echo esc_attr( $settings['param_name'] . '[' . $id . ']' ); ?>" data-name="<?php echo esc_attr( $id ); ?>"  class="vce-input-group__input" value="<?php echo esc_attr( $value[ $id ] ); ?>" placeholder="<?php echo esc_attr( $field['placeholder'] ); ?>">

						<?php if ( $field['title'] ) : ?>
							<span class="vce-input-group__tooltip"><?php echo esc_html( $field['title'] ); ?></span>
						<?php endif ?>
					</label>
					<?php endforeach ?>
				</div>

				<div class="vce-param-responsive_hide_button hidden">
					<button class="button vce-param-responsive__toggle" data-more-title="<?php esc_html_e( 'More Controls', 'vc_extended' ); ?>" data-origin-title="<?php esc_html_e( 'Simplify Controls', 'vc_extended' ); ?>">
						<span class="vce-input-group__tooltip"></span>
						<span class="dashicons dashicons-arrow-right-alt2"></span>
					</button>
				</div>

				<input type="hidden" data-json="<?php echo esc_attr( json_encode( $value ) ); ?>" value="<?php echo esc_attr( $raw_value ); ?>" name="<?php echo esc_attr( $settings['param_name'] ); ?>"  class="wpb_vc_param_value <?php echo esc_attr( $settings['param_name'] . ' ' . $settings['type'] ); ?>">
			</div><?php
		}

		/**
		 * Check if we need open minimal layout by default.
		 *
		 * @param  array $value Param array value.
		 * @return boolean
		 */
		protected function need_open_minimal( $value ) {
			foreach ( $value as $v => $k ) {
				if ( '' !== $k && null !== $k ) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Parse all settings value.
		 *
		 * @param  array $value    Raw string value.
		 * @param  array $settings Default of settings.
		 * @return array
		 */
		protected function get_parse_value( $value, $settings ) {
			$value = vc_parse_multi_attribute( $value );

			foreach ( $settings as $v => &$k ) {
				$k = isset( $value[ $v ] ) ? $value[ $v ] : '';
			}

			return $settings;
		}

		/**
		 * Parse field args.
		 *
		 * @param array $field Field raw data.
		 */
		protected function parse_field_args( &$field ) {
			$field = wp_parse_args( $field, array(
				'icon'  => '',
				'title' => '',
				'placeholder' => '',
			) );
		}

		/**
		 * Default settings responsive.
		 *
		 * @return array
		 */
		protected function get_default_settings() {
			return apply_filters( 'VC_Extended_Responsive_Param_default_settings', array(
				'lg' => array( 'icon' => 'dashicons dashicons-desktop',    'title' => esc_html__( 'Large', 'vc_extended' ) ),
				'md' => array( 'icon' => 'dashicons dashicons-laptop',     'title' => esc_html__( 'Medium', 'vc_extended' ) ),
				'sm' => array( 'icon' => 'dashicons dashicons-tablet',     'title' => esc_html__( 'Small', 'vc_extended' ) ),
				'xs' => array( 'icon' => 'dashicons dashicons-smartphone', 'title' => esc_html__( 'Extra Small', 'vc_extended' ) ),
			) );
		}
	}

	VC_Extended_Responsive_Param::init();
endif;

if ( ! function_exists( 'vc_extended_parse_responsive_attr' ) ) :
	/**
	 * Parse responsive attribute.
	 *
	 * @param  string $string String to parse.
	 * @return array
	 */
	function vc_extended_parse_responsive_attr( $string ) {
		return vc_parse_multi_attribute( $string );
	}
endif;

if ( ! function_exists( 'vc_extended_build_responsive_attr' ) ) :
	/**
	 * Build responsive array value to string.
	 *
	 * @param  array $value Array value to build.
	 * @return string
	 */
	function vc_extended_build_responsive_attr( $value ) {
		if ( is_array( $value ) ) {
			$build_value = array();

			foreach ( $value as $v => $k ) {
				if ( '' === $k || null === $k ) {
					continue;
				}

				$build_value[] = $v . ':' . $k;
			}

			$value = implode( '|', $build_value );
		}

		return $value;
	}
endif;
