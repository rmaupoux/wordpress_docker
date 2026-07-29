<?php
/**
 * Route wp_mail() through a local SMTP relay (Mailpit) when SMTP_HOST is set.
 *
 * Only active in environments defining the SMTP_HOST env var (see the
 * `mailpit` service in docker-compose.yml) — a no-op everywhere else,
 * including real production deployments.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$smtp_host = getenv( 'SMTP_HOST' );

if ( ! $smtp_host ) {
	return;
}

add_action( 'phpmailer_init', function ( $phpmailer ) use ( $smtp_host ) {
	$phpmailer->isSMTP();
	$phpmailer->Host       = $smtp_host;
	$phpmailer->Port       = getenv( 'SMTP_PORT' ) ?: 1025;
	$phpmailer->SMTPAuth   = false;
	$phpmailer->SMTPSecure = '';
} );
