<?php
$css_class = '';
extract(shortcode_atts(array(
    // 'style'             => '1',
    'on_click'              => 'none',
    'custom_links'          => '',
    'target_blank'          => '',
    'images'                => '',
    'item'                  => '3',
    'item_lg'               => '2',
    'item_md'               => '2',
    'item_sm'               => '1',
    'item_mb'               => '1',
    'number_row'            => '1',
    'image_size'            => 'thumbnail',
    'data_dots'             => 'true',
    'data_arrows'           => 'false',
    'el_class'              => '',
    'css'                   => '',
), $atts));

wp_enqueue_script( 'slick-js' );
wp_enqueue_style( 'slick-style' );
wp_enqueue_style( 'slick-theme-style' );

if ( $on_click == 'links' ) {
    $custom_links = explode( ',', $custom_links );
} elseif ( $on_click == 'lightbox' ) {
    wp_enqueue_script( 'fancybox-js' );
    wp_enqueue_style( 'fancybox-css' );
}

if ( $images == '' ) $images = '-1,-2,-3';
$images = explode( ',', $images );
$i = - 1;

// var_dump($target_blank);

$css_class = apply_filters( VC_SHORTCODE_CUSTOM_CSS_FILTER_TAG, vc_shortcode_custom_css_class( $css, ' ' ), 'wtb_carousel_image', $atts );
$el_class = esc_html( wtb_shortcode_extract_class( $el_class ) );

echo '<div class="wtb_carousel_image_container wpb_content_element '. $css_class .'">';
    echo '<div class="wtb_carousel_image-shortcode '. $el_class .'">';

        echo '<div class="slick-carousel carousel_image-slider" data-item="'. $item .'" data-item_lg="'. $item_lg .'" data-item_md="'. $item_md .'" data-item_sm="'. $item_sm .'" data-item_mb="'. $item_mb .'" data-row="'. $number_row .'" data-dots="'. $data_dots .'" data-arrows="'. $data_arrows .'" data-vertical="false">';
            
            foreach ( $images as $attach_id ): ?>
                <?php
                    $i ++;
                    if ( $attach_id > 0 ) {
                        $post_thumbnail = wpb_getImageBySize( array( 'attach_id' => $attach_id, 'thumb_size' => $image_size ) );
                    } else {
                        $post_thumbnail = array();
                        $post_thumbnail['thumbnail'] = '<img src="' . vc_asset_url( 'vc/no_image.png' ) . '" />';
                        $post_thumbnail['p_img_large'][0] = vc_asset_url( 'vc/no_image.png' );
                    }
                    $thumbnail = $post_thumbnail['thumbnail'];
                ?>
                <div class="slick-item">
                    <div class="slick-item-inner">
                        <?php if ( $on_click == 'lightbox' ): ?>
                        <?php $p_img_large = $post_thumbnail['p_img_large']; ?>
                        <a data-fancybox="gallery" href="<?php echo esc_url($p_img_large[0]); ?>">
                            <?php echo apply_filters( 'vc_images_carousel_thumbnail', $thumbnail ); ?>
                        </a>
                        <?php elseif ( $on_click == 'links' && isset( $custom_links[$i] ) && $custom_links[$i] != '' ): ?>
                        <a href="<?php echo esc_url( $custom_links[$i] ); ?>"<?php echo ( ( $target_blank == '1' ) ? ' target="_blank"' : '' ) ?>>
                            <?php echo apply_filters( 'vc_images_carousel_thumbnail', $thumbnail ); ?>
                        </a>
                        <?php else: ?>
                            <?php echo apply_filters( 'vc_images_carousel_thumbnail', $thumbnail ); ?>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach;

        echo '</div>';

    echo '</div>';
echo '</div>';
