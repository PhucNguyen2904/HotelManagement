<?php
add_shortcode('wtb_carousel_image', 'wtb_shortcode_carousel_image');
add_action('vc_build_admin_page', 'wtb_load_carousel_image_shortcode');
add_action('vc_after_init', 'wtb_load_carousel_image_shortcode');

function wtb_shortcode_carousel_image($atts, $content = null) {
    ob_start();
    if ($template = wtb_shortcode_template('wtb_carousel_image'))
        include $template;
    return ob_get_clean();
}

function wtb_load_carousel_image_shortcode() {
    $custom_class       = wtb_vc_custom_class();

    vc_map( array(
        'name'          => "Web3B " . esc_html__('Carousel Images', 'shtheme'),
        'base'          => 'wtb_carousel_image',
        'description'   => esc_html__('Show one carousel images', 'shtheme'),
        'category'      => esc_html__('Web3B', 'shtheme'),
        'icon'		    => get_template_directory_uri() . "/inc/vc_shortcode/assets/images/logo.svg",
        'weight'        => - 50,
        'params'        => array(
            array(
				'type' 			=> 'attach_images',
				'heading' 		=> esc_html__( 'Images', 'shtheme' ),
				'param_name' 	=> 'images',
				'value' 		=> '',
				'description' 	=> esc_html__( 'Select images from media library.', 'shtheme' ),
                'admin_label'   => true,
			),
            /**
            * Click action
            */
            array(
                'type'          => 'dropdown',
                'heading'       => esc_html__( 'On click action', 'shtheme' ),
                'param_name'    => 'on_click',
                'std'           => 1,
                'value'         => array(
                    esc_html__( 'Lightbox', 'shtheme' )     => 'lightbox',
                    esc_html__( 'Custom link', 'shtheme' )  => 'links',
                    esc_html__( 'None', 'shtheme' )         => 'none'
                ),
                'edit_field_class' => 'vc_col-sm-6 vc_column',
            ),
            array(
                "type"          => "dropdown",
                "heading"       => esc_html__( 'Open in new tab', 'shtheme' ),
                "param_name"    => "target_blank",
                'std'           => 1,
                'value'         => array(
                    esc_html__('No', 'shtheme') => 2,
                    esc_html__('Yes', 'shtheme') => 1,
                ),
                'dependency' => array(
                    'element' => 'on_click',
                    'value' => array( 'links' ),
                ),
                'edit_field_class' => 'vc_col-sm-6 vc_column',
            ),
            array(
                'type'          => 'exploded_textarea',
                'heading'       => esc_html__( 'Custom links', 'shtheme' ),
                'param_name'    => 'custom_links',
                'description'   => esc_html__( 'Enter links for each slide (Note: divide links with linebreaks (Enter)).', 'shtheme' ),
                'dependency' => array(
                    'element' => 'on_click',
                    'value' => array( 'links' ),
                ),
            ),
			array(
                "type"          => "dropdown",
                "heading"       => esc_html__("Number Column on Extra large screen (>= 1200px)", 'shtheme'),
                "param_name"    => "item",
                'std'           => 3,
                'value'         => array(
                    esc_html__('6', 'shtheme') => 6,
                    esc_html__('5', 'shtheme') => 5,
                    esc_html__('4', 'shtheme') => 4,
                    esc_html__('3', 'shtheme') => 3,
                    esc_html__('2', 'shtheme') => 2,
                    esc_html__('1', 'shtheme') => 1,
                ),
            ),
            array(
                "type"          => "dropdown",
                "heading"       => esc_html__("Number Column on Large screen (992px - 1199px)", 'shtheme'),
                "param_name"    => "item_lg",
                'std'           => 2,
                'value'         => array(
                    esc_html__('6', 'shtheme') => 6,
                    esc_html__('5', 'shtheme') => 5,
                    esc_html__('4', 'shtheme') => 4,
                    esc_html__('3', 'shtheme') => 3,
                    esc_html__('2', 'shtheme') => 2,
                    esc_html__('1', 'shtheme') => 1,
                ),
            ),
            array(
                "type"          => "dropdown",
                "heading"       => esc_html__("Number Column on Medium screen (769px - 991px)", 'shtheme'),
                "param_name"    => "item_md",
                'std'           => 2,
                'value'         => array(
                    esc_html__('6', 'shtheme') => 6,
                    esc_html__('5', 'shtheme') => 5,
                    esc_html__('4', 'shtheme') => 4,
                    esc_html__('3', 'shtheme') => 3,
                    esc_html__('2', 'shtheme') => 2,
                    esc_html__('1', 'shtheme') => 1,
                ),
            ),
            array(
                "type"          => "dropdown",
                "heading"       => __("Number Column on Small screen (577px - 767px)", "shtheme"),
                "param_name"    => "item_sm",
                'std'           => 2,
                'value'         => array(
                    esc_html__('4', 'shtheme') => 4,
                    esc_html__('3', 'shtheme') => 3,
                    esc_html__('2', 'shtheme') => 2,
                    esc_html__('1', 'shtheme') => 1,
                ),
            ),
            array(
                "type"          => "dropdown",
                "heading"       => __("Number Column on Extra small screen (< 576px)", "shtheme"),
                "param_name"    => "item_mb",
                'std'           => 1,
                'value'         => array(
                    esc_html__('6', 'shtheme') => 6,
                    esc_html__('5', 'shtheme') => 5,
                    esc_html__('4', 'shtheme') => 4,
                    esc_html__('3', 'shtheme') => 3,
                    esc_html__('2', 'shtheme') => 2,
                    esc_html__('1', 'shtheme') => 1,
                ),
            ),
            array(
                "type"          => "dropdown",
                "heading"       => __("Number row", "shtheme"),
                "param_name"    => "number_row",
                'std'           => 1,
                'value'         => array(
                    esc_html__('6', 'shtheme') => 6,
                    esc_html__('5', 'shtheme') => 5,
                    esc_html__('4', 'shtheme') => 4,
                    esc_html__('3', 'shtheme') => 3,
                    esc_html__('2', 'shtheme') => 2,
                    esc_html__('1', 'shtheme') => 1,
                ),
            ),
            array(
                'type'          => 'textfield',
                'heading'       => esc_html__('Image size', 'shtheme'),
                'param_name'    => 'image_size',
                'value'         => 'thumbnail',
                'admin_label'   => true,
                'description'   => esc_html__( 'Enter image size (Example: "thumbnail", "medium", "large", "full" or other sizes defined by theme). Alternatively enter size in pixels (Example: 200x100 (Width x Height)).', 'shtheme' ),
            ),

            $custom_class,

            array(
                'type'          => 'dropdown',
                'heading'       => __('Dots Navigation', 'shtheme'),
                'param_name'    => 'data_dots',
                'std'           => 'true',
                'value'         => array(
                    esc_html__('Yes', 'shtheme')    => 'true',
                    esc_html__('No', 'shtheme')     => 'false',
                ),
                'group'         => 'Navigation',
            ),
            array(
                'type'          => 'dropdown',
                'heading'       => __('Arrows Navigation', 'shtheme'),
                'param_name'    => 'data_arrows',
                'std'           => 'false',
                'value'         => array(
                    esc_html__('Yes', 'shtheme')    => 'true',
                    esc_html__('No', 'shtheme')     => 'false',
                ),
                'group'         => 'Navigation',
            ),
            array(
                'type'          => 'css_editor',
                'heading'       => esc_html__( 'CSS box', 'shtheme' ),
                'param_name'    => 'css',
                'group'         => esc_html__( 'Design Options', 'shtheme' ),
            ),
        )
    ) );
}