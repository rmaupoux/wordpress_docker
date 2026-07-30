<?php
/**
 * Plugin Name: Annuaire Unifié – Bateaux & Maritime
 * Description: Système complet de recherche avec onglets pour bateaux (YACHT), contacts maritimes (CHARTER) et réseau (NETWORK)
 * Version: 1.0.10
 * Author: Maupoux
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: annuaire-unifiee
 * Domain Path: /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Constantes du plugin
define( 'ANNUAIRE_UNIFIEE_VERSION', '1.0.10' );
define( 'ANNUAIRE_UNIFIEE_PATH', plugin_dir_path( __FILE__ ) );
define( 'ANNUAIRE_UNIFIEE_URL', plugin_dir_url( __FILE__ ) );

require_once ANNUAIRE_UNIFIEE_PATH . 'includes/class-plugin.php';

add_action( 'plugins_loaded', function() {
	new Annuaire_Unifiee();
} );
