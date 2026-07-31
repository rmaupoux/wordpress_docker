<?php
/**
 * Activation / désactivation : table d'historique, capacité admin custom,
 * cron d'expiration, complétion des champs Pods manquants sur le pod bateau.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IP_Activator {

	public static function activate() {
		self::create_history_table();
		self::add_capability();
		self::maybe_complete_pod_fields();
		IP_Subscription::schedule_cron();

		flush_rewrite_rules();
	}

	public static function deactivate() {
		IP_Subscription::unschedule_cron();
		flush_rewrite_rules();
	}

	/**
	 * Table d'historique des paiements/renouvellements par abonné.
	 */
	private static function create_history_table() {
		global $wpdb;

		$table_name      = $wpdb->prefix . 'ip_subscription_history';
		$charset_collate = $wpdb->get_charset_collate();

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$sql = "CREATE TABLE {$table_name} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id BIGINT UNSIGNED NOT NULL,
			action_type VARCHAR(50) NOT NULL,
			amount DECIMAL(10,2) NULL,
			payment_method VARCHAR(50) NULL,
			note TEXT NULL,
			created_by BIGINT UNSIGNED NULL,
			created_at DATETIME NOT NULL,
			PRIMARY KEY  (id),
			KEY user_id (user_id),
			KEY created_at (created_at)
		) {$charset_collate};";

		dbDelta( $sql );
	}

	/**
	 * Capacité custom pour gérer les abonnés sans forcément donner manage_options.
	 * Attribuée par défaut au rôle administrator.
	 */
	private static function add_capability() {
		$role = get_role( 'administrator' );

		if ( $role && ! $role->has_cap( 'manage_ip_subscriptions' ) ) {
			$role->add_cap( 'manage_ip_subscriptions' );
		}
	}

	/**
	 * Complète le pod "annuaire_bateau" avec les champs manquants attendus
	 * par le tunnel (tirant d'eau, tonnage, capacité, couchages, salles d'eau),
	 * sans toucher aux champs déjà créés par ailleurs.
	 *
	 * Choix validé avec l'utilisateur : le plugin complète le pod existant
	 * plutôt que de stocker ces valeurs en dehors de Pods.
	 */
	private static function maybe_complete_pod_fields() {
		if ( ! function_exists( 'pods_api' ) ) {
			return;
		}

		$pod_data = pods_api()->load_pod( array( 'name' => IP_BOAT_POD ) );

		if ( empty( $pod_data['id'] ) || empty( $pod_data['groups'] ) ) {
			return;
		}

		// Groupe "Plus de champs" : mêmes groupe/rangement que les champs généraux existants.
		$general_group = null;

		foreach ( $pod_data['groups'] as $group ) {
			if ( 'plus_de_champs' === $group['name'] ) {
				$general_group = $group;
				break;
			}
		}

		if ( ! $general_group ) {
			$general_group = reset( $pod_data['groups'] );
		}

		$existing_fields = array();

		foreach ( $pod_data['fields'] as $field ) {
			$existing_fields[ $field['name'] ] = true;
		}

		$missing_fields = array(
			'draft'          => array(
				'label' => 'Draft',
				'type'  => 'number',
			),
			'gross_tonnage'  => array(
				'label' => 'Gross tonnage',
				'type'  => 'number',
			),
			'capacity'       => array(
				'label' => 'Number of people allowed on board',
				'type'  => 'number',
			),
			'bed'            => array(
				'label' => 'Bed',
				'type'  => 'number',
			),
			'shower_room'    => array(
				'label' => 'Shower room',
				'type'  => 'number',
			),
		);

		$missing_fields[ ip_boat_expiry_field() ] = array(
			'label' => 'Listing expiry date',
			'type'  => 'date',
		);

		foreach ( $missing_fields as $field_name => $field_args ) {
			if ( isset( $existing_fields[ $field_name ] ) ) {
				continue;
			}

			$field_config = array(
				'pod_id'   => $pod_data['id'],
				'name'     => $field_name,
				'label'    => $field_args['label'],
				'type'     => $field_args['type'],
				'group'    => $general_group['name'],
				'required' => 0,
			);

			if ( 'number' === $field_args['type'] ) {
				$field_config['number_format']   = 'i18n';
				$field_config['number_decimals'] = 0;
			}

			pods_api()->save_field( $field_config );
		}
	}
}
