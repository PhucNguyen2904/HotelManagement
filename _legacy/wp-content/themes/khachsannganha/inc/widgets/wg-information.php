<?php
add_action('widgets_init', 'register_widget_information');
function register_widget_information() {
    register_widget('Gtid_Information_Widget');
}
class Gtid_Information_Widget extends WP_Widget {
    function __construct() {
        parent::__construct(
            'information',
            __( '3B - Information contact', 'fleurdesel' ),
            array( 
                'description'  => __( 'Display information contact', 'fleurdesel' ),
            )
        );
    }
    function widget($args, $instance) {
        extract($args);
        echo $before_widget;
        if ($instance['title']) echo $before_title . apply_filters('widget_title', $instance['title']) . $after_title;
        ?>
        <ul>
            <?php
            $hide_label = $instance['hide_label'] ? 'd-none' : '';
            $hide_icon  = $instance['hide_icon']  ? 'd-none' : '';
            if( $instance['company'] ) {
                echo '<li class="pl-0">'. $instance['company'] .'</li>';
            }
            if( $instance['address'] ) {
                echo '<li><i class="'. $hide_icon .' fa fa-map-marker"></i><span class="'. $hide_label .'">'. __( 'Address', 'fleurdesel' ) .':</span> '. $instance['address'] .'</li>';
            }
            if( $instance['tel'] ) {
                echo '<li><i class="'. $hide_icon .' fa fa-phone"></i><span class="'. $hide_label .'">'. __( 'Telephone', 'fleurdesel' ) .':</span> '. $instance['tel'] .'</li>';
            }
            if( $instance['hotline'] ) {
                echo '<li><i class="'. $hide_icon .' fa fa-mobile-alt"></i><span class="'. $hide_label .'">'. __( 'Hotline', 'fleurdesel' ) .':</span> '. $instance['hotline'] .'</li>';
            }
            if( $instance['email'] ) {
                echo '<li><i class="'. $hide_icon .' fa fa-envelope"></i><span class="'. $hide_label .'">'. __( 'Email', 'fleurdesel' ) .':</span> '. $instance['email'] .'</li>';
            }
            if( $instance['website'] ) {
                echo '<li><i class="'. $hide_icon .' fa fa-globe"></i><span class="'. $hide_label .'">'. __( 'Website', 'fleurdesel' ) .':</span> '. $instance['website'] .'</li>';
            }
            ?>
        </ul>
        <?php
        echo $after_widget;
    }
    function update($new_instance, $old_instance) {
        return $new_instance;
    }
    function form($instance) {
        $instance = wp_parse_args( 
            (array)$instance, array(
                'title'      => '', 
                'address'    => '',  
                'tel'        => '',
                'hotline'    => '',
                'email'      => '',
                'website'    => '',
                'hide_label' => '',
                'hide_icon'  => '',
            ) 
        );
        ?>
        <p>
            <label for="<?php  echo $this->get_field_id('title'); ?>"><?php _e('Title', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php  echo $this->get_field_name('title'); ?>" value="<?php  echo esc_attr( $instance['title'] ); ?>" />
        </p>
        <p>
            <label for="<?php  echo $this->get_field_id('company'); ?>"><?php _e('Company', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('company'); ?>" name="<?php  echo $this->get_field_name('company'); ?>" value="<?php  echo esc_attr( $instance['company'] ); ?>" />
        </p>
        <p>
            <label for="<?php  echo $this->get_field_id('address'); ?>"><?php _e('Address', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('address'); ?>" name="<?php  echo $this->get_field_name('address'); ?>" value="<?php  echo esc_attr( $instance['address'] ); ?>" />
        </p>
        <p>
            <label for="<?php  echo $this->get_field_id('tel'); ?>"><?php _e('Telephone', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('tel'); ?>" name="<?php  echo $this->get_field_name('tel'); ?>" value="<?php  echo esc_attr( $instance['tel'] ); ?>" />
        </p>
        <p>
            <label for="<?php  echo $this->get_field_id('hotline'); ?>"><?php _e('Hotline', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('hotline'); ?>" name="<?php  echo $this->get_field_name('hotline'); ?>" value="<?php  echo esc_attr( $instance['hotline'] ); ?>" />
        </p>
        <p>
            <label for="<?php  echo $this->get_field_id('email'); ?>"><?php _e('Email', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('email'); ?>" name="<?php  echo $this->get_field_name('email'); ?>" value="<?php  echo esc_attr( $instance['email'] ); ?>" />
        </p>
        <p>
            <label for="<?php  echo $this->get_field_id('website'); ?>"><?php _e('Website', 'fleurdesel'); ?>:</label>
            <input type="text" class="widefat" id="<?php echo $this->get_field_id('website'); ?>" name="<?php  echo $this->get_field_name('website'); ?>" value="<?php  echo esc_attr( $instance['website'] ); ?>" />
        </p>
        <p>
            <input id="<?php echo esc_attr( $this->get_field_id( 'hide_label' ) ); ?>" type="checkbox" name="<?php echo esc_attr( $this->get_field_name( 'hide_label' ) ); ?>" value="1" <?php checked( $instance['hide_label'] ); ?>/>
            <label for="<?php echo esc_attr( $this->get_field_id( 'hide_label' ) ); ?>"><?php _e( 'Hide label', 'fleurdesel' ); ?></label>
        </p>
        <p>
            <input id="<?php echo esc_attr( $this->get_field_id( 'hide_icon' ) ); ?>" type="checkbox" name="<?php echo esc_attr( $this->get_field_name( 'hide_icon' ) ); ?>" value="1" <?php checked( $instance['hide_icon'] ); ?>/>
            <label for="<?php echo esc_attr( $this->get_field_id( 'hide_icon' ) ); ?>"><?php _e( 'Hide icon', 'fleurdesel' ); ?></label>
        </p>
    <?php
    }
}
