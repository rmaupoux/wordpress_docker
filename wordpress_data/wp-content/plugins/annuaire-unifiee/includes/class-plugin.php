<?php
/**
 * Classe principale du plugin Annuaire Unifié
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Annuaire_Unifiee {

	public function __construct() {
		// Charger les CSS et JS
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		add_action( 'wp_footer', [ $this, 'inline_styles' ] );

		// Charger les includes
		$this->load_includes();

		// Enregistrer les shortcodes
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/shortcodes/tabs.php';
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/shortcodes/bateaux.php';
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/shortcodes/maritime.php';

		// Enregistrer les endpoints REST
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/endpoints/bateaux.php';
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/endpoints/maritime.php';
	}

	private function load_includes() {
		// Charger les helpers et fonctions utilitaires
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/helpers.php';
	}

	public function enqueue_assets() {
		global $post;

		// Vérifier si les shortcodes sont présents
		if ( ! $post || (
			! has_shortcode( $post->post_content, 'annuaire_tabs' ) &&
			! has_shortcode( $post->post_content, 'annuaire_bateaux_recherche' ) &&
			! has_shortcode( $post->post_content, 'annuaire_recherche' )
		) ) {
			return;
		}

		// Charger le CSS principal
		wp_enqueue_style(
			'annuaire-unifiee-style',
			ANNUAIRE_UNIFIEE_URL . 'css/style.css',
			[],
			ANNUAIRE_UNIFIEE_VERSION
		);

		// Charger le JS principal
		wp_enqueue_script(
			'annuaire-unifiee-script',
			ANNUAIRE_UNIFIEE_URL . 'js/script.js',
			[],
			ANNUAIRE_UNIFIEE_VERSION,
			true
		);
	}

	public function inline_styles() {
		global $post;

		if ( ! $post || (
			! has_shortcode( $post->post_content, 'annuaire_tabs' ) &&
			! has_shortcode( $post->post_content, 'annuaire_bateaux_recherche' ) &&
			! has_shortcode( $post->post_content, 'annuaire_recherche' )
		) ) {
			return;
		}

		// Charger les styles inline si nécessaire
		require_once ANNUAIRE_UNIFIEE_PATH . 'includes/inline-styles.php';
	}
}
