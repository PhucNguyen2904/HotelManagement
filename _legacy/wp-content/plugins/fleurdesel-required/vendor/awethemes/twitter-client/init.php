<?php

if ( ! class_exists( 'TwitterWP' ) ) {
	require_once plugin_dir_path( __FILE__ ) . '/inc/TwitterWP.php';
}

require_once plugin_dir_path( __FILE__ ) . '/inc/class-at-twitter.php';
require_once plugin_dir_path( __FILE__ ) . '/inc/class-at-twitter-admin.php';

AT_Twitter_Admin::instance();
