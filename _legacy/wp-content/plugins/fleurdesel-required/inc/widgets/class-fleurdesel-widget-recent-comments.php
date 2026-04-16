<?php
/**
 * Fleurdesel Widgets
 *
 * @package Fleurdesel Required
 */

/**
 * Fleurdesel_Recent_Comments_Widget
 */
class Fleurdesel_Recent_Comments_Widget extends WP_Widget_Recent_Comments {

	/**
	 * Outputs the content for the current Recent Comments widget instance.
	 *
	 * @since 2.8.0
	 * @access public
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Recent Comments widget instance.
	 */
	public function widget( $args, $instance ) {
		if ( ! isset( $args['widget_id'] ) )
			$args['widget_id'] = $this->id;

		$output = '';

		$title = ( ! empty( $instance['title'] ) ) ? $instance['title'] : __( 'Recent Comments' );

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		$number = ( ! empty( $instance['number'] ) ) ? absint( $instance['number'] ) : 5;
		if ( ! $number )
			$number = 5;

		/**
		 * Filters the arguments for the Recent Comments widget.
		 *
		 * @since 3.4.0
		 *
		 * @see WP_Comment_Query::query() for information on accepted arguments.
		 *
		 * @param array $comment_args An array of arguments used to retrieve the recent comments.
		 */
		$comments = get_comments( apply_filters( 'widget_comments_args', array(
			'number'      => $number,
			'status'      => 'approve',
			'post_status' => 'publish'
		) ) );

		$output .= $args['before_widget'];
		if ( $title ) {
			$output .= $args['before_title'] . $title . $args['after_title'];
		}
		$output .= '<div class="ac-widget__content"><ul id="recentcomments">';
		if ( is_array( $comments ) && $comments ) {
			// Prime cache for associated posts. (Prime post term cache if we need it for permalinks.)
			$post_ids = array_unique( wp_list_pluck( $comments, 'comment_post_ID' ) );
			_prime_post_caches( $post_ids, strpos( get_option( 'permalink_structure' ), '%category%' ), false );

			foreach ( (array) $comments as $comment ) {
				$comment_id = $comment->comment_ID;
				$the_comment = get_comment( $comment_id, ARRAY_A );
				$output .= '<li class="recentcomments"><article class="widget-comment">';
				$output .= '<div class="widget-comment__metadata clearfix">';
				$output .= '<div class="widget-comment__avatar">' . get_avatar( $comment, 68 ) . '</div>';
				$output .= '<div class="widget-comment__meta">';
				/* translators: comments widget: 1: comment author, 2: post link */
				$output .= '<p class="widget-comment__author">' . get_comment_author_link( $comment ) . '</p>';
				$output .= '<time datetime="' . $the_comment['comment_date'] . '">' . $the_comment['comment_date'] . '</time>';
				$output .= '</div>';
				$output .= '</div>';
				if ( $the_comment['comment_content'] ) {
					$output .= '<div class="widget-comment__content"><p>' . wp_trim_words( $the_comment['comment_content'], 15, '...' )
					. '</p></div>';
				}
				$output .= '</article></li>';
			}
		}
		$output .= '</ul></div>';
		$output .= $args['after_widget'];

		echo $output;
	}
}

/**
 * Register Fleurdesel_Recent_Comments_Widget
 */
function fleurdesel_register_recent_comments_widget() {
	unregister_widget( 'WP_Widget_Recent_Comments' );
	register_widget( 'Fleurdesel_Recent_Comments_Widget' );
}
add_action( 'widgets_init', 'fleurdesel_register_recent_comments_widget' );
