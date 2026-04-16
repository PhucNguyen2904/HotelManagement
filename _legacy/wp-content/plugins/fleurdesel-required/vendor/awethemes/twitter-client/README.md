# WP Twitter

Provider a Twitter API Interface with admin setting credentials for Twitter.

## Install

Install via composer:

`composer require awethemes/twitter-client`

## How to use

You need setup valid credentials for Twitter Client in this page `wp-admin/options-general.php?page=at-twitter`

Get tweets by username:

```
<?php

$tweets = AT_Twitter::get_tweets( $username, $count );

if ( AT_Twitter::is_tweets_error( $tweets ) ) {

	AT_Twitter::get_tweets_error();

} else {

	var_dump( $tweets );
}
```

Bounus: Format tweet content, Ex: `@username` become a link to public account twitter [@username](https://twitter.com/username)

```php
<?php

$string = 'ABCD @anhskohbo';

var_dump( AT_Twitter::format_tweet( $string ) );
```

For more details pls checkout source code :)
