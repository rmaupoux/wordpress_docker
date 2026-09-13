<?php
/**
 * Plugin Name: AM Post Refonte
 * Description: Refonte de l'affichage des articles (catégories "Activities" et sous-catégories) : shortcodes de fil d'Ariane/eyebrow/compteur et styles dédiés.
 * Version: 1.0.0
 * Author: Maupoux
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: am-post-refonte
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Constantes du plugin
define( 'AM_POST_REFONTE_VERSION', '1.0.0' );
define( 'AM_POST_REFONTE_PATH', plugin_dir_path( __FILE__ ) );
define( 'AM_POST_REFONTE_URL', plugin_dir_url( __FILE__ ) );

require_once AM_POST_REFONTE_PATH . 'includes/class-plugin.php';

add_action( 'plugins_loaded', function() {
	new AM_Post_Refonte();
} );
