<?php
$css_class = '';
extract(shortcode_atts(array(
    'numcol'            => '3',
    'posts_per_page'    => '3',
    'orderby'           => 'date',
    'order'             => 'desc',
    'categories'        => '',
    'el_class'          => '',
    'css'               => '',
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
    $css_class = apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $css, ' ' ), 'wtb_blog', $atts );
    $el_class = esc_html( wtb_shortcode_extract_class( $el_class ) );

    echo '<div class="sh-product-shortcode column-'. $numcol .' '. $el_class .'">';

        echo '<ul class="row list-products">';

            while ( $the_query->have_posts() ) {

                $the_query->the_post();

                /**
                 * Hook: woocommerce_shop_loop.
                 *
                 * @hooked WC_Structured_Data::generate_product_data() - 10
                 */
                do_action( 'woocommerce_shop_loop' );

                wc_get_template_part( 'content', 'product' );

            }
            wp_reset_postdata();

        echo '</ul>';

    echo '</div>';

}