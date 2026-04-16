<?php
/**
 * Layout metabox.
 *
 * @package Fleurdesel
 */

use Skeleton\Metabox;
/**
 * Register Custom layout metabox.
 */
class Fleurdesel_Custom_Layout {

	/**
	 * Define a new post type.
	 */
	public function __construct() {
		$this->register_metaboxes();
	}

	/**
	 * Register metabox.
	 */
	public function register_metaboxes() {
		$metabox = new Metabox( 'fleurdesel-layout', array(
			'id'            => 'fleurdesel-layout',
			'title'         => esc_html__( 'Custom Layout', 'fleurdesel' ),
			'object_types'  => apply_filters( 'fleurdesel_layout_metabox_screen', array( 'page' ) ),
			// 'taxonomies'    => apply_filters( 'fleurdesel_layout_taxonomy', array( 'category', 'post_tag' ) ),
			// 'context'    => 'side',
			'priority'   	=> 'low',
		) );

		// Header style tab.
		$metabox->add_section( 'custom_header_area', function( $tab ) {
			$prefix = 'fleurdesel_custom_layout';

			$toggle_options = array(
				''   => __( 'Default', 'fleurdesel' ),
				'on' => esc_html__( 'On', 'fleurdesel' ),
				0    => esc_html__( 'Off', 'fleurdesel' ),
			);

			$tab->set( array( 'title' => 'Header' ) );

			$sidebars = $GLOBALS['wp_registered_sidebars'];
			$opt_sidebars = array();
			$opt_sidebars[''] = esc_html__( 'Default', 'fleurdesel' );

			foreach ( $sidebars as $key => $sidebar ) {
				$opt_sidebars[ $key ] = $sidebar['name'];
			}

			$tab->add_field( array(
				'name'    => esc_html__( 'Header layout', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select header layout', 'fleurdesel' ),
				'id'      => $prefix . '[header_layout]',
				'type'    => 'select',
				'options' => array(
					''      				 => esc_html__( 'Default', 'fleurdesel' ),
					'classic'                => esc_html__( 'Classic header', 'fleurdesel' ),
					'minimal_fullscreen'     => esc_html__( 'Minimal with fullscreen menu', 'fleurdesel' ),
					'minimal_side'           => esc_html__( 'Mobile menu', 'fleurdesel' ),
					'classic_no_transparent' => esc_html__( 'Classic without transparent', 'fleurdesel' ),
					'classic_centered_logo'  => esc_html__( 'Classic with centered logo', 'fleurdesel' ),
					'classic_slider'         => esc_html__( 'With slider', 'fleurdesel' ),
				),
			) );

			$tab->add_field( array(
				'id'   => $prefix . '[header_sticky]',
				'name' => esc_html__( 'Header Sticky', 'fleurdesel' ),
				'type' => 'select',
				'deps'    => array( $prefix . '[header_layout]', 'any', 'classic,classic_no_transparent' ),
				'options' => $toggle_options,
			));

			// Header classic.
			$tab->add_field( array(
				'id'      => $prefix . '_site_logo',
				'name'    => esc_html__( 'Header classic logo', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select an image.', 'fleurdesel' ),
				'type'    => 'file',
				'deps'    => array( $prefix . '[header_layout]', '==', 'classic' ),
			) );

			// Header top.
			$tab->add_field( array(
				'name'    => esc_html__( 'Header top left content', 'fleurdesel' ),
				'id'      => $prefix . '[header_top_left_content]',
				'type'    => 'textarea',
				'deps'    => array( $prefix . '[header_layout]', 'any', 'classic,classic_no_transparent,classic_centered_logo,classic_slider' ),
			) );

			$tab->add_field( array(
				'name'    => esc_html__( 'Header top right content', 'fleurdesel' ),
				'id'      => $prefix . '[header_top_right_content]',
				'type'    => 'textarea',
				'deps'    => array( $prefix . '[header_layout]', 'any', 'classic,classic_no_transparent,classic_centered_logo,classic_slider' ),
			) );

			// Layout minimal_fullscreen.
			$tab->add_field( array(
				'id'      => $prefix . '_header_minimal_logo',
				'name'    => esc_html__( 'Header minimal logo', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select an image.', 'fleurdesel' ),
				'type'    => 'file',
				'deps'    => array( $prefix . '[header_layout]', '==', 'minimal_fullscreen' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Fullscreen panel left sidebar', 'fleurdesel' ),
				'id'   => $prefix . '[fs_panel_left_sidebar]',
				'type' => 'select',
				'deps' => array( $prefix . '[header_layout]', '==', 'minimal_fullscreen' ),
				'options' => $opt_sidebars,
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Fullscreen panel right sidebar', 'fleurdesel' ),
				'id'   => $prefix . '[fs_panel_right_sidebar]',
				'type' => 'select',
				'deps' => array( $prefix . '[header_layout]', '==', 'minimal_fullscreen' ),
				'options' => $opt_sidebars,
			) );

			// Layout classic no transparent.
			$tab->add_field( array(
				'id'      => $prefix . '_header_classic_no_transparent_logo',
				'name'    => esc_html__( 'Header classic no transparent logo', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select an image.', 'fleurdesel' ),
				'type'    => 'file',
				'deps'    => array( $prefix . '[header_layout]', '==', 'classic_no_transparent' ),
			) );

			// Layout centered logo.
			$tab->add_field( array(
				'id'      => $prefix . '_header_centered_logo',
				'name'    => esc_html__( 'Header centered logo', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select an image.', 'fleurdesel' ),
				'type'    => 'file',
				'deps'    => array( $prefix . '[header_layout]', '==', 'classic_centered_logo' ),
			) );

			// Layout with slider.
			$tab->add_field( array(
				'id'      => $prefix . '[header_slider]',
				'name'    => esc_html__( 'Header slider shortcode', 'fleurdesel' ),
				'type'    => 'textarea',
				'deps'    => array( $prefix . '[header_layout]', '==', 'classic_slider' ),
			) );

		} );

		// Header style tab.
		$metabox->add_section( 'custom_footer_area', function( $tab ) {
			$prefix = 'fleurdesel_custom_layout';

			$toggle_options = array(
				''   => __( 'Default', 'fleurdesel' ),
				'on' => esc_html__( 'On', 'fleurdesel' ),
				0    => esc_html__( 'Off', 'fleurdesel' ),
			);

			$tab->set( array( 'title' => 'Header' ) );

			$sidebars = $GLOBALS['wp_registered_sidebars'];
			$opt_sidebars = array();
			$opt_sidebars[''] = esc_html__( 'Default', 'fleurdesel' );

			foreach ( $sidebars as $key => $sidebar ) {
				$opt_sidebars[ $key ] = $sidebar['name'];
			}

			$tab->set( array( 'title' => 'Footer' ) );

			// General settings.
			$tab->add_field( array(
				'id'      => $prefix . '[copyright]',
				'name'    => esc_html__( 'Copyright', 'fleurdesel' ),
				'type'    => 'textarea',
			));

			$tab->add_field( array(
				'id'        => $prefix . '[footer_layout]',
				'name'      => esc_html__( 'Footer layout', 'fleurdesel' ),
				'type'      => 'select',
				'options'   => array(
					''				=> esc_html__( 'Default', 'fleurdesel' ),
					'classic'       => esc_html__( 'Classic', 'fleurdesel' ),
					'left-logo'     => esc_html__( 'Minimal with left logo', 'fleurdesel' ),
					'centered-logo' => esc_html__( 'Minimal with centered logo', 'fleurdesel' ),
				),
				'desc'      => esc_html__( 'Select a layout to show in Footer page.', 'fleurdesel' ),
			) );

			$tab->add_field( array(
				'id'      => $prefix . '[show_footer_social]',
				'name'    => esc_html__( 'Social follow | Show', 'fleurdesel' ),
				'type'    => 'select',
				'desc'    => esc_html__( 'Off / On', 'fleurdesel' ),
				'deps'    => array( $prefix . '[footer_layout]|fleurdesel_custom_layout[footer_layout]', '!=|!=', 'classic|' ), // TODO:
				'options' => $toggle_options,
			));

			$tab->add_field( array(
				'id'      => $prefix . '[right_text]',
				'name'    => esc_html__( 'Right text', 'fleurdesel' ),
				'type'    => 'textarea',
				'deps'    => array( $prefix . '[footer_layout]', '==', 'classic' ),
			));

			$tab->add_field( array(
				'id'        => $prefix . '[footer_bg_type]',
				'name'      => esc_html__( 'Footer Background Type', 'fleurdesel' ),
				'type'      => 'select',
				'options'   => array(
					''			=> esc_html__( 'Default', 'fleurdesel' ),
					'color'     => esc_html__( 'Color', 'fleurdesel' ),
					'image'     => esc_html__( 'Image', 'fleurdesel' ),
				),
			) );

			$tab->add_field( array(
				'id'   		=> $prefix . '[footer_bg_color]',
				'name' 		=> esc_html__( 'Background color', 'fleurdesel' ),
				'type' 		=> 'rgba_colorpicker',
				'deps'    	=> array( $prefix . '[footer_bg_type]', '==', 'color' ),
			) );

			$tab->add_field( array(
				'id'   		=> $prefix . '_footer_bg_image',
				'name' 		=> esc_html__( 'Background image', 'fleurdesel' ),
				'type' 		=> 'file',
				'deps'    	=> array( $prefix . '[footer_bg_type]', '==', 'image' ),
			) );

			// Layout left logo settings.
			$tab->add_field( array(
				'id'      => $prefix . '_footer_left_logo',
				'name'    => esc_html__( 'Footer left logo', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select an image.', 'fleurdesel' ),
				'type'    => 'file',
				'deps'    => array( $prefix . '[footer_layout]', '==', 'left-logo' ),
			) );

			// Layout centered logo settings.
			$tab->add_field( array(
				'id'      => $prefix . '_footer_centered_logo',
				'name'    => esc_html__( 'Footer centered logo', 'fleurdesel' ),
				'desc'    => esc_html__( 'Select an image.', 'fleurdesel' ),
				'type'    => 'file',
				'deps'    => array( $prefix . '[footer_layout]', '==', 'centered-logo' ),
			) );

			$tab->add_field( array(
				'id'      => $prefix . '[show_footer_centered_logo_columns]',
				'name'    => esc_html__( 'Footer columns | Show', 'fleurdesel' ),
				'type'    => 'select',
				'desc'    => esc_html__( 'Off / On', 'fleurdesel' ),
				'deps'    => array( $prefix . '[footer_layout]', '==', 'centered-logo' ),
				'options' => $toggle_options,
			));

			$tab->add_field( array(
				'name'    => esc_html__( 'Footer Columns', 'fleurdesel' ),
				'id'      => $prefix . '[centered_logo_footer_column]',
				'type'    => 'select',
				'options' => array(
					''     => esc_html__( 'Default', 'fleurdesel' ),
					'1'    => esc_html__( '1', 'fleurdesel' ),
					'2'    => esc_html__( '2', 'fleurdesel' ),
					'3'    => esc_html__( '3', 'fleurdesel' ),
				),
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_centered_logo_columns]', '==|==', 'centered-logo|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Centered Logo Footer Sidebar 1', 'fleurdesel' ),
				'id'   => $prefix . '[centered_logo_footer_sidebar_1]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_centered_logo_columns]', '==|==', 'centered-logo|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Centered Logo Footer Sidebar 2', 'fleurdesel' ),
				'id'   => $prefix . '[centered_logo_footer_sidebar_2]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_centered_logo_columns]', '==|==', 'centered-logo|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Centered Logo Footer Sidebar 3', 'fleurdesel' ),
				'id'   => $prefix . '[centered_logo_footer_sidebar_3]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_centered_logo_columns]', '==|==', 'centered-logo|on' ),
			) );

			$tab->add_field( array(
				'id'      => $prefix . '[show_footer_classic_columns]',
				'name'    => esc_html__( 'Footer columns | Show', 'fleurdesel' ),
				'type'    => 'select',
				'desc'    => esc_html__( 'Off / On', 'fleurdesel' ),
				'deps'    => array( $prefix . '[footer_layout]', '==', 'classic' ),
				'options' => $toggle_options,
			));

			$tab->add_field( array(
				'name'    => esc_html__( 'Footer Columns', 'fleurdesel' ),
				'id'      => $prefix . '[classic_footer_column]',
				'type'    => 'select',
				'options' => array(
					''     => esc_html__( 'Default', 'fleurdesel' ),
					'1'    => esc_html__( '1', 'fleurdesel' ),
					'2'    => esc_html__( '2', 'fleurdesel' ),
					'3'    => esc_html__( '3', 'fleurdesel' ),
					'4'    => esc_html__( '4', 'fleurdesel' ),
				),
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_classic_columns]', '==|==', 'classic|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Classic Footer Sidebar 1', 'fleurdesel' ),
				'id'   => $prefix . '[classic_footer_sidebar_1]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_classic_columns]', '==|==', 'classic|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Classic Footer Sidebar 2', 'fleurdesel' ),
				'id'   => $prefix . '[classic_footer_sidebar_2]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_classic_columns]', '==|==', 'classic|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Classic Footer Sidebar 3', 'fleurdesel' ),
				'id'   => $prefix . '[classic_footer_sidebar_3]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_classic_columns]', '==|==', 'classic|on' ),
			) );

			$tab->add_field( array(
				'name' => esc_html__( 'Classic Footer Sidebar 4', 'fleurdesel' ),
				'id'   => $prefix . '[classic_footer_sidebar_4]',
				'type' => 'select',
				'options' => $opt_sidebars,
				'deps'    => array( $prefix . '[footer_layout]|' . $prefix . '[show_footer_classic_columns]', '==|==', 'classic|on' ),
			) );

		} );
	}
}
