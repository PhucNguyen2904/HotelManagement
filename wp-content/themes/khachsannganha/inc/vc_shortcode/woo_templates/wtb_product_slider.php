<?php
$css_class = '';
extract(shortcode_atts(array(
    // 'style'             => '1',
    'posts_per_page'        => '10',
    'items_desktop_large'   => '3',
    'items_desktop'         => '2',
    'items_tablets'         => '2',
    'items_mobile'          => '1',
    'number_row'            => '1',
    'order'                 => 'desc',
    'orderby'               => 'date',
    'categories'            => '',
    'data_dots'             => 'true',
    'data_arrows'           => 'false',
    'el_class'              => '',
    'css'                   => '',
), $atts));

$args = array(
    'post_type' => 'product',
    'tax_query' => array(
        array(
            'taxonomy'  => 'product_cat',
            'field'     => 'id',
            'terms'     => $categories
        )
    ),
    'posts_per_page'    => $posts_per_page,
    'orderby'           => $orderby,
    'order'             => $order,
);
$the_query = new WP_Query( $args );

// The Loop
if ( $the_query->have_posts() ) {
    $css_class = apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $css, ' ' ), 'wtb_blog_slider', $atts );
    $el_class = esc_html( wtb_shortcode_extract_class( $el_class ) );

    wp_enqueue_script( 'slick-js' );
    wp_enqueue_style( 'slick-style' );
    wp_enqueue_style( 'slick-theme-style' );

    echo '<div class="wtb_product_slider_container wpb_content_element '. $css_class .'">';
        echo '<div class="sh-product-slider-shortcode '. $el_class .'">';

            echo '<div class="slick-carousel product-slider list-products" data-item="'. $items_desktop_large .'" data-item_md="'. $items_desktop .'" data-item_sm="'. $items_tablets .'" data-item_mb="'. $items_mobile .'" data-row="'. $number_row .'" data-dots="'. $data_dots .'" data-arrows="'. $data_arrows .'" data-vertical="false">';
                
                while ( $the_query->have_posts() ) { $the_query->the_post();

                    /**
                     * Hook: woocommerce_shop_loop.
                     *
                     * @hooked WC_Structured_Data::generate_product_data() - 10
                     */
                    do_action( 'woocommerce_shop_loop' );

                    wc_get_template_part( 'content', 'product' );
                    
                }
                wp_reset_postdata();

            echo '</div>';

        echo '</div>';
    echo '</div>';

}