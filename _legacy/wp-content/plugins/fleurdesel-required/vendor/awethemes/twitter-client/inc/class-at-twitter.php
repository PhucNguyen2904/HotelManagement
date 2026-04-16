<?php
/**
 * AweThemes Twitter API
 *
 * @package AweThemes
 * @subpackage Twitter Client
 * @version 0.1.0
 */

if ( ! class_exists( 'AT_Twitter' ) ) :

	class AT_Twitter {
		/**
		 * TwitterWP Client.
		 *
		 * @var TwitterWP
		 */
		protected static $client;

		/**
		 * Get Twitter WP Instance.
		 *
		 * @return TwitterWP
		 */
		public static function client() {
			if ( ! static::$client ) {
				static::$client = TwitterWP::start( static::get_credentials() );
			}

			return static::$client;
		}

		/**
		 * Get tweets by username.
		 *
		 * @param  string $user  Twitter username.
		 * @param  int    $count Number of tweets to return.
		 * @return array|WP_Error
		 */
		public static function get_tweets( $user, $count = 1 ) {
			$client = static::client();

			if ( is_wp_error( $client ) ) {
				return $client;
			}

			$transient = 'at_tweets_' . $user . '_' . $count;
			$tweets = get_transient( $transient );

			if ( ! $tweets || ! is_array( $tweets ) ) {
				$tweets = $client->get_tweets( $user, $count );

				if ( ! is_wp_error( $tweets ) ) {
					// Cache tweets in 12 hours.
					$expiration = apply_filters( 'at_tweets_expiration', 43200 );
					set_transient( $transient, $tweets, $expiration );
				}
			}

			return $tweets;
		}

		/**
		 * Check if $tweets is error response
		 *
		 * @param  mixed  $tweets
		 * @return boolean
		 */
		public static function is_tweets_error( $tweets ) {
			return is_wp_error( $tweets ) || ! is_array( $tweets );
		}

		/**
		 * Get response error from $tweets
		 *
		 * @param  mixed  $tweets
		 * @param  string $class
		 */
		public static function get_tweets_error( $tweets, $class = '' ) {
			global $allowedposttags;

			if ( ! static::is_tweets_error( $tweets ) ) {
				return;
			}

			?><div class="tweet-error <?php echo esc_attr( $class ); ?>">
				<?php if ( is_wp_error( $tweets ) ) : ?>
					<p><?php echo wp_kses( $tweets->get_error_message(), $allowedposttags ) ?></p>
				<?php elseif ( isset( $tweets->error ) ) : ?>
					<p><?php echo wp_kses( $tweets->error, $allowedposttags ); ?></p>
				<?php elseif ( is_string( $tweets ) ) : ?>
					<p><?php echo wp_kses( $tweets, $allowedposttags ); ?></p>
				<?php endif ?>
			</div><?php
		}

		/**
		 * Small helper to format tweet.
		 *
		 * @param  string $text
		 * @return string
		 */
		public static function format_tweet( $text ) {
			$text = make_clickable( $text );
			$text = preg_replace( '/@(\w+)/i', '<a target="_blank" href="' . esc_url( 'https://twitter.com' ) . '/$1">$0</a>', $text );

			return apply_filters( 'at_format_tweet', $text );
		}

		/**
		 * Get Twitter credentials from database.
		 *
		 * @return array
		 */
		public static function get_credentials() {
			return wp_parse_args( (array) get_option( 'at-twitter' ), array(
				'consumer_key'        => '',
				'consumer_secret'     => '',
				'access_token'        => '',
				'access_token_secret' => '',
			) );
		}

		/**
		 * Allow use client method call as static
		 *
		 * @param  string $method
		 * @param  array  $parameters
		 * @return mixed
		 */
		public static function __callStatic( $method, $parameters ) {
			$class = static::client();

			if ( ! method_exists( $class, $method ) ) {
				throw new InvalidArgumentException;
			}

			return call_user_func_array( array( $class, $method ), $parameters );
		}
	}
endif;
