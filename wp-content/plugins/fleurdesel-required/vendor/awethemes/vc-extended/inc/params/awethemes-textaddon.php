<?php
/**
 * The params textaddon class.
 *
 * @package AweThemes
 * @subpackage VC-Extended
 */

if ( ! class_exists( 'VC_Extended_Textaddon_Param' ) ) :

	/**
	 * VC_Extended_Textaddon_Param class.
	 */
	class VC_Extended_Textaddon_Param extends VC_Extended_Param_Abstract {

		/**
		 * Display param HTML.
		 *
		 * @param  array  $settings Array of param settings.
		 * @param  string $value    Param value.
		 */
		protected function display( $settings, $value ) {
			// Parse extra settings.
			$settings = wp_parse_args( $settings, array(
				'addon_icon'   => 'dashicons dashicons-editor-expand',
				'addon_text'   => '',
				'addon_insert' => 'after',
			) );

			?>
			<div class="vce-param-textaddon">
				<label class="vce-input-group">
					<?php if ( 'before' === $settings['addon_insert'] ) :
						$this->display_addon( $settings );
					endif ?>

					<input type="text" value="<?php echo esc_attr( $value ); ?>" name="<?php echo esc_attr( $settings['param_name'] ); ?>"  class="wpb_vc_param_value <?php echo esc_attr( $settings['param_name'] . ' ' . $settings['type'] ); ?>">

					<?php if ( 'after' === $settings['addon_insert'] ) :
						$this->display_addon( $settings );
					endif ?>
				</label>
			</div>
			<?php
		}

		/**
		 * Display addon input HTML.
		 *
		 * @param array $settings Array of param settings.
		 */
		protected function display_addon( $settings ) {
			if ( ! $settings['addon_text'] && ! $settings['addon_icon'] ) {
				return;
			}

			?>
			<span class="vce-input-group__addon" title="<?php echo esc_attr( $settings['heading'] ); ?>">
				<?php if ( $settings['addon_text'] ) : ?>
					<span class="vce-input-group__text"><?php echo esc_html( $settings['addon_text'] ); ?></span>
				<?php else : ?>
					<span class="vce-input-group__icon <?php echo esc_attr( $settings['addon_icon'] ); ?>"></span>
				<?php endif ?>
			</span><?php
		}
	}

	VC_Extended_Textaddon_Param::init();
endif;
