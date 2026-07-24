<?php
/**
 * Plugin Name: Annuaire Unifié – Bateaux & Maritime
 * Description: Système complet de recherche avec onglets pour bateaux (YACHT), contacts maritimes (CHARTER) et réseau (NETWORK)
 * Version: 1.0.0
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
define( 'ANNUAIRE_UNIFIEE_VERSION', '1.0.0' );
define( 'ANNUAIRE_UNIFIEE_PATH', plugin_dir_path( __FILE__ ) );
define( 'ANNUAIRE_UNIFIEE_URL', plugin_dir_url( __FILE__ ) );

// Charger les plugins existants comme includes
// Cela regroupe les deux plugins en un seul
add_action( 'plugins_loaded', function() {
	// Charger annuaire-bateaux-recherche
	if ( file_exists( dirname( ANNUAIRE_UNIFIEE_PATH ) . '/annuaire-bateaux-recherche.php' ) ) {
		require_once dirname( ANNUAIRE_UNIFIEE_PATH ) . '/annuaire-bateaux-recherche.php';
	}

	// Charger annuaire-maritime-recherche
	if ( file_exists( dirname( ANNUAIRE_UNIFIEE_PATH ) . '/annuaire-maritime-recherche.php' ) ) {
		require_once dirname( ANNUAIRE_UNIFIEE_PATH ) . '/annuaire-maritime-recherche.php';
	}
}, 5 );
