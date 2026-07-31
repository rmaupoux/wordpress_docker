<?php
/**
 * Plugin Name:       Inscription Premium
 * Plugin URI:         https://github.com/rmaupoux/inscription-premium
 * Description:        Inscription/abonnement front-end et tunnel de dépôt d'annonce en 5 étapes, adossé aux champs Pods du CPT "annuaire_bateau".
 * Version:            1.0.0
 * Requires PHP:       7.4
 * Requires Plugins:   pods
 * Author:              Atelier Maupoux
 * Text Domain:         inscription-premium
 * Domain Path:         /languages
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'IP_VERSION', '1.0.0' );
define( 'IP_PATH', plugin_dir_path( __FILE__ ) );
define( 'IP_URL', plugin_dir_url( __FILE__ ) );
define( 'IP_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Nom du pod (CPT Pods) et de la taxonomie utilisés pour les annonces.
 * Centralisé ici pour rester cohérent avec le plugin annuaire-unifiee.
 */
define( 'IP_BOAT_POD', 'annuaire_bateau' );
define( 'IP_BOAT_TAXONOMY', 'type_de_bateau' );
define( 'IP_CONTACT_POD', 'annuaire_maritime' );

/**
 * Vérifie les dépendances (Pods) avant de charger le reste du plugin.
 */
function ip_check_dependencies() {
	if ( ! function_exists( 'pods' ) ) {
		add_action( 'admin_notices', function () {
			echo '<div class="notice notice-error"><p>';
			esc_html_e( 'Inscription Premium nécessite le plugin Pods Framework, actif et configuré.', 'inscription-premium' );
			echo '</p></div>';
		} );

		return false;
	}

	return true;
}

require_once IP_PATH . 'includes/helpers.php';
require_once IP_PATH . 'includes/field-mapping.php';
require_once IP_PATH . 'includes/class-pods-bridge.php';
require_once IP_PATH . 'includes/class-subscription-history.php';
require_once IP_PATH . 'includes/class-activator.php';
require_once IP_PATH . 'includes/class-auth.php';
require_once IP_PATH . 'includes/class-subscription.php';
require_once IP_PATH . 'includes/class-tunnel.php';
require_once IP_PATH . 'includes/class-payment.php';
require_once IP_PATH . 'includes/class-rest-api.php';

if ( is_admin() ) {
	require_once IP_PATH . 'includes/admin/class-subscribers-list-table.php';
	require_once IP_PATH . 'includes/admin/class-admin-subscribers.php';
	require_once IP_PATH . 'includes/admin/class-admin-settings.php';
}

register_activation_hook( __FILE__, array( 'IP_Activator', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'IP_Activator', 'deactivate' ) );

add_action( 'plugins_loaded', function () {
	load_plugin_textdomain( 'inscription-premium', false, dirname( IP_BASENAME ) . '/languages' );

	if ( ! ip_check_dependencies() ) {
		return;
	}

	IP_Auth::instance();
	IP_Subscription::instance();
	IP_Tunnel::instance();
	IP_Payment::instance();
	IP_REST_API::instance();

	if ( is_admin() ) {
		IP_Admin_Subscribers::instance();
		IP_Admin_Settings::instance();
	}
} );

add_action( 'admin_enqueue_scripts', function ( $hook ) {
	if ( false === strpos( $hook, 'inscription-premium' ) && false === strpos( $hook, 'ip-subscribers' ) && false === strpos( $hook, 'ip-draft-listings' ) ) {
		return;
	}

	wp_enqueue_style( 'ip-admin', IP_URL . 'assets/css/admin.css', array(), IP_VERSION );
} );

add_action( 'wp_enqueue_scripts', function () {
	if ( ! ip_check_dependencies() ) {
		return;
	}

	wp_register_style( 'ip-tunnel', IP_URL . 'assets/css/tunnel.css', array(), IP_VERSION );
	wp_register_script( 'ip-tunnel', IP_URL . 'assets/js/tunnel.js', array(), IP_VERSION, true );

	wp_localize_script( 'ip-tunnel', 'ipTunnel', array(
		'restUrl'       => esc_url_raw( rest_url( 'inscription-premium/v1' ) ),
		'nonce'         => wp_create_nonce( 'wp_rest' ),
		'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
		'stripePubKey'  => get_option( 'ip_stripe_publishable_key', '' ),
		'i18n'          => array(
			'minPhotos'     => __( 'Merci d\'ajouter au moins 3 photos avant de continuer.', 'inscription-premium' ),
			'requiredField' => __( 'Ce champ est requis.', 'inscription-premium' ),
			'genericError'  => __( 'Une erreur est survenue, merci de réessayer.', 'inscription-premium' ),
		),
	) );
} );
