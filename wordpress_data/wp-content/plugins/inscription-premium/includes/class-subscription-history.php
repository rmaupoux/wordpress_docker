<?php
/**
 * Accès à la table wp_ip_subscription_history (créée à l'activation).
 * Classe toujours chargée (contrairement aux classes admin/) car utilisée
 * aussi bien depuis le webhook Stripe que depuis le tableau de bord admin.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Subscription_History {

	public static function table_name() {
		global $wpdb;

		return $wpdb->prefix . 'ip_subscription_history';
	}

	public static function log( $user_id, $action_type, $amount = null, $payment_method = null, $note = '', $created_by = null ) {
		global $wpdb;

		$wpdb->insert(
			self::table_name(),
			array(
				'user_id'        => (int) $user_id,
				'action_type'    => sanitize_key( $action_type ),
				'amount'         => null !== $amount ? (float) $amount : null,
				'payment_method' => $payment_method ? sanitize_text_field( $payment_method ) : null,
				'note'           => $note ? sanitize_textarea_field( $note ) : null,
				'created_by'     => $created_by,
				'created_at'     => current_time( 'mysql' ),
			),
			array( '%d', '%s', '%f', '%s', '%s', '%d', '%s' )
		);
	}

	public static function for_user( $user_id, $limit = 50 ) {
		global $wpdb;

		return $wpdb->get_results( $wpdb->prepare(
			'SELECT * FROM ' . self::table_name() . ' WHERE user_id = %d ORDER BY created_at DESC LIMIT %d',
			$user_id,
			$limit
		) );
	}
}
