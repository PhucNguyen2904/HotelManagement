<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'khachsanng_khachsannganha');
/** MySQL database username */
define('DB_USER', 'khachsanng_khachsannganha');
/** MySQL database password */
define('DB_PASSWORD', 'QWjgmVjuC');
/** MySQL hostname */
define('DB_HOST', 'localhost');
/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');
/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');
/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'VPJ+$E)[LZyfrHB_PhX||#9X6p3u/@SK11zwt7D3>]MzcMkOT5iMd,X!Uk`[?r9[');
define('SECURE_AUTH_KEY',  '$XY#q`e-b G1;sB{YrLPvEv(O_+6U^VV3p&]boE{$$*8aWkRxW8k?x/fCZrUbmpj');
define('LOGGED_IN_KEY',    ':(w*6a(C<Mcj-hY2D;dzmp+RmLi3wo>w3x~k~XOH^(4*}.}&ZMIUvC~(!!Q={6O>');
define('NONCE_KEY',        ';0lKn<op^j[X YSAinu=~W;*#f*|*>#$IT#u&9@)`4R8?I[i@[,!0<:3KA`)$(N ');
define('AUTH_SALT',        '>#L+Io|W.N+$W%3$/N!@ZjD,[PaZ[3m{=MquMP9P^OT?cVnIRF2(!X2hwlL?EuBH');
define('SECURE_AUTH_SALT', 'X+6oAAQLCOlr)}Hqy(Xjo+V19hq7ri6EmgSD||}GQlyTRu^U%}Bd5QReb FreC.Q');
define('LOGGED_IN_SALT',   'NBG!XK8%6}I9__4g*R:W5~MQnhxCHqa8dM.Y:T*]oyA=N`|52 l[bj=Ioe(RXjr=');
define('NONCE_SALT',       'xknqLL~cR5:?wvcxM^Fj|1RO*f4z+N;T@MeMzj17x9R_:cOe>J_K6(WaBR&WHK!/');
/**#@-*/
/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'sh_';
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );
// define( 'DISALLOW_FILE_EDIT', true );
define('AUTOSAVE_INTERVAL', 300 ); // seconds
define('WP_POST_REVISIONS', false );
/* That's all, stop editing! Happy blogging. */
/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');
/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
