<?php

/**
 * Fired during plugin activation
 *
 * @link       https://citeo.com
 * @since      1.0.0
 *
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Citeo_Jeunesse
 * @subpackage Citeo_Jeunesse/includes
 * @author     citeo <citeo@citeo.com>
 */
class Citeo_Jeunesse_Activator {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'citeo_jeunesse_form';
		$charset_collate = $wpdb->get_charset_collate();

		// Structure de la table form
		$sql = "CREATE TABLE $table_name (
			ID BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			type VARCHAR(255) NOT NULL,
			statut VARCHAR(255) NOT NULL,
			email VARCHAR(255),
			nombre_enfant INT(11),
			visionnement_video BOOLEAN,
			opt_in BOOLEAN NOT NULL,
			date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
			refuse_survey BOOLEAN
		) $charset_collate;";

		// Création de la nouvelle table sondage
		$table_sondage = $wpdb->prefix . 'citeo_jeunesse_sondage';
		$sql_sondage = "CREATE TABLE $table_sondage (
			ID BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
			email VARCHAR(255) NOT NULL UNIQUE,
			date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
		) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
		dbDelta($sql_sondage);
		
		if ( get_site_option( 'wp_citeo_jeunesse_db_version' ) != WP_CITEO_JEUNESSE_DB_VERSION )
			self::plugin_updates();

		// Planifie l'événement Cron
        if (!wp_next_scheduled('citeo_jeunesse_cleanup_event')) {
            wp_schedule_event(time(), 'daily', 'citeo_jeunesse_cleanup_event');
        }
	}

	public static function plugin_updates() {
		global $wpdb;
		$table_name = $wpdb->prefix . 'citeo_jeunesse_form';

		// Supprime 'import_newsletter' si elle existe
        $column_exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) 
                 FROM INFORMATION_SCHEMA.COLUMNS 
                 WHERE TABLE_NAME = %s AND COLUMN_NAME = 'import_newsletter'",
                $table_name
            )
        );

        if ($column_exists) {
            $wpdb->query("ALTER TABLE $table_name DROP COLUMN `import_newsletter`");
        }

		// Ajoute 'refuse_survey' si absent (pour compatibilité ascendante)
        $column_exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) 
                 FROM INFORMATION_SCHEMA.COLUMNS 
                 WHERE TABLE_NAME = %s AND COLUMN_NAME = 'refuse_survey'",
                $table_name
            )
        );

        if (!$column_exists) {
            $wpdb->query("ALTER TABLE $table_name ADD COLUMN `refuse_survey` BOOLEAN");
        }

		global $wpdb;
		$table_sondage = $wpdb->prefix . 'citeo_jeunesse_sondage';
		$charset_collate = $wpdb->get_charset_collate();
		
		// Vérification de l'existence de la table sondage
		if ($wpdb->get_var("SHOW TABLES LIKE '$table_sondage'") != $table_sondage) {
			// Recréation sécurisée si la table est manquante
			$sql_sondage = "CREATE TABLE $table_sondage (
				ID BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
				email VARCHAR(255) NOT NULL UNIQUE,
				date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
			) $charset_collate;";
			
			dbDelta($sql_sondage);
		}

		update_option('wp_citeo_jeunesse_db_version', WP_CITEO_JEUNESSE_DB_VERSION);
	}
}
