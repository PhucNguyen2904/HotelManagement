<?php

global $at_importers;

if ( ! function_exists( 'at_importer_init' ) ) :
	/**
	 * Initial AT-Importer
	 *
	 * @todo Improve this function!!!
	 */
	function at_importer_init() {
		$class = array( new AT_Importer_Manager, 'dispatch' );
		$description = esc_html__( 'Import demo content from awethemes by one click.', 'awethemes' );

		register_importer( 'at-importer', esc_html__( 'AT: Importer', 'awethemes' ), $description, $class );
	}
endif;
add_action( 'admin_init', 'at_importer_init', 999 );

if ( ! function_exists( 'at_importer_register' ) ) :
	/**
	 * //
	 *
	 * @param  string $id   //.
	 * @param  array  $args //.
	 */
	function at_importer_register( $id, array $args ) {
		global $at_importers;

		$id = sanitize_key( $id );

		$args = wp_parse_args( $args, array(
			'name'        => '',
			'preview'     => '',
			'screenshot'  => '',
			'archive'     => '',
			'directory'   => '',
		) );

		$at_importers[ $id ] = $args;
	}
endif;

if ( ! function_exists( 'at_importers' ) ) :
	/**
	 * Get registered at-importer
	 *
	 * @return array
	 */
	function at_importers() {
		global $at_importers;

		return is_null( $at_importers ) ? array() : $at_importers;
	}
endif;
add_filter( 'at_importer_metadata', 'at_importers', 20 );

/**
 * Welcome screen support.
 */
function _at_importer_welcome_tab() {
	if ( ! class_exists( 'AT_Admin_Welcome' ) ) {
		return;
	}

	AT_Admin_Welcome::instance()->add_tab( array(
		'id'    => 'importer',
		'title' => esc_html__( 'Import Demo', 'awethemes' ),
		'link'  => admin_url( 'admin.php?import=at-importer' ),
	) );
}
add_action( 'admin_init', '_at_importer_welcome_tab' );
